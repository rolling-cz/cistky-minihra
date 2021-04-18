import React from "react";
import {
    effectivnessToWord,
    inflectGroups,
    inflectProductionSites,
    inflectResources,
    resourceToWord4thCase,
    resourceToWord2ndCase,
    aggregateByRegion,
    rankingToWord,
    findEnemyNameObject
} from "../services/AuditLogUtils";

export default class DetailedAuditLog extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            definitions: props.definitions,
            disabledRegions: props.disabledRegions,
            auditLogPerRegion: aggregateByRegion(props.definitions, props.auditLog)
        }
    }

    componentWillReceiveProps(props) {
        this.setState({
            auditLogPerRegion: aggregateByRegion(this.state.definitions, props.auditLog),
            disabledRegions: props.disabledRegions
        })
    }

    static renderRank(rankPoints) {
        return (
            <div className="row justify-content-md-center">
                <div className="col-md-4 font-weight-bold">
                    Hodnocení
                </div>
                <div className="col-md-8 text-left">
                    {rankingToWord(rankPoints)}
                </div>
            </div>
        )
    }

    renderOneLog(log, i) {
        let logType;
        let logDescription;

        switch(log.type) {
            case "production":
                logType = "Produkce";
                logDescription = `Vyprodukovali jsme ${log.number} ${inflectResources(log.number)} ${resourceToWord2ndCase(log.resource)}. Efektivita byla ${effectivnessToWord(log.effectiveness)}.`;
                break;
            case "starvation":
                logType = "Hladomor";
                logDescription = `Zemřelo ${log.number} ${inflectGroups(log.number)} soudruhů.`;
                break;
            case "rebellion":
                logType = "Nepokoje";
                logDescription = `Zaznamenali jsme ${log.number} ${inflectGroups(log.number)} zrádců.`;
                break;
            case "construction":
                logType = "Výstavba výrobních zařízení";
                logDescription = `Dokončili jsme ${log.number} ${inflectProductionSites(log.number)} na ${resourceToWord4thCase(log.resource)}.`;
                break;
            case "repair":
                logType = "Oprava výrobních zařízení";
                logDescription = `Opravili jsme ${log.number} ${inflectProductionSites(log.number)} na ${resourceToWord4thCase(log.resource)}.`;
                break;
            case "natality":
                logType = "Noví pracovníci";
                logDescription = `Máme navíc ${log.number} ${inflectGroups(log.number)} soudruhů schopných práce.`;
                break;
            case "damage":
                logType = "Poškozené výrobní zařízení";
                logDescription = `Povstalci poškodili ${log.number} ${inflectProductionSites(log.number)} na ${resourceToWord4thCase(log.resource)}.`;
                break;
            case "transportOut":
                logType = "Odchozí transport";
                logDescription = `Odešel transport čítající ${log.number} ${inflectGroups(log.number)} soudruhů.`;
                break;
            case "transportIn":
                logType = "Příchozí transport";
                logDescription = `Dorazil transport čítající ${log.number} ${inflectGroups(log.number)} soudruhů.`;
                break;
            case "victory":
                logType = "Potlačení povstání";
                logDescription = `Úspěšné potlačení vzpoury, naše ztráty ${log.soldiersWounded} ${inflectGroups(log.soldiersWounded)} vojáků, ztráty nepřátel ${log.rebelsWounded} ${inflectGroups(log.rebelsWounded)} povstalců.`;
                break;
            case "defeat":
                logType = "Potlačení povstání";
                logDescription = `Ostudná porážka od rebelů, naše ztráty ${log.soldiersWounded} ${inflectGroups(log.soldiersWounded)} vojáků, ztráty nepřátel ${log.rebelsWounded} ${inflectGroups(log.rebelsWounded)} povstalců.`;
                break;
            case "monuments":
                logType = "Výstavba monumentu";
                logDescription = `Dokončili jsme stavbu ${log.number} monumentu.`;
                break;
            case "recruiting":
                logType = "Nábor armády";
                logDescription = `Poskytli jsme ${log.number} ${inflectGroups(log.number)} soudruhů pro nábor do armády.`;
                break;
            case "plunderAttemptFailed":
                logType = "Neúspěšný pokus o vyplenění";
                logDescription = `Naše armáda úspěšně odrazila ${findEnemyNameObject(log.enemy, this.state.definitions).attr} pokus o vyplenění.`;
                break;
            case "plunderAttemptSuccess":
                logType = "Vyplenění nepřítelem";
                logDescription = `${findEnemyNameObject(log.enemy, this.state.definitions).people} vyplenili region, přišli jsme o většinu produkce.`;
                break;
            case "occupyAttemptFailed":
                logType = "Neúspěšný pokus o obsazení";
                logDescription = `Naše armáda úspěšně odrazila ${findEnemyNameObject(log.enemy, this.state.definitions).attr} pokus o obsazení.`;
                break;
            case "occupyAttemptSuccess":
                logType = "Obsazení nepřítelem";
                logDescription = `${findEnemyNameObject(log.enemy, this.state.definitions).people} obsadili region, přišli jsme o veškerou kontrolu.`;
                break;
            default:
                return ""
        }

        return (
            <div className="row justify-content-md-center" key={i}>
                <div className="col-md-4 font-weight-bold">
                    {logType}
                </div>
                <div className="col-md-8 text-left">
                    {logDescription}
                </div>
            </div>
        )
    }

    render() {
        return this.state.definitions.regions
            .filter(region => !this.state.disabledRegions.includes(region.name))
            .map((regionDef, i) => {
                return (
                    <div key={i} className="mt-2">
                        <h3>Region {regionDef.name}</h3>
                        {DetailedAuditLog.renderRank(this.props.ranking.getRegionRank(regionDef.name))}
                        {this.state.auditLogPerRegion[regionDef.name].map((log, i) => {
                            return this.renderOneLog(log, i)
                        })}
                        <hr />
                    </div>
                )
            })
    }
}