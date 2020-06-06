import React from "react";

export default class OccupationList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            defs: props.defs,
            currentState: props.currentState
        }
    }

    render() {
        return (
            <div className="mt-3">
                <h3>Obsazené regiony</h3>
                <div className="row justify-content-md-center">
                    <div className="col-md-3 font-weight-bold">
                        Nepřítel
                    </div>
                    <div className="col-md-3 font-weight-bold">
                        Region
                    </div>
                    <div className="col-md-2 font-weight-bold">
                        Počet vojáků
                    </div>
                </div>
                {this.state.currentState.occupations.map((invasion, i) =>{
                    return (
                        <div className="row mt-1 justify-content-md-center" key={i}>
                            <div className="col-md-3">
                                {invasion.enemy}
                            </div>
                            <div className="col-md-3">
                                {invasion.region}
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