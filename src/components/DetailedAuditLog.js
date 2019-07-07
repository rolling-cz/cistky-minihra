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

    static resourceToWord4thCase(resource) {
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

    static resourceToWord1stCase(resource) {
        switch(resource) {
            case "wheat":
                return "pšenici";
            case "steal":
                return "ocel";
            case "fuel":
                return "palivo";
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

    static inflectProductionSites(number) {
        if (number === 1) {
            return "produkční závod"
        } else if (number === 2 || number === 3 || number === 4) {
            return "produkční závody"
        } else {
            return "produkčních závodů"
        }
    }

    static effectivnessToWord(number) {
        if (number < 0.4) {
            return "příšerná"
        } else if (number < 0.8) {
            return "špatná"
        } else if (number < 1.1) {
            return "průměrná"
        } else if (number < 1.4) {
            return "velice dobrá"
        } else {
            return "úžasná"
        }
    }

    static renderOneLog(log, i) {
        let logType;
        let logDescription;

        switch(log.type) {
            case "production":
                logType = "Produkce";
                logDescription = `Vyprodukovali jsme ${log.number} ${DetailedAuditLog.inflectResources(log.number)} ${DetailedAuditLog.resourceToWord4thCase(log.resource)}. Efektivita byla ${DetailedAuditLog.effectivnessToWord(log.effectiveness)}.`;
                break;
            case "starvation":
                logType = "Hladomor";
                logDescription = `Zemřelo ${log.number} ${DetailedAuditLog.inflectGroups(log.number)} soudruhů.`;
                break;
            case "rebellion":
                logType = "Nepokoje";
                logDescription = `Nepokoje ${log.number} ${DetailedAuditLog.inflectGroups(log.number)} zrádců.`;
                break;
            case "construction":
                logType = "Výstavba výrobních zařízení";
                logDescription = `Dokončili jsme ${log.number} ${DetailedAuditLog.inflectProductionSites(log.number)} na ${DetailedAuditLog.resourceToWord1stCase(log.resource)}.`;
                break;
            case "repair":
                logType = "Oprava výrobních zařízení";
                logDescription = `Opravili jsme ${log.number} ${DetailedAuditLog.inflectProductionSites(log.number)} na ${DetailedAuditLog.resourceToWord1stCase(log.resource)}.`;
                break;
            case "natality":
                logType = "Noví pracovníci";
                logDescription = `Máme navíc ${log.number} ${DetailedAuditLog.inflectGroups(log.number)} soudruhů schopných práce.`;
                break;
            case "damage":
                logType = "Poškozené výrobní zařízení";
                logDescription = `Povstalci poškodili ${log.number} ${DetailedAuditLog.inflectProductionSites(log.number)} na ${DetailedAuditLog.resourceToWord1stCase(log.resource)}.`;
                break;
            case "transportOut":
                logType = "Odchozí transport";
                logDescription = `Odešel transport čítající ${log.number} ${DetailedAuditLog.inflectGroups(log.number)} soudruhů.`;
                break;
            case "transportIn":
                logType = "Příchozí transport";
                logDescription = `Dorazil transport čítající ${log.number} ${DetailedAuditLog.inflectGroups(log.number)} soudruhů.`;
                break;
            default:
                logType = "UNKNOWN";
                logDescription = JSON.stringify(log);
        }

        return (
            <div className="row" key={i}>
                <div className="col-md-4 font-weight-bold">
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
                        <hr />
                    </div>
                )
            })
        )
    }
}