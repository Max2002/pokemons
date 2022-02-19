import React, {Component} from "react";
import colors from "../../src/colorType";

class FilterPokemon extends Component {
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

    contains(array, otherArray) {
        return array.every(item => otherArray.indexOf(item) !== -1);
    }

    filters() {
        let pokemons = this.props.pokemons;
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
                let weaknessesPokemon = this.props.weaknesses[pokemon.name].map(weakness => weakness);
                if (this.contains(weaknesses, weaknessesPokemon))
                    flag++;
            }
            if (flag === countTrueKey)
                filterPokemons.push(pokemon);
        });

        return filterPokemons;
    }

    render() {
        return (
            <div className="wrapper">
                <div className="filters">
                    <div className="filters_types">
                        <p className="filters-types_title">Type and weaknesses</p>
                        <div className="b-filters-types">
                            {
                                Object.keys(colors[0]).map((key, index) =>
                                    <div className="filters-types_flex">
                                        <p key={key} className="filters-types_type capitalize"
                                           style={{background: this.props.color(key)}}>{key}</p>
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
                            <button className="filters-param-btns_refresh"
                                    onClick={() => this.props.refreshFilter()}>Refresh</button>
                            <button className="filters-param-btns_search"
                                    onClick={() => this.props.filter(this.filters())}>Search</button>
                        </div>
                    </div>
                </div>
                <div className="filters_open" onClick={() => this.toggleFilters()}>
                    <button className="filters-open_btn">Filters</button>
                    <img className="filters-open_img" src="./images/arrow.png" />
                </div>
            </div>
        );
    }
}

export default FilterPokemon;