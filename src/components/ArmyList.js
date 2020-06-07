import React from "react";
import Button from "react-bootstrap/Button";
import Army from "./Army"

export default class ArmyList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            definitions: props.definitions,
            currentState: props.currentState,
            armyToEnabled: null
        }
    }

    componentWillReceiveProps(props) {
        this.setState({currentState: props.currentState, regionToEnabled: null})
    }

    renderArmyActivation() {
        const disabledArmies = [];
        this.state.currentState.armies.forEach(army => {
            if (!army.enabled) {
                return disabledArmies.push(army.name)
            }
        });

        if (disabledArmies.length > 0) {
            return (
                <div className="row justify-content-md-center mt-3">
                    <div className="col-md-2">
                        <select className="browser-default custom-select"
                                value={this.state.armyToEnabled || disabledArmies[0]}
                                onChange={(e) => this.setState({armyToEnabled: e.target.value})}>
                            {disabledArmies.map((army, i) => {
                                if (!army.enabled) {
                                    return (<option value={army} key={i}>{army}</option>)
                                } else {
                                    return ""
                                }
                            })}
                        </select>
                    </div>
                    <div className="col-md-2">
                        <Button variant="success" onClick={() => this.props.toggleArmy(this.state.armyToEnabled || disabledArmies[0])}>
                            Aktivovat armádu
                        </Button>
                    </div>
                </div>
            )
        } else {
            return "";
        }
    }

    render() {
        let order = 0;
        return (
            <div className="mt-3">
                <div className="row justify-content-md-center">
                    <div className="col-md-2 font-weight-bold">
                        Název
                    </div>
                    <div className="col-md-1 font-weight-bold">
                        Velikost
                    </div>
                    <div className="col-md-1 font-weight-bold">
                        Jídlo
                    </div>
                    <div className="col-md-1 font-weight-bold">
                        Nábor
                    </div>
                </div>
                {
                    this.state.currentState.armies.map((armyState, i) => {
                        if (armyState.enabled) {
                            return <Army
                                definition={this.state.definitions.armies.find(army => army.name === armyState.name)}
                                currentState={armyState}
                                updateHandler={this.props.updateHandler}
                                toggleArmy={this.props.toggleArmy}
                                key={i}
                                order={order++}/>
                        } else {
                            return "";
                        }
                    })
                }
                {this.renderArmyActivation()}
            </div>
        )
    }
}