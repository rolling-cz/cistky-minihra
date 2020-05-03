import React from "react";
import Button from "react-bootstrap/Button";

export default class Army extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            definition: props.definition,
            currentState: props.currentState,
            previousState: props.previousState,
            order: props.order
        }
    }

    componentWillReceiveProps(props) {
        this.setState({currentState: props.currentState, previousState: props.previousState, order: props.order})
    }

    handleChange(event) {
        let value = parseInt(event.target.value);
        if (isNaN(value)) {
            value = 0;
        }

        if (value < 0) {
            value = 0;
        }

        const id = event.target.id;
        this.props.updateHandler(this.state.definition.name, id, value);
    }

    render() {
        const rowClass = this.state.order%2 === 1 ? '' : 'odd-row';
        return (
            <div className={`row mt-2 justify-content-md-center ${rowClass}`}>
                <div className="col-md-2 font-weight-bold">
                    {this.state.definition.name} <br />
                    <Button variant="dark" onClick={() => this.props.toggleArmy(this.state.definition.name)} className="mr-1">
                        Deaktivovat
                    </Button>
                </div>
                <div className="col-md-1 text-left">
                    {this.state.currentState.soldiers}
                </div>
                <div className="col-md-1 text-left">
                    <input id="food" type="text" size="2" value={this.state.currentState.food} onChange={this.handleChange.bind(this)} />
                </div>
                <div className="col-md-1 text-left">
                    <input id="recruiting" type="text" size="2" value={this.state.currentState.recruiting} onChange={this.handleChange.bind(this)} />
                </div>
                <div className="col-md-1 text-left">
                    mise
                </div>
            </div>
        )
    }
}