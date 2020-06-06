import React from "react";
import Button from "react-bootstrap/Button";
import { invasionTypeToWord } from "../services/AuditLogUtils"

export default class InvasionList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            defs: props.defs,
            currentState: props.currentState,
            invasionEnemy: props.defs.coefficients.enemy.names[0].countryName,
            invasionRegion: props.currentState.regions.filter(region => region.enabled)[0].name,
            invasionType: 'plunder',
            invasionSoldiers: 0
        }
    }

    componentWillReceiveProps(props) {
        this.setState({currentState: props.currentState})
    }

    render() {
        const regionNames = [];
        this.state.currentState.regions.map((regionState, i) => {
            if (regionState.enabled) {
                regionNames.push(regionState.name);
            }
            return 0
        });
        return (
            <div className="mt-3">
                <h3>Pohyby cizích vojsk</h3>
                <div className="row justify-content-md-center">
                    <div className="col-md-3 font-weight-bold">
                        Nepřítel
                    </div>
                    <div className="col-md-3 font-weight-bold">
                        Region
                    </div>
                    <div className="col-md-3 font-weight-bold">
                        Úkon
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
                                value={this.state.invasionEnemy}
                                onChange={(e) => this.setState({invasionEnemy: e.target.value})}>
                            {this.state.defs.coefficients.enemy.names.map((army, i) => {
                                return (<option value={army.countryName} key={i}>{army.countryName}</option>)
                            })}
                        </select>
                    </div>
                    <div className="col-md-3">
                        <select className="browser-default custom-select"
                                value={this.state.invasionRegion}
                                onChange={(e) => this.setState({invasionRegion: e.target.value})}>
                            {regionNames.map((region, i) => {
                                return (<option value={region} key={i}>{region}</option>)
                            })}
                        </select>
                    </div>
                    <div className="col-md-3">
                        <select className="browser-default custom-select"
                                value={this.state.invasionType}
                                onChange={(e) => this.setState({invasionType: e.target.value})}>
                            {this.state.defs.coefficients.enemy.invasion.types.map((type, i) => {
                                return (<option value={type} key={i}>{invasionTypeToWord(type)}</option>)
                            })}
                        </select>
                    </div>
                    <div className="col-md-2">
                        <input type="text"
                               size="4"
                               value={this.state.invasionSoldiers}
                               onChange={(e) => this.setState({invasionSoldiers: parseInt(e.target.value)})} />
                    </div>
                    <div className="col-md-1">
                        <Button variant="primary"
                                onClick={() => this.props.addInvasion(this.state.invasionEnemy, this.state.invasionRegion, this.state.invasionType, this.state.invasionSoldiers)}>
                            Naplánovat
                        </Button>
                    </div>
                </div>

                {this.state.currentState.invasions.map((invasion, i) =>{
                    return (
                        <div className="row mt-1 justify-content-md-center" key={i}>
                            <div className="col-md-3">
                                {invasion.enemy}
                            </div>
                            <div className="col-md-3">
                                {invasion.region}
                            </div>
                            <div className="col-md-3">
                                {invasionTypeToWord(invasion.type)}
                            </div>
                            <div className="col-md-2">
                                {invasion.soldiers}
                            </div>
                            <div className="col-md-1">
                                <Button variant="primary" onClick={() => this.props.cancelInvasion(i)}>
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