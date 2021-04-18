import React from "react";
import {
    aggregateByRegion, aggregateByArmy, rankingToWord, findEnemyNameObject
} from "../services/AuditLogUtils";

export default class ArmyAuditLog extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            definitions: props.definitions,
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

    static renderRank(rankPoints) {
        return (
            <div>
                {rankingToWord(rankPoints)}
            </div>
        )
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
                                    {ArmyAuditLog.renderRank(this.props.ranking.getArmyRank(armyDef.name))}
                                    {this.state.auditLogPerArmy[armyDef.name].map((log, i) => {
                                        return this.renderArmyLog(log, i)
                                    })}
                                </div>
                            </div>
                        )
                    })
    }

    renderRegionLogs() {
        return this.state.definitions.regions
                .map((regionDef, i) => {
                    if (ArmyAuditLog.containsInterestingLogs(this.state.auditLogPerRegion[regionDef.name])) {
                        return (
                            <div key={i} className="row row mt-2 justify-content-md-center">
                                <div className="col-md-3 font-weight-bold">
                                    Region {regionDef.name}
                                </div>
                                <div className="col-md-6 text-left">
                                    {this.state.auditLogPerRegion[regionDef.name].map((log, i) => {
                                        return this.renderRegionLog(log, i)
                                    })}
                                </div>
                            </div>
                        )
                    } else {
                        return ""
                    }
                })
    }

    renderArmyLog(log, i) {
        let message;

        switch(log.type) {
            case "armyStarvation":
                message = `Hladomor.`;
                break;
            case "armyRecruiting":
                message = `Výcvik nových vojáků.`;
                break;
            case "victory":
                message = `Úspěšně potlačené povstání v regionu ${log.region}.`;
                break;
            case "defeat":
                message = `Neúspěšně potlačené povstání v regionu ${log.region}.`;
                break;
            case "liberationArmySuccess":
                message = `Účast na osvobození regionu ${log.region}.`;
                break;
            case "liberationArmyLost":
                message = `Účast na neúspěšném osvbození regionu ${log.region}.`;
                break;
            case "operationSuccess":
                message = `Úspěšně splněna vojenské operace ${log.operation}. `;
                break;
            case "operationFail":
                message = `Selhání během vojenské operace ${log.operation}. `;
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

    static containsInterestingLogs(logs) {
        return logs.filter(
            log => log.type === "rebellion" ||
            log.type === "recruiting" ||
            log.type === "plunderAttemptFailed" ||
            log.type === "plunderAttemptSuccess" ||
            log.type === "occupyAttemptFailed" ||
            log.type === "occupyAttemptSuccess" ||
            log.type === "liberationSuccess" ||
            log.type === "liberationFail"
        ).length > 0
    }

    renderRegionLog(log, i) {
        let message;

        switch(log.type) {
            case "rebellion":
                message = `Nepokoje`;
                break;
            case "recruiting":
                message = `Poskytli soudruhy pro nábor do armády.`;
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
                message = `${findEnemyNameObject(log.enemy, this.state.definitions).people} obsadili region.`;
                break;
            case "liberationSuccess":
                message = `Úspěšně osvobozen z područí ${findEnemyNameObject(log.enemy, this.state.definitions).countryName2nd}.`;
                break;
            case "liberationFail":
                message = `Nezdařený pokus o osvobození.`;
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