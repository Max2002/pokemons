import React, {Component} from 'react';
import colors from "../colorType";
import Filters from "../filters/filters";
import Cards from "./cards/cards";

class Main extends Component {
    state = {
        pokemons: this.props.pokemons,
        limitPokemons: 10,
        isAdd: true,
        filterPokemon: [],
        isMixPokemon: false,
        isSorting: false
    }

    generateColor(name) {
        return colors[0][name].length === 1 ?
            `linear-gradient(${colors[0][name]} 50%, ${colors[0][name]} 50%)` :
            `linear-gradient(${colors[0][name][0]} 50%, ${colors[0][name][1]} 50%)`;
    }

    randomMixPokemon() {
        let pokemons = this.state.filterPokemon.length !== 0 ? this.state.filterPokemon : this.state.pokemons;
        this.state.filterPokemon.length !== 0 ?
            this.setState({
                filterPokemon: pokemons.sort(() => Math.random() - .5),
                isMixPokemon: true
            }) :
            this.setState({
                pokemons: pokemons.sort(() => Math.random() - .5),
                isMixPokemon: true
            });
    }

    selectSort(pokemonsSort) {
        this.state.filterPokemon.length !== 0 ?
            this.setState({
                filterPokemon: pokemonsSort,
                isSorting: true
            }) :
            this.setState({
                pokemons: pokemonsSort,
                isSorting: true
            });
    }

    filters(filterPokemons) {
        this.setState({
            filterPokemon: filterPokemons.length !== 0 ? filterPokemons : [undefined],
            limitPokemons: 10,
            isAdd: true
        });
    }

    refreshFilters() {
        let buttons = [...document.querySelectorAll(".filters-types_flex")];
        let nodeParams = [...document.querySelectorAll(".flex-param")];
        let inputsRange = [...document.querySelectorAll(".filters-types-range_inp")];
        buttons.map(btn => [...btn.children].map(child => child.classList.remove("activeBtn")));
        nodeParams.map(param => [...param.children].map(child => child.classList.remove("activeValue")));
        inputsRange.map(inp => inp.value = "");
        this.setState({
            pokemons: this.state.pokemons.sort((a, b) => a.id - b.id),
            filterPokemon: [],
            limitPokemons: 10,
            isAdd: true
        });
    }

    addPokemons() {
        let limit, flag = true;
        if (this.state.filterPokemon.length === 0) {
            if (this.state.limitPokemons + 20 >= this.state.pokemons.length) {
                limit = this.state.pokemons.length;
                flag = false;
            } else
                limit = this.state.limitPokemons + 20;
        }
        else {
            if (this.state.limitPokemons + 20 >= this.state.filterPokemon.length) {
                limit = this.state.filterPokemon.length;
                flag = false;
            } else
                limit = this.state.limitPokemons + 20;
        }
        this.setState({
            limitPokemons: limit,
            isAdd: flag
        });
    }

    render() {
        const pokemons = this.state.filterPokemon.length !== 0 ? this.state.filterPokemon : this.state.pokemons;
        return (
            <div className="b-cards">
                <Filters mix = {() => this.randomMixPokemon()}
                         sort = {this.selectSort.bind(this)}
                         color = {this.generateColor.bind(this)}
                         pokemons = {this.state.pokemons}
                         filterPokemon = {this.state.filterPokemon}
                         weaknesses = {this.props.weaknesses}
                         filter = {this.filters.bind(this)}
                         refreshFilter = {() => this.refreshFilters()} />
                <div className="cards">
                    {<Cards pokemons = {pokemons}
                            limitPokemons = {this.state.limitPokemons}
                            isAdd = {this.state.isAdd}
                            color = {this.generateColor.bind(this)}
                            isMixPokemon = {this.state.isMixPokemon}
                            isSorting = {this.state.isSorting}
                            clickPokemon = {this.props.clickPokemon.bind(this)} />
                    }
                </div>
                <div className="b-cards_addCards">
                    {
                        this.state.isAdd && pokemons.length !== 0 ?
                            <button className="b-cards-addCards_btn" onClick={() => this.addPokemons()}>Add pokemons</button> : ''
                    }
                </div>
            </div>
        );
    }
}

export default Main;