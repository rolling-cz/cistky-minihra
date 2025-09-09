import React from "react";
import {
    aggregateByRegion, aggregateByArmy, rankingToWord, findEnemyNameObject
} from "../services/AuditLogUtils";
import {t} from "../localization";

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

    static renderRank(rankPoints) {
        return (
            <div>
                {t(rankingToWord(rankPoints))}
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
                                    {t(armyDef.name)} ${t("armáda")}
                                </div>
                                <div className="col-md-6 text-left">
                                    {ArmyAuditLog.renderRank(this.props.ranking.getArmyRank(armyDef.name))}
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
                    if (ArmyAuditLog.containsInterestingLogs(this.state.auditLogPerRegion[regionDef.name])) {
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
                message = `${t("Hladomor")}.`;
                break;
            case "armyRecruiting":
                message = `${t("Výcvik nových vojáků")}.`;
                break;
            case "victory":
                message = `${t("Úspěšně potlačené povstání v regionu")} ${t(log.region)}.`;
                break;
            case "defeat":
                message = `${t("Neúspěšně potlačené povstání v regionu")} ${t(log.region)}.`;
                break;
            case "liberationArmySuccess":
                message = `${t("Účast na osvobození regionu")} ${t(log.region)}.`;
                break;
            case "liberationArmyLost":
                message = `${t("Účast na neúspěšném osvbození regionu")} ${t(log.region)}.`;
                break;
            case "operationSuccess":
                message = `${t("Úspěšně splněna vojenské operace")} ${t(log.operation)}. `;
                break;
            case "operationFail":
                message = `${t("Selhání během vojenské operace")} ${t(log.operation)}. `;
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
            log.type === "recruiting" ||
            log.type === "culturalEventRebelsRemoved" ||
            log.type === "plunderAttemptFailed" ||
            log.type === "plunderAttemptSuccess" ||
            log.type === "occupyAttemptFailed" ||
            log.type === "occupyAttemptSuccess" ||
            log.type === "liberationSuccess" ||
            log.type === "liberationFail"
        ).length > 0
    }

    renderRegionLog(log, i) {
        let message;

        switch(log.type) {
            case "rebellion":
                message = `${t("Nepokoje")}`;
                break;
            case "recruiting":
                message = `${t("Poskytli soudruhy pro nábor do armády")}.`;
                break;
            case "culturalEventRebelsRemoved":
                message = `${t("Zklidnění rebélie díky kulturní události")}.`;
                break;
            case "plunderAttemptFailed":
                message = `${t("Odražen")} ${t(findEnemyNameObject(log.enemy, this.state.definitions).attr)} ${t("pokus o vyplenění")}`;
                break;
            case "plunderAttemptSuccess":
                message = `${t(findEnemyNameObject(log.enemy, this.state.definitions).people)} ${t("vyplenili region")}`;
                break;
            case "occupyAttemptFailed":
                message = `${t("Odražen")} ${t(findEnemyNameObject(log.enemy, this.state.definitions).attr)} ${t("pokus o obsazení")}`;
                break;
            case "occupyAttemptSuccess":
                message = `${t(findEnemyNameObject(log.enemy, this.state.definitions).people)} ${t("obsadili region")}.`;
                break;
            case "liberationSuccess":
                message = `${t("Úspěšně osvobozen z područí")} ${t(findEnemyNameObject(log.enemy, this.state.definitions).countryName2nd)}.`;
                break;
            case "liberationFail":
                message = `${t("Nezdařený pokus o osvobození")}.`;
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
