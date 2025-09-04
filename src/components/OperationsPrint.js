import React from "react";
import {
    inflectGroups, resourceToWord2ndCase, inflectResources1stCase
} from "../services/AuditLogUtils";
import { t } from "../localization";

export default class OperationsPrint extends React.Component {
    difficultyToWord(difficulty) {
        switch (difficulty) {
            case 1: return  t("Velice jednoduché");
            case 2: return  t("Jednoduché");
            case 3: return  t("Střední");
            case 4: return  t("Těžké");
            case 5: return  t("Velmi těžké");
            default: return t("ERROR: neznámá obtížnost ") + difficulty;
        }
    }

    minSoldiersToWord(units, consumeSoldiers) {
        let unitsString;
        if (units === 0) {
            unitsString = t("Libovolný");
        } else {
            unitsString = `${t("Minimálně")} ${units} ${t(inflectGroups(units))} ${t("vojáků")}`;
        }

        if (consumeSoldiers) {
            return (
                <div>
                    <div>{unitsString}</div>
                    <div>{t("Vyslaní vojácí se z operace v blízké době nevrátí.")}</div>
                </div>
            );
        } else {
            return unitsString;
        }
    }

    costsToWord(costs) {
        const messages = [];
        this.props.defs.coefficients.resources.types.forEach(resourceName => {
            if (costs[resourceName] > 0) {
                messages.push(`${costs[resourceName]} ${t(inflectResources1stCase(costs[resourceName]))} ${t(resourceToWord2ndCase(resourceName))}`);
            }
        })
        if (costs.randomOneResource > 0) {
            messages.push(`${costs.randomOneResource} ${t(inflectResources1stCase(costs.randomOneResource))} ${t("libovolné suroviny")}`);
        }
        if (costs.randomMultiResource > 0) {
            messages.push(`${costs.randomMultiResource} ${t(inflectResources1stCase(costs.randomMultiResource))} ${t("libovolné kombinace surovin")}`);
        }

        if (messages.length > 0) {
            return (
                <div>
                    {messages.map((text, i) => {
                        return <div key={i}>{text}</div>
                    })}
                </div>
            )
        } else {
            return t("žádné")
        }
    }

    codeToWord(opDef) {
        return `${opDef.code}-${opDef.actMin}-${opDef.actMax}-${opDef.isGeneral ? "G" : "I"}`;
    }

    actionToWord(action) {
        return this.props.defs.coefficients.army.actions[action].name;
    }


    render() {
        return (
            <div className="mt-3">
                <h3 className="no-print">{t("Seznam operací")}</h3>

                {this.props.defs.operations.map((op, i) =>{
                    return (
                        <div className="mt-1 operation-print" key={i}>
                            <h4>{t(op.name)}</h4>
                            <div className="row justify-content-md-center">
                                <div className="col-md-2 font-weight-bold">
                                    {t("Kód")}
                                </div>
                                <div className="col-md-4">
                                    {this.codeToWord(op)}
                                </div>

                                <div className="col-md-2 font-weight-bold">
                                    {t("Počet jednotek")}
                                </div>
                                <div className="col-md-4">
                                    {this.minSoldiersToWord(op.minSoldiers, op.consumeSoldiers)}
                                </div>
                            </div>

                            <div className="row justify-content-md-center">
                                <div className="col-md-2 font-weight-bold">
                                    {t("Obtížnost")}
                                </div>
                                <div className="col-md-4">
                                    {this.difficultyToWord(op.difficulty)}
                                </div>
                                <div className="col-md-2 font-weight-bold">
                                    {t("Činnost")}
                                </div>
                                <div className="col-md-4">
                                    {t(this.actionToWord(op.costs.soldiersAction))}
                                </div>
                            </div>

                            <div className="row justify-content-md-center">
                                <div className="offset-md-6 col-md-2 font-weight-bold">
                                    {t("Další náklady")}
                                </div>
                                <div className="col-md-4">
                                    {this.costsToWord(op.costs)}
                                </div>
                            </div>

                            <div className="desc">{t(op.desc)}</div>
                        </div>
                    )
                })}
            </div>
        )
    }
}
