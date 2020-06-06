import React from "react";
import {
    inflectProductionSites,
    resourceToWord4thCase,
    aggregateByRegion,
    inflectGroups4thCase
} from "../services/AuditLogUtils";

export default class RegionsAdminsAuditLog extends React.Component {
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
        if (rankPoints > 0) {
            return (
                <div>
                    Přidat {rankPoints} bod(y) ocenění.
                </div>
            )
        } else if (rankPoints < 0) {
           return (
               <div>
                   Odebrat {Math.abs(rankPoints)} bod(y) ocenění.
               </div>
           )
        } else {
            return "";
        }
    }

    static renderOneLog(log, i) {
        let message;

        switch(log.type) {
            case "starvation":
                message = `Odebrat ${log.number} ${inflectGroups4thCase(log.number)} soudruhů kvůli hladomoru.`;
                break;
            case "rebellion":
                message = `Odebrat ${log.number} ${inflectGroups4thCase(log.number)} soudruhů kvůlu rebélii.`;
                break;
            case "construction":
                message = `Postavit ${log.number} ${inflectProductionSites(log.number)} na ${resourceToWord4thCase(log.resource)}.`;
                break;
            case "repair":
                message = `Opravit ${log.number} ${inflectProductionSites(log.number)} na ${resourceToWord4thCase(log.resource)}.`;
                break;
            case "natality":
                message = `Přidat ${log.number} ${inflectGroups4thCase(log.number)} soudruhů.`;
                break;
            case "damage":
                message = `Poškodit ${log.number} ${inflectProductionSites(log.number)} na ${resourceToWord4thCase(log.resource)}.`;
                break;
            case "monuments":
                message = `Postavit ${log.number} monument.`;
                break;
            case "occupyAttemptSuccess":
                message = `Deaktivovat obsazený region.`;
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
                            {RegionsAdminsAuditLog.renderRank(this.props.ranking.getRegionRank(regionDef.name))}
                            {this.state.auditLogPerRegion[regionDef.name].map((log, i) => {
                                return RegionsAdminsAuditLog.renderOneLog(log, i)
                            })}
                        </div>
                    </div>
                )
            })
    }
}