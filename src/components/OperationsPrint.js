import React from "react";
import {
    inflectGroups, resourceToWord2ndCase, inflectResources1stCase
} from "../services/AuditLogUtils";

export default class OperationsPrint extends React.Component {
    difficultyToWord(difficulty) {
        switch (difficulty) {
            case 1: return "Velice jednoduché";
            case 2: return "Jednoduché";
            case 3: return "Střední";
            case 4: return "Těžké";
            case 5: return "Velmi těžké";
            default: return "ERROR: neznámá obtížnost " + difficulty;
        }
    }

    minSoldiersToWord(units, consumeSoldiers) {
        let unitsString;
        if (units === 0) {
            unitsString = "Libovolný";
        } else {
            unitsString = `Minimálně ${units} ${inflectGroups(units)} vojáků`;
        }

        if (consumeSoldiers) {
            return (
                <div>
                    <div>{unitsString}</div>
                    <div>Vyslaní vojácí se z operace v blízké době nevrátí.</div>
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
                messages.push(`${costs[resourceName]} ${inflectResources1stCase(costs[resourceName])} ${resourceToWord2ndCase(resourceName)}`);
            }
        })
        if (costs.randomOneResource > 0) {
            messages.push(`${costs.randomOneResource} ${inflectResources1stCase(costs.randomOneResource)} libovolné suroviny`);
        }
        if (costs.randomMultiResource > 0) {
            messages.push(`${costs.randomMultiResource} ${inflectResources1stCase(costs.randomMultiResource)} libovolné kombinace surovin`);
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
            return "žádné"
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
                <h3 className="no-print">Seznam operací</h3>

                {this.props.defs.operations.map((op, i) =>{
                    return (
                        <div className="mt-1 operation-print" key={i}>
                            <h4>{op.name}</h4>
                            <div className="row justify-content-md-center">
                                <div className="col-md-2 font-weight-bold">
                                    Kód
                                </div>
                                <div className="col-md-4">
                                    {this.codeToWord(op)}
                                </div>

                                <div className="col-md-2 font-weight-bold">
                                    Počet jednotek
                                </div>
                                <div className="col-md-4">
                                    {this.minSoldiersToWord(op.minSoldiers, op.consumeSoldiers)}
                                </div>
                            </div>

                            <div className="row justify-content-md-center">
                                <div className="col-md-2 font-weight-bold">
                                    Obtížnost
                                </div>
                                <div className="col-md-4">
                                    {this.difficultyToWord(op.difficulty)}
                                </div>
                                <div className="col-md-2 font-weight-bold">
                                    Činnost
                                </div>
                                <div className="col-md-4">
                                    {this.actionToWord(op.costs.soldiersAction)}
                                </div>
                            </div>

                            <div className="row justify-content-md-center">
                                <div className="offset-md-6 col-md-2 font-weight-bold">
                                    Další náklady
                                </div>
                                <div className="col-md-4">
                                    {this.costsToWord(op.costs)}
                                </div>
                            </div>

                            <div className="desc">{op.desc}</div>
                        </div>
                    )
                })}
            </div>
        )
    }
}