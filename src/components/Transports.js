import React from "react";
import Button from "react-bootstrap/Button";
import { t } from "../localization";

export default class TransportList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            defs: props.defs,
            currentState: props.currentState,
            transports: props.transports,
            addTransport: props.addTransport,
            cancelTransport: props.cancelTransport,
            newTransportSource: props.defs.regions[0].name,
            newTransportTarget: props.defs.regions[0].name,
            newTransportNumber: 0
        }
    }

    componentWillReceiveProps(props) {
        this.setState({transports: props.transports, currentState: props.currentState})
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
                <h3>{t("Seznam transportů mezi regiony")}</h3>
                <div className="row justify-content-md-center">
                    <div className="col-md-3 font-weight-bold">
                        {t("Zdrojový region")}
                    </div>
                    <div className="col-md-3 font-weight-bold">
                        {t("Cílový region")}
                    </div>
                    <div className="col-md-3 font-weight-bold">
                        {t("Počet skupin k přesunutí")}
                    </div>
                    <div className="col-md-1 font-weight-bold">
                        {t("Akce")}
                    </div>
                </div>

                <div className="row justify-content-md-center">
                    <div className="col-md-3">
                        <select className="browser-default custom-select"
                                value={this.state.newTransportSource}
                                onChange={(e) => this.setState({newTransportSource: e.target.value})}>
                            <option value="Zahraničí" >{t("Zahraničí")}</option>
                            {regionNames.map((region, i) => {
                                return (<option value={region} key={i}>{t(region)}</option>)
                            })}
                        </select>
                    </div>
                    <div className="col-md-3">
                        <select className="browser-default custom-select"
                                value={this.state.newTransportTarget}
                                onChange={(e) => this.setState({newTransportTarget: e.target.value})}>
                            {regionNames.map((region, i) => {
                                return (<option value={region} key={i}>{t(region)}</option>)
                            })}
                        </select>
                    </div>
                    <div className="col-md-3">
                        <input type="text"
                               size="4"
                               value={this.state.newTransportNumber}
                               onChange={(e) => this.setState({newTransportNumber: parseInt(e.target.value)})} />
                    </div>
                    <div className="col-md-1">
                        <Button variant="primary"
                                onClick={() => this.state.addTransport(this.state.newTransportSource, this.state.newTransportTarget, this.state.newTransportNumber)}>
                            {t("Naplánovat")}
                        </Button>
                    </div>
                </div>

                {this.state.transports.map((transport, i) =>{
                    return (
                        <div className="row mt-1 justify-content-md-center" key={i}>
                            <div className="col-md-3">
                                {t(transport.sourceRegion)}
                            </div>
                            <div className="col-md-3">
                                {t(transport.targetRegion)}
                            </div>
                            <div className="col-md-3">
                                {t(transport.number)}
                            </div>
                            <div className="col-md-1">
                                <Button variant="primary" onClick={() => this.state.cancelTransport(i)}>
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
