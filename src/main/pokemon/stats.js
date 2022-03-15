import React from 'react';

function Stats(props) {
    const animation = (hp, attack, defense, specAtt, specDef, speed) => {
        let stats = [...document.querySelectorAll(".stats-span")];
        let arr = [hp, attack, defense, specAtt, specDef, speed];
        stats.map((item, index) => {
            item.animate([
                    { height: '0%' },
                    { height: `100%` },
                    { height: `${arr[index] / 1.2}%` }],
                    { duration: 2000 })})
        stats.map((item, index) => item.style.height = `${arr[index] / 1.2}%`);
    }

    setTimeout(animation, 1,
        props.pokemon.stats.hp, props.pokemon.stats.attack, props.pokemon.stats.defense,
        props.pokemon.stats.special_Attack, props.pokemon.stats.special_Defense, props.pokemon.stats.speed);

    return (
        <div className="pokemon_stat" style={{display: "block"}}>
            <img className="pokemon-stat_img" src={props.pokemon.image} alt="" />
            <div className="pokemon-stat_stats">
                { Object.keys(props.pokemon.stats).map(stat => {
                    const title = stat === 'hp' ? stat.toUpperCase() : stat;
                    return (
                        <div key={stat} className="b-pokemon-stat">
                            <div className="pokemon-stat-stats_value">
                                            <span className="stats-span">
                                                <p>{props.pokemon.stats[stat]}</p>
                                            </span>
                            </div>
                            <p className="pokemon-stat-stats_title capitalize">
                                {
                                    title.includes('_') ? title.replace('_', ' ') : title
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