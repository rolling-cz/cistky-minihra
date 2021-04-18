import React from "react";
import {
    aggregateByArmy,
    inflectGroups,
    rankingToWord,
    inflectResources,
    resourceToWord2ndCase,
} from "../services/AuditLogUtils";

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
                    Hodnocení
                </div>
                <div className="col-md-8 text-left">
                    {rankingToWord(rankPoints)}
                </div>
            </div>
        )
    }

    renderArmyLog(log, i) {
        let messages = [];
        let type;

        switch(log.type) {
            case "armyStarvation":
                type = "Hladomor";
                messages.push(`Hlady zemřelo ${log.number} ${inflectGroups(log.number)} vojáků.`);
                break;
            case "armyRecruiting":
                type = "Nábor";
                messages.push(`Vycvičeno ${log.number} ${inflectGroups(log.number)} vojáků.`);
                break;
            case "victory":
                type = "Potlačení povstání";
                messages.push(`Úspěšně potlačené povstání v regionu ${log.region}.`);
                messages.push(`Naše ztráty ${log.soldiersWounded} ${inflectGroups(log.soldiersWounded)} vojáků.`);
                messages.push(`Ztráty nepřátel ${log.rebelsWounded} ${inflectGroups(log.rebelsWounded)} povstalců.`);
                break;
            case "defeat":
                type = "Prohra s rebely";
                messages.push(`Neúspěšně potlačené povstání v regionu ${log.region}.`);
                messages.push(`Naše ztráty ${log.soldiersWounded} ${inflectGroups(log.soldiersWounded)} vojáků.`);
                messages.push(`Ztráty nepřátel ${log.rebelsWounded} ${inflectGroups(log.rebelsWounded)} povstalců.`);
                break;
            case "liberationArmySuccess":
                type = "Osvbození regionu";
                messages.push(`Účast na osvobození regionu ${log.region}.`);
                messages.push(`Naše ztráty ${log.soldiersWounded} ${inflectGroups(log.soldiersWounded)} vojáků.`);
                break;
            case "liberationArmyLost":
                type = "Selhání při osvobození";
                messages.push(`Účast na neúspěšném osvbození regionu ${log.region}.`);
                messages.push(`Naše ztráty ${log.soldiersWounded} ${inflectGroups(log.soldiersWounded)} vojáků.`);
                break;
            case "operationSuccess":
                type = "Úpěšná operace"
                messages.push(`Úspěšně splněna vojenské operace ${log.operation}. `);
                if (log.soldiersWounded > 0) {
                    messages.push(`Naše ztráty ${log.soldiersWounded} ${inflectGroups(log.soldiersWounded)} vojáků.`);
                }
                if (log.soldiersDeparted > 0) {
                    messages.push(`Odešlo ${log.soldiersDeparted} ${inflectGroups(log.soldiersDeparted)} vojáků.`);
                }
                this.state.definitions.coefficients.resources.types.forEach(resourceName => {
                    if (log.rewards[resourceName] > 0) {
                        messages.push(`Získali jsme ${log.rewards[resourceName]} ${inflectResources(log.rewards[resourceName])} ${resourceToWord2ndCase(resourceName)}.`);
                    }
                })

                if (log.rewards.soldiers > 0) {
                    messages.push(`Získali jsme ${log.rewards.soldiers} ${inflectGroups(log.rewards.soldiers)} vojáků.`);
                }
                break;
            case "operationFail":
                type = "Neúspěšná operace"
                messages.push(`Selhání během vojenské operace ${log.operation}.`);
                if (log.soldiersWounded > 0) {
                    messages.push(`Naše ztráty ${log.soldiersWounded} ${inflectGroups(log.soldiersWounded)} vojáků.`);
                }
                if (log.soldiersDeparted > 0) {
                    messages.push(`\nOdešlo ${log.soldiersDeparted} ${inflectGroups(log.soldiersDeparted)} vojáků.`);
                }
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
                        <h3>Armáda {armyDef.name}</h3>
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