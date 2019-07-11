import React from "react";

export default class Armies extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            defs: props.defs,
            actions: {
                maintenance: 0,
                conscripting: 0,
                fight: 0,
                movement: 0,
                patrolling: 0
            }
        }
    }

    updateActionNumber(event) {
        let value = parseInt(event.target.value);
        if (isNaN(value)) {
            value = 0;
        }

        if (value < 0) {
            value = 0;
        }

        const id = event.target.id;

        const actions = JSON.parse(JSON.stringify(this.state.actions));
        actions[id] = value;
        this.setState({actions: actions})
    }

    calculateCosts(action) {
        const costs = {};
        this.state.defs.coefficients.resources.types.forEach(resourceType =>
            costs[resourceType] = action[resourceType] * this.state.actions[action.id]
        );
        return costs;
    }

    renderAction(action) {
        const costs = this.calculateCosts(action);
        return (
            <div className="row justify-content-md-center mt-2">
                <div className="col-md-2 font-weight-bold">
                    {action.name}
                </div>
                <div className="col-md-2">
                    <input id={action.id} type="text" size="2" value={this.state.actions[action.id]} onChange={this.updateActionNumber.bind(this)} />
                </div>
                <div className="col-md-2">
                    {costs.wheat}
                </div>
                <div className="col-md-2">
                    {costs.steal}
                </div>
                <div className="col-md-2">
                    {costs.fuel}
                </div>
            </div>
        )
    }

    renderSum() {
        const costs = [];
        costs.push(this.calculateCosts(this.state.defs.coefficients.army.actions.maintenance));
        costs.push(this.calculateCosts(this.state.defs.coefficients.army.actions.conscripting));
        costs.push(this.calculateCosts(this.state.defs.coefficients.army.actions.fight));
        costs.push(this.calculateCosts(this.state.defs.coefficients.army.actions.movement));
        costs.push(this.calculateCosts(this.state.defs.coefficients.army.actions.patrolling));

        const totalCosts = {};
        this.state.defs.coefficients.resources.types.forEach(resourceType => {
            totalCosts[resourceType] = 0;
            costs.forEach(actionCost => {
                totalCosts[resourceType] += actionCost[resourceType]
            })
        });

        const units = this.state.actions.maintenance
            + this.state.actions.conscripting
            + this.state.actions.fight
            + this.state.actions.movement
            + this.state.actions.patrolling;

        return (
            <div className="row justify-content-md-center mt-2">
                <div className="col-md-2 font-weight-bold">
                    Celkem
                </div>
                <div className="col-md-2 font-weight-bold">
                    {units}
                </div>
                <div className="col-md-2 font-weight-bold">
                    {Math.ceil(totalCosts.wheat)}
                </div>
                <div className="col-md-2 font-weight-bold">
                    {Math.ceil(totalCosts.steal)}
                </div>
                <div className="col-md-2 font-weight-bold">
                    {Math.ceil(totalCosts.fuel)}
                </div>
            </div>
        )
    }

    render() {
        return (
            <div className="mt-4">
                <h3>Počítadlo nákladů armády</h3>
                <div className="row justify-content-md-center">
                    <div className="col-md-2 font-weight-bold">
                        Akce
                    </div>
                    <div className="col-md-2 font-weight-bold">
                        Počet jednotek
                    </div>
                    <div className="col-md-2 font-weight-bold">
                        Pšenice
                    </div>
                    <div className="col-md-2 font-weight-bold">
                        Ocel
                    </div>
                    <div className="col-md-2 font-weight-bold">
                        Palivo
                    </div>
                </div>
                {this.renderAction(this.state.defs.coefficients.army.actions.maintenance)}
                {this.renderAction(this.state.defs.coefficients.army.actions.conscripting)}
                {this.renderAction(this.state.defs.coefficients.army.actions.fight)}
                {this.renderAction(this.state.defs.coefficients.army.actions.movement)}
                {this.renderAction(this.state.defs.coefficients.army.actions.patrolling)}
                {this.renderSum()}
            </div>
        )
    }
}