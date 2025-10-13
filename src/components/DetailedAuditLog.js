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
import {t} from "../localization";

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
                    {t("Hodnocení")}
                </div>
                <div className="col-md-8 text-left">
                    {t(rankingToWord(rankPoints))}
                </div>
            </div>
        )
    }

    renderOneLog(log, i) {
        let logType;
        let logDescription;

        switch(log.type) {
            case "production":
                logType = t("Produkce");
                logDescription = `${t("Vyprodukovali jsme")} ${log.number} ${t(inflectResources(log.number))} ${t(resourceToWord2ndCase(log.resource))}. ${t("Efektivita byla")} ${t(effectivnessToWord(log.effectiveness))}.`;
                break;
            case "starvation":
                logType = t("Hladomor");
                logDescription = `${t("Zemřelo")} ${log.number} ${t(inflectGroups(log.number))} ${t("soudruhů")}.`;
                break;
            case "rebellion":
                logType = t("Nepokoje");
                const totalRebels = log.number + log.numberMoved + log.numberCreated
                logDescription = `${t("Zaznamenali jsme")} ${totalRebels} ${t(inflectGroups(totalRebels))} ${t("zrádců")}.`;
                if (log.rebellionType === "region") {
                    logDescription += `${t("Přišli z regionu")} ${t(log.rebellionSource)}.`;
                }
                break;
            case "construction":
                logType = t("Výstavba výrobních zařízení");
                logDescription = `${t("Dokončili jsme")} ${log.number} ${t(inflectProductionSites(log.number))} ${t("na")} ${t(resourceToWord4thCase(log.resource))}.`;
                break;
            case "repair":
                logType = t("Oprava výrobních zařízení");
                logDescription = `${t("Opravili jsme")} ${log.number} ${t(inflectProductionSites(log.number))} ${t("na")} ${t(resourceToWord4thCase(log.resource))}.`;
                break;
            case "natality":
                logType = t("Noví pracovníci");
                logDescription = `${t("Máme navíc")} ${log.number} ${t(inflectGroups(log.number))} ${t("soudruhů schopných práce")}.`;
                break;
            case "damage":
                logType = t("Poškozené výrobní zařízení");
                logDescription = `${t("Povstalci poškodili")} ${log.number} ${t(inflectProductionSites(log.number))} ${t("na")} ${t(resourceToWord4thCase(log.resource))}.`;
                break;
            case "transportOut":
                logType = t("Odchozí transport");
                logDescription = `${t("Odešel transport čítající")} ${log.number} ${t(inflectGroups(log.number))} ${t("soudruhů")}.`;
                break;
            case "transportIn":
                logType = t("Příchozí transport");
                logDescription = `${t("Dorazil transport čítající")} ${log.number} ${t(inflectGroups(log.number))} ${t("soudruhů")}.`;
                break;
            case "victory":
                logType = t("Potlačení povstání");
                logDescription = `${t("Úspěšné potlačení vzpoury, naše ztráty")} ${log.soldiersWounded} ${t(inflectGroups(log.soldiersWounded))} ${t("vojáků")}, ${t("ztráty nepřátel")} ${log.rebelsWounded} ${t(inflectGroups(log.rebelsWounded))} ${t("povstalců")}.`;
                break;
            case "defeat":
                logType = t("Potlačení povstání");
                logDescription = `${t("Ostudná porážka od rebelů, naše ztráty")} ${log.soldiersWounded} ${t(inflectGroups(log.soldiersWounded))} ${t("vojáků")}, ${t("ztráty nepřátel")} ${log.rebelsWounded} ${t(inflectGroups(log.rebelsWounded))} ${t("povstalců")}.`;
                break;
            case "monuments":
                logType = t("Výstavba monumentu");
                logDescription = `${t("Dokončili jsme stavbu")} ${log.number} ${t("monumentu")}.`;
                break;
            case "recruiting":
                logType = t("Nábor armády");
                logDescription = `${t("Poskytli jsme")} ${log.number} ${t(inflectGroups(log.number))} ${t("soudruhů pro nábor do armády")}.`;
                break;
            case "culturalEventRebelsRemoved":
                logType = t("Zklidnění rebélie díky kulturní události");
                logDescription = `${log.rebelsRemoved} ${t(inflectGroups(log.rebelsRemoved))} ${t("rebelů se vlivem kulturní události zařadilo zpět do populace")}.`;
                break;
            case "plunderAttemptFailed":
                logType = t("Neúspěšný pokus o vyplenění");
                logDescription = `${t("Naše armáda úspěšně odrazila")} ${t(findEnemyNameObject(log.enemy, this.state.definitions).attr)} ${t("pokus o vyplenění")}.`;
                break;
            case "plunderAttemptSuccess":
                logType = t("Vyplenění nepřítelem");
                logDescription = `${t(findEnemyNameObject(log.enemy, this.state.definitions).people)} ${t("vyplenili region, přišli jsme o většinu produkce")}.`;
                break;
            case "occupyAttemptFailed":
                logType = t("Neúspěšný pokus o obsazení");
                logDescription = `${t("Naše armáda úspěšně odrazila")} ${t(findEnemyNameObject(log.enemy, this.state.definitions).attr)} ${t("pokus o obsazení")}.`;
                break;
            case "occupyAttemptSuccess":
                logType = t("Obsazení nepřítelem");
                logDescription = `${t(findEnemyNameObject(log.enemy, this.state.definitions).people)} ${t("obsadili region, přišli jsme o veškerou kontrolu")}.`;
                break;
            case "occupationFullWithdraw":
            case "liberationSuccess":
                logType = t("Osvobození od nepřátel");
                logDescription = `${t(findEnemyNameObject(log.enemy, this.state.definitions).people)} ${t("opustili region, máme jej zpět pod kontrolou")}.`;
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
                        <h3>{t("Region")} {t(regionDef.name)}</h3>
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
