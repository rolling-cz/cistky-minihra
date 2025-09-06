import React from "react";
import {
    inflectProductionSites,
    resourceToWord4thCase,
    aggregateByRegion,
    inflectGroups4thCase
} from "../services/AuditLogUtils";
import {t} from "../localization";

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

    renderRank(rank) {
        if (!rank) {
            return "";
        }

        const rankLevel = this.state.definitions.coefficients.ranking.points.region[rank];
        if (!rankLevel) {
            return "Neznámý rank " + rank;
        }
        const rankPoints = rankLevel.rankChange;
        if (rankPoints > 0) {
            return (
                <div>
                    {t("Přidat")} {rankPoints} {t("bod(y) ocenění")}.
                </div>
            )
        } else if (rankPoints < 0) {
           return (
               <div>
                   {t("Odebrat")} {Math.abs(rankPoints)} {t("bod(y) ocenění")}.
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
                message = `${t("Odebrat")} ${log.number} ${t(inflectGroups4thCase(log.number))} ${t("soudruhů")} ${t("kvůli hladomoru")}.`;
                break;
            case "rebellion":
                message = `${t("Odebrat")} ${log.number} ${t(inflectGroups4thCase(log.number))} ${t("soudruhů")} ${t("kvůlu rebélii")}.`;
                break;
            case "construction":
                message = `${t("Postavit")} ${log.number} ${t(inflectProductionSites(log.number))} ${t("na")} ${t(resourceToWord4thCase(log.resource))}.`;
                break;
            case "repair":
                message = `${t("Opravit")} ${log.number} ${t(inflectProductionSites(log.number))} ${t("na")} ${t(resourceToWord4thCase(log.resource))}.`;
                break;
            case "natality":
                message = `${t("Přidat")} ${log.number} ${t(inflectGroups4thCase(log.number))} ${t("soudruhů")}.`;
                break;
            case "damage":
                message = `${t("Poškodit")} ${log.number} ${t(inflectProductionSites(log.number))} na ${t(resourceToWord4thCase(log.resource))}.`;
                break;
            case "monuments":
                message = `${t("Postavit")} ${log.number} ${t("monument")}.`;
                break;
            case "occupyAttemptSuccess":
                message = `${t("Deaktivovat obsazený region")}`;
                break;
            case "liberationSuccess":
                message = `${t("Informovat o osvobození regionu")}`;
                break;
            case "liberationFail":
                message = `${t("Informovat o nepodařeném pokusu osvobodit region.")}`;
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
            .filter(region => !this.state.disabledRegions.includes(region.name) || this.state.auditLogPerRegion[region.name].length > 0)
            .map((regionDef, i) => {
                return (
                    <div key={i} className="row row mt-2 justify-content-md-center">
                        <div className="col-md-3 font-weight-bold">
                            {t("Region")} {t(regionDef.name)}
                        </div>
                        <div className="col-md-6 text-left">
                            {this.renderRank(this.props.ranking.getRegionRank(regionDef.name))}
                            {this.state.auditLogPerRegion[regionDef.name].map((log, i) => {
                                return RegionsAdminsAuditLog.renderOneLog(log, i)
                            })}
                        </div>
                    </div>
                )
            })
    }
}