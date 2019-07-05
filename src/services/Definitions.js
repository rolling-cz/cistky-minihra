module.exports.getInitialState = () => {
    const regionsDto = [];
    const defs = getDefinitions();
    defs.regions.forEach(region => {
        regionsDto.push({
            "name": region.name,
            "population": {
                "total": calculateAbsoluteValue(defs.coefficients.resources.start.population, region.start.population),
                "wheat": 0,
                "steal": 0,
                "fuel": 0
            },
            "productionSites": {
                "wheat": calculateAbsoluteValue(defs.coefficients.resources.start.wheat, region.start.wheat),
                "steal": calculateAbsoluteValue(defs.coefficients.resources.start.steal, region.start.steal),
                "fuel": calculateAbsoluteValue(defs.coefficients.resources.start.fuel, region.start.fuel)
            },
            "fearLevel": 1,
            "rebels": 0,
            "food": 0,
            "damaged": {
                "wheat": 0,
                "steal": 0,
                "fuel": 0
            },
            "constructing": {
                "wheat": 0,
                "steal": 0,
                "fuel": 0
            },
            "repairing": {
                "wheat": 0,
                "steal": 0,
                "fuel": 0
            }
        })
    });

    return {
        regions: regionsDto,
        transports: [],
        auditLog: []
    }
};

function calculateAbsoluteValue(coef, percentage) {
    return Math.round((percentage/100) * coef)
}

module.exports.getDefinitions = getDefinitions;
function getDefinitions() {
    return {
        "coefficients": {
            "resources": {
                "start": {
                    "population": 8,
                    "wheat": 5,
                    "steal": 2,
                    "fuel": 2
                },
                "income": {
                    "wheat": 2,
                    "steal": 1,
                    "fuel": 2
                },
                "minProduction": 0.2
            },
            "fearLevels": [
                {
                    "level": 1,
                    "production": 100,
                    "rebellionRisk": 5,
                    "rebellionSize": 1
                },
                {
                    "level": 2,
                    "production": 115,
                    "rebellionRisk": 15,
                    "rebellionSize": 1
                },
                {
                    "level": 3,
                    "production": 130,
                    "rebellionRisk": 40,
                    "rebellionSize": 2
                }
            ],
            "rebellion": {
                "effectPerRebel": 10,
                "riskPerStarvedPop": 10,
                "rebelPerStarvedPop": 0.2,
                "minPopulation": 2
            },
            "random": {
                "production": {
                    "min": 75,
                    "max": 110
                }
            }
        },
        "regions": [
            {
                "name": "Bělorusko",
                "priority": 2,
                "start": {
                    "population": 100,
                    "wheat": 170,
                    "steal": 0,
                    "fuel": 50
                },
                "richness": {
                    "wheat": 150,
                    "steal": 25,
                    "fuel": 50
                }
            },{
                "name": "Dálný východ",
                "priority": 3,
                "start": {
                    "population": 90,
                    "wheat": 70,
                    "steal": 0,
                    "fuel": 50
                },
                "richness": {
                    "wheat": 100,
                    "steal": 20,
                    "fuel": 100
                }
            },{
                "name": "Kavkaz",
                "priority": 2,
                "start": {
                    "population": 50,
                    "wheat": 50,
                    "steal": 100,
                    "fuel": 100
                },
                "richness": {
                    "wheat": 100,
                    "steal": 70,
                    "fuel": 70
                }
            },{
                "name": "Kazašská republika",
                "priority": 3,
                "start": {
                    "population": 80,
                    "wheat": 70,
                    "steal": 50,
                    "fuel": 0
                },
                "richness": {
                    "wheat": 100,
                    "steal": 100,
                    "fuel": 0
                }
            },{
                "name": "Krym",
                "priority": 3,
                "start": {
                    "population": 100,
                    "wheat": 120,
                    "steal": 80,
                    "fuel": 0
                },
                "richness": {
                    "wheat": 150,
                    "steal": 100,
                    "fuel": 0
                }
            },{
                "name": "Leningradská oblast",
                "priority": 2,
                "start": {
                    "population": 120,
                    "wheat": 110,
                    "steal": 100,
                    "fuel": 0
                },
                "richness": {
                    "wheat": 100,
                    "steal": 100,
                    "fuel": 0
                }
            },{
                "name": "Moskevská oblast",
                "priority": 1,
                "start": {
                    "population": 150,
                    "wheat": 80,
                    "steal": 50,
                    "fuel": 50
                },
                "richness": {
                    "wheat": 100,
                    "steal": 100,
                    "fuel": 70
                }
            },{
                "name": "Rostov",
                "priority": 3,
                "start": {
                    "population": 100,
                    "wheat": 100,
                    "steal": 100,
                    "fuel": 0
                },
                "richness": {
                    "wheat": 120,
                    "steal": 100,
                    "fuel": 0
                }
            },{
                "name": "Sibiř",
                "priority": 1,
                "start": {
                    "population": 50,
                    "wheat": 10,
                    "steal": 100,
                    "fuel": 100
                },
                "richness": {
                    "wheat": 20,
                    "steal": 120,
                    "fuel": 125
                }
            },{
                "name": "Stalingradská oblast",
                "priority": 2,
                "start": {
                    "population": 120,
                    "wheat": 40,
                    "steal": 100,
                    "fuel": 50
                },
                "richness": {
                    "wheat": 100,
                    "steal": 100,
                    "fuel": 70
                }
            },{
                "name": "Ukrajina",
                "priority": 1,
                "start": {
                    "population": 80,
                    "wheat": 160,
                    "steal": 0,
                    "fuel": 100
                },
                "richness": {
                    "wheat": 150,
                    "steal": 0,
                    "fuel": 100
                }
            },{
                "name": "Ural",
                "priority": 1,
                "start": {
                    "population": 80,
                    "wheat": 20,
                    "steal": 200,
                    "fuel": 0
                },
                "richness": {
                    "wheat": 50,
                    "steal": 200,
                    "fuel": 0
                }
            }
        ]
    }
}