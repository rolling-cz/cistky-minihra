import React from "react";
import {
    aggregateByRegion, aggregateByArmy, inflectGroups, rankingToWord
} from "../services/AuditLogUtils";

export default class ArmyAuditLog extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            definitions: props.definitions,
            disabledArmies: props.disabledArmies,
            auditLogPerRegion: aggregateByRegion(props.definitions, props.auditLog),
            auditLogPerArmy: aggregateByArmy(props.definitions, props.auditLog)
        }
    }

    componentWillReceiveProps(props) {
        this.setState({
            auditLogPerRegion: aggregateByRegion(this.state.definitions, props.auditLog),
            disabledRegions: props.disabledRegions
        })
    }

    static renderRank(rankPoints, i) {
        return (
            <div>
                {rankingToWord(rankPoints)}
            </div>
        )
    }

    renderArmyLogs() {
        return this.state.definitions.armies
                    .filter(army => !this.state.disabledArmies.includes(army.name))
                    .map((armyDef, i) => {
                        return (
                            <div key={i} className="row row mt-2 justify-content-md-center">
                                <div className="col-md-3 font-weight-bold">
                                    {armyDef.name} armáda
                                </div>
                                <div className="col-md-6 text-left">
                                    {ArmyAuditLog.renderRank(this.props.ranking.getArmyRank(armyDef.name))}
                                    {this.state.auditLogPerArmy[armyDef.name].map((log, i) => {
                                        return ArmyAuditLog.renderArmyLog(log, i)
                                    })}
                                </div>
                            </div>
                        )
                    })
    }

    renderRegionLogs() {
        return this.state.definitions.regions
                .map((regionDef, i) => {
                    if (ArmyAuditLog.containsInterestingLogs(this.state.auditLogPerRegion[regionDef.name])) {
                        return (
                            <div key={i} className="row row mt-2 justify-content-md-center">
                                <div className="col-md-3 font-weight-bold">
                                    Region {regionDef.name}
                                </div>
                                <div className="col-md-6 text-left">
                                    {this.state.auditLogPerRegion[regionDef.name].map((log, i) => {
                                        return ArmyAuditLog.renderRegionLog(log, i)
                                    })}
                                </div>
                            </div>
                        )
                    } else {
                        return ""
                    }
                })
    }

    static renderArmyLog(log, i) {
        let message;

        switch(log.type) {
            case "armyStarvation":
                message = `Hlady zemřelo ${log.number} ${inflectGroups(log.number)} vojáků.`;
                break;
            case "armyRecruiting":
                message = `Vycvičeno ${log.number} ${inflectGroups(log.number)} vojáků.`;
                break;
            case "victory":
                message = `Úspěšně potlačené povstání v regionu ${log.region}. Naše ztráty ${log.soldiersWounded} ${inflectGroups(log.soldiersWounded)} vojáků, ztráty nepřátel ${log.rebelsWounded} ${inflectGroups(log.rebelsWounded)} povstalců.`;
                break;
            case "defeat":
                message = `Neúspěšně potlačené povstání v regionu ${log.region}. Naše ztráty ${log.soldiersWounded} ${inflectGroups(log.soldiersWounded)} vojáků, ztráty nepřátel ${log.rebelsWounded} ${inflectGroups(log.rebelsWounded)} povstalců.`;
                break;
            default:
                return ""
        }

        return (
            <div key={i}>
                {message}
            </div>
        )
    }

    static containsInterestingLogs(logs) {
        return logs.filter(log => log.type === "rebellion" || log.type === "recruiting").length > 0
    }

    static renderRegionLog(log, i) {
        let message;

        switch(log.type) {
            case "rebellion":
                message = `Nepokoje - ${log.number} ${inflectGroups(log.number)} zrádců`;
                break;
            case "recruiting":
                message = `Poskytli ${log.number} ${inflectGroups(log.number)} soudruhů pro nábor do armády.`;
                break;
            default:
                return ""
        }

        return (
            <div key={i}>
                {message}
            </div>
        )
    }

    render() {
        return (
            <div className="mt-4">
                <h3>Vojenské shrnutí</h3>
                {this.renderArmyLogs()}
                <h3 className="mt-4">Regionální shrnutí</h3>
                {this.renderRegionLogs()}
            </div>
        )
    }
}