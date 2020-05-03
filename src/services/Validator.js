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

module.exports.validateArmy = (defs, army, commands) => {
    let error = null;

    let totalSoldiers = commands
        .filter(command => command.army === army.name)
        .reduce((totalSoldiers, command) => totalSoldiers + command.soldiers, 0);

    if (totalSoldiers > army.soldiers) {
        return `${army.name} armáda má rozkazy pro více vojáků (${totalSoldiers}) než kolik jich má (${army.soldiers}).`
    }

    const suppressingAtRegions = {};
    commands.forEach(command => {
        if (command.type === 'suppress') {
            if (!suppressingAtRegions[command.region]) {
                suppressingAtRegions[command.region] = command.army;
            } else if (suppressingAtRegions[command.region] !== command.army) {
                error = `V regionu ${command.region} už potlačuje povstání jiná armáda.`;
            } else {
                // NOOP the same army -> ok
            }
        }
    })

    return error;
}
