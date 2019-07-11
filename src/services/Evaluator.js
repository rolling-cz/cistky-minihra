module.exports.evaluateAct = (definitions, state) => {
    const newState = JSON.parse(JSON.stringify(state));

    newState.transports.forEach(transport => startTransport(newState.auditLog, transport, newState.regions));

    newState.regions.forEach(region => evaluateRegion(newState.auditLog, definitions, region));

    newState.transports.forEach(transport => finishTransport(newState.auditLog, transport, newState.regions));
    return newState
};

function startTransport(auditLog, transport, regions) {
    const sourceRegion = regions.find(region => region.name === transport.sourceRegion);
    if (sourceRegion) {
        sourceRegion.population.total -= transport.number;

        auditLog.push({
            "type": "transportOut",
            "region": sourceRegion.name,
            "number": transport.number
        })
    }
}

function finishTransport(auditLog, transport, regions) {
    const targetRegion = regions.find(region => region.name === transport.targetRegion);
    targetRegion.population.total += transport.number;

    auditLog.push({
        "type": "transportIn",
        "region": targetRegion.name,
        "number": transport.number
    })
}

function evaluateRegion(auditLog, defs, region) {
    if (!region.enabled) {
        return;
    }

    const regionDef = defs.regions.find(regionDef => regionDef.name === region.name);

    const activeRebels = processArmies(auditLog, defs, region);

    // rebels from previous act
    let rebelNegativeBonus = 1 - (activeRebels * defs.coefficients.rebellion.effectPerRebel) / 100;
    damageProductionSites(auditLog, defs, region, activeRebels);

    // production coef
    const fearLevel = defs.coefficients.fearLevels.find(fear => fear.level === region.fearLevel);
    let productionCoef = fearLevel.production / 100;
    productionCoef *= rebelNegativeBonus;
    if (productionCoef < defs.coefficients.resources.minProduction) {
        productionCoef = defs.coefficients.resources.minProduction
    }

    // production
    defs.coefficients.resources.types.forEach(resourceType => {
        produceResources(auditLog, defs, regionDef, region, productionCoef, resourceType);
    });

    // food consumption
    let starved = 0;
    if (region.food < region.population.total) {
        starved = region.population.total - region.food;
        region.population.total -= starved;

        auditLog.push({
            "type": "starvation",
            "region": regionDef.name,
            "number": starved
        })
    }

    if (starved === 0) {
        const probability = region.population.total * defs.coefficients.population.bornProbabilityPerPop;
        if (getRandom(0, 100) < probability) {
            const newPop = defs.coefficients.population.numberOfBirthed;
            region.population.total += newPop;
            auditLog.push({
                "type": "natality",
                "region": regionDef.name,
                "number": newPop
            })
        }
    }

    // new rebellion
    const rebellionRisk = fearLevel.rebellionRisk + starved * defs.coefficients.rebellion.riskPerStarvedPop;
    if (region.population.total > defs.coefficients.rebellion.minPopulation && getRandom(0, 100) <= rebellionRisk) {
        let numberOfRebels = fearLevel.rebellionSize + Math.ceil(starved * defs.coefficients.rebellion.rebelPerStarvedPop);

        if (region.population.total - defs.coefficients.rebellion.minPopulation < numberOfRebels) {
            numberOfRebels = region.population.total - defs.coefficients.rebellion.minPopulation
        }

        region.population.total -= numberOfRebels;
        region.rebels += numberOfRebels;

        auditLog.push({
            "type": "rebellion",
            "region": regionDef.name,
            "number": numberOfRebels
        })
    }

    defs.coefficients.resources.types.forEach(resourceType => {
        constructProductionSite(auditLog, region, resourceType);
    });

    defs.coefficients.resources.types.forEach(resourceType => {
        repairProductionSite(auditLog, region, resourceType);
    });
}

function processArmies(auditLog, defs, region) {
    let activeRebels = region.rebels;

    // attack
    if (region.soldiers.attacking > 0 && activeRebels > 0) {
        const soldiersPower = region.soldiers.attacking
            * (getRandom(defs.coefficients.army.attackPower.min, defs.coefficients.army.attackPower.max) / 100)
            * defs.coefficients.army.soldiersOverRebels;
        const rebelsPower = activeRebels
            * (getRandom(defs.coefficients.army.attackPower.min, defs.coefficients.army.attackPower.max) / 100);

        const soldiersWon = soldiersPower >= rebelsPower;
        let soldiersWounded = 0;
        let rebelsWounded = 0;
        if (soldiersWon) {
            soldiersWounded = Math.ceil(region.soldiers.attacking * defs.coefficients.army.wounded.soldiers.win);
            rebelsWounded = Math.ceil(activeRebels * defs.coefficients.army.wounded.rebels.defeat);
        } else {
            soldiersWounded = Math.ceil(region.soldiers.attacking * defs.coefficients.army.wounded.soldiers.defeat);
            rebelsWounded = Math.ceil(activeRebels * defs.coefficients.army.wounded.rebels.win);
        }

        activeRebels -= rebelsWounded;
        auditLog.push({
            "type": soldiersWon ? "victory" : "defeat",
            "region": region.name,
            "soldiersWounded": soldiersWounded,
            "rebelsWounded": rebelsWounded
        })
    }

    // patrolling
    if (region.soldiers.patrolling > activeRebels) {
        activeRebels = 0
    } else {
        activeRebels -= region.soldiers.patrolling
    }

    return activeRebels;
}

function damageProductionSites(auditLog, defs, region, activeRebels) {
    if (activeRebels > 0) {
        const probabilityOfDamage = activeRebels * defs.coefficients.rebellion.probabilityToDamagePerRebel;
        const damagedSites = {};
        defs.coefficients.resources.types.forEach(resourceType => {
            damagedSites[resourceType] = 0;
        });

        if (getRandom(0, 100) < probabilityOfDamage) {
            const numberOfDamaged = Math.ceil(activeRebels * defs.coefficients.rebellion.numberOfDamagePerRebel);
            for (let i = 0; i < numberOfDamaged; i++) {
                // find functional production site types
                const existedSites = [];
                defs.coefficients.resources.types.forEach(resourceType => {
                    if (region.productionSites[resourceType] > 0) {
                        existedSites.push(resourceType);
                    }
                });
                if (existedSites.length < 1) {
                    // no functional factories
                    break;
                }

                const damagedTypeKey = Math.round(getRandom(0, existedSites.length - 1));
                const damagedType = existedSites[damagedTypeKey];
                region.productionSites[damagedType]--;
                region.damaged[damagedType]++;
                damagedSites[damagedType]++;
            }
        }

        defs.coefficients.resources.types.forEach(resourceType => {
            if(damagedSites[resourceType] > 0) {
               auditLog.push({
                   "type": "damage",
                   "region": region.name,
                   "resource": resourceType,
                   "number": damagedSites[resourceType]
               })
            }
        });
    }
}

function produceResources(auditLog, defs, regionDef, region, productionCoef, resourceType) {
    if (region.population[resourceType] > 0) {
        const resourceCoef = productionCoef
            * (getRandom(defs.coefficients.random.production.min, defs.coefficients.random.production.max) / 100)
            * (regionDef.richness[resourceType] / 100);
        const produced = Math.round(
            defs.coefficients.resources.income[resourceType]
            * region.population[resourceType]
            * resourceCoef
        );

        auditLog.push({
            "type": "production",
            "region": regionDef.name,
            "resource": resourceType,
            "number": produced,
            "effectiveness": Math.round(resourceCoef * 100) / 100
        })
    }
}

function constructProductionSite(auditLog, region, resourceType) {
    if (region.constructing[resourceType] > 0) {
        region.productionSites[resourceType] += region.constructing[resourceType];

        auditLog.push({
            "type": "construction",
            "region": region.name,
            "resource": resourceType,
            "number": region.constructing[resourceType]
        })
    }
}

function repairProductionSite(auditLog, region, resourceType) {
    if (region.repairing[resourceType] > 0) {
        region.productionSites[resourceType] += region.repairing[resourceType];
        region.damaged[resourceType] -= region.repairing[resourceType];

        auditLog.push({
            "type": "repair",
            "region": region.name,
            "resource": resourceType,
            "number": region.repairing[resourceType]
        })
    }
}

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}