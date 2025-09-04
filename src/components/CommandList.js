import React from "react";
import Button from "react-bootstrap/Button";
import { commandTypeToWord } from "../services/AuditLogUtils"
import { t } from "../localization";

export default class CommandList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            defs: props.defs,
            currentState: props.currentState,
            commands: props.commands,
            commandedArmy: props.currentState.armies.filter(army => army.enabled)[0].name,
            commandedRegion: props.currentState.regions.filter(region => region.enabled)[0].name,
            commandType: 'patrol',
            commandedSoldiers: 0
        }
    }

    componentWillReceiveProps(props) {
        this.setState({commands: props.commands, currentState: props.currentState})
    }

    render() {
        const regionNames = [];
        this.state.currentState.regions.map((regionState, i) => {
            if (regionState.enabled) {
                regionNames.push(regionState.name);
            }
            return 0
        });
        this.state.currentState.occupations.forEach(occupation => regionNames.push(occupation.region));
        const armyNames = [];
        this.state.currentState.armies.map((armyState, i) => {
            if (armyState.enabled) {
                armyNames.push(armyState.name);
            }
            return 0
        });
        return (
            <div className="mt-3">
                <h3>{t("Rozkazy jednotkám")}</h3>
                <div className="row justify-content-md-center">
                    <div className="col-md-3 font-weight-bold">
                        {t("Armáda")}
                    </div>
                    <div className="col-md-3 font-weight-bold">
                        {t("Region")}
                    </div>
                    <div className="col-md-3 font-weight-bold">
                        {t("Úkon")}
                    </div>
                    <div className="col-md-2 font-weight-bold">
                        {t("Počet vojáků")}
                    </div>
                    <div className="col-md-1 font-weight-bold">
                        {t("Akce")}
                    </div>
                </div>

                <div className="row justify-content-md-center">
                    <div className="col-md-3">
                        <select className="browser-default custom-select"
                                value={this.state.commandedArmy}
                                onChange={(e) => this.setState({commandedArmy: e.target.value})}>
                            {armyNames.map((army, i) => {
                                return (<option value={army} key={i}>{t(army)}</option>)
                            })}
                        </select>
                    </div>
                    <div className="col-md-3">
                        <select className="browser-default custom-select"
                                value={this.state.commandedRegion}
                                onChange={(e) => this.setState({commandedRegion: e.target.value})}>
                            {regionNames.map((region, i) => {
                                return (<option value={region} key={i}>{t(region)}</option>)
                            })}
                        </select>
                    </div>
                    <div className="col-md-3">
                        <select className="browser-default custom-select"
                                value={this.state.commandType}
                                onChange={(e) => this.setState({commandType: e.target.value})}>
                            {this.state.defs.coefficients.army.commands.types.map((type, i) => {
                                return (<option value={type} key={i}>{t(commandTypeToWord(type))}</option>)
                            })}
                        </select>
                    </div>
                    <div className="col-md-2">
                        <input type="text"
                               size="4"
                               value={this.state.commandedSoldiers}
                               onChange={(e) => this.setState({commandedSoldiers: parseInt(e.target.value)})} />
                    </div>
                    <div className="col-md-1">
                        <Button variant="primary"
                                onClick={() => this.props.addCommand(this.state.commandedArmy, this.state.commandedRegion, this.state.commandType, this.state.commandedSoldiers)}>
                            {t("Naplánovat")}
                        </Button>
                    </div>
                </div>

                {this.state.commands.map((command, i) =>{
                    return (
                        <div className="row mt-1 justify-content-md-center" key={i}>
                            <div className="col-md-3">
                                {t(command.army)}
                            </div>
                            <div className="col-md-3">
                                {t(command.region)}
                            </div>
                            <div className="col-md-3">
                                {t(commandTypeToWord(command.type))}
                            </div>
                            <div className="col-md-2">
                                {command.soldiers}
                            </div>
                            <div className="col-md-1">
                                <Button variant="primary" onClick={() => this.props.cancelCommand(i)}>
                                    {t("Zrušit")}
                                </Button>
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }
}
