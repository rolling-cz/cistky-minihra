import React from "react";
import {
    effectivnessToWord,
    resourceToWord4thCase,
    resourceToWord2ndCase,
    aggregateByRegion,
    rankingToWord,
    findEnemyNameObject
} from "../services/AuditLogUtils";

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
                {rankingToWord(rankPoints)}
            </div>
        )
    }

    renderOneLog(log, i) {
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
            case "victory":
                message = "Úspěšně potlačené povstání";
                break;
            case "defeat":
                message = "Neúspěšně potlačené povstání";
                break;
            case "monuments":
                message = "Výstavba monumentu";
                break;
            case "recruiting":
                message = "Poskytnutí soudruhů pro armádu";
                break;
            case "plunderAttemptFailed":
                message = `Odražen ${findEnemyNameObject(log.enemy, this.state.definitions).attr} pokus o vyplenění`;
                break;
            case "plunderAttemptSuccess":
                message = `${findEnemyNameObject(log.enemy, this.state.definitions).people} vyplenili region`;
                break;
            case "occupyAttemptFailed":
                message = `Odražen ${findEnemyNameObject(log.enemy, this.state.definitions).attr} pokus o obsazení`;
                break;
            case "occupyAttemptSuccess":
                message = `${findEnemyNameObject(log.enemy, this.state.definitions).people} obsadili region`;
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
                            Region {regionDef.name}
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