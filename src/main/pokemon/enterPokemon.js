import React, {useState, useEffect} from 'react';
import {animateScroll as scroll } from "react-scroll";
import Stats from "./stats";
import Information from "./information";
import Evolve from "./evolve";
import colors from "../../colorType";

function EnterPokemon(props) {
    const [id, setId] = useState(props.idDidClickPokemon);
    useEffect(() => {
        setId(props.idDidClickPokemon);
    }, [props.idDidClickPokemon]);

    const generateColor = (name) => {
        return colors[0][name].length === 1 ? `linear-gradient(${colors[0][name]} 50%, ${colors[0][name]} 50%)` :
            `linear-gradient(${colors[0][name][0]} 50%, ${colors[0][name][1]} 50%)`;
    }

    const clickPrevPokemon = (id) => {
        if (id < props.pokemons[0].id)
            id = props.pokemons[props.pokemons.length - 1].id;
        setId(id);
    }

    const clickNextPokemon = (id) => {
        if (id > props.pokemons[props.pokemons.length - 1].id)
            id = props.pokemons[0].id;
        setId(id);
    }

    const clickEvolve = (id) => {
        scroll.scrollToTop();
        setId(id);
    }

    let pokemon;
    props.pokemons.map(one => {
        if (one.id === id)
            pokemon = one;
    });

    const pokemons = props.pokemons.sort((a, b) => a.id - b.id);
    let names = {};
    pokemons.map(pokemon => {
        if (pokemon.id === id - 1)
            names['prev'] = pokemon.name;
        else if (pokemon.id === id + 1)
            names['next'] = pokemon.name;
    });
    const prevPokemon = id - 1 < pokemons[0].id ?
        `№${pokemons[pokemons.length - 1].id} ${pokemons[pokemons.length - 1].name}` : `№${id - 1} ${names.prev}`;
    const nextPokemon = id + 1 > pokemons[pokemons.length - 1].id ?
        `№${pokemons[0].id} ${pokemons[0].name}` : `№${id + 1} ${names.next}`;

    return (
        <div className="pokemon">
            <div className="pokemon_header">
                <button className="pokemon-header_prev"
                        onClick={() => clickPrevPokemon(id - 1)}>
                    <p className="capitalize">{prevPokemon}</p>
                </button>
                <p className="pokemon-header_name capitalize">{pokemon.name} №{pokemon.id}</p>
                <button className="pokemon-header_next capitalize"
                        onClick={() => clickNextPokemon(id + 1)}>
                    <p className="capitalize">{nextPokemon}</p>
                </button>
            </div>
            <div className="pokemon_flex">
                <Stats pokemon = {pokemon} />
                <Information pokemon = {pokemon}
                             color = {generateColor} />
            </div>
            <Evolve pokemon = {pokemon}
                    pokemons = {props.pokemons}
                    clickEvolve = {clickEvolve}
                    color = {generateColor} />
            <button className="pokemon_back" onClick={props.back}>More pokemons</button>
        </div>
    );
}

export default EnterPokemon;