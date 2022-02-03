import React, {Component} from 'react';
import {animateScroll as scroll } from "react-scroll";
import Header from "./header";
import colors from "./colorType";

class Pokemons extends Component {
    state = {
        error: null,
        isLoaded: false,
        clickPokemon: false,
        idDidClickPokemon: null,
        limitPokemons: 10,
        isAdd: true,
        items: [],
        pokemons: [],
        filterPokemon: [],
        isMixPokemon: false,
        isSorting: false,
        gender: {},
        categories: {},
        descriptions: {},
        descriptionAbilities: [],
        weaknesses: {},
        evolve: []
    }

    componentDidMount() {
        fetch(`https://pokeapi.co/api/v2/pokemon?limit=800`)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        items: result.results
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
        if (this.state.clickPokemon) {
            scroll.scrollToTop();
            this.setState({
                idDidClickPokemon: id
            });
        }
        else
            this.setState({
                clickPokemon: true,
                idDidClickPokemon: id
            })
    }

    backToMain() {
        this.setState({
            clickPokemon: false,
            idDidClickPokemon: null,
            filterPokemon: []
        });
    }

    clickPrevPokemon(id) {
        const descriptions = [...document.querySelectorAll(".pokemon-information-dAbility_one")];
        descriptions.map(item => item.classList.remove("activeDescriptionAbilities"));
        if (id < this.state.pokemons[0].id)
            id = this.state.pokemons[this.state.pokemons.length - 1].id;
        this.setState({
            idDidClickPokemon: id
        });
    }

    clickNextPokemon(id) {
        const descriptions = [...document.querySelectorAll(".pokemon-information-dAbility_one")];
        descriptions.map(item => item.classList.remove("activeDescriptionAbilities"));
        if (id > this.state.pokemons[this.state.pokemons.length - 1].id)
            id = this.state.pokemons[0].id;
        this.setState({
            idDidClickPokemon: id
        });
    }

    generateOnePokemon(name) {
        fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
            .then(res => res.json())
            .then(
                result => {
                    let pushResult = this.state.pokemons;
                    result.types.map(async type => await this.findOutWeaknesses(type.type.url, name, result.types));
                    result.abilities.map(item => this.findOutDescriptionAbilities(item.ability.url));
                    pushResult.push({
                        id: result.id,
                        name: result.name,
                        types: result.types,
                        weaknesses: this.state.weaknesses[name],
                        image: result.sprites.other['official-artwork'].front_default,
                        description: this.state.descriptions[name],
                        parameters: {
                            height: result.height / 10 + " m",
                            weight: result.weight / 10 + " kg",
                            gender: this.state.gender[name],
                            category: this.state.categories[name],
                            abilities: result.abilities
                        },
                        stats: {
                            hp: result.stats[0].base_stat,
                            attack: result.stats[1].base_stat,
                            defense: result.stats[2].base_stat,
                            special_Attack: result.stats[3].base_stat,
                            special_Defense: result.stats[4].base_stat,
                            speed: result.stats[5].base_stat
                        },
                        modifications: []
                    });
                    this.setState({
                        pokemons: pushResult
                    });
                }
            )
    }

    async findOutGender(name) {
        let female, male = false;
        await fetch(`https://pokeapi.co/api/v2/gender/1/`)
            .then(res => res.json())
            .then(
                (result) => {
                    result.pokemon_species_details.map(item => {
                        if (item.pokemon_species.name === name)
                            female = true;
                    })
                }
            )

        await fetch(`https://pokeapi.co/api/v2/gender/2/`)
            .then(res => res.json())
            .then(
                (result) => {
                    result.pokemon_species_details.map(item => {
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
        await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}/`)
            .then(res => res.json())
            .then(
                (result) => {
                    category[name] = result.genera[7].genus.replace(' Pokémon', '');
                    result.flavor_text_entries.map(item => {
                        if (item.language.name === 'en')
                            description[name] = item.flavor_text.replace('\f', ' ');
                    });
                    urlForEvolve = result.evolution_chain.url;
                }
            )
        await fetch(urlForEvolve)
            .then(evolve => evolve.json())
            .then(evolve => {
                let evolveString = `${evolve.chain.species.name}_`;
                if (evolveList.length === 0)
                    evolveList.push(evolve.chain.species.name + '_' +
                        evolve.chain.evolves_to[0].species.name + '_' +
                        evolve.chain.evolves_to[0].evolves_to[0].species.name);
                else if (!evolveList[evolveList.length - 1].includes(name)) {
                    if (evolve.chain.evolves_to.length > 1)
                        evolve.chain.evolves_to.map((ev, index) => {
                            index !== evolve.chain.evolves_to.length - 1 ? evolveString += ev.species.name + '_' :
                                evolveString += ev.species.name;
                        });
                    else if (evolve.chain.evolves_to[0] !== undefined) {
                        evolveString += evolve.chain.evolves_to[0].species.name;
                        if (evolve.chain.evolves_to[0].evolves_to[0] !== undefined) {
                            evolveString += '_' + evolve.chain.evolves_to[0].evolves_to[0].species.name;
                            if (evolve.chain.evolves_to[0].evolves_to[1] !== undefined)
                                evolveString += '_' + evolve.chain.evolves_to[0].evolves_to[1].species.name;
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
        await fetch(url)
            .then(description => description.json())
            .then(descriptionRes => {
                if (descriptionRes.effect_entries[0].language.name === "en")
                    description[descriptionRes.name] = descriptionRes.effect_entries[0].short_effect;
                else
                    description[descriptionRes.name] = descriptionRes.effect_entries[1].short_effect;
            });
        if (this.state.descriptionAbilities.length !== 0) {
            this.setState({
                descriptionAbilities: description
            });
        }
    }

    async findOutWeaknesses(url, name, types) {
        let weaknesses = this.state.weaknesses;
        let weaknessesList = [];
        let typeList = types.map(type => type.type.name);
        await fetch(url)
            .then(weaknesses => weaknesses.json())
            .then(weaknesses =>
                    weaknesses.damage_relations.double_damage_from.map(weakness => {
                        if (!typeList.includes(weakness.name))
                            weaknessesList.push(weakness.name)
                    })
                )
        if (typeof weaknesses[name] === "undefined") {
            weaknesses[name] = weaknessesList;
        }
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

    generateColor(name) {
        return colors[0][name].length === 1 ?
            `linear-gradient(${colors[0][name]} 50%, ${colors[0][name]} 50%)` :
            `linear-gradient(${colors[0][name][0]} 50%, ${colors[0][name][1]} 50%)`;
    }

    animation(hp, attack, defense, specAtt, specDef, speed) {
        let stats = [...document.querySelectorAll(".stats-span")];
        let arr = [hp, attack, defense, specAtt, specDef, speed];
        stats.map((item, index) => {
            item.animate([
                    { height: '0%' },
                    { height: `100%` },
                    { height: `${arr[index] / 1.2}%` }],
                { duration: 2000 })})
        stats.map((item, index) => item.style.height = `${arr[index] / 1.2}%`);
    }

    clickDescriptionAbilities(index) {
        const descriptions = [...document.querySelectorAll(".pokemon-information-dAbility_one")];
        descriptions[index].classList.toggle("activeDescriptionAbilities");

    }

    enterPokemon() {
        let pokemon;
        let descriptionAbilities;
        this.state.pokemons.map(one => {
            if (one.id === this.state.idDidClickPokemon)
                pokemon = one;
        });

        setTimeout(this.animation, 1,
            pokemon.stats.hp, pokemon.stats.attack, pokemon.stats.defense,
            pokemon.stats.special_Attack, pokemon.stats.special_Defense, pokemon.stats.speed);

        let names = {};
        this.state.pokemons.map(pokemon => {
            if (pokemon.id === this.state.idDidClickPokemon - 1)
                names['prev'] = pokemon.name;
            else if (pokemon.id === this.state.idDidClickPokemon + 1)
                names['next'] = pokemon.name;
        });
        const prevPokemon = this.state.idDidClickPokemon - 1 < this.state.pokemons[0].id ?
            `№${this.state.pokemons[this.state.pokemons.length - 1].id} ${this.state.pokemons[this.state.pokemons.length - 1].name}` :
            `№${this.state.idDidClickPokemon - 1} ${names.prev}`;
        const nextPokemon = this.state.idDidClickPokemon + 1 > this.state.pokemons[this.state.pokemons.length - 1].id ?
            `№${this.state.pokemons[0].id} ${this.state.pokemons[0].name}` :
            `№${this.state.idDidClickPokemon + 1} ${names.next}`;
        let evolve = "";
        this.state.evolve.map(ev => ev.includes(pokemon.name) ? evolve = ev : "");
        let evolveThisPokemon = [];
        this.state.pokemons.sort((a, b) => a.id - b.id).map(pokemon => {
            evolve.split('_').map(ev => {
                if (ev === pokemon.name)
                    evolveThisPokemon.push(pokemon);
            });
        });
        return (
            <div className="pokemon">
                <div className="pokemon_header">
                    <button className="pokemon-header_prev"
                            onClick={() => this.clickPrevPokemon(this.state.idDidClickPokemon - 1)}>
                        <p className="capitalize">{prevPokemon}</p>
                    </button>
                    <p className="pokemon-header_name capitalize">{pokemon.name} №{pokemon.id}</p>
                    <button className="pokemon-header_next capitalize"
                            onClick={() => this.clickNextPokemon(this.state.idDidClickPokemon + 1)}>
                        <p className="capitalize">{nextPokemon}</p>
                        </button>
                </div>
                <div className="pokemon_flex">
                    <div className="pokemon_stat" style={{display: "block"}}>
                        <img className="pokemon-stat_img" src={pokemon.image} alt="" />
                        <div className="pokemon-stat_stats">
                            { Object.keys(pokemon.stats).map(stat => {
                                const title = stat === 'hp' ? stat.toUpperCase() : stat;
                                return (
                                    <div key={stat} className="b-pokemon-stat">
                                        <div className="pokemon-stat-stats_value">
                                            <span className="stats-span">
                                                <p>{pokemon.stats[stat]}</p>
                                            </span>
                                        </div>
                                        <p className="pokemon-stat-stats_title capitalize">
                                            {
                                                title.includes('_') ? title.replace('_', ' ') : title
                                            }
                                        </p>
                                    </div>
                                )
                            })
                            }
                        </div>
                    </div>
                    <div className="pokemon_information">
                        <p className="pokemon-information_description">{pokemon.description}</p>
                        <div className="pokemon-information_parameters">
                            { Object.keys(pokemon.parameters).map(param => {
                                const classForValue = param === 'abilities' ? "param_value description capitalize" : "param_value";
                                const value = param !== 'abilities' ? pokemon.parameters[param] :
                                    pokemon.parameters[param].map(ability => ability.ability.name);
                                descriptionAbilities = pokemon.parameters.abilities.map(ability =>
                                    <p className="pokemon-information-dAbility_one">
                                        {this.state.descriptionAbilities[ability.ability.name]}
                                    </p>
                                );
                                return (
                                    <div key={param} className="pokemon-information-parameters_param">
                                        <span className="param_tittle capitalize">{param}</span>
                                        {
                                            param !== "abilities" ? <span className={classForValue}>{value}</span> :
                                                <div className="value-flex">
                                                    {value.map((val, index) =>
                                                        index !== value.length - 1 ?
                                                            <span className={classForValue}
                                                                  onClick={() => this.clickDescriptionAbilities(index)}>
                                                                {val},</span> :
                                                            <span className={classForValue}
                                                                  onClick={() => this.clickDescriptionAbilities(index)}>
                                                                {val}</span>
                                                    )}
                                                </div>
                                        }
                                    </div>
                                );
                            })
                            }
                            <div className="pokemon-information_dAbility">{descriptionAbilities}</div>
                        </div>
                        <div className="pokemon-information_main">
                            <div className="pokemon-information-main_types">
                                <p className="pokemon-information-main-types_title">Type</p>
                                <div className="containerTypesWeaknesses">
                                    {
                                        pokemon.types.map(type =>
                                            <p key={type.type.name} className="pokemon-information-main-types_type capitalize"
                                               style={{background: this.generateColor(type.type.name)}}>
                                                {type.type.name}
                                            </p>
                                        )
                                    }
                                </div>
                            </div>
                            <div className="pokemon-information-main_weaknesses">
                                <p className="pokemon-information-main-weaknesses_title">Weaknesses</p>
                                <div className="containerTypesWeaknesses">
                                    {
                                        this.state.weaknesses[pokemon.name].map(weakness =>
                                            <p key={weakness} className="pokemon-information-main-weaknesses_weakness capitalize"
                                               style={{background: this.generateColor(weakness)}}>
                                                {weakness}
                                            </p>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="pokemon_evolve">
                    <p className="pokemon-evolve_title">
                        {
                            evolveThisPokemon.length !== 1 ? "Evolution pokemon" : "Pokemon doesn't evolve"
                        }
                    </p>
                    <div className="pokemon-evolve_flex">
                        {
                            evolveThisPokemon.map(evPokemon => {
                                return (
                                    <div key={evPokemon.id} className="pokemon-evolve_one"
                                         onClick={() => this.clickPokemon(evPokemon.id)}>
                                        <div className="pokemon-evolve-one_bImg">
                                            <img className="pokemon-evolve-one_img" src={evPokemon.image} alt="" />
                                        </div>
                                        <p className="pokemon-evolve-one_name capitalize">{evPokemon.name} №{evPokemon.id}</p>
                                        <div className="pokemon-evolve-one_flex">
                                            {
                                                evPokemon.types.map(type =>
                                                    <p key={type.type.name} className="pokemon-evolve-one_type capitalize"
                                                       style={{background: this.generateColor(type.type.name)}}>
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
                <button className="pokemon_back" onClick={() => this.backToMain()}>More pokemons</button>
            </div>
        );
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

    clickSortLabel() {
        document.querySelector(".b-cards_sortList").classList.toggle("activeList");
        document.querySelector(".b-cards-sort_arrow").classList.toggle("arrowTop");
    }

    selectSort(valueForSort) {
        let pokemonsSort = this.state.filterPokemon.length !== 0 ? this.state.filterPokemon : this.state.pokemons;
        let paramForSorting = document.querySelector(".b-cards-sort_label");
        let textContents = document.querySelectorAll(".b-cards-sortList_items");
        if (valueForSort === 'numberAsc') {
            pokemonsSort.sort((a, b) => a.id - b.id);
            paramForSorting.textContent = textContents[1].textContent;
        }
        else if (valueForSort === 'numberDesc') {
            pokemonsSort.sort((a, b) => b.id - a.id);
            paramForSorting.textContent = textContents[2].textContent;
        }
        else if (valueForSort === 'nameAsc') {
            pokemonsSort.sort((x, y) => x.name.localeCompare(y.name));
            paramForSorting.textContent = textContents[3].textContent;
        }
        else if (valueForSort === "nameDesc") {
            pokemonsSort.sort((x, y) => y.name.localeCompare(x.name));
            paramForSorting.textContent = textContents[4].textContent;
        }
        else
            paramForSorting.textContent = textContents[0].textContent;
        document.querySelector(".b-cards_sortList").classList.remove("activeList");
        document.querySelector(".b-cards-sort_arrow").classList.remove("arrowTop");
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

    contains(array, otherArray) {
        return array.every(item => otherArray.indexOf(item) !== -1);
    }

    filters() {
        let pokemons = this.state.pokemons;
        let filterPokemons = [];
        let typesAndWeaknesses = [...document.querySelectorAll(".filters-types_flex")];
        let range = document.querySelectorAll(".filters-types-range_inp");
        let nodeParam = document.querySelectorAll(".flex-param");
        let paramHeight = "", paramWeight = "";
        let types = [], weaknesses = [];
        let heightPokemon = pokemons.map(pokemon => +pokemon.parameters.height.split('m')[0]);
        let weightPokemon = pokemons.map(pokemon => +pokemon.parameters.weight.split('kg')[0]);
        let valuesHeight = [Math.max(...heightPokemon),
            heightPokemon.reduce((sum, elem) => sum + elem) / heightPokemon.length, Math.min(...heightPokemon)];
        let valuesWeight = [Math.max(...weightPokemon),
            weightPokemon.reduce((sum, elem) => sum + elem) / weightPokemon.length, Math.min(...weightPokemon)];
        [...nodeParam[0].children].map(child => {
            if (child.classList.contains("activeValue"))
                paramHeight = child.textContent;
        });
        [...nodeParam[1].children].map(child => {
            if (child.classList.contains("activeValue"))
                paramWeight = child.textContent;
        });
        typesAndWeaknesses.map(item => {
            [...item.children].map(el => {
                if (el.classList.contains("activeBtn")) {
                    if (el.textContent === 'T')
                        types.push(item.children[0].textContent);
                    else
                        weaknesses.push(item.children[0].textContent);
                }
            });
        });

        let objectParam = {
            range: range[0].value !== "" && range[1].value !== "",
            height: paramHeight !== "",
            weight: paramWeight !== "",
            types: types.length !== 0,
            weaknesses: weaknesses.length !== 0
        };

        let countTrueKey = 0;
        Object.keys(objectParam).map(key => {
            if (objectParam[key])
                countTrueKey++;
        });
        pokemons.map(pokemon => {
            let flag = 0;
            if (objectParam.range && pokemon.id >= +range[0].value && pokemon.id <= +range[1].value)
                flag++;
            if (objectParam.height) {
                let height = +pokemon.parameters.height.split('m')[0];
                if (paramHeight === "Short" && height < (valuesHeight[1] + valuesHeight[2]) / 2)
                    flag++;
                else if (paramHeight === "High" && height >= (valuesHeight[1] + valuesHeight[0]) / 2)
                    flag++;
                else if (paramHeight === "Medium height" && height >= (valuesHeight[1] + valuesHeight[2]) / 2 && height < (valuesHeight[1] + valuesHeight[0]) / 2)
                    flag++;
            }
            if (objectParam.weight) {
                let weight = +pokemon.parameters.weight.split('kg')[0];
                if (paramWeight === "Thin" && weight < (valuesWeight[1] + valuesWeight[2]) / 2)
                    flag++;
                else if (paramWeight === "Heavy" && weight >= (valuesWeight[1] + valuesWeight[0]) / 2)
                    flag++;
                else if (paramWeight === "Average weight" && weight >= (valuesWeight[1] + valuesWeight[2]) / 2 && weight < (valuesWeight[1] + valuesWeight[0]) / 2)
                    flag++;
            }
            if (objectParam.types) {
                let typesPokemon = pokemon.types.map(type => type.type.name);
                if (this.contains(types, typesPokemon))
                    flag++;
            }
            if (objectParam.weaknesses) {
                let weaknessesPokemon = this.state.weaknesses[pokemon.name].map(weakness => weakness);
                if (this.contains(weaknesses, weaknessesPokemon))
                    flag++;
            }
            if (flag === countTrueKey)
                filterPokemons.push(pokemon);
        });

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

    activeFilterButton(index, active) {
        let buttons = document.querySelectorAll(".filters-types_flex");
        [...buttons[index].children].map(btn => {
            if (active === 't' && btn !== buttons[index].children[1])
                btn.classList.remove("activeBtn");
            else if (active === 'w' && btn !== buttons[index].children[2])
                btn.classList.remove("activeBtn");
        });
        if (active === 't')
            buttons[index].children[1].classList.toggle("activeBtn");
        else
            buttons[index].children[2].classList.toggle("activeBtn");
    }

    activeFilterParam(index, active) {
        let nodeParams = document.querySelectorAll(".flex-param");
        [...nodeParams[index].children].map(param => {
            if (param !== nodeParams[index].children[active])
                param.classList.remove("activeValue");
        });
        nodeParams[index].children[active].classList.toggle("activeValue");
    }

    toggleFilters() {
        const nodeFilters = document.querySelector(".filters");
        document.querySelector(".filters-open_btn").classList.toggle("activeBtnFilters");
        document.querySelector(".filters-open_img").classList.toggle("activeImgFilters");
        if (nodeFilters.classList.contains("activeFilters")) {
            nodeFilters.classList.remove("activeFilters");
            setTimeout(() => nodeFilters.style.display = "none", 1000);
        } else {
            nodeFilters.classList.add("activeFilters");
            nodeFilters.style.display = "flex";
        }
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

    generateMain() {
        let pokemonsAll = this.state.filterPokemon.length !== 0 ? this.state.filterPokemon : this.state.pokemons;
        let pokemons = [];
        if (!this.state.isMixPokemon && !this.state.isSorting)
            pokemonsAll.sort((a, b) => a.id - b.id);
        if (pokemonsAll.length > this.state.limitPokemons)
            pokemonsAll.map((pokemon, index) => {
                if (this.state.isAdd) {
                    if (index < this.state.limitPokemons)
                        pokemons.push(pokemon);
                } else {
                    if (index < this.state.limitPokemons + 1)
                        pokemons.push(pokemon);
                }
            });
        else
            pokemons = pokemonsAll;
        let cards;
        if (pokemons.length === 0)
            cards = <div className="b-loading">
                        <p className="b-loading_title">Loading...</p>
                        <img className="b-loading_img" src="./images/loading.gif" alt="" />
                    </div>;
        else if (pokemons[0] === undefined)
            cards = <div className="b-undefined">
                        <h1 className="b-undefined_title">Unfortunately, no pokemon found for your search!</h1>
                        <h2 className="b-undefined_subtitle">Here are some suggestion for search:</h2>
                        <ul className="b-undefined_list">
                            <li className="b-undefined-list_item">Try different heights and weights</li>
                            <li className="b-undefined-list_item">Try selecting a larger search range</li>
                            <li className="b-undefined-list_item">Try specifying fewer filters</li>
                        </ul>
                    </div>;
        else
            cards = pokemons.map(pokemon => {
                return (
                    <div key={pokemon.id} className="card" onClick={() => this.clickPokemon(pokemon.id)}>
                        <img className="card_img" src={pokemon.image} alt="" />
                        <p className="card_id">№{pokemon.id}</p>
                        <p className="card_name">{pokemon.name}</p>
                        <div className="card_types">
                            {
                                pokemon.types.map(type =>
                                    <p key={type.type.name} className="card-types_type"
                                       style={{background: this.generateColor(type.type.name)}}>
                                       {type.type.name}
                                    </p>
                                )
                            }
                        </div>
                    </div>
                );
            });

        return (
            <div className="b-cards">
                <div className="b-cards_func">
                    <button className="b-cards_mix" onClick={() => this.randomMixPokemon()}>Surprise me</button>
                    <div className="b-cards-func_sort">
                        <div className="b-cards_sort" onClick={() => this.clickSortLabel()}>
                            <p className="b-cards-sort_label">Sort</p>
                            <img src="./images/arrow.png" className="b-cards-sort_arrow" alt="" />
                        </div>
                        <ul className="b-cards_sortList">
                            <li className="b-cards-sortList_items"
                                onClick={() => this.selectSort("noSort")}>Sort</li>
                            <li className="b-cards-sortList_items"
                                onClick={() => this.selectSort("numberAsc")}>Ascending numbers</li>
                            <li className="b-cards-sortList_items"
                                onClick={() => this.selectSort("numberDesc")}>Descending numbers</li>
                            <li className="b-cards-sortList_items"
                                onClick={() => this.selectSort("nameAsc")}>A - Z</li>
                            <li className="b-cards-sortList_items"
                                onClick={() => this.selectSort("nameDesc")}>Z - A</li>
                        </ul>
                    </div>
                </div>
                <div className="wrapper">
                    <div className="filters">
                        <div className="filters_types">
                            <p className="filters-types_title">Type and weaknesses</p>
                            <div className="b-filters-types">
                                {
                                    Object.keys(colors[0]).map((key, index) =>
                                        <div className="filters-types_flex">
                                            <p key={key} className="filters-types_type capitalize"
                                               style={{background: this.generateColor(key)}}>{key}</p>
                                            <button className="filters-types-flex_btn"
                                                    onClick={() => this.activeFilterButton(index, 't')}>T</button>
                                            <button className="filters-types-flex_btn"
                                                    onClick={() => this.activeFilterButton(index, 'w')}>W</button>
                                        </div>
                                    )
                                }
                            </div>
                            <div className="filters-types_range">
                                <p className="filters-types-range_title">Numbering range</p>
                                <div>
                                    <input type="text" className="filters-types-range_inp" placeholder="1" />
                                    <span className="filters-types-range_span">-</span>
                                    <input type="text" className="filters-types-range_inp" placeholder="800" />
                                </div>
                            </div>
                        </div>
                        <div className="filters_param">
                            <div className="filters-param_height">
                                <p className="filters-param-height_title">Height</p>
                                <div className="flex-param">
                                    <p className="filters-param-height_value"
                                       onClick={() => this.activeFilterParam(0, 0)}>Short</p>
                                    <p className="filters-param-height_value"
                                       onClick={() => this.activeFilterParam(0, 1)}>Medium height</p>
                                    <p className="filters-param-height_value"
                                       onClick={() => this.activeFilterParam(0, 2)}>High</p>
                                </div>
                            </div>
                            <div className="filters-param_weight">
                                <p className="filters-param-weight_title">Weight</p>
                                <div className="flex-param">
                                    <p className="filters-param-weight_value"
                                       onClick={() => this.activeFilterParam(1, 0)}>Thin</p>
                                    <p className="filters-param-weight_value"
                                       onClick={() => this.activeFilterParam(1, 1)}>Average weight</p>
                                    <p className="filters-param-weight_value"
                                       onClick={() => this.activeFilterParam(1, 2)}>Heavy</p>
                                </div>
                            </div>
                            <div className="filters-param_btns">
                                <button className="filters-param-btns_refresh" onClick={() => this.refreshFilters()}>Refresh</button>
                                <button className="filters-param-btns_search" onClick={() => this.filters()}>Search</button>
                            </div>
                        </div>
                    </div>
                    <div className="filters_open" onClick={() => this.toggleFilters()}>
                        <button className="filters-open_btn">Filters</button>
                        <img className="filters-open_img" src="./images/arrow.png" />
                    </div>
                </div>
                <div className="cards">{cards}</div>
                <div className="b-cards_addCards">
                    {
                        this.state.isAdd && pokemons.length !== 0 ?
                        <button className="b-cards-addCards_btn" onClick={() => this.addPokemons()}>Add pokemons</button> : ''
                    }
                </div>
            </div>
        );
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
                <Header onClick={() => this.searchPokemon()} />
                <div className="main">
                    <div className="container">
                        {!this.state.clickPokemon ? this.generateMain() : this.enterPokemon()}
                    </div>
                </div>
            </div>
        );
    }
}

export default Pokemons;