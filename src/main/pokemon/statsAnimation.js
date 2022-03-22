import React, {useRef} from "react";

function StatsAnimation(props) {
    const stat = useRef(null);
    const animation = (statValue) => {
        stat.current.animate([
                { height: '0%' },
                { height: `100%` },
                { height: `${statValue / 1.2}%` }],
            { duration: 2000 })
        stat.current.style.height = `${statValue / 1.2}%`;
    }

    setTimeout(animation, 1, props.value);

    return (
        <div className="pokemon-stat-stats_value">
            <span className="stats-span" ref={stat}>
                <p>{props.value}</p>
            </span>
        </div>
    );
}

export default StatsAnimation;