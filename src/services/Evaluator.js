module.exports.evaluateAct = (definitions, state) => {
    const newState = JSON.parse(JSON.stringify(state));

    newState.transports.forEach(transport => startTransport(newState.auditLog, transport, newState.regions));

    newState.regions.forEach(region => evaluateRegion(newState.auditLog, definitions, region, newState.armies, newState.commands, newState.invasions, newState.occupations, region.name === newState.eventRegion));

    newState.transports.forEach(transport => finishTransport(newState.auditLog, transport, newState.regions));

    newState.operations.forEach(operation => evaluateOperation(newState.auditLog, definitions, operation, newState.armies));

    newState.armies.forEach(army => evaluateArmy(newState.auditLog, definitions, army));

    return newState
};

module.exports.sumSoldiersInRegion = sumSoldiersInRegion;
function sumSoldiersInRegion(regionName, commandType, commands) {
    return commands
       .filter(command => command.region === regionName && command.type === commandType)
       .reduce((totalSoldiers, command) => totalSoldiers + command.soldiers, 0);
}

function findArmyWithCommand (regionName, commandType, commands) {
    return commands
        .filter(command => command.region === regionName && command.type === commandType)
        .map(command => command.army)
    }

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

function evaluateOperation(auditLog, defs, operation, armies) {
    const operationDef = defs.operations.find(op => op.name === operation.operation);
    const army = armies.find(army => army.name === operation.army);

    let operationSuccessful;
    let soldiersWounded = 0;
    if (operationDef.adversaries > 0) {
        const soldiersPower = operation.soldiers
            * (getRandom(defs.coefficients.army.attackPower.min, defs.coefficients.army.attackPower.max) / 100)
            * defs.coefficients.army.soldiersOverEnemies;
        const enemyPower = operationDef.adversaries
            * (getRandom(defs.coefficients.army.attackPower.min, defs.coefficients.army.attackPower.max) / 100);

        operationSuccessful = soldiersPower >= enemyPower;
        const soldiersWoundedCoefficient = operationSuccessful
            ? defs.coefficients.army.wounded.soldiers.win
            : defs.coefficients.army.wounded.soldiers.defeat;
        soldiersWounded = Math.ceil(soldiersWoundedCoefficient * operation.soldiers);
        army.soldiers -= soldiersWounded;
    } else {
        operationSuccessful = true;
    }

    let soldiersDeparted = 0;
    if (operationDef.consumeSoldiers) {
        soldiersDeparted = operation.soldiers - soldiersWounded;
        army.soldiers -= soldiersDeparted;
    }

    const rewards = {
        "wheat": 0,
        "steal": 0,
        "fuel": 0,
        "soldiers": 0
    }
    if (operationSuccessful) {
        rewards.wheat = operationDef.rewards.wheat;
        rewards.steal = operationDef.rewards.steal;
        rewards.fuel = operationDef.rewards.fuel;
        rewards.soldiers = operationDef.rewards.soldiers;

        army.soldiers += rewards.soldiers;
        if (rewards.soldiers > 0) {
            // new soldiers have their own food
            army.food += rewards.soldiers * defs.coefficients.army.costs.wheat;
        }

        addRandomResource(defs, rewards, operationDef.rewards.randomOneResource);
        for (let i = 0; i < operationDef.rewards.randomMultiResource; i++) {
            addRandomResource(defs, rewards, 1);
        }
    }

    auditLog.push({
        "type": operationSuccessful ? "operationSuccess" : "operationFail",
        "army": army.name,
        "operation": operationDef.name,
        "difficulty": operationDef.difficulty,
        "rewards": rewards,
        "soldiersWounded": soldiersWounded,
        "soldiersDeparted": soldiersDeparted
    })
}

function addRandomResource(defs, resources, amount) {
    if (amount < 1) {
        return;
    }
    const resourceName = defs.coefficients.resources.types[Math.floor((Math.random() * 3))];
    resources[resourceName] += amount;
}

function evaluateArmy(auditLog, defs, army) {
    if (!army.enabled) {
        return;
    }

    const food = army.soldiers * defs.coefficients.army.costs.wheat;
    if (food > army.food) {
        const starved = (food - army.food) / defs.coefficients.army.costs.wheat;
        army.soldiers -= starved;
        auditLog.push({
            "type": "armyStarvation",
            "army": army.name,
            "number": starved
        })
    }

    if (army.recruiting > 0) {
        army.soldiers += army.recruiting;
        auditLog.push({
            "type": "armyRecruiting",
            "army": army.name,
            "number": army.recruiting
        })
    }
}

function evaluateRegion(auditLog, defs, region, armies, commands, invasions, occupations, hasCulturalEvent) {
    processLiberationAttempt(auditLog, defs, region, armies, commands, occupations);

    if (!region.enabled) {
        return;
    }

    const regionDef = defs.regions.find(regionDef => regionDef.name === region.name);

    if (processOccupationAttempt(auditLog, defs, region, armies, commands, invasions, occupations)) {
        return;
    }

    const plunderEffect = processPlunderAttempt(auditLog, defs, region, armies, commands, invasions);

    processRecruiting(auditLog, region);

    const activeRebels = processPatrolSuppress(auditLog, defs, region, armies, commands, hasCulturalEvent);

    // rebels from previous act
    damageProductionSites(auditLog, defs, region, activeRebels);
    let rebelNegativeBonus = 1 - (activeRebels * defs.coefficients.rebellion.effectPerRebel) / 100;
    if (rebelNegativeBonus < 0) {
        rebelNegativeBonus = 0;
    }

    // production coef
    const fearLevel = defs.coefficients.fearLevels.find(fear => fear.level === region.fearLevel);
    let productionCoef = fearLevel.production / 100;
    productionCoef *= rebelNegativeBonus;
    productionCoef *= 1 + (defs.coefficients.monuments.productivity * region.monuments.finished) / 100;

    if (hasCulturalEvent) {
        productionCoef *= 1 + (defs.coefficients.culturalEvents.productionBoostMultiplier) / 100;
    }

    if (productionCoef < defs.coefficients.resources.minProduction) {
        productionCoef = defs.coefficients.resources.minProduction
    }

    // production
    defs.coefficients.resources.types.forEach(resourceType => {
        produceResources(auditLog, defs, regionDef, region, productionCoef, resourceType, plunderEffect);
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
            let newPop = defs.coefficients.population.numberOfBirthed;

            if (hasCulturalEvent) {
                newPop += defs.coefficients.culturalEvents.numberOfBirthed;
            }

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

    processBuildingMonuments(auditLog, region);

    defs.coefficients.resources.types.forEach(resourceType => {
        repairProductionSite(auditLog, region, resourceType);
    });
}

function processLiberationAttempt(auditLog, defs, region, armies, commands, occupations) {
    const occupation = occupations.find(oc => oc.region === region.name);
    if (!occupation) {
        return;
    }

    const liberationSoldiers = sumSoldiersInRegion(region.name, 'liberate', commands);
    if (liberationSoldiers === 0) {
        return;
    }

    const soldiersPower = liberationSoldiers
        * (getRandom(defs.coefficients.army.attackPower.min, defs.coefficients.army.attackPower.max) / 100)
        * defs.coefficients.army.soldiersOverEnemies;
    const enemyPower = occupation.soldiers
        * (getRandom(defs.coefficients.army.attackPower.min, defs.coefficients.army.attackPower.max) / 100);

    const soldiersWon = soldiersPower >= enemyPower;
    const soldiersWoundedCoefficient = soldiersWon
        ? defs.coefficients.army.wounded.soldiers.win
        : defs.coefficients.army.wounded.soldiers.defeat;
    const enemiesWoundedCoefficient = soldiersWon
        ? defs.coefficients.army.wounded.enemies.defeat
        : defs.coefficients.army.wounded.enemies.win;
    const enemiesWounded = Math.ceil(occupation.soldiers * enemiesWoundedCoefficient);

    let withdraw = 0;
    if (soldiersWon) {
        const occupationIndex = occupations.indexOf(occupation);
        if (occupationIndex !== -1) {
            occupations.splice(occupationIndex, 1);
        }
        withdraw = occupation.soldiers - enemiesWounded;
    } else {
        occupation.soldiers -= enemiesWounded;
    }

    auditLog.push({
       "type": soldiersWon ? "liberationSuccess" : "liberationFail",
       "region": region.name,
       "enemy": occupation.enemy,
       "withdraw": withdraw,
       "enemiesWounded": enemiesWounded
    })

    commands
        .filter(command => command.region === region.name && command.type === 'liberate')
        .forEach(command => {
            const share = command.soldiers / liberationSoldiers;
            const soldiersWoundedForThisArmy = Math.ceil(command.soldiers * soldiersWoundedCoefficient * share);
            const enemiesWoundedForThisArmy = Math.ceil(enemiesWounded * share);

            const army = armies.find(army => army.name === command.army);
            army.soldiers -= soldiersWoundedForThisArmy;

            auditLog.push({
                "type": soldiersWon ? "liberationArmySuccess" : "liberationArmyLost",
                "region": region.name,
                "army": command.army,
                "enemy": occupation.enemy,
                "soldiersWounded": soldiersWoundedForThisArmy,
                "enemiesWounded": enemiesWoundedForThisArmy
            })
        });
}

function processOccupationAttempt(auditLog, defs, region, armies, commands, invasions, occupations) {

    const occupyAttempt = invasions.find(invasion => invasion.region === region.name && invasion.type === 'occupy');
    if (occupyAttempt) {
        const patrolling = sumSoldiersInRegion(region.name, 'patrol', commands);
        const soldiersPower = patrolling
            * (getRandom(defs.coefficients.army.attackPower.min, defs.coefficients.army.attackPower.max) / 100)
            * defs.coefficients.army.soldiersOverEnemies;
        const enemyPower = occupyAttempt.soldiers
            * (getRandom(defs.coefficients.army.attackPower.min, defs.coefficients.army.attackPower.max) / 100);

        let defended;
        if (enemyPower > soldiersPower) {
            defended = false;
            occupations.push({enemy: occupyAttempt.enemy, region: occupyAttempt.region, soldiers: occupyAttempt.soldiers});
        } else {
            defended = true;
        }

        auditLog.push({
           "type": defended ? "occupyAttemptFailed" : "occupyAttemptSuccess",
           "region": region.name,
           "enemy": occupyAttempt.enemy,
           "soldiers": occupyAttempt.soldiers
        })

        commands
            .filter(command => command.region === region.name && command.type === 'patrol')
            .forEach(command =>

                auditLog.push({
                    "type": defended ? "occupyPatrolDefended" : "occupyPatrolLost",
                    "region": region.name,
                    "army": command.army,
                    "enemy": occupyAttempt.enemy,
                    "contribution": command.soldiers / patrolling
                }
            ));
        return !defended;
    } else {
        return false;
    }
}

function processPlunderAttempt(auditLog, defs, region, armies, commands, invasions) {

    let plunderProductionEffect = 1;

    const plunderAttempt = invasions.find(invasion => invasion.region === region.name && invasion.type === 'plunder');
    if (plunderAttempt) {
        const patrolling = sumSoldiersInRegion(region.name, 'patrol', commands);
        const soldiersPower = patrolling
            * (getRandom(defs.coefficients.army.attackPower.min, defs.coefficients.army.attackPower.max) / 100)
            * defs.coefficients.army.soldiersOverEnemies;
        const enemyPower = plunderAttempt.soldiers
            * (getRandom(defs.coefficients.army.attackPower.min, defs.coefficients.army.attackPower.max) / 100);

        let defended;
        if (enemyPower > soldiersPower) {
            plunderProductionEffect = defs.coefficients.enemy.plunderEffect;
            defended = false;
        } else {
            defended = true;
        }

        auditLog.push({
           "type": defended ? "plunderAttemptFailed" : "plunderAttemptSuccess",
           "region": region.name,
           "enemy": plunderAttempt.enemy
        })

        commands
            .filter(command => command.region === region.name && command.type === 'patrol')
            .forEach(command => auditLog.push({
                "type": defended ? "plunderPatrolDefended" : "plunderPatrolLost",
                "region": region.name,
                "army": command.army,
                "enemy": plunderAttempt.enemy,
                "contribution": command.soldiers / patrolling
            }));
    }

    return plunderProductionEffect;
}

function processBuildingMonuments(auditLog, region) {
    if (region.monuments.building > 0) {
        region.monuments.finished += region.monuments.building;
        auditLog.push({
           "type": "monuments",
           "region": region.name,
           "number": region.monuments.building
       })
    }
}

function processRecruiting(auditLog, region) {
    if (region.population.recruiting > 0) {
        region.population.total -= region.population.recruiting;
        auditLog.push({
           "type": "recruiting",
           "region": region.name,
           "number": region.population.recruiting
       })
    }
}

function processPatrolSuppress(auditLog, defs, region, armies, commands, hasCulturalEvent) {
    let activeRebels = region.rebels;
    const attacking = sumSoldiersInRegion(region.name, 'suppress', commands);

    // Cultural event removes some from active rebels
    if (hasCulturalEvent) {
        const rebelsToRemove = Math.min(defs.coefficients.culturalEvents.removedRebels, activeRebels);
        activeRebels -= rebelsToRemove;
        region.rebels -= rebelsToRemove;
        // Returning back to the population
        region.population.total += rebelsToRemove;

        auditLog.push({
            "type": "culturalEventRebelsRemoved",
            "region": region.name,
            "rebelsRemoved": defs.coefficients.culturalEvents.removedRebels,
        })
    }

    // attack
    if (attacking > 0 && activeRebels > 0) {
        const soldiersPower = attacking
            * (getRandom(defs.coefficients.army.attackPower.min, defs.coefficients.army.attackPower.max) / 100)
            * defs.coefficients.army.soldiersOverRebels;
        const rebelsPower = activeRebels
            * (getRandom(defs.coefficients.army.attackPower.min, defs.coefficients.army.attackPower.max) / 100);

        const soldiersWon = soldiersPower >= rebelsPower;
        let soldiersWounded;
        let rebelsWounded;
        if (soldiersWon) {
            soldiersWounded = Math.ceil(attacking * defs.coefficients.army.wounded.soldiers.win);
            rebelsWounded = Math.ceil(activeRebels * defs.coefficients.army.wounded.rebels.defeat);
        } else {
            soldiersWounded = Math.ceil(attacking * defs.coefficients.army.wounded.soldiers.defeat);
            rebelsWounded = Math.ceil(activeRebels * defs.coefficients.army.wounded.rebels.win);
        }

        const armyNames = findArmyWithCommand(region.name, 'suppress', commands);
        const army = armies.find(armyState => armyState.name === armyNames[0]);
        army.soldiers -= soldiersWounded;

        activeRebels -= rebelsWounded;
        region.rebels -= rebelsWounded;
        auditLog.push({
            "type": soldiersWon ? "victory" : "defeat",
            "region": region.name,
            "army": army.name,
            "soldiersWounded": soldiersWounded,
            "rebelsWounded": rebelsWounded
        })
    }

    // patrolling
    const patrolling = sumSoldiersInRegion(region.name, 'patrol', commands);
    let blocked;
    if (patrolling > activeRebels) {
        blocked = activeRebels;
        activeRebels = 0;
    } else {
        blocked = patrolling;
        activeRebels -= patrolling;
    }

    if (blocked > 0) {
        const percent = blocked/patrolling;
        commands
            .filter(command => command.region === region.name && command.type === 'patrol')
            .forEach(command => auditLog.push({
                "type": "patrol",
                "region": region.name,
                "army": command.army,
                "number": Math.ceil(command.soldiers * percent)
            }));
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

function produceResources(auditLog, defs, regionDef, region, productionCoef, resourceType, plunderEffect) {
    if (region.population[resourceType] > 0) {
        const resourceCoef = productionCoef
            * (getRandom(defs.coefficients.random.production.min, defs.coefficients.random.production.max) / 100)
            * (regionDef.richness[resourceType] / 100);
        const produced = Math.round(
            defs.coefficients.resources.income[resourceType]
            * region.population[resourceType]
            * resourceCoef
            * plunderEffect
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
