import React from 'react';
import StatsAnimation from "./statsAnimation";

function Stats(props) {
    return (
        <div className="pokemon_stat" style={{display: "block"}}>
            <img className="pokemon-stat_img" src={props.pokemon.image} alt="" />
            <div className="pokemon-stat_stats">
                { Object.keys(props.pokemon.stats).map(stat => {
                    return (
                        <div key={stat} className="b-pokemon-stat">
                            <StatsAnimation value = {props.pokemon.stats[stat]} />
                            <p className="pokemon-stat-stats_title capitalize">
                                {
                                    stat.includes('_') ? stat.replace('_', ' ') : stat
                                }
                            </p>
                        </div>
                    )
                })
                }
            </div>
        </div>
    );
}

export default Stats;