import React from "react";
import {getInitialState, getDefinitions} from "../services/Definitions";
import Region from "./Region";
import Button from "react-bootstrap/Button";
import {evaluateAct} from "../services/Evaluator";
import DetailedAuditLog from "./DetailedAuditLog";
import TransportList from "./Transports";

export default class GameContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentState: getInitialState(),
            newState: null,
            history: []
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

        this.setState({currentState: newState})
    }

    addTransport(sourceRegion, targetRegion, number) {
        const newState = JSON.parse(JSON.stringify(this.state.currentState));
        newState.transports.push({sourceRegion: sourceRegion, targetRegion: targetRegion, number});
        this.setState({currentState: newState})
    }

    cancelTransport(transportKey) {
        const newState = JSON.parse(JSON.stringify(this.state.currentState));
        if (newState.transports.length > transportKey && transportKey >= 0 ) {
            newState.transports.splice(transportKey, 1);
            this.setState({currentState: newState})
        }
    }

    evaluate() {
        // TODO validations

        const newState = evaluateAct(getDefinitions(), this.state.currentState);
        this.setState({newState: newState});
    }

    applyEvaluation() {
        this.state.history.push(this.state.currentState);

        const newState = JSON.parse(JSON.stringify(this.state.newState));
        // TODO prepareStateForNextAct(newState);
        newState.auditLog = [];

        this.setState({currentState: newState, newState: null});
    }

    renderForm() {
        const definitions = getDefinitions();

        // TODO add armies
        // TODO disable regions

        return (
            <div>
                <h3 id="main-title">Plán hospodářství pro {this.state.history.length + 1}.dějství</h3>

                <div className="row">
                    <div className="col-md-2 font-weight-bold">
                        Název
                    </div>
                    <div className="col-md-1 font-weight-bold">
                        Populace
                    </div>
                    <div className="col-md-1 font-weight-bold">
                        Útlak
                    </div>
                    <div className="col-md-1 font-weight-bold">
                        Jídlo
                    </div>
                    <div className="col-md-1 font-weight-bold">
                        Pšenice
                    </div>
                    <div className="col-md-1 font-weight-bold">
                        Ocel
                    </div>
                    <div className="col-md-1 font-weight-bold">
                        Palivo
                    </div>
                    <div className="col-md-1 font-weight-bold">
                        Poškozené
                    </div>
                    <div className="col-md-1 font-weight-bold">
                        Výstavba
                    </div>
                    <div className="col-md-1 font-weight-bold">
                        Oprava
                    </div>
                    <div className="col-md-1 font-weight-bold">
                        Rebelové
                    </div>
                </div>
                {
                    this.state.currentState.regions.map((regionState, i) => {
                        return <Region definition={definitions.regions.find(region => region.name === regionState.name)}
                                       currentState={regionState}
                                       updateHandler={this.updateRegion.bind(this)}
                                       key={i} />
                    })
                }

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
        const definitions = getDefinitions();

        // TODO politbyro audit log

        return (
            <div>
                <DetailedAuditLog definitions={definitions} auditLog={this.state.newState.auditLog} />
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
            <div className="container mt-2">
                {this.state.newState ? this.renderEvaluation() : this.renderForm()}
            </div>
        )
    }
}