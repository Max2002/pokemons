import React, {useEffect, useState} from 'react';
import colors from "../colorType";
import Filters from "../filters/filters";
import Cards from "./cards/cards";

function Main(props) {
    const [pokemonsProp, setPokemonsProp] = useState([]);
    useEffect(() => setPokemonsProp(props.pokemons), [props.pokemons]);
    const [limitPokemons, setLimitPokemons] = useState(10);
    const [isAdd, setIsAdd] = useState(true);
    const [filterPokemon, setFilterPokemon] = useState([]);
    const [isSorting, setIsSorting] = useState(false);
    const [refresh, setRefresh] = useState(false);
    useEffect(() => {
        if (refresh)
            setRefresh(false)
    }, [refresh]);

    const generateColor = (name) => {
        return colors[0][name].length === 1 ? `linear-gradient(${colors[0][name]} 50%, ${colors[0][name]} 50%)` :
            `linear-gradient(${colors[0][name][0]} 50%, ${colors[0][name][1]} 50%)`;
    }

    const randomMixPokemon = () => {
        filterPokemon.length !== 0 ? setFilterPokemon(filterPokemon.slice().sort(() => Math.random() - .5)) :
            setPokemonsProp(pokemonsProp.slice().sort(() => Math.random() - .5));
        setIsSorting(true);
    }

    const selectSort = (pokemonsSort) => {
        filterPokemon.length !== 0 ? setFilterPokemon(pokemonsSort) : setPokemonsProp(pokemonsSort);
        setIsSorting(true);
    }

    const filters = (filterPokemons) => {
        setFilterPokemon(filterPokemons.length !== 0 ? filterPokemons : [undefined]);
        setLimitPokemons(10);
        setIsAdd(true);
        setRefresh(false);
    }

    const refreshFilters = () => {
        setPokemonsProp(pokemonsProp.sort((a, b) => a.id - b.id));
        setFilterPokemon([]);
        setLimitPokemons(10);
        setIsAdd(true);
        setRefresh(true);
    }

    const addPokemons = () => {
        let limit, flag = true;
        if (filterPokemon.length === 0) {
            if (limitPokemons + 20 >= pokemonsProp.length) {
                limit = pokemonsProp.length;
                flag = false;
            } else
                limit = limitPokemons + 20;
        }
        else {
            if (limitPokemons + 20 >= filterPokemon.length) {
                limit = filterPokemon.length;
                flag = false;
            } else
                limit = limitPokemons + 20;
        }
        setLimitPokemons(limit);
        setIsAdd(flag);
    }
    const pokemons = filterPokemon.length !== 0 ? filterPokemon : pokemonsProp;

    return (
        <div className="b-cards">
            <Filters mix = {randomMixPokemon}
                     sort = {selectSort}
                     color = {generateColor}
                     pokemons = {pokemonsProp}
                     filterPokemon = {filterPokemon}
                     filter = {filters}
                     refreshFilter = {refreshFilters} refresh = {refresh}/>
            <div className="cards">
                <Cards pokemons = {pokemons}
                       limitPokemons = {limitPokemons}
                       isAdd = {isAdd}
                       color = {generateColor}
                       isSorting = {isSorting}
                       clickPokemon = {props.clickPokemon} />
            </div>
            <div className="b-cards_addCards">
                {
                    isAdd && pokemons.length !== 0 ?
                        <button className="b-cards-addCards_btn" onClick={() => addPokemons()}>Add pokemons</button> : ''
                }
            </div>
        </div>
    );
}

export default Main;