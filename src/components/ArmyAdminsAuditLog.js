import React from "react";
import {
    aggregateByRegion, aggregateByArmy, inflectGroups, findEnemyNameObject
} from "../services/AuditLogUtils";
import {t} from "../localization";

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

    renderRank(rank, i) {
        if (!rank) {
            return "";
        }

        const rankLevel = this.state.definitions.coefficients.ranking.points.army[rank];
        if (!rankLevel) {
            return t("Neznámý rank") + " " + rank;
        }
        const rankPoints = rankLevel.rankChange;
        if (rankPoints > 0) {
            return (
                <div>
                    {t("Přidat")} {rankPoints} {t("bod(y) ocenění")}.
                </div>
            )
        } else if (rankPoints < 0) {
           return (
               <div>
                   {t("Odebrat")} {Math.abs(rankPoints)} {t("bod(y) ocenění")}.
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
                                    {t(armyDef.name)}  {t("armáda")}
                                </div>
                                <div className="col-md-6 text-left">
                                    {this.renderRank(this.props.ranking.getArmyRank(armyDef.name))}
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
                                    {t("Region")} {t(regionDef.name)}
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
                message = `${t("Odebrat")} ${log.number} ${t(inflectGroups(log.number))} ${t("vojáků")} ${t("kvůli hladomoru")}.`;
                break;
            case "armyRecruiting":
                message = `${t("Přidat")} ${log.number} ${t(inflectGroups(log.number))} ${t("vojáků")} ${t("kvůli verbování")}.`;
                break;
            case "victory":
                message = `${t("V regionu")} ${t(log.region)} ${t("odebrat")} ${log.soldiersWounded} ${t(inflectGroups(log.soldiersWounded))} ${t("vojáků")} ${t("a")} ${log.rebelsWounded} ${t(inflectGroups(log.rebelsWounded))} ${t("povstalců")}.`;
                break;
            case "defeat":
                message = `${t("V regionu")} ${t(log.region)} ${t("odebrat")} ${log.soldiersWounded} ${t(inflectGroups(log.soldiersWounded))} ${t("vojáků")} ${t("a")} ${log.rebelsWounded} ${t(inflectGroups(log.rebelsWounded))} ${t("povstalců")}.`;
                break;
            case "liberationArmySuccess":
                message = `${t("Odebrat")} ${log.soldiersWounded} ${t(inflectGroups(log.soldiersWounded))} ${t("vojáků")} ${t("kvůli osvobození")}`;
                break;
            case "liberationArmyLost":
                message = `${t("Odebrat")} ${log.soldiersWounded} ${t(inflectGroups(log.soldiersWounded))} ${t("vojáků")} ${t("kvůli osvobození")}`;
                break;
            case "operationSuccess":
                message = '';
                if (log.soldiersWounded > 0) {
                    message += `${t("Odebrat")} ${log.soldiersWounded} ${t(inflectGroups(log.soldiersWounded))} ${t("vojáků")} - ${t("ztráty z úspěšné operace")}.`;
                }
                if (log.soldiersDeparted > 0) {
                    message += `${t("Odebrat")} ${log.soldiersDeparted} ${t(inflectGroups(log.soldiersDeparted))} ${t("vojáků")} - ${t("odešlo v rámci z úspěšné operace")}. `;
                }
                if (log.rewards.soldiers > 0) {
                    message += `${t("Přidat")} ${log.rewards.soldiers} ${t(inflectGroups(log.rewards.soldiers))} ${t("vojáků")} - ${t("odměna za operaci")}. `;
                }
                break;
            case "operationFail":
                message = '';
                if (log.soldiersWounded > 0) {
                    message += `${t("Odebrat")} ${log.soldiersWounded} ${t(inflectGroups(log.soldiersWounded))} ${t("vojáků")} - ${t("ztráty z neúspěšné operace")}. `;
                }
                if (log.soldiersDeparted > 0) {
                    message += `${t("Odebrat")} ${log.soldiersDeparted} ${t(inflectGroups(log.soldiersDeparted))} ${t("vojáků")} - ${t("odešlo v rámci z neúspěšné operace")}. `;
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
            log.type === "liberationFail" ||
            log.type === "occupationReinforcement" ||
            log.type === "occupationFullWithdraw" ||
            log.type === "occupationWithdraw"
        ).length > 0
    }

    renderRegionLog(log, i) {
        let message;

        switch(log.type) {
            case "rebellion":
                const totalRebels = log.number + log.numberMoved + log.numberCreated
                message = `${t("Přidat")} ${totalRebels} ${t(inflectGroups(totalRebels))} ${t("povstalců")}.`;
                if (log.rebellionType === "region") {
                    message += `${t("Odebrat z regionu")} ${t(log.rebellionSource)} ${log.numberMoved} ${t(inflectGroups(log.numberMoved))} ${t("povstalců")}.`;
                }
                break;
            case "occupyAttemptSuccess":
            case "occupationReinforcement":
                message = `${t("Přidat")} ${log.soldiers} ${t(inflectGroups(log.soldiers))} ${t("nepřátel")}.`;
                break;
            case "occupationWithdraw":
            case "occupationFullWithdraw":
                message = `${t("Odebrat")} ${log.soldiers} ${t(inflectGroups(log.soldiers))} ${t("nepřátel")}.`;
                break;
            case "liberationSuccess":
                message = `${t("Úspěšně osvobozen")} - ${t("přesunout")} ${log.withdraw} ${t(inflectGroups(log.soldiers))} ${t("nepřátel")} ${t("zpět do")} ${t(findEnemyNameObject(log.enemy, this.state.definitions).countryName)}, ${t("zbytek odebrat")}.`;
                break;
            case "liberationFail":
                message = `${t("Odebrat")} ${log.enemiesWounded} ${t(inflectGroups(log.enemiesWounded))} ${t("nepřátelských vojáků")}.`;
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
                <h3>{t("Vojenské shrnutí")}</h3>
                {this.renderArmyLogs()}
                <h3 className="mt-4">{t("Regionální shrnutí")}</h3>
                {this.renderRegionLogs()}
            </div>
        )
    }
}