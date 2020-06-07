export default class Ranking {

    constructor(defs, disabledRegions, disabledArmies, auditLog) {
        this.defs = defs;
        this.regionPoints = this.processAuditLogForRegions(disabledRegions, auditLog);
        this.regionRanking = this.calculateRanksForRegions(disabledRegions);

        this.armyPoints = this.processAuditLogForArmies(disabledArmies, auditLog);
        this.armyRanking = this.calculateRanksForArmies(disabledArmies);
    }

    calculateRanksForRegions(disabledRegions) {
        let rankList = [];
        this.defs.regions.filter(region => !disabledRegions.includes(region.name)).forEach(region => {
            rankList.push({"name": region.name, "points": this.regionPoints[region.name]});
        });
        rankList.sort((a, b) => b.points - a.points);

        let rankMap = this.initRegions(disabledRegions);
        this.applyRanks(rankMap, rankList)
        return rankMap;
    }

    calculateRanksForArmies(disabledArmies) {
        let rankList = [];
        this.defs.armies.filter(army => !disabledArmies.includes(army.name)).forEach(army => {
            rankList.push({"name": army.name, "points": this.armyPoints[army.name]});
        });
        rankList.sort((a, b) => b.points - a.points);

        let rankMap = this.initArmies(disabledArmies);
        this.applyRanks(rankMap, rankList)
        return rankMap;
    }

    applyRanks(rankMap, rankList) {
        const length = rankList.length;
        const pDef = this.defs.coefficients.ranking.points;

        this.applyRank(rankMap, rankList, 0, pDef.best.number, pDef.best.rank);
        this.applyRank(rankMap, rankList, 1, Math.ceil(length * pDef.good.percent), pDef.good.rank);
        this.applyRank(rankMap, rankList, Math.floor((length  - 1) * (1 - pDef.bad.percent)), length - 1, pDef.bad.rank);
        this.applyRank(rankMap, rankList, length - pDef.worst.number, length, pDef.worst.rank);

        return rankMap
    }

    applyRank(rankMap, rankList, start, end, rank) {
        //console.log("ranking:", rank, ":", start, "-" ,end)
        for (let i = start; i < end; i++) {
            rankMap[rankList[i].name] = rank;
        }
    }

    initRegions(disabledRegions) {
        const regionMap = {};
        this.defs.regions.filter(region => !disabledRegions.includes(region.name)).forEach(region => {
            regionMap[region.name] = 0
        })
        return regionMap;
    }

    initArmies(disabledArmies) {
        const armyMap = {};
        this.defs.armies.filter(army => !disabledArmies.includes(army.name)).forEach(army => {
            armyMap[army.name] = 0
        })
        return armyMap;
    }

    processAuditLogForRegions(disabledRegions, auditLog) {
        const points = this.initRegions(disabledRegions);
        auditLog.forEach(log => {
            if (log.region) {
                points[log.region] += this.calculateRegionPoint(log);
            }
        })
        return points;
    }

    processAuditLogForArmies(disabledArmies, auditLog) {
        const points = this.initArmies(disabledArmies);
        auditLog.forEach(log => {
            if (log.army) {
                points[log.army] += this.calculateArmyPoint(log);
            }
        })
        return points;
    }

    calculateRegionPoint(log) {
        const rDef = this.defs.coefficients.ranking;
        switch(log.type) {
            case "production":
                if (log.effectiveness > rDef.production.min) {
                    return Math.ceil((log.effectiveness - rDef.production.min) * rDef.production[log.resource]);
                } else {
                    return 0;
                }
            case "starvation":
                return log.number * rDef.starvation;
            case "rebellion":
                return log.number * rDef.rebellion;
            case "construction":
                return log.number * rDef.construction[log.resource];
            case "repair":
                return log.number * rDef.repair[log.resource];
            case "natality":
                return log.number * rDef.natality;
            case "damage":
                return log.number * rDef.damage[log.resource];
            case "transportOut":
                return log.number * rDef.transport.out;
            case "transportIn":
                return log.number * rDef.transport.in;
            case "monuments":
                return log.number * rDef.monument;
            case "recruiting":
                return log.number * rDef.recruiting;
            case "plunderAttemptSuccess":
                return rDef.plundered;
            case "occupyAttemptSuccess":
                return rDef.occupied;
            default:
                return 0
        }
    }

    calculateArmyPoint(log) {
        const rDef = this.defs.coefficients.ranking;
        switch(log.type) {
            case "victory":
                return rDef.army.victory + log.soldiersWounded * rDef.army.lost + log.rebelsWounded * rDef.army.killed;
            case "defeat":
                return rDef.army.defeat + log.soldiersWounded * rDef.army.lost + log.rebelsWounded * rDef.army.killed;
            case "armyStarvation":
                return log.number * rDef.army.starvation;
            case "armyRecruiting":
                return log.number * rDef.army.recruiting;
            case "patrol":
                return log.number * rDef.army.patrol;
            case "plunderPatrolDefended":
                return Math.ceil(log.contribution * rDef.army.plunderPatrolDefended);
            case "plunderPatrolLost":
                return Math.ceil(log.contribution * rDef.army.plunderPatrolLost);
            case "occupyPatrolDefended":
                return Math.ceil(log.contribution * rDef.army.occupyPatrolDefended);
            case "occupyPatrolLost":
                return Math.ceil(log.contribution * rDef.army.occupyPatrolLost);
            case "liberationArmySuccess":
                return rDef.army.victory + log.soldiersWounded * rDef.army.lost + log.enemiesWounded * rDef.army.killed;
            case "liberationArmyLost":
                return rDef.army.defeat + log.soldiersWounded * rDef.army.lost + log.enemiesWounded * rDef.army.killed;
            case "operationSuccess":
                return rDef.army.operationSuccess * log.difficulty + log.soldiersWounded * rDef.army.lost;
            case "operationFail":
                return rDef.army.operationFail * log.difficulty + log.soldiersWounded * rDef.army.lost;
            default:
                return 0
        }
    }

    getRegionPoints(regionName) {
        return this.regionPoints[regionName];
    }

    getRegionRank(regionName) {
        return this.regionRanking[regionName];
    }

    getArmyRank(armyName) {
        return this.armyRanking[armyName];
    }
}