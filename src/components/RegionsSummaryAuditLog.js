import React from "react";
import {
    effectivnessToWord,
    resourceToWord4thCase,
    resourceToWord2ndCase,
    aggregateByRegion,
    rankingToWord,
    findEnemyNameObject,
    capitalize
} from "../services/AuditLogUtils";
import {t} from "../localization";

export default class RegionsSummaryAuditLog extends React.Component {
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

    static renderRank(rankPoints, i) {
        return (
            <div>
                {t(rankingToWord(rankPoints))}
            </div>
        )
    }

    renderOneLog(log, i) {
        let message;

        switch(log.type) {
            case "production":
                message = `${capitalize(t(effectivnessToWord(log.effectiveness)))} produkce ${t(resourceToWord2ndCase(log.resource))}`;
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
            case "victory":
                message = t("Úspěšně potlačené povstání");
                break;
            case "defeat":
                message = t("Neúspěšně potlačené povstání");
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
            case "occupationFullWithdraw":
                message = `${t(findEnemyNameObject(log.enemy, this.state.definitions).people)} ${t("opustili region")}`;
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
        return this.state.definitions.regions
            .filter(region => !this.state.disabledRegions.includes(region.name))
            .map((regionDef, i) => {
                return (
                    <div key={i} className="row row mt-2 justify-content-md-center">
                        <div className="col-md-3 font-weight-bold">
                            {t("Region")} {t(regionDef.name)}
                        </div>
                        <div className="col-md-6 text-left">
                            {RegionsSummaryAuditLog.renderRank(this.props.ranking.getRegionRank(regionDef.name))}
                            {this.state.auditLogPerRegion[regionDef.name].map((log, i) => {
                                return this.renderOneLog(log, i)
                            })}
                        </div>
                    </div>
                )
            })
    }
}
