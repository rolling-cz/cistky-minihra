import React from "react";
import {
    aggregateByRegion, inflectGroups
} from "../services/AuditLogUtils";

export default class ArmyAuditLog extends React.Component {
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

    static renderOneLog(log, i) {
        let message;

        switch(log.type) {
            case "rebellion":
                message = `Nepokoje - ${log.number} ${inflectGroups(log.number)} zrádců`;
                break;
            case "victory":
                message = `Úspěšně potlačené povstání. Naše ztráty ${log.soldiersWounded} ${inflectGroups(log.soldiersWounded)} vojáků, ztráty nepřátel ${log.rebelsWounded} ${inflectGroups(log.rebelsWounded)} povstalců.`;
                break;
            case "defeat":
                message = `Neúspěšně potlačené povstání. Naše ztráty ${log.soldiersWounded} ${inflectGroups(log.soldiersWounded)} vojáků, ztráty nepřátel ${log.rebelsWounded} ${inflectGroups(log.rebelsWounded)} povstalců.`;
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
                            {this.state.auditLogPerRegion[regionDef.name].map((log, i) => {
                                return ArmyAuditLog.renderOneLog(log, i)
                            })}
                        </div>
                    </div>
                )
            })
    }
}