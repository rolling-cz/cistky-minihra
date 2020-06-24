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
                "fuel": 0,
                "recruiting": 0
            },
            "productionSites": {
                "wheat": calculateAbsoluteValue(defs.coefficients.resources.start.wheat, region.start.wheat),
                "steal": calculateAbsoluteValue(defs.coefficients.resources.start.steal, region.start.steal),
                "fuel": calculateAbsoluteValue(defs.coefficients.resources.start.fuel, region.start.fuel)
            },
            "monuments": {
                "finished": 0,
                "building": 0
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

    const armiesDto = [];
    defs.armies.forEach(army => {
            armiesDto.push({
                "name": army.name,
                "enabled": true,
                "soldiers": army.soldiers,
                "recruiting": 0,
                "food": 0,
                "mission": null
            })
        });

    return {
        regions: regionsDto,
        transports: [],
        armies: armiesDto,
        commands: [],
        invasions: [],
        occupations: [],
        operations: [],
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
                    "wheat": 2.5,
                    "steal": 1,
                    "fuel": 1.5
                },
                "minProduction": 0.2
            },
            "ranking": {
                "production": {
                    "min": 1,
                    "wheat": 6,
                    "steal": 8,
                    "fuel": 8
                },
                "starvation": -5,
                "rebellion": -10,
                "construction": {
                    "wheat": 13,
                    "steal": 16,
                    "fuel": 16
                },
                "repair": {
                    "wheat": 6,
                    "steal": 8,
                    "fuel": 8
                },
                "natality": 4,
                "damage": {
                    "wheat": -5,
                    "steal": -7,
                    "fuel": -7
                },
                "transport": {
                    "out": 4,
                    "in": 1
                },
                "monument": 25,
                "recruiting": 5,
                "plundered": -5,
                "occupied": -10,
                "points": {
                    "region": {
                        "best": {
                            "rankChange": 2,
                            "number": 1
                        },
                        "good": {
                            "rankChange": 1,
                            "percent": 0.4
                        },
                        "bad": {
                            "rankChange": -1,
                            "percent": 0.1
                        },
                        "worst": {
                            "rankChange": -2,
                            "number": 1
                        },
                    },
                    "army": {
                        "best": {
                            "rankChange": 1,
                            "number": 1
                        },
                        "good": {
                            "rankChange": 1,
                            "percent": 0.4
                        },
                        "bad": {
                            "rankChange": -1,
                            "percent": 0.1
                        },
                        "worst": {
                            "rankChange": -1,
                            "number": 1
                        },
                    },
                },
                "army": {
                    "recruiting": 5,
                    "starvation": -4,
                    "victory": 5,
                    "defeat": -3,
                    "killed": 3,
                    "lost": -2,
                    "patrol": 2,
                    "plunderPatrolDefended": 15,
                    "plunderPatrolLost": -8,
                    "occupyPatrolDefended": 18,
                    "occupyPatrolLost": -20,
                    "operationSuccess": 8,
                    "operationFail": -3
                }
            },
            "monuments": {
                "productivity": 10,
                "building": 1,
            },
            "fearLevels": [
                {
                    "level": 1,
                    "production": 95,
                    "rebellionRisk": 5,
                    "rebellionSize": 1
                },
                {
                    "level": 2,
                    "production": 110,
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
                    "min": 85,
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
                        "defeat": 0.8
                    },
                    "enemies": {
                        "win": 0.25,
                        "defeat": 0.5
                    }
                },
                "soldiersOverRebels": 1.2,
                "soldiersOverEnemies": 1,
                "commands": {
                    "types": ["patrol", "suppress", "liberate"]
                },
                "costs": {
                    "wheat": 0.5,
                    "steal": 0.5,
                    "fuel": 0.5
                },
                "actions": {
                    "maintenance": {
                        "id": "maintenance",
                        "name": "Údržba",
                        "wheat": 0.5,
                        "steal": 0,
                        "fuel": 0
                    },
                    "conscripting": {
                        "id": "conscripting",
                        "name": "Zbrojení",
                        "wheat": 0.5,
                        "steal": 0.5,
                        "fuel": 0.5
                    },
                    "fight": {
                        "id": "fight",
                        "name": "Boj",
                        "wheat": 0.5,
                        "steal": 0.5,
                        "fuel": 0.5
                    },
                    "movement": {
                        "id": "movement",
                        "name": "Pohyb",
                        "wheat": 0.5,
                        "steal": 0,
                        "fuel": 0.5
                    },
                    "patrolling": {
                        "id": "patrolling",
                        "name": "Hlídkování",
                        "wheat": 0.5,
                        "steal": 0,
                        "fuel": 0.5
                    }
                }
            },
            "enemy": {
                "invasion": {
                    "types": ["plunder", "occupy"]
                },
                "names": [{
                        "countryName": "Polsko",
                        "countryName2nd": "Polska",
                        "attr": "polský",
                        "people": "Poláci"
                    },
                    {
                        "countryName": "Čína",
                        "countryName2nd": "Číny",
                        "attr": "čínský",
                        "people": "Číňani"
                    },
                    {
                        "countryName": "Japonsko",
                        "countryName2nd": "Japonska",
                        "attr": "japonský",
                        "people": "Japonci"
                    },
                    {
                        "countryName": "Turecko",
                        "countryName2nd": "Turecka",
                        "attr": "turecký",
                        "people": "Turci"
                    },
                    {
                        "countryName": "Finsko",
                        "countryName2nd": "Finska",
                        "attr": "finský",
                        "people": "Finové"
                    },
                    {
                        "countryName": "Rumunsko",
                        "countryName2nd": "Rumunska",
                        "attr": "rumunský",
                        "people": "Rumuni"
                    }
                ],
                "plunderEffect": 0.1
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
                "priority": 2,
                "start": {
                    "population": 80,
                    "wheat": 160,
                    "steal": 0,
                    "fuel": 100
                },
                "richness": {
                    "wheat": 150,
                    "steal": 0,
                    "fuel": 50
                }
            },{
                "name": "Jižní Kavkaz",
                "priority": 1,
                "start": {
                    "population": 50,
                    "wheat": 50,
                    "steal": 80,
                    "fuel": 150
                },
                "richness": {
                    "wheat": 80,
                    "steal": 100,
                    "fuel": 100
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
                "priority": 1,
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
                "priority": 2,
                "start": {
                    "population": 50,
                    "wheat": 10,
                    "steal": 100,
                    "fuel": 120
                },
                "richness": {
                    "wheat": 20,
                    "steal": 120,
                    "fuel": 125
                }
            }
        ],
        "armies": [
            {
                "name": "Modrá",
                "soldiers": 6
            },
            {
                "name": "Bílá",
                "soldiers": 6
            },
            {
                "name": "Hnědá",
                "soldiers": 6
            },
            {
                "name": "Černá",
                "soldiers": 6
            },
            {
                "name": "Žlutá",
                "soldiers": 6
            },
            {
                "name": "Šedivá",
                "soldiers": 6
            },
        ],
        "operations": [
            {
                "name": "Vojenská přehlídka",
                "desc": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
                "code": 84539,
                "actMin": 1,
                "actMax": 3,
                "isGeneral": true,
                "consumeSoldiers": false,
                "minSoldiers": 2,
                "difficulty": 1,
                "adversaries": 0,
                "costs": {
                    "wheat": 2,
                    "steal": 0,
                    "fuel": 1,
                    "randomOneResource": 0,
                    "randomMultiResource": 0,
                    "soldiersAction": "movement"
                },
                "rewards": {
                    "wheat": 0,
                    "steal": 0,
                    "fuel": 0,
                    "randomOneResource": 0,
                    "randomMultiResource": 0,
                    "soldiers": 0,
                }
            },
            {
                "name": "Obrana jezera Chasan",
                "desc": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
                "code": 52167,
                "actMin": 3,
                "actMax": 4,
                "isGeneral": true,
                "consumeSoldiers": true,
                "minSoldiers": 0,
                "difficulty": 3,
                "adversaries":  4,
                "costs": {
                    "wheat": 0,
                    "steal": 2,
                    "fuel": 0,
                    "randomOneResource": 0,
                    "randomMultiResource": 0,
                    "soldiersAction": "fight"
                },
                "rewards": {
                    "wheat": 0,
                    "steal": 0,
                    "fuel": 0,
                    "randomOneResource": 0,
                    "randomMultiResource": 0,
                    "soldiers": 0,
                }
            }
        ]
    }
}