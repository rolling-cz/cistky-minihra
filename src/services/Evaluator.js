module.exports.evaluateAct = (definitions, state) => {
    const newState = JSON.parse(JSON.stringify(state));

    // TODO process armies

    // TODO start transports

    // process regions
    newState.regions.forEach(region => evaluateRegion(newState.auditLog, definitions, region));

    // TODO finish transports

    return newState
};

function evaluateRegion(auditLog, defs, region) {
    const regionDef = defs.regions.find(regionDef => regionDef.name === region.name);

    // rebels from previous act
    let rebelNegativeBonus = 1 - (region.rebels * defs.coefficients.rebellion.effectPerRebel) / 100;

    // TODO damaging production sites

    // production coef
    const fearLevel = defs.coefficients.fearLevels.find(fear => fear.level === region.fearLevel);
    let productionCoef = fearLevel.production / 100;
    productionCoef *= rebelNegativeBonus;
    if (productionCoef < defs.coefficients.resources.minProduction) {
        productionCoef = defs.coefficients.resources.minProduction
    }

    // production
    produceResources(auditLog, defs, regionDef, region, productionCoef,"wheat");
    produceResources(auditLog, defs, regionDef, region, productionCoef,"steal");
    produceResources(auditLog, defs, regionDef, region, productionCoef,"fuel");

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

    // TODO new population

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

    // TODO construction

    // TODO repairing
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

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}