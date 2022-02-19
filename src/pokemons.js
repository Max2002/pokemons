import React, {Component} from 'react';
import axios from "axios";
import Header from "./header";
import Main from "./main/main";
import EnterPokemon from "./main/pokemon/enterPokemon";

class Pokemons extends Component {
    state = {
        error: null,
        isLoaded: false,
        clickPokemon: false,
        idDidClickPokemon: null,
        items: [],
        pokemons: [],
        gender: {},
        categories: {},
        descriptions: {},
        descriptionAbilities: [],
        weaknesses: {},
        evolve: []
    }

    componentDidMount() {
        axios.get(`https://pokeapi.co/api/v2/pokemon?limit=50`)
            .then(result => {
                    this.setState({
                        isLoaded: true,
                        items: result.data.results
                    });
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }

    componentDidUpdate() {
        if (this.state.isLoaded) {
            this.state.items.map(async item => {
                const id = item.url.split('/')[item.url.split('/').length - 2];
                await this.findOutGender(item.name);
                await this.findOutCategoryAndDescriptionAndEvolve(item.name, id);
                this.generateOnePokemon(item.name);
            });
            this.setState({
                isLoaded: false
            });
        }
    }

    clickPokemon(id) {
        this.setState({
            clickPokemon: true,
            idDidClickPokemon: id
        });
    }

    backToMain() {
        this.setState({
            clickPokemon: false,
            idDidClickPokemon: null
        });
    }

    generateOnePokemon(name) {
        axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`)
            .then(result => {
                    let pushResult = this.state.pokemons;
                    result.data.types.map(async type => await this.findOutWeaknesses(type.type.url, name, result.data.types));
                    result.data.abilities.map(item => this.findOutDescriptionAbilities(item.ability.url));
                    pushResult.push({
                        id: result.data.id,
                        name: result.data.name,
                        types: result.data.types,
                        weaknesses: this.state.weaknesses[name],
                        image: result.data.sprites.other['official-artwork'].front_default,
                        description: this.state.descriptions[name],
                        parameters: {
                            height: result.data.height / 10 + " m",
                            weight: result.data.weight / 10 + " kg",
                            gender: this.state.gender[name],
                            category: this.state.categories[name],
                            abilities: result.data.abilities
                        },
                        stats: {
                            hp: result.data.stats[0].base_stat,
                            attack: result.data.stats[1].base_stat,
                            defense: result.data.stats[2].base_stat,
                            special_Attack: result.data.stats[3].base_stat,
                            special_Defense: result.data.stats[4].base_stat,
                            speed: result.data.stats[5].base_stat
                        }
                    });
                    this.setState({
                        pokemons: pushResult
                    });
                }
            )
    }

    async findOutGender(name) {
        let female, male = false;
        await axios.get(`https://pokeapi.co/api/v2/gender/1/`)
            .then(result => {
                    result.data.pokemon_species_details.map(item => {
                        if (item.pokemon_species.name === name)
                            female = true;
                    })
                }
            )

        await axios.get(`https://pokeapi.co/api/v2/gender/2/`)
            .then(result => {
                    result.data.pokemon_species_details.map(item => {
                        if (item.pokemon_species.name === name)
                            male = true;
                    })
                }
            )
        let genders = this.state.gender;
        if (female && male)
            genders[name] = "♀ ♂";
        else if (female && !male)
            genders[name] = "♀";
        else if (!female && male)
            genders[name] = "♂";
        else
            genders[name] = "unknown";
        this.setState({
            gender: genders
        });
    }

    async findOutCategoryAndDescriptionAndEvolve(name, id) {
        let category = this.state.categories;
        let description = this.state.descriptions;
        let urlForEvolve;
        let evolveList = this.state.evolve;
        await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${id}/`)
            .then(result => {
                    category[name] = result.data.genera[7].genus.replace(' Pokémon', '');
                    result.data.flavor_text_entries.map(item => {
                        if (item.language.name === 'en')
                            description[name] = item.flavor_text.replace('\f', ' ');
                    });
                    urlForEvolve = result.data.evolution_chain.url;
                }
            )
        await axios.get(urlForEvolve)
            .then(evolve => {
                let evolveString = `${evolve.data.chain.species.name}_`;
                if (evolveList.length === 0)
                    evolveList.push(evolve.data.chain.species.name + '_' +
                        evolve.data.chain.evolves_to[0].species.name + '_' +
                        evolve.data.chain.evolves_to[0].evolves_to[0].species.name);
                else if (!evolveList[evolveList.length - 1].includes(name)) {
                    if (evolve.data.chain.evolves_to.length > 1)
                        evolve.data.chain.evolves_to.map((ev, index) => {
                            index !== evolve.data.chain.evolves_to.length - 1 ? evolveString += ev.species.name + '_' :
                                evolveString += ev.species.name;
                        });
                    else if (evolve.data.chain.evolves_to[0] !== undefined) {
                        evolveString += evolve.data.chain.evolves_to[0].species.name;
                        if (evolve.data.chain.evolves_to[0].evolves_to[0] !== undefined) {
                            evolveString += '_' + evolve.data.chain.evolves_to[0].evolves_to[0].species.name;
                            if (evolve.data.chain.evolves_to[0].evolves_to[1] !== undefined)
                                evolveString += '_' + evolve.data.chain.evolves_to[0].evolves_to[1].species.name;
                        }
                    }
                    evolveList.push(evolveString);
                }
            });
        this.setState({
            categories: category,
            descriptions: description,
            evolve: evolveList.filter((item, pos) => evolveList.indexOf(item) === pos)
        });
    }

    async findOutDescriptionAbilities(url) {
        let description = this.state.descriptionAbilities;
        await axios.get(url)
            .then(descriptionRes => {
                if (descriptionRes.data.effect_entries[0].language.name === "en")
                    description[descriptionRes.data.name] = descriptionRes.data.effect_entries[0].short_effect;
                else
                    description[descriptionRes.data.name] = descriptionRes.data.effect_entries[1].short_effect;
            });
        if (this.state.descriptionAbilities.length !== 0)
            this.setState({
                descriptionAbilities: description
            });
    }

    async findOutWeaknesses(url, name, types) {
        let weaknesses = this.state.weaknesses;
        let weaknessesList = [];
        let typeList = types.map(type => type.type.name);
        await axios.get(url)
            .then(weaknesses =>
                    weaknesses.data.damage_relations.double_damage_from.map(weakness => {
                        if (!typeList.includes(weakness.name))
                            weaknessesList.push(weakness.name)
                    })
                )
        if (typeof weaknesses[name] === "undefined")
            weaknesses[name] = weaknessesList;
        else {
            let weaknessesName = weaknesses[name];
            weaknessesList.map(weakness => {
                if (!weaknessesName.includes(weakness))
                    weaknessesName.push(weakness)
            });
            weaknesses[name] = weaknessesName;
        }
        this.setState({
           weaknesses:  weaknesses
        });
    }

    searchPokemon() {
        let inpSearch = document.querySelector(".header-search_inp");
        let pokemon;
        this.state.pokemons.map(one => {
            if (!isNaN(+inpSearch.value) && one.id === +inpSearch.value)
                pokemon = one;
            else if (one.name === inpSearch.value.toLowerCase())
                pokemon = one;
        });
        if (pokemon === undefined) {
            inpSearch.value = "";
            inpSearch.placeholder = 'Not correct!';
        }
        else {
            inpSearch.value = "";
            inpSearch.placeholder = 'ID or Name';
        }
        this.setState({
            clickPokemon: true,
            idDidClickPokemon: pokemon.id
        });
    }

    render() {
        return (
            <div>
                <Header onClick = {() => this.searchPokemon()} />
                <div className="main">
                    <div className="container">
                        {!this.state.clickPokemon ? <Main pokemons = {this.state.pokemons}
                                                          clickPokemon = {this.clickPokemon.bind(this)}
                                                          weaknesses = {this.state.weaknesses} /> :
                            <EnterPokemon pokemons = {this.state.pokemons}
                                          idDidClickPokemon = {this.state.idDidClickPokemon}
                                          descriptionAbilities = {this.state.descriptionAbilities}
                                          weaknesses = {this.state.weaknesses}
                                          evolve = {this.state.evolve}
                                          back = {() => this.backToMain()} />
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default Pokemons;