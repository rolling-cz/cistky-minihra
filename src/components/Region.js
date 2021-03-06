import React from "react";
import Button from "react-bootstrap/Button";
import {sumSoldiersInRegion} from "../services/Evaluator";

export default class Region extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            definition: props.definition,
            currentState: props.currentState,
            commands: props.commands,
            previousState: props.previousState,
            updateHandler: props.updateHandler,
            toggleRegion: props.toggleRegion,
            order: props.order
        }
    }

    componentWillReceiveProps(props) {
        this.setState({currentState: props.currentState, previousState: props.previousState, order: props.order, commands: props.commands})
    }

    handleChange(event) {
        let value = parseInt(event.target.value);
        if (isNaN(value)) {
            value = 0;
        }

        if (value < 0) {
            value = 0;
        }

        const id = event.target.name;
        this.state.updateHandler(this.state.definition.name, id, value);
    }

    render() {
        const rowClass = this.state.order%2 === 1 ? '' : 'odd-row';
        return (
            <div className={`row mt-2 justify-content-md-center ${rowClass}`}>
                <div className="col-md-2 font-weight-bold">
                    {this.state.definition.name} <br />
                    <Button variant="dark" onClick={() => this.state.toggleRegion(this.state.definition.name)} className="mr-1">
                        Deaktivovat
                    </Button>
                </div>
                <div className="col-md-2 text-left">
                    Populace celkem: {this.state.currentState.population.total} <br />
                    Útlak:
                    <select name="fearLevel" value={this.state.currentState.fearLevel}  onChange={this.handleChange.bind(this)}>
                        <option value="1">Nízký</option>
                        <option value="2">Střední</option>
                        <option value="3">Vysoký</option>
                    </select> <br />
                    Poskytnuté jídlo: <input name="food" type="text" size="3" value={this.state.currentState.food} onChange={this.handleChange.bind(this)} />
                </div>
                <div className="col-md-2 text-left">
                    Pšenice:
                    <input name="population.wheat" type="text" size="2" value={this.state.currentState.population.wheat} onChange={this.handleChange.bind(this)} /> /
                    {this.state.currentState.productionSites.wheat}<br />
                    Ocel: <input name="population.steal" type="text" size="2" value={this.state.currentState.population.steal} onChange={this.handleChange.bind(this)} /> /
                    {this.state.currentState.productionSites.steal} <br />
                    Palivo: <input name="population.fuel" type="text" size="2" value={this.state.currentState.population.fuel} onChange={this.handleChange.bind(this)} /> /
                    {this.state.currentState.productionSites.fuel} <br />
                    Naverbovat: <input name="population.recruiting" type="text" size="3" value={this.state.currentState.population.recruiting} onChange={this.handleChange.bind(this)} />
                </div>
                <div className="col-md-2 text-left">
                    Poškozené: {this.state.currentState.damaged.wheat}/{this.state.currentState.damaged.steal}/{this.state.currentState.damaged.fuel} <br />
                    Budované <br />
                    <input name="constructing.wheat" type="text" size="1" value={this.state.currentState.constructing.wheat} onChange={this.handleChange.bind(this)} />
                    <input name="constructing.steal" type="text" size="1" value={this.state.currentState.constructing.steal} onChange={this.handleChange.bind(this)} />
                    <input name="constructing.fuel" type="text" size="1" value={this.state.currentState.constructing.fuel} onChange={this.handleChange.bind(this)} />
                    <br />
                    Opravované <br />
                    <input name="repairing.wheat" type="text" size="1" value={this.state.currentState.repairing.wheat} onChange={this.handleChange.bind(this)} />
                    <input name="repairing.steal" type="text" size="1" value={this.state.currentState.repairing.steal} onChange={this.handleChange.bind(this)} />
                    <input name="repairing.fuel" type="text" size="1" value={this.state.currentState.repairing.fuel} onChange={this.handleChange.bind(this)} />
                </div>
                <div className="col-md-2 text-left">
                    Dokončeno: {this.state.currentState.monuments.finished} <br />
                    Postavit: <input name="monuments.building" type="text" size="1" value={this.state.currentState.monuments.building} onChange={this.handleChange.bind(this)} />
                </div>
                <div className="col-md-2 text-left">
                    Rebelové: {this.state.currentState.rebels} <br />
                    Patrolující jed.: {sumSoldiersInRegion(this.state.definition.name, 'patrol', this.state.commands)} <br />
                    Potlačující jed: {sumSoldiersInRegion(this.state.definition.name, 'suppress', this.state.commands)}
                </div>
            </div>
        )
    }
}