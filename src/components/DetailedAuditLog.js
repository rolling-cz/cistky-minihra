import React from "react";

export default class DetailedAuditLog extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            definitions: props.definitions,
            auditLogPerRegion: this.aggregateByRegion(props.definitions, props.auditLog)
        }
    }

    componentWillReceiveProps(props) {
        this.setState({auditLogPerRegion: this.aggregateByRegion(this.state.definitions, props.auditLog)})
    }

    aggregateByRegion(definitions, auditLog) {
        const logsByRegions = {};
        definitions.regions.forEach(region => logsByRegions[region.name] = []);

        auditLog.forEach(log => {
            if (log.region) {
                logsByRegions[log.region].push(log)
            }
        });

        return logsByRegions
    }

    static resourceToWord(resource) {
        switch(resource) {
            case "wheat":
                return "pšenice";
            case "steal":
                return "ocele";
            case "fuel":
                return "paliva";
            default:
                return resource;
        }
    }

    static inflectResources(number) {
        if (number === 1) {
            return "jednotka"
        } else if (number === 2 || number === 3 || number === 4) {
            return "jednotky"
        } else {
            return "jednotek"
        }
    }

    static inflectGroups(number) {
        if (number === 1) {
            return "skupina"
        } else if (number === 2 || number === 3 || number === 4) {
            return "skupiny"
        } else {
            return "skupin"
        }
    }

    static renderOneLog(log, i) {
        let logType;
        let logDescription;

        switch(log.type) {
            case "production":
                logType = "Produkce";
                logDescription = `Vyprodukováno ${log.number} ${DetailedAuditLog.inflectResources(log.number)} ${DetailedAuditLog.resourceToWord(log.resource)}. Efektivnost byla ${log.effectiveness * 100}%.`;
                break;
            case "starvation":
                logType = "Hladomor";
                logDescription = `Zemřelo ${log.number} ${DetailedAuditLog.inflectGroups(log.number)} soudruhů.`;
                break;
            case "rebellion":
                logType = "Nepokoje";
                logDescription = `Vzbouřilo se ${log.number} ${DetailedAuditLog.inflectGroups(log.number)} zrádců.`;
                break;
            default:
                logType = "UNKNOWN";
                logDescription = JSON.stringify(log);
        }

        return (
            <div className="row" key={i}>
                <div className="col-md-2 font-weight-bold">
                    {logType}
                </div>
                <div className="col-md-8">
                    {logDescription}
                </div>
            </div>
        )
    }

    render() {
        return (
            this.state.definitions.regions.map((regionDef, i) => {
                return (
                    <div key={i} className="mt-2">
                        <h3>Region {regionDef.name}</h3>
                        {this.state.auditLogPerRegion[regionDef.name].map((log, i) => {
                            return DetailedAuditLog.renderOneLog(log, i)
                        })}
                    </div>
                )
            })
        )
    }
}