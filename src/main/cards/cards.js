import React from 'react';
import Loading from "./loading";
import IncorrectFilters from "./incorrectFilters";

function Cards(props) {
    let pokemonsAll = props.pokemons;
    let pokemons = [];
    if (!props.isMixPokemon && !props.isSorting)
        pokemonsAll.sort((a, b) => a.id - b.id);
    if (pokemonsAll.length > props.limitPokemons)
        pokemonsAll.map((pokemon, index) => {
            if (props.isAdd) {
                if (index < props.limitPokemons)
                    pokemons.push(pokemon);
            } else {
                if (index < props.limitPokemons + 1)
                    pokemons.push(pokemon);
            }
        });
    else
        pokemons = pokemonsAll;
    let cards;
    if (pokemons.length === 0)
        cards = <Loading />;
    else if (pokemons[0] === undefined)
        cards = <IncorrectFilters />;
    else
        cards = pokemons.map(pokemon => {
            return (
                <div key={pokemon.id} className="card" onClick={() => props.clickPokemon(pokemon.id)}>
                    <img className="card_img" src={pokemon.image} alt="" />
                    <p className="card_id">№{pokemon.id}</p>
                    <p className="card_name">{pokemon.name}</p>
                    <div className="card_types">
                        {
                            pokemon.types.map(type =>
                                <p key={type.type.name} className="card-types_type"
                                   style={{background: props.color(type.type.name)}}> {type.type.name}
                                </p>
                            )
                        }
                    </div>
                </div>
            );
        });

    return cards;
}

export default Cards;