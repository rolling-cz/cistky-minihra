import React from "react";
import { t } from "../localization";

export default class ConfigTab extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            defs: props.defs,
            originalDefs: props.originalDefs,
            updateHandler: props.updateHandler
        }
    }

    handleChange(event) {
        try {
            const newDef = JSON.parse(event.target.value);
            this.state.updateHandler(newDef)
            this.setState({defs: newDef})
        } catch (e) {
            alert(e)
        }
    }

    resetConfig() {
        this.state.updateHandler(this.state.originalDefs)
        this.setState({defs: this.state.originalDefs})
    }

    saveConfig() {
        this.state.updateHandler(this.state.defs)
    }

    render() {
        return (
            <div className="mt-4">
                <h3>{t("Konfigurace minihry")}</h3>
                <textarea value={JSON.stringify(this.state.defs, undefined, 4)} cols="120" rows="25" onChange={this.handleChange.bind(this)} />
                <br />
                <button onClick={this.resetConfig.bind(this)}>{t("Resetovat na výchozí nastavení")}</button>
            </div>
        )
    }
}
