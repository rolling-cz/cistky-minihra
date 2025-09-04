import React from "react";
import Region from "./Region";
import Button from "react-bootstrap/Button";
import { t } from "../localization";

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
                                    return (<option value={region} key={i}>{t(region)}</option>)
                                } else {
                                    return ""
                                }
                            })}
                        </select>
                    </div>
                    <div className="col-md-2">
                        <Button variant="success" onClick={() => this.state.toggleRegion(this.state.regionToEnabled || disabledRegions[0])}>
                            {t("Aktivovat region")}
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
                        {t("Název")}
                    </div>
                    <div className="col-md-2 font-weight-bold">
                        {t("Populace")}
                    </div>
                    <div className="col-md-2 font-weight-bold">
                        {t("Alokace pracovníků")}
                    </div>
                    <div className="col-md-2 font-weight-bold">
                        {t("Produkcní zařízení")}
                    </div>
                    <div className="col-md-2 font-weight-bold">
                        {t("Monumenty")}
                    </div>
                    <div className="col-md-2 font-weight-bold">
                        {t("Jednotky")}
                    </div>
                </div>
                {
                    this.state.currentState.regions.map((regionState, i) => {
                        if (regionState.enabled) {
                            return <Region
                                definition={this.state.definitions.regions.find(region => region.name === regionState.name)}
                                currentState={regionState}
                                commands={this.state.currentState.commands}
                                updateHandler={this.state.updateHandler}
                                toggleRegion={this.state.toggleRegion}
                                key={i}
                                order={order++}/>
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
