module.exports.resourceToWord2ndCase = (resource) => {
    switch(resource) {
        case "wheat":
            return "pšenice";
        case "steal":
            return "ocele";
        case "fuel":
            return "paliva";
        default:
            return resource;
    }
};

module.exports.resourceToWord4thCase = (resource) => {
    switch(resource) {
        case "wheat":
            return "pšenici";
        case "steal":
            return "ocel";
        case "fuel":
            return "palivo";
        default:
            return resource;
    }
};

module.exports.inflectResources = (number) => {
    if (number === 1) {
        return "jednotku"
    } else if (number === 2 || number === 3 || number === 4) {
        return "jednotky"
    } else {
        return "jednotek"
    }
};

module.exports.inflectResources1stCase = (number) => {
    if (number === 1) {
        return "jednotka"
    } else if (number === 2 || number === 3 || number === 4) {
        return "jednotky"
    } else {
        return "jednotek"
    }
};

module.exports.inflectGroups = (number) => {
    if (number === 1) {
        return "skupina"
    } else if (number === 2 || number === 3 || number === 4) {
        return "skupiny"
    } else {
        return "skupin"
    }
};

module.exports.inflectGroups4thCase = (number) => {
    if (number === 1) {
        return "skupinu"
    } else if (number === 2 || number === 3 || number === 4) {
        return "skupiny"
    } else {
        return "skupin"
    }
};

module.exports.inflectProductionSites = (number) => {
    if (number === 1) {
        return "produkční závod"
    } else if (number === 2 || number === 3 || number === 4) {
        return "produkční závody"
    } else {
        return "produkčních závodů"
    }
};

module.exports.effectivnessToWord = (number) => {
    if (number < 0.4) {
        return "příšerná"
    } else if (number < 0.8) {
        return "špatná"
    } else if (number < 1.1) {
        return "průměrná"
    } else if (number < 1.4) {
        return "velice dobrá"
    } else {
        return "úžasná"
    }
};

module.exports.rankingToWord = (rank) => {
    switch (rank) {
        case "best":
            return "Excelentní vedení";
        case "good":
            return "Dobré vedení";
        case "bad":
            return "Špatné vedení";
        case "worst":
            return "Otřesné vedení";
        default:
            return "Standardní vedení";
    }
}

module.exports.commandTypeToWord = (type) => {
    switch (type) {
        case "patrol":
            return "Hlídkovat";
        case "suppress":
            return "Potlačit povstání";
        case "liberate":
            return "Osvobodit";
        default:
            return "Neznámý typ rozkazu: " + type;
    }
}

module.exports.invasionTypeToWord = (type) => {
    switch (type) {
        case "plunder":
            return "Vyplenit";
        case "occupy":
            return "Obsadit";
        default:
            return "Neznámý typ rozkazu: " + type;
    }
}

module.exports.findEnemyNameObject = (enemy, defs) => {
    return defs.coefficients.enemy.names.find(nameObj => nameObj.countryName === enemy)
}

module.exports.capitalize = (s) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

module.exports.aggregateByRegion = (definitions, auditLog) => {
    const logsByRegions = {};
    definitions.regions.forEach(region => logsByRegions[region.name] = []);

    auditLog.forEach(log => {
        if (log.region) {
            logsByRegions[log.region].push(log)
        }
    });

    return logsByRegions
};

module.exports.aggregateByArmy = (definitions, auditLog) => {
    const logsByArmies = {};
    definitions.armies.forEach(army => logsByArmies[army.name] = []);

    auditLog.forEach(log => {
        if (log.army) {
            logsByArmies[log.army].push(log)
        }
    });

    return logsByArmies
};

