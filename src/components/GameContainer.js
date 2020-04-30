import React from "react";
import {getInitialState, getDefinitions} from "../services/Definitions";
import Button from "react-bootstrap/Button";
import {evaluateAct} from "../services/Evaluator";
import DetailedAuditLog from "./DetailedAuditLog";
import TransportList from "./Transports";
import RegionList from "./RegionList";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import PolitbyroAuditLog from "./PolitbyroAuditLog";
import RegionsSummaryAuditLog from "./RegionsSummaryAuditLog";
import RegionsAdminsAuditLog from "./RegionsAdminsAuditLog";
import {validateRegion} from "../services/Validator";
import Alert from "react-bootstrap/Alert";
import Armies from "./Armies";
import ConfigTab from "./ConfigTab";
import ArmyAuditLog from "./ArmyAuditLog";
import Ranking from "../services/Ranking";

export default class GameContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentState: getInitialState(),
            definitions: getDefinitions(),
            newState: null,
            history: [],
            logTab: "regionsComplete",
            formTab: "regions",
            error: null
        }
    }

    updateRegion(name, id, value) {
        const newState = JSON.parse(JSON.stringify(this.state.currentState));
        const region = newState.regions.find(region => region.name === name);

        if (id.includes(".")) {
            const ids = id.split(".");
            region[ids[0]][ids[1]] = value;
        } else {
            region[id] = value;
        }

        const error = validateRegion(this.state.definitions, region, newState.transports);
        if (!error) {
            this.setState({currentState: newState, error: null})
        } else {
            this.setState({error: error})
        }
    }

    toggleRegion(name) {
        const newState = JSON.parse(JSON.stringify(this.state.currentState));
        const region = newState.regions.find(region => region.name === name);
        region.enabled = !region.enabled;
        this.setState({currentState: newState})
    }

    addTransport(sourceRegion, targetRegion, number) {
        const newState = JSON.parse(JSON.stringify(this.state.currentState));
        newState.transports.push({sourceRegion: sourceRegion, targetRegion: targetRegion, number});

        const region = newState.regions.find(region => region.name === sourceRegion);
        if (region) {
            const error = validateRegion(this.state.definitions, region, newState.transports);
            if (!error) {
                this.setState({currentState: newState, error: null})
            } else {
                this.setState({error: error})
            }
        } else {
            this.setState({currentState: newState, error: null})
        }
    }

    updateConfig(newDef) {
        this.setState({definitions: newDef})
    }

    cancelTransport(transportKey) {
        const newState = JSON.parse(JSON.stringify(this.state.currentState));
        if (newState.transports.length > transportKey && transportKey >= 0 ) {
            newState.transports.splice(transportKey, 1);
            this.setState({currentState: newState})
        }
    }

    evaluate() {
        const newState = evaluateAct(this.state.definitions, this.state.currentState);
        this.setState({newState: newState});
    }

    applyEvaluation() {
        this.state.history.push(this.state.currentState);

        const newState = JSON.parse(JSON.stringify(this.state.newState));
        this.prepareStateForNextAct(newState);


        this.setState({currentState: newState, newState: null});
    }

    prepareStateForNextAct(newState) {
        const definitions = this.state.definitions;

        newState.auditLog = [];
        newState.transports = [];

        newState.regions.forEach(region => {
            definitions.coefficients.resources.types.forEach(resourceType => {
                region.constructing[resourceType] = 0;
                region.repairing[resourceType] = 0;
                region.population[resourceType] = 0;
            });
            region.food = 0;
            region.soldiers.attacking = 0;
        })
    }

    renderError() {
        if (this.state.error) {
            return (
                <Alert variant="danger" onClose={() => this.setState({error: null})} dismissible>
                    {this.state.error}
                </Alert>
            )
        }
    }

    renderForm() {
        return (
            <Tabs
                id="form-tabs"
                activeKey={this.state.formTab}
                onSelect={key => this.setState({ formTab: key })}
            >
                <Tab eventKey="regions" title="Regiony">
                    {this.renderRegions(this.state.definitions)}
                </Tab>
                <Tab eventKey="army" title="Armáda">
                    <Armies defs={this.state.definitions}/>
                </Tab>
                <Tab eventKey="config" title="Konfigurace">
                    <ConfigTab
                        defs={this.state.definitions}
                        updateHandler={this.updateConfig.bind(this)}
                        originalDefs={getDefinitions()}/>
                </Tab>
            </Tabs>

        )
    }

    renderRegions(definitions) {
        return (
            <div className="mt-4">
                <h3 id="main-title">Plán hospodářství pro {this.state.history.length + 1}. dějství</h3>
                {this.renderError()}

                <RegionList definitions={definitions}
                            currentState={this.state.currentState}
                            updateHandler={this.updateRegion.bind(this)}
                            toggleRegion={this.toggleRegion.bind(this)}
                />

                <TransportList defs={definitions}
                               transports={this.state.currentState.transports}
                               addTransport={this.addTransport.bind(this)}
                               cancelTransport={this.cancelTransport.bind(this)}/>

                <div className="mt-3 no-print">
                    <Button variant="primary" onClick={this.evaluate.bind(this)} className="mr-2">
                        Vyhodnotit dějství
                    </Button>
                </div>
            </div>
        )
    }

    renderEvaluation() {
        const definitions = this.state.definitions;
        const disabledRegions = this.state.newState.regions.filter(region => !region.enabled).map(region => region.name);
        const ranking = new Ranking(definitions, disabledRegions, this.state.newState.auditLog);
        return (
            <div>
                <h3 id="main-title">Výsledky hospodářství za {this.state.history.length + 1}. dějství</h3>
                <Tabs
                    id="log-tabs"
                    activeKey={this.state.logTab}
                    onSelect={key => this.setState({ logTab: key })}
                >
                    <Tab eventKey="regionsComplete" title="Regiony kompletní">
                        <DetailedAuditLog definitions={definitions}
                                          auditLog={this.state.newState.auditLog}
                                          disabledRegions={disabledRegions}
                                          ranking={ranking}/>
                    </Tab>
                    <Tab eventKey="regionsSummary" title="Regiony shrnutí">
                        <RegionsSummaryAuditLog definitions={definitions}
                                          auditLog={this.state.newState.auditLog}
                                          disabledRegions={disabledRegions}
                                          ranking={ranking}/>
                    </Tab>
                    <Tab eventKey="regionsAdmins" title="Regiony orgové">
                        <RegionsAdminsAuditLog definitions={definitions}
                                          auditLog={this.state.newState.auditLog}
                                          disabledRegions={disabledRegions}
                                          ranking={ranking}/>
                    </Tab>
                    <Tab eventKey="politbyro" title="Politbyro">
                        <PolitbyroAuditLog definitions={definitions}
                                           auditLog={this.state.newState.auditLog}
                                           disabledRegions={disabledRegions}
                                           ranking={ranking}/>
                    </Tab>
                    <Tab eventKey="army" title="Armáda">
                        <ArmyAuditLog definitions={definitions}
                                      auditLog={this.state.newState.auditLog}
                                      disabledRegions={disabledRegions}/>
                    </Tab>
                </Tabs>

                <div className="mt-3 no-print">
                    <Button variant="primary" onClick={this.applyEvaluation.bind(this)} className="mr-2">
                        Potvrdit vyhodnocení
                    </Button>
                    <Button variant="secondary" onClick={() => this.setState({"newState": null})} className="mr-2">
                        Zpět na zadávání
                    </Button>
                </div>
            </div>
        )
    }

    render() {
        return (
            <div className={`container mt-2 ${this.state.error ? "invalid" : ""}`}>
                {this.state.newState ? this.renderEvaluation() : this.renderForm()}
            </div>
        )
    }
}