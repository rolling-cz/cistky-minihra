import React from "react";
import {
    aggregateByRegion, aggregateByArmy, inflectGroups, findEnemyNameObject
} from "../services/AuditLogUtils";

export default class ArmyAdminsAuditLog extends React.Component {
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
        if (rankPoints > 0) {
            return (
                <div>
                    Přidat {rankPoints} bod(y) ocenění.
                </div>
            )
        } else if (rankPoints < 0) {
           return (
               <div>
                   Odebrat {Math.abs(rankPoints)} bod(y) ocenění.
               </div>
           )
        } else {
            return "";
        }
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
                                    {ArmyAdminsAuditLog.renderRank(this.props.ranking.getArmyRank(armyDef.name))}
                                    {this.state.auditLogPerArmy[armyDef.name].map((log, i) => {
                                        return this.renderArmyLog(log, i)
                                    })}
                                </div>
                            </div>
                        )
                    })
    }

    renderRegionLogs() {
        return this.state.definitions.regions
                .map((regionDef, i) => {
                    if (ArmyAdminsAuditLog.containsInterestingLogs(this.state.auditLogPerRegion[regionDef.name])) {
                        return (
                            <div key={i} className="row row mt-2 justify-content-md-center">
                                <div className="col-md-3 font-weight-bold">
                                    Region {regionDef.name}
                                </div>
                                <div className="col-md-6 text-left">
                                    {this.state.auditLogPerRegion[regionDef.name].map((log, i) => {
                                        return this.renderRegionLog(log, i)
                                    })}
                                </div>
                            </div>
                        )
                    } else {
                        return ""
                    }
                })
    }

    renderArmyLog(log, i) {
        let message;

        switch(log.type) {
            case "armyStarvation":
                message = `Odebrat ${log.number} ${inflectGroups(log.number)} vojáků kvůli hladomoru.`;
                break;
            case "armyRecruiting":
                message = `Přidat ${log.number} ${inflectGroups(log.number)} vojáků kvůli verbování.`;
                break;
            case "victory":
                message = `V regionu ${log.region} odebrat ${log.soldiersWounded} ${inflectGroups(log.soldiersWounded)} vojáků a ${log.rebelsWounded} ${inflectGroups(log.rebelsWounded)} povstalců.`;
                break;
            case "defeat":
                message = `V regionu ${log.region} odebrat ${log.soldiersWounded} ${inflectGroups(log.soldiersWounded)} vojáků a ${log.rebelsWounded} ${inflectGroups(log.rebelsWounded)} povstalců.`;
                break;
            case "liberationArmySuccess":
                message = `Odebrat ${log.soldiersWounded} ${inflectGroups(log.soldiersWounded)} vojáků kvůli osvobození`;
                break;
            case "liberationArmyLost":
                message = `Odebrat ${log.soldiersWounded} ${inflectGroups(log.soldiersWounded)} vojáků kvůli osvobození`;
                break;
            case "operationSuccess":
                message = '';
                if (log.soldiersWounded > 0) {
                    message += `Odebrat ${log.soldiersWounded} ${inflectGroups(log.soldiersWounded)} vojáků - ztráty z úspěšné operace.`;
                }
                if (log.soldiersDeparted > 0) {
                    message += `Odebrat ${log.soldiersDeparted} ${inflectGroups(log.soldiersDeparted)} vojáků - odešlo v rámci z úspěšné operace. `;
                }
                if (log.rewards.soldiers > 0) {
                    message += `Přidat ${log.rewards.soldiers} ${inflectGroups(log.rewards.soldiers)} vojáků - odměna za operaci. `;
                }
                break;
            case "operationFail":
                message = '';
                if (log.soldiersWounded > 0) {
                    message += `Odebrat ${log.soldiersWounded} ${inflectGroups(log.soldiersWounded)} vojáků - ztráty z neúspěšné operace. `;
                }
                if (log.soldiersDeparted > 0) {
                    message += `Odebrat ${log.soldiersDeparted} ${inflectGroups(log.soldiersDeparted)} vojáků - odešlo v rámci z neúspěšné operace. `;
                }
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
        return logs.filter(
            log => log.type === "rebellion" ||
            log.type === "occupyAttemptSuccess" ||
            log.type === "liberationSuccess" ||
            log.type === "liberationFail"
        ).length > 0
    }

    renderRegionLog(log, i) {
        let message;

        switch(log.type) {
            case "rebellion":
                message = `Přidat ${log.number} ${inflectGroups(log.number)} povstalců`;
                break;
            case "occupyAttemptSuccess":
                message = `Přidat ${log.soldiers} ${inflectGroups(log.soldiers)} nepřátel.`;
                break;
            case "liberationSuccess":
                message = `Úspěšně osvobozen - přesunout ${log.withdraw} ${inflectGroups(log.soldiers)} nepřátel zpět do ${findEnemyNameObject(log.enemy, this.state.definitions).countryName}, zbytek odebrat.`;
                break;
            case "liberationFail":
                message = `Odebrat ${log.enemiesWounded} ${inflectGroups(log.enemiesWounded)} nepřátelských vojáků.`;
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