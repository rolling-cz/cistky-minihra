module.exports.getInitialState = () => {
    const regionsDto = [];
    const defs = getDefinitions();
    defs.regions.forEach(region => {
        regionsDto.push({
            "name": region.name,
            "enabled": region.priority !== 0,
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
            },
            "fortified": false
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
        rebellions: [],
        auditLog: [],
        eventRegion: null
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
                    "wheat": 4.2,
                    "steal": 3,
                    "fuel": 4.5
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
            "culturalEvents": {
                "productionBoostMultiplier": 20,
                "numberOfBirthed": 2,
                "removedRebels": 2,
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
                    "types": ["patrol", "suppress", "liberate", "fortify"]
                },
                "fortification": {
                    "defensePower": 1.2,
                    "lessWounded": 0.8,
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
                    "types": ["plunder", "occupy", "reinforce", "withdraw"]
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
                "priority": 0,
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
                "name": "Sibiř",
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
            },{
                "name": "Stalingradská oblast",
                "priority": 2,
                "start": {
                    "population": 110,
                    "wheat": 50,
                    "steal": 70,
                    "fuel": 70
                },
                "richness": {
                    "wheat": 50,
                    "steal": 70,
                    "fuel": 70
                }
            },{
                "name": "Středoasijské stány",
                "priority": 3,
                "start": {
                    "population": 80,
                    "wheat": 80,
                    "steal": 50,
                    "fuel": 0
                },
                "richness": {
                    "wheat": 100,
                    "steal": 100,
                    "fuel": 0
                }
            },{
                "name": "Ukrajina a Bělorusko",
                "priority": 1,
                "start": {
                    "population": 100,
                    "wheat": 170,
                    "steal": 0,
                    "fuel": 75
                },
                "richness": {
                    "wheat": 150,
                    "steal": 25,
                    "fuel": 50
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
                "name": "Zelená",
                "soldiers": 6
            },
            {
                "name": "Žlutá",
                "soldiers": 6
            },
            {
                "name": "Stříbrná",
                "soldiers": 6
            },
        ],
        "operations": [
            {
                "name": "Oslavná přehlídka",
                "desc": "Nic nepovzbudí bojovného ducha jako oslavná vojenská přehlídka. Taková přehlídka je demonstrací síly Strany, která potěší Vůdce a zastraší nepřítele. Kdo by nemiloval vojáky v uniformách, kteří pochodují pro Rudém náměstí?",
                "code": 4270,
                "actMin": 1,
                "actMax": 4,
                "isGeneral": true,
                "consumeSoldiers": false,
                "minSoldiers": 3,
                "difficulty": 1,
                "adversaries": 0,
                "costs": {
                    "wheat": 0,
                    "steal": 0,
                    "fuel": 0,
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
                "name": "Grandiózní přehlídka",
                "desc": "Existují vojenské přehlídky a vojenské přehlídky, na které se nezapomíná. Takové přehlídky, které představí neporazitelné vojsko, nové zbraně, zkušené generály. Takové přehlídky, při kterých davy jásají a jedno oko nezůstane suché. Takové přehlídky, které vykouzlí úsměv na tváří Vůdce, mraky se rozestoupí a slunce rozzáří oblohu. ",
                "code": 5349,
                "actMin": 2,
                "actMax": 4,
                "isGeneral": true,
                "consumeSoldiers": false,
                "minSoldiers": 6,
                "difficulty": 2,
                "adversaries": 0,
                "costs": {
                    "wheat": 0,
                    "steal": 0,
                    "fuel": 0,
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
                "name": "Přičlenění Tanu Tuva",
                "desc": "Tanu Tuva je ochotným spojencem Státu i Strany. Lid Tanu Tuva již dlouho touží stát se součástí Státu, aby se již nemusel sám bránit imperialistickým útokům proradného Západu. Soudruzi z Tanu Tuva již připravili vše potřebné a těší se na to, až je Vůdce přijme do své otcovské náruče. Armádu Strany budou všichni vítat s radostí a s ůsměvem na tváři. Ať žije Strana!",
                "code": 3472,
                "actMin": 1,
                "actMax": 2,
                "isGeneral": true,
                "consumeSoldiers": false,
                "minSoldiers": 1,
                "difficulty": 1,
                "adversaries": 2,
                "costs": {
                    "wheat": 1,
                    "steal": 0,
                    "fuel": 1,
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
            },
            {
                "name": "Bitva o Khalkin Gol",
                "desc": "Hranice s Mandžuskem dle Pekingské smlouvy patří Svazu. Do oblasti kolem hranice se v poslední době začaly přesouvat japonské vojenské jednotky, které se snaží ukrást toto území. Nedokážeme tomuto bezpráví jen nečinně přihlížet. Strana je silná a ochrání všechny své soudruhy a půdu: sovětská armáda přímo vojensky napadne japonské jednotky. Internacionalisté mohou mít k dispozici i mírové řešení.",
                "code": 7265,
                "actMin": 1,
                "actMax": 5,
                "isGeneral": true,
                "consumeSoldiers": false,
                "minSoldiers": 5,
                "difficulty": 2,
                "adversaries": 5,
                "costs": {
                    "wheat": 3,
                    "steal": 3,
                    "fuel": 3,
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
            },
            {
                "name": "Obrana Moldavska",
                "desc": "Moldávie v náručí Strany a Státu až donedávna prosperovala. Nyní moldavští soudruzi volají o pomoc. Rumunská vojska se valí do Moldávie a ohrožují mír i životy moldavského lidu. Sovětská armáda nemůže nechat takovou urážku bez odpovědi. Ať zhyne bídný nepřítel! Moldávii nevydáme!",
                "code": 8756,
                "actMin": 3,
                "actMax": 4,
                "isGeneral": true,
                "consumeSoldiers": false,
                "minSoldiers": 1,
                "difficulty": 2,
                "adversaries": 8,
                "costs": {
                    "wheat": 0,
                    "steal": 1,
                    "fuel": 2,
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
            },
            {
                "name": "Zajištění východočínské železenice",
                "desc": "Východočínská železnice byla vybudována díky úsilí, potu a krvi ruského lidu a byla po desetiletí pod ochranou sovětského impéria. Čínské vojenské jednotky se rozhodly porušit mezinárodní smlouvy a ukradnout dílo ruského lidu. Čínská armáda ale nedokáže zastrašit Vůdce. Sovětská armáda si opět vezme to, co jí patří a vyžene útočníky z jejich pozic. Sláva Straně!",
                "code": 1729,
                "actMin": 1,
                "actMax": 2,
                "isGeneral": true,
                "consumeSoldiers": false,
                "minSoldiers": 1,
                "difficulty": 2,
                "adversaries": 3,
                "costs": {
                    "wheat": 0,
                    "steal": 0,
                    "fuel": 1,
                    "randomOneResource": 0,
                    "randomMultiResource": 0,
                    "soldiersAction": "patrolling"
                },
                "rewards": {
                    "wheat": 0,
                    "steal": 0,
                    "fuel": 0,
                    "randomOneResource": 0,
                    "randomMultiResource": 1,
                    "soldiers": 0,
                }
            },
            {
                "name": "Pomoc do Španělska",
                "desc": "Ve Španělsku bojují španělští soudruzi i soudruzi z dalších zemích proti fašistické hrozbě. Sovětský Svaz rád podá pomocnou ruku španělským soudruhům, aby ve Španělsku mohla zvítězit revoluce.",
                "code": 6429,
                "actMin": 2,
                "actMax": 4,
                "isGeneral": true,
                "consumeSoldiers": false,
                "minSoldiers": 2,
                "difficulty": 3,
                "adversaries": 4,
                "costs": {
                    "wheat": 1,
                    "steal": 1,
                    "fuel": 1,
                    "randomOneResource": 0,
                    "randomMultiResource": 0,
                    "soldiersAction": "fight"
                },
                "rewards": {
                    "wheat": 0,
                    "steal": 0,
                    "fuel": 0,
                    "randomOneResource": 0,
                    "randomMultiResource": 2,
                    "soldiers": 0,
                }
            },
            {
                "name": "Nácvik nových taktik",
                "desc": "Armáda Sovětského Svazu je neohrožená, zkušená a bdělá! Ale někdy neuškodí připravit taktické cvičení a naučit již tak dokonalou armádu novým manévrům. Vojáci se nenudí a Generální štáb má šanci ukázat připravenost svých mužů.",
                "code": 7405,
                "actMin": 1,
                "actMax": 4,
                "isGeneral": true,
                "consumeSoldiers": false,
                "minSoldiers": 2,
                "difficulty": 1,
                "adversaries": 0,
                "costs": {
                    "wheat": 0,
                    "steal": 0,
                    "fuel": 0,
                    "randomOneResource": 0,
                    "randomMultiResource": 7,
                    "soldiersAction": "patrolling"
                },
                "rewards": {
                    "wheat": 1,
                    "steal": 0,
                    "fuel": 0,
                    "randomOneResource": 0,
                    "randomMultiResource": 0,
                    "soldiers": 2,
                }
            },
            {
                "name": "Přeshraniční návštěva",
                "desc": "Hranice je třeba hlídat. Občas je třeba hranice preventivně překročit, aby se armáda ujistila, že hranice neleží o pár kilometrů dál na území nepřítele. Nepřítel nikdy nespí a jistě plánuje vojenskou operaci na území Sovětského Svazu. A i kdyby neplánoval, je potřeba se ujistit, že plánovat nezačne.",
                "code": 7560,
                "actMin": 2,
                "actMax": 4,
                "isGeneral": true,
                "consumeSoldiers": false,
                "minSoldiers": 3,
                "difficulty": 2,
                "adversaries": 5,
                "costs": {
                    "wheat": 0,
                    "steal": 0,
                    "fuel": 1,
                    "randomOneResource": 0,
                    "randomMultiResource": 0,
                    "soldiersAction": "fight"
                },
                "rewards": {
                    "wheat": 0,
                    "steal": 0,
                    "fuel": 0,
                    "randomOneResource": 0,
                    "randomMultiResource": 6,
                    "soldiers": 0,
                }
            },
            {
                "name": "Vojenští poradci do Československa",
                "desc": "Revoluci je třeba dobře naplánovat a nikdo nemá lepší vojenské poradce než Sovětský Svaz. Pečlivě vybraní soudruzi, které vychovala Strana, zocelila válka a prověřil sám Vůdce, dokáží rozžehnout plamen revoluce a pomoci internacionále v jejím úsilí. Soudruzi všech zemí, spojte se!",
                "code": 4230,
                "actMin": 1,
                "actMax": 4,
                "isGeneral": false,
                "consumeSoldiers": true,
                "minSoldiers": 1,
                "difficulty": 1,
                "adversaries": 0,
                "costs": {
                    "wheat": 1,
                    "steal": 0,
                    "fuel": 0,
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
                "name": "Vojenští poradci do Francie",
                "desc": "Revoluci je třeba dobře naplánovat a nikdo nemá lepší vojenské poradce než Sovětský Svaz. Pečlivě vybraní soudruzi, které vychovala Strana, zocelila válka a prověřil sám Vůdce, dokáží rozžehnout plamen revoluce a pomoci internacionále v jejím úsilí. Soudruzi všech zemí, spojte se!",
                "code": 4820,
                "actMin": 1,
                "actMax": 4,
                "isGeneral": false,
                "consumeSoldiers": true,
                "minSoldiers": 1,
                "difficulty": 1,
                "adversaries": 0,
                "costs": {
                    "wheat": 1,
                    "steal": 0,
                    "fuel": 0,
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
                "name": "Vojenští poradci do Itálie",
                "desc": "Revoluci je třeba dobře naplánovat a nikdo nemá lepší vojenské poradce než Sovětský Svaz. Pečlivě vybraní soudruzi, které vychovala Strana, zocelila válka a prověřil sám Vůdce, dokáží rozžehnout plamen revoluce a pomoci internacionále v jejím úsilí. Soudruzi všech zemí, spojte se!",
                "code": 5110,
                "actMin": 1,
                "actMax": 4,
                "isGeneral": false,
                "consumeSoldiers": true,
                "minSoldiers": 1,
                "difficulty": 1,
                "adversaries": 0,
                "costs": {
                    "wheat": 1,
                    "steal": 0,
                    "fuel": 0,
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
                "name": "Vojenští poradci do Jugoslávie",
                "desc": "Revoluci je třeba dobře naplánovat a nikdo nemá lepší vojenské poradce než Sovětský Svaz. Pečlivě vybraní soudruzi, které vychovala Strana, zocelila válka a prověřil sám Vůdce, dokáží rozžehnout plamen revoluce a pomoci internacionále v jejím úsilí. Soudruzi všech zemí, spojte se!",
                "code": 5640,
                "actMin": 1,
                "actMax": 4,
                "isGeneral": false,
                "consumeSoldiers": true,
                "minSoldiers": 1,
                "difficulty": 1,
                "adversaries": 0,
                "costs": {
                    "wheat": 1,
                    "steal": 0,
                    "fuel": 0,
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
                "name": "Vojenští poradci do Německa",
                "desc": "Revoluci je třeba dobře naplánovat a nikdo nemá lepší vojenské poradce než Sovětský Svaz. Pečlivě vybraní soudruzi, které vychovala Strana, zocelila válka a prověřil sám Vůdce, dokáží rozžehnout plamen revoluce a pomoci internacionále v jejím úsilí. Soudruzi všech zemí, spojte se!",
                "code": 2340,
                "actMin": 1,
                "actMax": 4,
                "isGeneral": false,
                "consumeSoldiers": true,
                "minSoldiers": 1,
                "difficulty": 1,
                "adversaries": 0,
                "costs": {
                    "wheat": 1,
                    "steal": 0,
                    "fuel": 0,
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
                "name": "Vojenští poradci do Rakouska",
                "desc": "Revoluci je třeba dobře naplánovat a nikdo nemá lepší vojenské poradce než Sovětský Svaz. Pečlivě vybraní soudruzi, které vychovala Strana, zocelila válka a prověřil sám Vůdce, dokáží rozžehnout plamen revoluce a pomoci internacionále v jejím úsilí. Soudruzi všech zemí, spojte se!",
                "code": 1850,
                "actMin": 1,
                "actMax": 4,
                "isGeneral": false,
                "consumeSoldiers": true,
                "minSoldiers": 1,
                "difficulty": 1,
                "adversaries": 0,
                "costs": {
                    "wheat": 1,
                    "steal": 0,
                    "fuel": 0,
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
                "name": "Vojenští poradci do Portugalska",
                "desc": "Revoluci je třeba dobře naplánovat a nikdo nemá lepší vojenské poradce než Sovětský Svaz. Pečlivě vybraní soudruzi, které vychovala Strana, zocelila válka a prověřil sám Vůdce, dokáží rozžehnout plamen revoluce a pomoci internacionále v jejím úsilí. Soudruzi všech zemí, spojte se!",
                "code": 7250,
                "actMin": 1,
                "actMax": 4,
                "isGeneral": false,
                "consumeSoldiers": true,
                "minSoldiers": 1,
                "difficulty": 1,
                "adversaries": 0,
                "costs": {
                    "wheat": 1,
                    "steal": 0,
                    "fuel": 0,
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
                "name": "Vojenští poradci do Španělska",
                "desc": "Revoluci je třeba dobře naplánovat a nikdo nemá lepší vojenské poradce než Sovětský Svaz. Pečlivě vybraní soudruzi, které vychovala Strana, zocelila válka a prověřil sám Vůdce, dokáží rozžehnout plamen revoluce a pomoci internacionále v jejím úsilí. Soudruzi všech zemí, spojte se!",
                "code": 6230,
                "actMin": 1,
                "actMax": 4,
                "isGeneral": false,
                "consumeSoldiers": true,
                "minSoldiers": 1,
                "difficulty": 1,
                "adversaries": 0,
                "costs": {
                    "wheat": 1,
                    "steal": 0,
                    "fuel": 0,
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
                "name": "Získat podporu ze zahraničí",
                "desc": "Kominterna dokáže získat dobrovolníky z různých zemí. Internacionalisti zajistí vojáky, na generálech je jen obléct je, živit je a dát jim zbraně.",
                "code": 8953,
                "actMin": 1,
                "actMax": 4,
                "isGeneral": false,
                "consumeSoldiers": false,
                "minSoldiers": 0,
                "difficulty": 1,
                "adversaries": 0,
                "costs": {
                    "wheat": 2,
                    "steal": 1,
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
                    "soldiers": 1,
                }
            },
            {
                "name": "Invaze do zahraničí",
                "desc": "Vítězná válka povzbudí morálku, zajistí nová území a posílí víru v revoluci. Každá vítězná válka začíná dobře naplánovanou invazí. Nepřátelé budou v hrůze prchat a zahazovat své zbraně, zem se zbarví krví padlých, ženy budou plést věnce a děti budou zpívat oslavné písně. To bude krása!",
                "code": 6750,
                "actMin": 2,
                "actMax": 5,
                "isGeneral": false,
                "consumeSoldiers": false,
                "minSoldiers": 4,
                "difficulty": 3,
                "adversaries": 5,
                "costs": {
                    "wheat": 3,
                    "steal": 1,
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
                    "soldiers": 3,
                }
            }
        ]
    }
}
