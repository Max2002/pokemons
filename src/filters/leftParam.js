import React, {useEffect, useState} from "react";
import clsx from "clsx";

function LeftParam(props) {
    const [toggle, setToggle] = useState({
        types: false,
        weakness: false
    });
    useEffect(() => {
        if (props.refresh)
            setToggle({
                types: false,
                weakness: false
            });
    }, [props.refresh]);

    useEffect(() => {
        if (toggle.types)
            props.setTAndW(props.title, "types");
        else if (toggle.weakness)
            props.setTAndW(props.title, "weaknesses");
        else
            props.setTAndW(props.title, "clear");
    }, [toggle]);

    return (
        <div className="filters-types_flex">
            <p key={props.title} className="filters-types_type capitalize"
               style={{background: props.color(props.title)}}>{props.title}</p>
            <button className={clsx("filters-types-flex_btn", {activeBtn: toggle.types})}
                    onClick={() => setToggle({
                        types: !toggle.types,
                        weakness: false
                    })}>T</button>
            <button className={clsx("filters-types-flex_btn", {activeBtn: toggle.weakness})}
                    onClick={() => setToggle({
                        types: false,
                        weakness: !toggle.weakness
                    })}>W</button>
        </div>
    );
}

export default LeftParam;