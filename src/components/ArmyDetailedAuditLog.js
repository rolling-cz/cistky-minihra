import React from "react";
import {
    aggregateByArmy,
    inflectGroups,
    rankingToWord,
    inflectResources,
    resourceToWord2ndCase,
} from "../services/AuditLogUtils";
import {t} from "../localization";

export default class ArmyDetailedAuditLog extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            definitions: props.definitions,
            disabledArmies: props.disabledArmies,
            auditLogPerArmy: aggregateByArmy(props.definitions, props.auditLog)
        }
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

    renderArmyLog(log, i) {
        let messages = [];
        let type;

        switch(log.type) {
            case "armyStarvation":
                type = t("Hladomor");
                messages.push(`${t("Hlady zemřelo")} ${log.number} ${t(inflectGroups(log.number))} ${t("vojáků")}.`);
                break;
            case "armyRecruiting":
                type = t("Nábor");
                messages.push(`${t("Vycvičeno")} ${log.number} ${t(inflectGroups(log.number))} ${t("vojáků")}.`);
                break;
            case "victory":
                type = t("Potlačení povstání");
                messages.push(`${t("Úspěšně potlačené povstání v regionu")} ${t(log.region)}.`);
                messages.push(`${t("Naše ztráty")} ${log.soldiersWounded} ${t(inflectGroups(log.soldiersWounded))} ${t("vojáků")}.`);
                messages.push(`${t("Ztráty nepřátel")} ${log.rebelsWounded} ${t(inflectGroups(log.rebelsWounded))} ${t("povstalců")}.`);
                break;
            case "defeat":
                type = t("Prohra s rebely");
                messages.push(`${t("Neúspěšně potlačené povstání v regionu")} ${t(log.region)}.`);
                messages.push(`${t("Naše ztráty")} ${log.soldiersWounded} ${t(inflectGroups(log.soldiersWounded))} ${t("vojáků")}.`);
                messages.push(`${t("Ztráty nepřátel")} ${log.rebelsWounded} ${t(inflectGroups(log.rebelsWounded))} ${t("povstalců")}.`);
                break;
            case "liberationArmySuccess":
                type = t("Osvobození regionu");
                messages.push(`${t("Účast na osvobození regionu")} ${t(log.region)}.`);
                messages.push(`${t("Naše ztráty")} ${log.soldiersWounded} ${t(inflectGroups(log.soldiersWounded))} ${t("vojáků")}.`);
                break;
            case "liberationArmyLost":
                type = t("Selhání při osvobození");
                messages.push(`${t("Účast na neúspěšném osvbození regionu")} ${t(log.region)}.`);
                messages.push(`${t("Naše ztráty")} ${log.soldiersWounded} ${t(inflectGroups(log.soldiersWounded))} ${t("vojáků")}.`);
                break;
            case "occupyPatrolLost":
                type = t("Selhání obrany regionu");
                messages.push(`${t("Účast na obraně před obsazením regionu")} ${t(log.region)}.`);
                messages.push(`${t("Naše ztráty")} ${log.soldiersWounded} ${t(inflectGroups(log.soldiersWounded))} ${t("vojáků")}.`);
                messages.push(`${t("Ztráty nepřátel")} ${log.enemiesWounded} ${t(inflectGroups(log.enemiesWounded))} ${t("vojáků")}.`);
                break;
            case "occupyPatrolDefended":
                type = t("Úspěšná obrana regionu");
                messages.push(`${t("Účast na obraně před obsazením regionu")} ${t(log.region)}.`);
                messages.push(`${t("Naše ztráty")} ${log.soldiersWounded} ${t(inflectGroups(log.soldiersWounded))} ${t("vojáků")}.`);
                messages.push(`${t("Ztráty nepřátel")} ${log.enemiesWounded} ${t(inflectGroups(log.enemiesWounded))} ${t("vojáků")}.`);
                break;
            case "plunderPatrolLost":
                type = t("Selhání obrany regionu");
                messages.push(`${t("Účast na obraně před vypleněním regionu")} ${t(log.region)}.`);
                messages.push(`${t("Naše ztráty")} ${log.soldiersWounded} ${t(inflectGroups(log.soldiersWounded))} ${t("vojáků")}.`);
                break;
            case "plunderPatrolDefended":
                type = t("Úspěšná obrana regionu");
                messages.push(`${t("Účast na obraně před vypleněním regionu")} ${t(log.region)}.`);
                messages.push(`${t("Naše ztráty")} ${log.soldiersWounded} ${t(inflectGroups(log.soldiersWounded))} ${t("vojáků")}.`);
                break;
            case "operationSuccess":
                type = t("Úspěšná operace")
                messages.push(`${t("Úspěšně splněna vojenské operace")} ${t(log.operation)}. `);
                if (log.soldiersWounded > 0) {
                    messages.push(`${t("Naše ztráty")} ${log.soldiersWounded} ${t(inflectGroups(log.soldiersWounded))} ${t("vojáků")}.`);
                }
                if (log.soldiersDeparted > 0) {
                    messages.push(`${t("Odešlo")} ${log.soldiersDeparted} ${t(inflectGroups(log.soldiersDeparted))} ${t("vojáků")}.`);
                }
                this.state.definitions.coefficients.resources.types.forEach(resourceName => {
                    if (log.rewards[resourceName] > 0) {
                        messages.push(`${t("Získali jsme")} ${log.rewards[resourceName]} ${inflectResources(log.rewards[resourceName])} ${resourceToWord2ndCase(resourceName)}.`);
                    }
                })

                if (log.rewards.soldiers > 0) {
                    messages.push(`${t("Získali jsme")} ${log.rewards.soldiers} ${t(inflectGroups(log.rewards.soldiers))} ${t("vojáků")}.`);
                }
                break;
            case "operationFail":
                type = t("Neúspěšná operace")
                messages.push(`${t("Selhání během vojenské operace")} ${log.operation}.`);
                if (log.soldiersWounded > 0) {
                    messages.push(`${t("Naše ztráty")} ${log.soldiersWounded} ${t(inflectGroups(log.soldiersWounded))} ${t("vojáků")}.`);
                }
                if (log.soldiersDeparted > 0) {
                    messages.push(`\n${t("Odešlo")} ${log.soldiersDeparted} ${t(inflectGroups(log.soldiersDeparted))} ${t("vojáků")}.`);
                }
                break;
            case "fortificationSuccess":
                type = t("Opevnění");
                messages.push(`${t("Úspěšně opevněn")} ${t("region")} ${t(log.region)}`);
                break;
            case "fortificationOccupied":
                type = t("Opevnění");
                messages.push(`${t("Neúspěšný pokus o opevnění regionu")} ${t(log.region)}, ${t("je obsazen nepřítelem")}.`);
                break;
            case "fortificationUnnecessary":
                type = t("Opevnění");
                messages.push(`${t("Neúspěšný pokus o opevnění regionu")} ${t(log.region)}, ${t("již je opevněn")}.`);
                break;
            default:
                return ""
        }

        return (
            <div className="row justify-content-md-center" key={i}>
                <div className="col-md-4 font-weight-bold">
                    {type}
                </div>
                <div className="col-md-8 text-left">
                    {messages.map((text, i) => {
                        return <div key={i}>{text}</div>
                    })}
                </div>
            </div>
        )
    }

    render() {
         return this.state.definitions.armies
            .filter(army => !this.state.disabledArmies.includes(army.name))
            .map((armyDef, i) => {
                return (
                    <div key={i} className="mt-2">
                        <h3>{t("Armáda")} {t(armyDef.name)}</h3>
                        {ArmyDetailedAuditLog.renderRank(this.props.ranking.getArmyRank(armyDef.name))}
                        {this.state.auditLogPerArmy[armyDef.name].map((log, i) => {
                            return this.renderArmyLog(log, i)
                        })}
                        <hr />
                    </div>
                )
            })
    }
}
