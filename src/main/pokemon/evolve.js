import React from 'react';

function Evolve(props) {
    let evolve = [];
    props.pokemon.evolve.split('_').map(ev => {
        props.pokemons.map(pokemon => {
            if (pokemon.name === ev)
                evolve.push(pokemon);
        });
    });

    return (
        <div className="pokemon_evolve">
            <p className="pokemon-evolve_title">
                {
                    evolve.length !== 1 ? "Evolution pokemon" : "Pokemon doesn't evolve"
                }
            </p>
            <div className="pokemon-evolve_flex">
                {
                    evolve.map(evPokemon => {
                        return (
                            <div key={evPokemon.id} className="pokemon-evolve_one"
                                 onClick={() => props.clickEvolve(evPokemon.id)}>
                                <div className="pokemon-evolve-one_bImg">
                                    <img className="pokemon-evolve-one_img" src={evPokemon.image} alt="" />
                                </div>
                                <p className="pokemon-evolve-one_name capitalize">{evPokemon.name} №{evPokemon.id}</p>
                                <div className="pokemon-evolve-one_flex">
                                    {
                                        evPokemon.types.map(type =>
                                            <p key={type.type.name} className="pokemon-evolve-one_type capitalize"
                                               style={{background: props.color(type.type.name)}}>
                                               {type.type.name}
                                            </p>
                                        )
                                    }
                                </div>
                            </div>
                        );
                    })
                }
            </div>
        </div>
    );
}

export default Evolve;