import React from "react";
import { t } from "../localization";

export default class OccupationList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            defs: props.defs,
            currentState: props.currentState
        }
    }

    componentWillReceiveProps(props) {
        this.setState({currentState: props.currentState})
    }

    render() {
        return (
            <div className="mt-3">
                <h3>{t("Obsazené regiony")}</h3>
                <div className="row justify-content-md-center">
                    <div className="col-md-3 font-weight-bold">
                        {t("Nepřítel")}
                    </div>
                    <div className="col-md-3 font-weight-bold">
                        {t("Region")}
                    </div>
                    <div className="col-md-2 font-weight-bold">
                        {t("Počet vojáků")}
                    </div>
                </div>
                {this.state.currentState.occupations.map((invasion, i) =>{
                    return (
                        <div className="row mt-1 justify-content-md-center" key={i}>
                            <div className="col-md-3">
                                {t(invasion.enemy)}
                            </div>
                            <div className="col-md-3">
                                {t(invasion.region)}
                            </div>
                            <div className="col-md-2">
                                {invasion.soldiers}
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }
}
