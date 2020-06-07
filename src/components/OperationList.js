import React from "react";
import Button from "react-bootstrap/Button";

export default class OperationList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            defs: props.defs,
            currentState: props.currentState,
            operationArmy: props.currentState.armies.filter(army => army.enabled)[0].name,
            operationName: props.defs.operations[0].name,
            operationSoldiers: 0
        }
    }

    componentWillReceiveProps(props) {
        this.setState({currentState: props.currentState})
    }

    render() {
        const armyNames = [];
        this.state.currentState.armies.map((armyState, i) => {
            if (armyState.enabled) {
                armyNames.push(armyState.name);
            }
            return 0
        });
        return (
            <div className="mt-3">
                <h3>Plánované operace</h3>
                <div className="row justify-content-md-center">
                    <div className="col-md-3 font-weight-bold">
                        Armáda
                    </div>
                    <div className="col-md-3 font-weight-bold">
                        Operace
                    </div>
                    <div className="col-md-2 font-weight-bold">
                        Počet vojáků
                    </div>
                    <div className="col-md-1 font-weight-bold">
                        Akce
                    </div>
                </div>

                <div className="row justify-content-md-center">
                    <div className="col-md-3">
                        <select className="browser-default custom-select"
                                value={this.state.operationArmy}
                                onChange={(e) => this.setState({operationArmy: e.target.value})}>
                            {armyNames.map((army, i) => {
                                return (<option value={army} key={i}>{army}</option>)
                            })}
                        </select>
                    </div>
                    <div className="col-md-3">
                        <select className="browser-default custom-select"
                                value={this.state.operationName}
                                onChange={(e) => this.setState({operationName: e.target.value})}>
                            {this.state.defs.operations.map((op, i) => {
                                return (<option value={op.name} key={i}>{op.name}</option>)
                            })}
                        </select>
                    </div>
                    <div className="col-md-2">
                        <input type="text"
                               size="4"
                               value={this.state.operationSoldiers}
                               onChange={(e) => this.setState({operationSoldiers: parseInt(e.target.value)})} />
                    </div>
                    <div className="col-md-1">
                        <Button variant="primary"
                                onClick={() => this.props.addOperation(this.state.operationArmy, this.state.operationName, this.state.operationSoldiers)}>
                            Naplánovat
                        </Button>
                    </div>
                </div>

                {this.state.currentState.operations.map((op, i) =>{
                    return (
                        <div className="row mt-1 justify-content-md-center" key={i}>
                            <div className="col-md-3">
                                {op.army}
                            </div>
                            <div className="col-md-3">
                                {op.operation}
                            </div>
                            <div className="col-md-2">
                                {op.soldiers}
                            </div>
                            <div className="col-md-1">
                                <Button variant="primary" onClick={() => this.props.cancelOperation(i)}>
                                    Zrušit
                                </Button>
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }
}