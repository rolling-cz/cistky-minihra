module.exports.getInitialState = () => {
    const regionsDto = [];
    const defs = getDefinitions();
    defs.regions.forEach(region => {
        regionsDto.push({
            "name": region.name,
            "enabled": region.priority < 3,
            "population": {
                "total": calculateAbsoluteValue(defs.coefficients.population.start, region.start.population),
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
            },
            "soldiers": {
                "patrolling": 0,
                "attacking": 0
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
                "types": ["wheat", "steal", "fuel"],
                "start": {
                    "wheat": 5,
                    "steal": 2,
                    "fuel": 2
                },
                "income": {
                    "wheat": 2.4,
                    "steal": 1.2,
                    "fuel": 2.4
                },
                "minProduction": 0.2
            },
            "fearLevels": [
                {
                    "level": 1,
                    "production": 90,
                    "rebellionRisk": 5,
                    "rebellionSize": 1
                },
                {
                    "level": 2,
                    "production": 105,
                    "rebellionRisk": 15,
                    "rebellionSize": 1
                },
                {
                    "level": 3,
                    "production": 120,
                    "rebellionRisk": 40,
                    "rebellionSize": 2
                }
            ],
            "population": {
                "start": 8,
                "bornProbabilityPerPop": 5,
                "numberOfBirthed": 1
            },
            "rebellion": {
                "effectPerRebel": 10,
                "riskPerStarvedPop": 10,
                "rebelPerStarvedPop": 0.2,
                "minPopulation": 2,
                "probabilityToDamagePerRebel": 30,
                "numberOfDamagePerRebel": 0.25

            },
            "random": {
                "production": {
                    "min": 75,
                    "max": 110
                }
            },
            "army": {
                "attackPower": {
                    "min": 75,
                    "max": 125
                },
                "wounded": {
                    "soldiers": {
                        "win": 0.1,
                        "defeat": 0.3
                    },
                    "rebels": {
                        "win": 0.25,
                        "defeat": 0.6
                    }
                },
                "soldiersOverRebels": 1.2,
                "actions": {
                    "maintenance": {
                        "id": "maintenance",
                        "name": "Údržba",
                        "wheat": 0.25,
                        "steal": 0,
                        "fuel": 0
                    },
                    "conscripting": {
                        "id": "conscripting",
                        "name": "Zbrojení",
                        "wheat": 1,
                        "steal": 2,
                        "fuel": 0
                    },
                    "fight": {
                        "id": "fight",
                        "name": "Boj",
                        "wheat": 0.5,
                        "steal": 0.5,
                        "fuel": 1
                    },
                    "movement": {
                        "id": "movement",
                        "name": "Pohyb",
                        "wheat": 0.25,
                        "steal": 0,
                        "fuel": 0.5
                    },
                    "patrolling": {
                        "id": "patrolling",
                        "name": "Hlídkování",
                        "wheat": 0.5,
                        "steal": 0,
                        "fuel": 0.25
                    }
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
                "name": "Jih",
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
                "name": "Jihozápad",
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
                "name": "Jižní Kavkaz",
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
                "name": "Kazachstán",
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
                "name": "Severozápad",
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
                "name": "Střed",
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
                "name": "Střední černozem",
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
            },{
                "name": "Volha",
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
                "name": "Východní Sibiř",
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
            }
        ]
    }
}