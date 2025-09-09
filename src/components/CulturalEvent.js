import React from "react";
import { t } from "../localization";

export default class CulturalEvent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            defs: props.defs,
            currentState: props.currentState,
            selectCulturalRegion: props.selectCulturalRegion,
            culturalEventSource: "",
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
            <div>
                <div className="mt-3">
                    <h3>{t("Kulturní událost")}</h3>
                    <div className="row justify-content-md-center">
                        <div className="col-md-5 font-weight-bold">
                            {t("Region")}
                        </div>
                    </div>
                    <div className="row justify-content-md-center">
                        <div className="col-md-5">
                            <select className="browser-default custom-select"
                                    value={this.state.culturalEventSource}
                                    onChange={(e) => {
                                        this.setState({culturalEventSource: e.target.value});
                                        this.state.selectCulturalRegion(e.target.value);
                                    }}>
                            <option value="">{t("Nevybráno")}</option>
                                {regionNames.map((region, i) => {
                                    return (<option value={region} key={i}>{t(region)}</option>)
                                })}
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
