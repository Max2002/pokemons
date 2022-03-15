import React from 'react';
import MixAndSort from "./mixAndSort";
import FilterPokemon from "./filterPokemon";

function Filters(props) {
    return (
        <div className="b-filters">
            <MixAndSort mix = {() => props.mix()}
                        pokemons = {props.pokemons}
                        filterPokemon = {props.filterPokemon}
                        sort = {props.sort.bind(this)} />
            <FilterPokemon color = {props.color.bind(this)}
                           pokemons = {props.pokemons}
                           filter = {props.filter.bind(this)}
                           refreshFilter = {() => props.refreshFilter()} />
        </div>
    );
}

export default Filters;