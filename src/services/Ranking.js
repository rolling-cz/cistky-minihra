export default class Ranking {

    constructor(defs, disabledRegions, auditLog) {
        this.defs = defs;
        this.points = this.processAuditLog(disabledRegions, auditLog);
        this.ranking = this.calculateRanks(disabledRegions);
    }

    calculateRanks(disabledRegions) {
        let rankList = [];
        this.defs.regions.filter(region => !disabledRegions.includes(region.name)).forEach(region => {
            rankList.push({"name": region.name, "points": this.points[region.name]});
        });
        rankList.sort((a, b) => b.points - a.points);

        let rankMap = this.initRegions(disabledRegions);
        const length = rankList.length;


        const pDef = this.defs.coefficients.ranking.points;

        this.applyRank(rankMap, rankList, 0, pDef.best.number, pDef.best.rank);
        this.applyRank(rankMap, rankList, 1, Math.ceil(length * pDef.good.percent), pDef.good.rank);
        this.applyRank(rankMap, rankList, Math.floor((length  - 1) * (1 - pDef.bad.percent)), length - 1, pDef.bad.rank);
        this.applyRank(rankMap, rankList, length - pDef.worst.number, length, pDef.worst.rank);

        return rankMap;
    }

    applyRank(rankMap, rankList, start, end, rank) {
        console.log("ranking:", rank, ":", start, "-" ,end)
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

    processAuditLog(disabledRegions, auditLog) {
        const points = this.initRegions(disabledRegions);
        auditLog.forEach(log => {
            points[log.region] += this.calculatePoint(log);
        })
        return points;
    }

    calculatePoint(log) {
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
            default:
                return 0
        }
    }

    getRegionPoints(regionName) {
        return this.points[regionName];
    }

    getRegionRank(regionName) {
        return this.ranking[regionName];
    }
}