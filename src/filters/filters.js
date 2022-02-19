import React, {Component} from 'react';
import MixAndSort from "./mixAndSort";
import FilterPokemon from "./filterPokemon";

class Filters extends Component {

    render() {
        return (
            <div className="b-filters">
                <MixAndSort mix = {() => this.props.mix()}
                            pokemons = {this.props.pokemons}
                            filterPokemon = {this.props.filterPokemon}
                            sort = {this.props.sort.bind(this)} />
                <FilterPokemon color = {this.props.color.bind(this)}
                               pokemons = {this.props.pokemons}
                               weaknesses = {this.props.weaknesses}
                               filter = {this.props.filter.bind(this)}
                               refreshFilter = {() => this.props.refreshFilter()} />
            </div>
        );
    }
}

export default Filters;