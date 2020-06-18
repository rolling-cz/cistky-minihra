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
import ArmyDetailedAuditLog from "./ArmyDetailedAuditLog";
import ArmyAdminsAuditLog from "./ArmyAdminsAuditLog";
import {validateRegion, validateArmy, validateEnemy} from "../services/Validator";
import Alert from "react-bootstrap/Alert";
import ArmyCosts from "./ArmyCosts";
import ConfigTab from "./ConfigTab";
import ArmyAuditLog from "./ArmyAuditLog";
import ArmyList from "./ArmyList";
import InvasionList from "./InvasionList";
import OccupationList from "./OccupationList";
import CommandList from "./CommandList";
import OperationList from "./OperationList";
import Ranking from "../services/Ranking";
import OperationsPrint from "./OperationsPrint";

export default class GameContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentState: getInitialState(),
            definitions: getDefinitions(),
            newState: null,
            history: [],
            logTab: "regionsComplete",
            formTab: "operationsPrint",
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

    updateArmy(name, id, value) {
        const newState = JSON.parse(JSON.stringify(this.state.currentState));
        const army = newState.armies.find(army => army.name === name);

        if (id.includes(".")) {
          const ids = id.split(".");
          army[ids[0]][ids[1]] = value;
        } else {
          army[id] = value;
        }

        this.setState({currentState: newState, error: null})
    }

    toggleArmy(name) {
        const newState = JSON.parse(JSON.stringify(this.state.currentState));
        const army = newState.armies.find(army => army.name === name);
        army.enabled = !army.enabled;
        this.setState({currentState: newState})
    }

    addCommand(armyName, regionName, type, soldiers) {
        const newState = JSON.parse(JSON.stringify(this.state.currentState));
        newState.commands.push({army: armyName, region: regionName, type: type, soldiers: soldiers});

        const army = newState.armies.find(armyState => armyState.name === armyName);
        if (army) {
          const error = validateArmy(this.state.definitions, army, newState.commands, newState.occupations, newState.operations);
          if (!error) {
              this.setState({currentState: newState, error: null})
          } else {
              this.setState({error: error})
          }
        } else {
          this.setState({currentState: newState, error: null})
        }
    }

    cancelCommand(commandKey) {
        const newState = JSON.parse(JSON.stringify(this.state.currentState));
        if (newState.commands.length > commandKey && commandKey >= 0 ) {
            newState.commands.splice(commandKey, 1);
            this.setState({currentState: newState})
        }
    }

    addOperation(armyName, operationName, soldiers) {
        const newState = JSON.parse(JSON.stringify(this.state.currentState));
        newState.operations.push({army: armyName, operation: operationName, soldiers: soldiers});

        const army = newState.armies.find(armyState => armyState.name === armyName);
        if (army) {
          const error = validateArmy(this.state.definitions, army, newState.commands, newState.occupations, newState.operations);
          if (!error) {
              this.setState({currentState: newState, error: null})
          } else {
              this.setState({error: error})
          }
        } else {
          this.setState({currentState: newState, error: null})
        }
    }

    cancelOperation(operationKey) {
        const newState = JSON.parse(JSON.stringify(this.state.currentState));
        if (newState.operations.length > operationKey && operationKey >= 0 ) {
            newState.operations.splice(operationKey, 1);
            this.setState({currentState: newState})
        }
    }

    addInvasion(enemyName, regionName, type, soldiers) {
        const newState = JSON.parse(JSON.stringify(this.state.currentState));
        newState.invasions.push({enemy: enemyName, region: regionName,  type: type, soldiers: soldiers});
        const error = validateEnemy(this.state.definitions, enemyName, newState.invasions);
        if (!error) {
          this.setState({currentState: newState, error: null})
        } else {
          this.setState({error: error})
        }
    }

    cancelInvasion(invasionKey) {
        const newState = JSON.parse(JSON.stringify(this.state.currentState));
        if (newState.invasions.length > invasionKey && invasionKey >= 0 ) {
            newState.invasions.splice(invasionKey, 1);
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
        newState.commands = [];
        newState.invasions = [];
        newState.operations = [];

        newState.regions.forEach(region => {
            definitions.coefficients.resources.types.forEach(resourceType => {
                region.constructing[resourceType] = 0;
                region.repairing[resourceType] = 0;
                region.population[resourceType] = 0;
            });
            region.population.recruiting = 0;
            region.monuments.building = 0;
            region.food = 0;
        })

        newState.armies.forEach(army => {
            army.food = 0;
            army.recruiting = 0;
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
                <Tab eventKey="regions" title="Regiony plán">
                    {this.renderRegions(this.state.definitions)}
                </Tab>
                <Tab eventKey="armies" title="Armáda plán">
                    {this.renderArmies(this.state.definitions)}
                </Tab>
                <Tab eventKey="armyCosts" title="Armáda náklady">
                    <ArmyCosts defs={this.state.definitions}/>
                </Tab>
                <Tab eventKey="foreignArmies" title="Cizí armády">
                    {this.renderForeignArmies(this.state.definitions)}
                </Tab>
                <Tab eventKey="config" title="Konfigurace">
                    <ConfigTab
                        defs={this.state.definitions}
                        updateHandler={this.updateConfig.bind(this)}
                        originalDefs={getDefinitions()}/>
                </Tab>
                <Tab eventKey="operationsPrint" title="Operace">
                    <OperationsPrint defs={this.state.definitions}/>
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
                               currentState={this.state.currentState}
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

    renderArmies(definitions) {
        return (
            <div className="mt-4">
                <h3 id="main-title">Plán armád pro {this.state.history.length + 1}. dějství</h3>
                {this.renderError()}

                <ArmyList definitions={definitions}
                            currentState={this.state.currentState}
                            updateHandler={this.updateArmy.bind(this)}
                            toggleArmy={this.toggleArmy.bind(this)}
                />

                <CommandList defs={definitions}
                              currentState={this.state.currentState}
                              commands={this.state.currentState.commands}
                              addCommand={this.addCommand.bind(this)}
                              cancelCommand={this.cancelCommand.bind(this)}
                />

                <OperationList defs={definitions}
                            currentState={this.state.currentState}
                            addOperation={this.addOperation.bind(this)}
                            cancelOperation={this.cancelOperation.bind(this)}
                />

                <div className="mt-3 no-print">
                    <Button variant="primary" onClick={this.evaluate.bind(this)} className="mr-2">
                        Vyhodnotit dějství
                    </Button>
                </div>
            </div>
        )
    }

    renderForeignArmies(definitions) {
        return (
            <div className="mt-4">
                <h3 id="main-title">Plán cizích armád pro {this.state.history.length + 1}. dějství</h3>
                {this.renderError()}

                <OccupationList defs={definitions}
                            currentState={this.state.currentState}
                />

                <InvasionList defs={definitions}
                            currentState={this.state.currentState}
                            addInvasion={this.addInvasion.bind(this)}
                            cancelInvasion={this.cancelInvasion.bind(this)}
                />

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
        const disabledArmies = this.state.newState.armies.filter(army => !army.enabled).map(army => army.name);
        const ranking = new Ranking(definitions, disabledRegions, disabledArmies, this.state.newState.auditLog);
        return (
            <div className="reports">
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
                                           disabledArmies={disabledArmies}
                                           ranking={ranking}/>
                    </Tab>
                    <Tab eventKey="armyDetail" title="Armáda kompletní">
                        <ArmyDetailedAuditLog definitions={definitions}
                                      auditLog={this.state.newState.auditLog}
                                      disabledArmies={disabledArmies}
                                      ranking={ranking}/>
                    </Tab>
                    <Tab eventKey="armySummary" title="Armáda shrnutí">
                        <ArmyAuditLog definitions={definitions}
                                      auditLog={this.state.newState.auditLog}
                                      disabledArmies={disabledArmies}
                                      ranking={ranking}/>
                    </Tab>
                    <Tab eventKey="armyAdmins" title="Armáda orgové">
                        <ArmyAdminsAuditLog definitions={definitions}
                                      auditLog={this.state.newState.auditLog}
                                      disabledArmies={disabledArmies}
                                      ranking={ranking}/>
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