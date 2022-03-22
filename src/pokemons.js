import React, {useState, useEffect} from 'react';
import Header from "./header";
import Main from "./main/main";
import EnterPokemon from "./main/pokemon/enterPokemon";
import api from "./api/general";

function Pokemons() {
    const [state, setState] = useState({
        clickPokemon: false,
        idDidClickPokemon: null
    });
    const [pokemons, setPokemons] = useState([]);

    useEffect(async () => {
        setPokemons(await api(400));
    }, []);

    const clickPokemon = (id) => {
        setState({
            clickPokemon: true,
            idDidClickPokemon: id
        });
    }

    const backToMain = () => {
        setState({
            clickPokemon: false,
            idDidClickPokemon: null
        });
    }

    const searchPokemon = (id) => {
        setState({
            clickPokemon: true,
            idDidClickPokemon: id
        });
    }

    return (
        <>
            <Header searchPokemon = {searchPokemon}
                    pokemons = {pokemons} />
            <div className="main">
                <div className="container">
                    {!state.clickPokemon ? <Main pokemons = {pokemons}
                                                 clickPokemon = {clickPokemon} /> :
                        <EnterPokemon pokemons = {pokemons}
                                      idDidClickPokemon = {state.idDidClickPokemon}
                                      back = {backToMain} />
                    }
                </div>
            </div>
        </>
    );
}

export default Pokemons;