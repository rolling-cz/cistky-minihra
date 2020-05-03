import React from "react";
import {
    effectivnessToWord,
    resourceToWord4thCase,
    resourceToWord2ndCase,
    aggregateByRegion,
    aggregateByArmy,
    rankingToWord
} from "../services/AuditLogUtils";

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

    static renderRank(rankPoints, i) {
        if (rankPoints !== 0) {
            return (
                <div>
                    {rankingToWord(rankPoints)}
                </div>
            )
        } else {
            return "";
        }
    }

    static renderOneRegionLog(log, i) {
        let message;

        switch(log.type) {
            case "production":
                message = `${effectivnessToWord(log.effectiveness)} produkce ${resourceToWord2ndCase(log.resource)}`;
                break;
            case "starvation":
                message = "Hladomor";
                break;
            case "rebellion":
                message = "Nepokoje";
                break;
            case "construction":
                message = `Výstavba výrobních zařízení na ${resourceToWord4thCase(log.resource)}`;
                break;
            case "repair":
                message = `Oprava výrobních zařízení na ${resourceToWord4thCase(log.resource)}.`;
                break;
            case "damage":
                message = `Poškozené výrobní zařízení na ${resourceToWord4thCase(log.resource)} povstalci`;
                break;
            case "monuments":
                message = "Výstavba monumentu";
                break;
            case "recruiting":
                message = "Poskytnutí soudruhů pro armádu";
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

    static renderOneArmyLog(log, i) {
        let message;

        switch(log.type) {
            case "armyStarvation":
                message = "Vojáci zemřeli hlady";
                break;
            case "armyRecruiting":
                message = "Vyzbrojení nových vojáků.";
                break;
            case "victory":
                message = `Úspěšně potlačené povstání v regionu ${log.region}`;
                break;
            case "defeat":
                message = `Neúspěšně potlačené povstání v regionu ${log.region}`;
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
            .filter(region => !this.state.disabledRegions.includes(region.name))
            .map((regionDef, i) => {
                return (
                    <div key={i} className="row row mt-2 justify-content-md-center">
                        <div className="col-md-3 font-weight-bold">
                            Region {regionDef.name}
                        </div>
                        <div className="col-md-6 text-left">
                            {PolitbyroAuditLog.renderRank(this.props.ranking.getRegionRank(regionDef.name))}
                            {this.state.auditLogPerRegion[regionDef.name].map((log, i) => {
                                return PolitbyroAuditLog.renderOneRegionLog(log, i)
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
                            {armyDef.name} armáda
                        </div>
                        <div className="col-md-6 text-left">
                            {PolitbyroAuditLog.renderRank(this.props.ranking.getArmyRank(armyDef.name))}
                            {this.state.auditLogPerArmy[armyDef.name].map((log, i) => {
                                return PolitbyroAuditLog.renderOneArmyLog(log, i)
                            })}
                        </div>
                    </div>
                )
            })
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