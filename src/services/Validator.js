module.exports.validateRegion = (defs, region, transports) => {
    let error = null;

    // population - workers
    let totalWorkers = 0;
    defs.coefficients.resources.types.forEach(resourceType => {
        totalWorkers += region.population[resourceType];
    });

    // population - recruiting
    totalWorkers += region.population["recruiting"];

    // population - transports
    let totalTransports = transports
        .filter(transport => transport.sourceRegion === region.name)
        .reduce((totalTransports, transport) => totalTransports + transport.number, 0);

    // population check
    if (region.population.total < totalWorkers + totalTransports) {
        return `Alokovaných lidí (${totalWorkers + totalTransports}) nemůže být víc než celkové populace (${region.population.total}).`;
    }

    // factories capacity
    defs.coefficients.resources.types.forEach(resourceType => {
        if (region.population[resourceType] > region.productionSites[resourceType]) {
            error = `Není tolik dostupných zařízení na produkci ${resourceType}.`;
        }
    });

    // enough damaged factories
    defs.coefficients.resources.types.forEach(resourceType => {
        if (region.repairing[resourceType] > region.damaged[resourceType]) {
            error = `Není tolik poškozených zařízení na produkci ${resourceType}.`;
        }
    });

    // monuments max building
    if (region.monuments.building > defs.coefficients.monuments.building) {
        return `V jednu chvíli lze stavět pouze ${defs.coefficients.monuments.building} monument.`;
    }

    return error;
};