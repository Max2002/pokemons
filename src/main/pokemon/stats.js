import React, {Component} from 'react';

class Stats extends Component {
    animation(hp, attack, defense, specAtt, specDef, speed) {
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

    render() {
        setTimeout(this.animation, 1,
            this.props.pokemon.stats.hp, this.props.pokemon.stats.attack, this.props.pokemon.stats.defense,
            this.props.pokemon.stats.special_Attack, this.props.pokemon.stats.special_Defense, this.props.pokemon.stats.speed);

        return (
            <div className="pokemon_stat" style={{display: "block"}}>
                <img className="pokemon-stat_img" src={this.props.pokemon.image} alt="" />
                <div className="pokemon-stat_stats">
                    { Object.keys(this.props.pokemon.stats).map(stat => {
                        const title = stat === 'hp' ? stat.toUpperCase() : stat;
                        return (
                            <div key={stat} className="b-pokemon-stat">
                                <div className="pokemon-stat-stats_value">
                                            <span className="stats-span">
                                                <p>{this.props.pokemon.stats[stat]}</p>
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
}

export default Stats;