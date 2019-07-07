import React from "react";
import Region from "./Region";
import Button from "react-bootstrap/Button";

export default class RegionList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            definitions: props.definitions,
            currentState: props.currentState,
            updateHandler: props.updateHandler,
            toggleRegion: props.toggleRegion,
            regionToEnabled: null
        }
    }

    componentWillReceiveProps(props) {
        this.setState({currentState: props.currentState, regionToEnabled: null})
    }

    renderRegionActivation() {
        const disabledRegions = [];
        this.state.currentState.regions.forEach(region => {
            if (!region.enabled) {
                return disabledRegions.push(region.name)
            }
        });

        if (disabledRegions.length > 0) {
            return (
                <div className="row justify-content-md-center mt-3">
                    <div className="col-md-2">
                        <select className="browser-default custom-select"
                                value={this.state.regionToEnabled || disabledRegions[0]}
                                onChange={(e) => this.setState({regionToEnabled: e.target.value})}>
                            {disabledRegions.map((region, i) => {
                                if (!region.enabled) {
                                    return (<option value={region} key={i}>{region}</option>)
                                } else {
                                    return ""
                                }
                            })}
                        </select>
                    </div>
                    <div className="col-md-2">
                        <Button variant="success" onClick={() => this.state.toggleRegion(this.state.regionToEnabled || disabledRegions[0])}>
                            Aktivovat region
                        </Button>
                    </div>
                </div>
            )
        } else {
            return "";
        }
    }

    render() {
        return (
            <div className="mt-3">
                <div className="row justify-content-md-center">
                    <div className="col-md-2 font-weight-bold">
                        Název
                    </div>
                    <div className="col-md-3 font-weight-bold">
                        Populace
                    </div>
                    <div className="col-md-2 font-weight-bold">
                        Alokace pracovníků
                    </div>
                    <div className="col-md-2 font-weight-bold">
                        Produkcní zařízení
                    </div>
                    <div className="col-md-2 font-weight-bold">
                        Jednotky
                    </div>
                </div>
                {
                    this.state.currentState.regions.map((regionState, i) => {
                        if (regionState.enabled) {
                            return <Region
                                definition={this.state.definitions.regions.find(region => region.name === regionState.name)}
                                currentState={regionState}
                                updateHandler={this.state.updateHandler}
                                toggleRegion={this.state.toggleRegion}
                                key={i}/>
                        } else {
                            return "";
                        }
                    })
                }
                {this.renderRegionActivation()}
            </div>
        )
    }
}