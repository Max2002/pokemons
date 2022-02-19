import React, {Component} from 'react';
import {animateScroll as scroll } from "react-scroll";
import Stats from "./stats";
import Information from "./information";
import Evolve from "./evolve";
import colors from "../../colorType";

class EnterPokemon extends Component {
    state = {
        id: this.props.idDidClickPokemon
    }

    componentDidUpdate(prevProps) {
        if (prevProps.idDidClickPokemon !== this.props.idDidClickPokemon)
            this.setState({
                id: this.props.idDidClickPokemon
            });
    }

    generateColor(name) {
        return colors[0][name].length === 1 ?
            `linear-gradient(${colors[0][name]} 50%, ${colors[0][name]} 50%)` :
            `linear-gradient(${colors[0][name][0]} 50%, ${colors[0][name][1]} 50%)`;
    }

    clickPrevPokemon(id) {
        const descriptions = [...document.querySelectorAll(".pokemon-information-dAbility_one")];
        descriptions.map(item => item.classList.remove("activeDescriptionAbilities"));
        if (id < this.props.pokemons[0].id)
            id = this.props.pokemons[this.props.pokemons.length - 1].id;
        this.setState({
            id: id
        });
    }

    clickNextPokemon(id) {
        const descriptions = [...document.querySelectorAll(".pokemon-information-dAbility_one")];
        descriptions.map(item => item.classList.remove("activeDescriptionAbilities"));
        if (id > this.props.pokemons[this.props.pokemons.length - 1].id)
            id = this.props.pokemons[0].id;
        this.setState({
            id: id
        });
    }

    clickEvolve(id) {
        scroll.scrollToTop();
        this.setState({
            id: id
        });
    }

    render() {
        let pokemon;
        this.props.pokemons.map(one => {
            if (one.id === this.state.id)
                pokemon = one;
        });

        const pokemons = this.props.pokemons.sort((a, b) => a.id - b.id);
        let names = {};
        pokemons.map(pokemon => {
            if (pokemon.id === this.state.id - 1)
                names['prev'] = pokemon.name;
            else if (pokemon.id === this.state.id + 1)
                names['next'] = pokemon.name;
        });
        const prevPokemon = this.state.id - 1 < pokemons[0].id ?
            `№${pokemons[pokemons.length - 1].id} ${pokemons[pokemons.length - 1].name}` :
            `№${this.state.id - 1} ${names.prev}`;
        const nextPokemon = this.state.id + 1 > pokemons[pokemons.length - 1].id ?
            `№${pokemons[0].id} ${pokemons[0].name}` :
            `№${this.state.id + 1} ${names.next}`;

        return (
            <div className="pokemon">
                <div className="pokemon_header">
                    <button className="pokemon-header_prev"
                            onClick={() => this.clickPrevPokemon(this.state.id - 1)}>
                        <p className="capitalize">{prevPokemon}</p>
                    </button>
                    <p className="pokemon-header_name capitalize">{pokemon.name} №{pokemon.id}</p>
                    <button className="pokemon-header_next capitalize"
                            onClick={() => this.clickNextPokemon(this.state.id + 1)}>
                        <p className="capitalize">{nextPokemon}</p>
                    </button>
                </div>
                <div className="pokemon_flex">
                    <Stats pokemon = {pokemon} />
                    <Information pokemon = {pokemon}
                                 descriptionAbilities = {this.props.descriptionAbilities}
                                 color = {this.generateColor.bind(this)}
                                 weaknesses = {this.props.weaknesses} />
                </div>
                <Evolve pokemon = {pokemon}
                        pokemons = {this.props.pokemons}
                        evolve = {this.props.evolve}
                        clickEvolve = {this.clickEvolve.bind(this)}
                        color = {this.generateColor.bind(this)}/>
                <button className="pokemon_back" onClick={() => this.props.back()}>More pokemons</button>
            </div>
        );
    }
}

export default EnterPokemon;