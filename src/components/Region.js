import React from "react";
import Button from "react-bootstrap/Button";

export default class Region extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            definition: props.definition,
            currentState: props.currentState,
            previousState: props.previousState,
            updateHandler: props.updateHandler,
            toggleRegion: props.toggleRegion
        }
    }

    componentWillReceiveProps(props) {
        this.setState({currentState: props.currentState, previousState: props.previousState})
    }

    handleChange(event) {
        const value = parseInt(event.target.value);
        const id = event.target.id;
        this.state.updateHandler(this.state.definition.name, id, value);
    }

    render() {
        return (
            <div className="row mt-2 justify-content-md-center">
                <div className="col-md-2 font-weight-bold">
                    {this.state.definition.name} <br />
                    <Button variant="dark" onClick={() => this.state.toggleRegion(this.state.definition.name)} className="mr-1">
                        Deaktivovat
                    </Button>
                </div>
                <div className="col-md-3 text-left">
                    Populace celkem: {this.state.currentState.population.total} <br />
                    Útlak:
                    <select id="fearLevel" value={this.state.currentState.fearLevel}  onChange={this.handleChange.bind(this)}>
                        <option value="1">Nízký</option>
                        <option value="2">Střední</option>
                        <option value="3">Vysoký</option>
                    </select> <br />
                    Dedikované jídlo: <input id="food" type="text" size="3" value={this.state.currentState.food} onChange={this.handleChange.bind(this)} /> <br />
                </div>
                <div className="col-md-2 text-left">
                    Pšenice:
                    <input id="population.wheat" type="text" size="2" value={this.state.currentState.population.wheat} onChange={this.handleChange.bind(this)} /> /
                    {this.state.currentState.productionSites.wheat}<br />
                    Ocel: <input id="population.steal" type="text" size="2" value={this.state.currentState.population.steal} onChange={this.handleChange.bind(this)} /> /
                    {this.state.currentState.productionSites.steal} <br />
                    Palivo: <input id="population.fuel" type="text" size="2" value={this.state.currentState.population.fuel} onChange={this.handleChange.bind(this)} /> /
                    {this.state.currentState.productionSites.fuel} <br />
                </div>
                <div className="col-md-2 text-left">
                    Poškozené: {this.state.currentState.damaged.wheat}/{this.state.currentState.damaged.steal}/{this.state.currentState.damaged.fuel} <br />
                    Budované
                    <input id="constructing.wheat" type="text" size="1" value={this.state.currentState.constructing.wheat} onChange={this.handleChange.bind(this)} />
                    <input id="constructing.steal" type="text" size="1" value={this.state.currentState.constructing.steal} onChange={this.handleChange.bind(this)} />
                    <input id="constructing.fuel" type="text" size="1" value={this.state.currentState.constructing.fuel} onChange={this.handleChange.bind(this)} />
                    <br />
                    Opravované
                    <input id="repairing.wheat" type="text" size="1" value={this.state.currentState.repairing.wheat} onChange={this.handleChange.bind(this)} />
                    <input id="repairing.steal" type="text" size="1" value={this.state.currentState.repairing.steal} onChange={this.handleChange.bind(this)} />
                    <input id="repairing.fuel" type="text" size="1" value={this.state.currentState.repairing.fuel} onChange={this.handleChange.bind(this)} />
                </div>
                <div className="col-md-2 text-left">
                    Rebelové: {this.state.currentState.rebels} <br />
                    Patrolující jed.: <input id="soldiers.patrolling" type="text" size="1" value={this.state.currentState.soldiers.patrolling} onChange={this.handleChange.bind(this)} /><br />
                    Útočící jed: <input id="soldiers.attacking" type="text" size="1" value={this.state.currentState.soldiers.attacking} onChange={this.handleChange.bind(this)} />
                </div>
            </div>
        )
    }
}