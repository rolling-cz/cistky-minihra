import React from "react";
import {
    effectivnessToWord,
    inflectGroups,
    inflectProductionSites,
    inflectResources,
    resourceToWord4thCase, resourceToWord2ndCase, aggregateByRegion
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

     static renderOneLog(log, i) {
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
            default:
                logType = "UNKNOWN";
                logDescription = JSON.stringify(log);
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
                        {this.state.auditLogPerRegion[regionDef.name].map((log, i) => {
                            return DetailedAuditLog.renderOneLog(log, i)
                        })}
                        <hr />
                    </div>
                )
            })
    }
}