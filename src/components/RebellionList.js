import React from "react";
import Button from "react-bootstrap/Button";
import { invasionTypeToWord } from "../services/AuditLogUtils"
import { t } from "../localization";

export default class RebellionList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            defs: props.defs,
            currentState: props.currentState,
            rebellionSource: props.currentState.regions.filter(region => region.enabled)[0].name,
            rebellionTarget: props.currentState.regions.filter(region => region.enabled)[0].name,
            rebelsCreated: 0,
            rebelsMoved: 0,
            rebelsRecruited: 0,
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
                <h3>{t("Povstání")}</h3>
                <div className="row justify-content-md-center">
                    <div className="col-md-2 font-weight-bold">
                        {t("Region")}
                    </div>
                    <div className="col-md-2 font-weight-bold">
                        {t("Zdroj")}
                    </div>
                    <div className="col-md-2 font-weight-bold">
                        {t("Nových povstalců")}
                    </div>
                    <div className="col-md-2 font-weight-bold">
                        {t("Přesunutých povstalců")}
                    </div>
                    <div className="col-md-2 font-weight-bold">
                        {t("Naverbovaných povstalců")}
                    </div>
                    <div className="col-md-2 font-weight-bold">
                        {t("Akce")}
                    </div>
                </div>

                <div className="row justify-content-md-center">
                    <div className="col-md-2">
                        <select className="browser-default custom-select"
                                value={this.state.rebellionTarget}
                                onChange={(e) => this.setState({rebellionTarget: e.target.value})}>
                            {regionNames.map((region, i) => {
                                return (<option value={region} key={i}>{t(region)}</option>)
                            })}
                        </select>
                    </div>
                    <div className="col-md-2">
                        <select className="browser-default custom-select"
                                value={this.state.rebellionSource}
                                onChange={(e) => this.setState({rebellionSource: e.target.value})}>
                            <option value="none" key="100">{t("žádný")}</option>
                            {regionNames.map((region, i) => {
                                return (<option value={region} key={i}>{t(region)}</option>)
                            })}
                        </select>
                    </div>
                    <div className="col-md-2">
                        <input type="text"
                               size="4"
                               value={this.state.rebelsCreated}
                               onChange={(e) => this.setState({rebelsCreated: parseInt(e.target.value)})} />
                    </div>
                    <div className="col-md-2">
                        <input type="text"
                               size="4"
                               value={this.state.rebelsMoved}
                               onChange={(e) => this.setState({rebelsMoved: parseInt(e.target.value)})} />
                    </div>
                    <div className="col-md-2">
                        <input type="text"
                               size="4"
                               value={this.state.rebelsRecruited}
                               onChange={(e) => this.setState({rebelsRecruited: parseInt(e.target.value)})} />
                    </div>
                    <div className="col-md-1">
                        <Button variant="primary"
                                onClick={() => this.props.addRebellion(this.state.rebellionSource, this.state.rebellionTarget, this.state.rebelsCreated, this.state.rebelsMoved, this.state.rebelsRecruited)}>
                            {t("Naplánovat")}
                        </Button>
                    </div>
                </div>

                {this.state.currentState.rebellions.map((rebellion, i) =>{
                    return (
                        <div className="row mt-1 justify-content-md-center" key={i}>
                            <div className="col-md-2">
                                {t(rebellion.rebellionTarget)}
                            </div>
                            <div className="col-md-2">
                                {t(rebellion.rebellionSource)}
                            </div>
                            <div className="col-md-2">
                                {rebellion.rebelsCreated}
                            </div>
                            <div className="col-md-2">
                                {rebellion.rebelsMoved}
                            </div>
                            <div className="col-md-2">
                                {rebellion.rebelsRecruited}
                            </div>
                            <div className="col-md-2">
                                <Button variant="primary" onClick={() => this.props.cancelRebellion(i)}>
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
