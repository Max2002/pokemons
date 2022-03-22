import React, {useEffect, useState} from "react";
import clsx from "clsx";

function RightParam(props) {
    const [toggleHeight, setToggleHeight] = useState({
        short: false,
        medium: false,
        high: false
    });

    const [toggleWeight, setToggleWeight] = useState({
        thin: false,
        medium: false,
        heavy: false
    });

    useEffect(() => {
        setToggleHeight({
            short: false,
            medium: false,
            high: false
        });
        setToggleWeight({
            thin: false,
            medium: false,
            heavy: false
        });
    }, [props.refresh]);

    useEffect(() => {
        let countHeight = 0;
        Object.keys(toggleHeight).map(key => {
            if (toggleHeight[key])
                props.setHAndW(key, "height");
            else
                countHeight++;
        });
        if (countHeight === Object.keys(toggleHeight).length)
            props.setHAndW("", "clearHeight");

    }, [toggleHeight]);

    useEffect(() => {
        let countWeight = 0;
        Object.keys(toggleWeight).map(key => {
            if (toggleWeight[key])
                props.setHAndW(key, "weight");
            else
                countWeight++;
        });
        if (countWeight === Object.keys(toggleWeight).length)
            props.setHAndW("", "clearWeight");
    }, [toggleWeight]);

    return (
        <>
            <div className="filters-param_height">
                <p className="filters-param-height_title">Height</p>
                <div className="flex-param">
                    <p className={clsx("filters-param-height_value", {activeValue: toggleHeight.short})}
                       onClick={() => setToggleHeight({
                           short: !toggleHeight.short
                       })}>Short</p>
                    <p className={clsx("filters-param-height_value", {activeValue: toggleHeight.medium})}
                       onClick={() => setToggleHeight({
                           medium: !toggleHeight.medium
                       })}>Medium height</p>
                    <p className={clsx("filters-param-height_value", {activeValue: toggleHeight.high})}
                       onClick={() => setToggleHeight({
                           high: !toggleHeight.high
                       })}>High</p>
                </div>
            </div>
            <div className="filters-param_weight">
                <p className="filters-param-weight_title">Weight</p>
                <div className="flex-param">
                    <p className={clsx("filters-param-weight_value", {activeValue: toggleWeight.thin})}
                       onClick={() => setToggleWeight({
                           thin: !toggleWeight.thin
                       })}>Thin</p>
                    <p className={clsx("filters-param-weight_value", {activeValue: toggleWeight.medium})}
                       onClick={() => setToggleWeight({
                           medium: !toggleWeight.medium
                       })}>Average weight</p>
                    <p className={clsx("filters-param-weight_value", {activeValue: toggleWeight.heavy})}
                       onClick={() => setToggleWeight({
                           heavy: !toggleWeight.heavy
                       })}>Heavy</p>
                </div>
            </div>
        </>
    );
}

export default RightParam;