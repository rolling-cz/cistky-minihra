import React from "react";
import { t } from "../localization";

export default class GameStateTab extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            gameState: props.gameState,
            updateHandler: props.updateHandler
        }
    }

    componentWillReceiveProps(props) {
        this.setState({gameState: props.gameState})
    }

    handleChange(event) {
        try {
            const newGameState = JSON.parse(event.target.value);
            this.state.updateHandler(newGameState)
            this.setState({gameState: newGameState})
        } catch (e) {
            alert(e)
        }
    }

    render() {
        return (
            <div className="mt-4">
                <h3>{t("Stav minihry")}</h3>
                <textarea value={JSON.stringify(this.state.gameState, undefined, 4)} cols="120" rows="25" onChange={this.handleChange.bind(this)} />
            </div>
        )
    }
}
