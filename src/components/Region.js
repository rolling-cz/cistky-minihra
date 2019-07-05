import React from "react";

export default class Region extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            definition: props.definition,
            currentState: props.currentState,
            previousState: props.previousState,
            updateHandler: props.updateHandler
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
            <div className="row">
                <div className="col-md-2 font-weight-bold">
                    {this.state.definition.name}
                </div>
                <div className="col-md-1">
                    {this.state.currentState.population.total}
                </div>
                <div className="col-md-1">
                    <input id="fearLevel" type="text" size="3" value={this.state.currentState.fearLevel} onChange={this.handleChange.bind(this)} />
                </div>
                <div className="col-md-1">
                    <input id="food" type="text" size="3" value={this.state.currentState.food} onChange={this.handleChange.bind(this)} />
                </div>
                <div className="col-md-1">
                    <input id="population.wheat" type="text" size="2" value={this.state.currentState.population.wheat} onChange={this.handleChange.bind(this)} /> /
                    {this.state.currentState.productionSites.wheat}
                </div>
                <div className="col-md-1">
                    <input id="population.steal" type="text" size="2" value={this.state.currentState.population.steal} onChange={this.handleChange.bind(this)} /> /
                    {this.state.currentState.productionSites.steal}
                </div>
                <div className="col-md-1">
                    <input id="population.fuel" type="text" size="2" value={this.state.currentState.population.fuel} onChange={this.handleChange.bind(this)} /> /
                    {this.state.currentState.productionSites.fuel}
                </div>
                <div className="col-md-1">
                    {this.state.currentState.damaged.wheat}/{this.state.currentState.damaged.steal}/{this.state.currentState.damaged.fuel}
                </div>
                <div className="col-md-1">
                    <input id="constructing.wheat" type="text" size="1" value={this.state.currentState.constructing.wheat} onChange={this.handleChange.bind(this)} />
                    <input id="constructing.steal" type="text" size="1" value={this.state.currentState.constructing.steal} onChange={this.handleChange.bind(this)} />
                    <input id="constructing.fuel" type="text" size="1" value={this.state.currentState.constructing.fuel} onChange={this.handleChange.bind(this)} />
                </div>
                <div className="col-md-1">
                    <input id="repairing.wheat" type="text" size="1" value={this.state.currentState.repairing.wheat} onChange={this.handleChange.bind(this)} />
                    <input id="repairing.steal" type="text" size="1" value={this.state.currentState.repairing.steal} onChange={this.handleChange.bind(this)} />
                    <input id="repairing.fuel" type="text" size="1" value={this.state.currentState.repairing.fuel} onChange={this.handleChange.bind(this)} />
                </div>
                <div className="col-md-1">
                    {this.state.currentState.rebels}
                </div>
            </div>
        )
    }
}