import React from 'react';
import MixAndSort from "./mixAndSort";
import FilterPokemon from "./filterPokemon";

function Filters(props) {
    return (
        <div className="b-filters">
            <MixAndSort mix = {props.mix}
                        pokemons = {props.pokemons}
                        filterPokemon = {props.filterPokemon}
                        sort = {props.sort} />
            <FilterPokemon color = {props.color}
                           pokemons = {props.pokemons}
                           filter = {props.filter}
                           refreshFilter = {props.refreshFilter}
                           refresh = {props.refresh} />
        </div>
    );
}

export default Filters;