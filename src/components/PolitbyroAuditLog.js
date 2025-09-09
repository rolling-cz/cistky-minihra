import React from "react";
import {
    effectivnessToWord,
    resourceToWord4thCase,
    resourceToWord2ndCase,
    aggregateByRegion,
    aggregateByArmy,
    rankingToWord,
    findEnemyNameObject,
    capitalize
} from "../services/AuditLogUtils";
import {t} from "../localization";

export default class PolitbyroAuditLog extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            definitions: props.definitions,
            disabledRegions: props.disabledRegions,
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
        if (rankPoints !== 0) {
            return (
                <div>
                    {t(rankingToWord(rankPoints))}
                </div>
            )
        } else {
            return "";
        }
    }

    renderOneRegionLog(log, i) {
        let message;

        switch(log.type) {
            case "production":
                message = `${capitalize(t(effectivnessToWord(log.effectiveness)))} ${t("produkce")} ${t(resourceToWord2ndCase(log.resource))}`;
                break;
            case "starvation":
                message = t("Hladomor");
                break;
            case "rebellion":
                message = t("Nepokoje");
                break;
            case "construction":
                message = `${t("Výstavba výrobních zařízení na")} ${t(resourceToWord4thCase(log.resource))}`;
                break;
            case "repair":
                message = `${t("Oprava výrobních zařízení na")} ${t(resourceToWord4thCase(log.resource))}.`;
                break;
            case "damage":
                message = `${t("Poškozené výrobní zařízení na")} ${t(resourceToWord4thCase(log.resource))} ${t("povstalci")}`;
                break;
            case "monuments":
                message = t("Výstavba monumentu");
                break;
            case "recruiting":
                message = t("Poskytnutí soudruhů pro armádu");
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
                message = `${t(findEnemyNameObject(log.enemy, this.state.definitions).people)} ${t("obsadili region")}`;
                break;
            case "liberationSuccess":
                message = `${t("Úspěšně osvobozen z područí")} ${t(findEnemyNameObject(log.enemy, this.state.definitions).countryName2nd)}.`;
                break;
            case "liberationFail":
                message = t("Nezdařený pokus o osvobození");
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

    renderOneArmyLog(log, i) {
        let message;

        switch(log.type) {
            case "armyStarvation":
                message = t("Vojáci zemřeli hlady");
                break;
            case "armyRecruiting":
                message = t("Vyzbrojení nových vojáků");
                break;
            case "victory":
                message = `${t("Úspěšně potlačené povstání v regionu")} ${t(log.region)}`;
                break;
            case "defeat":
                message = `${t("Neúspěšně potlačené povstání v regionu")} ${t(log.region)}`;
                break;
            case "liberationArmySuccess":
                message = `${t("Účast na osvobození regionu")} ${t(log.region)}`;
                break;
            case "liberationArmyLost":
                message = `${t("Účast na neúspěšném osvbození")} regionu ${t(log.region)}`;
                break;
            case "operationSuccess":
                message = `${t("Úspěšně splněna vojenské operace")} ${t(log.operation)}`;
                break;
            case "operationFail":
                message = `${t("Selhání během vojenské operace")} ${t(log.operation)}`;
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

    renderRegionLogs() {
        return this.state.definitions.regions
            .filter(region => !this.state.disabledRegions.includes(region.name) || this.state.auditLogPerRegion[region.name].length > 0)
            .map((regionDef, i) => {
                return (
                    <div key={i} className="row row mt-2 justify-content-md-center">
                        <div className="col-md-3 font-weight-bold">
                            {t("Region")} {t(regionDef.name)}
                        </div>
                        <div className="col-md-6 text-left">
                            {!this.state.disabledRegions.includes(regionDef.name) ? PolitbyroAuditLog.renderRank(this.props.ranking.getRegionRank(regionDef.name)) : ''}
                            {this.state.auditLogPerRegion[regionDef.name].map((log, i) => {
                                return this.renderOneRegionLog(log, i)
                            })}
                        </div>
                    </div>
                )
            })
    }

    renderArmyLogs() {
        return this.state.definitions.armies
            .filter(army => !this.state.disabledArmies.includes(army.name))
            .map((armyDef, i) => {
                return (
                    <div key={i} className="row row mt-2 justify-content-md-center">
                        <div className="col-md-3 font-weight-bold">
                            {t(armyDef.name)} {t("armáda")}
                        </div>
                        <div className="col-md-6 text-left">
                            {PolitbyroAuditLog.renderRank(this.props.ranking.getArmyRank(armyDef.name))}
                            {this.state.auditLogPerArmy[armyDef.name].map((log, i) => {
                                return this.renderOneArmyLog(log, i)
                            })}
                        </div>
                    </div>
                )
            })
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
