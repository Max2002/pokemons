import React, {useEffect, useState} from "react";
import colors from "../../src/colorType";
import LeftParam from "./leftParam";
import RightParam from "./rightParam";
import clsx from "clsx";

function FilterPokemon(props) {
    const [rangeFrom, setRangeFrom] = useState("");
    const [rangeTo, setRangeTo] = useState("");
    const [toggleFilters, setToggleFilters] = useState(false);
    const [types, setTypes] = useState([]);
    const [weaknesses, setWeaknesses] = useState([]);
    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");
    useEffect(() => {
        if (props.refresh) {
            setRangeFrom("");
            setRangeTo("");
            setTypes([]);
            setWeaknesses([]);
            setHeight("");
            setWeight("");
        }
    }, [props.refresh]);

    const setTAndW = (title, flag) => {
        let typesState = types.slice();
        let weaknessesState = weaknesses.slice();
        if (flag === "types" && !typesState.includes(title)) {
            typesState.push(title);
            setWeaknesses(weaknessesState.filter(val => val !== title));
            setTypes(typesState);
        } else if (flag === "weaknesses" && !weaknessesState.includes(title)) {
            weaknessesState.push(title);
            setTypes(typesState.filter(val => val !== title));
            setWeaknesses(weaknessesState);
        } else {
            setTypes(typesState.filter(val => val !== title));
            setWeaknesses(weaknessesState.filter(val => val !== title));
        }
    }

    const setHAndW = (value, flag) => {
        if (flag === "height")
            setHeight(value);
        else if (flag === "weight")
            setWeight(value);
        else if (flag === "clearHeight")
            setHeight("");
        else
            setWeight("");
    }

    const contains = (array, otherArray) => {
        return array.every(item => otherArray.indexOf(item) !== -1);
    }

    const filters = () => {
        let pokemons = props.pokemons;
        let filterPokemons = [];
        let heightPokemon = pokemons.map(pokemon => +pokemon.parameters.height.split('m')[0]);
        let weightPokemon = pokemons.map(pokemon => +pokemon.parameters.weight.split('kg')[0]);
        let valuesHeight = [Math.max(...heightPokemon),
            heightPokemon.reduce((sum, elem) => sum + elem) / heightPokemon.length, Math.min(...heightPokemon)];
        let valuesWeight = [Math.max(...weightPokemon),
            weightPokemon.reduce((sum, elem) => sum + elem) / weightPokemon.length, Math.min(...weightPokemon)];
        let objectParam = {
            range: rangeFrom !== "" && rangeTo !== "",
            height: height !== "",
            weight: weight !== "",
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
            if (objectParam.range && pokemon.id >= +rangeFrom && pokemon.id <= +rangeTo)
                flag++;
            if (objectParam.height) {
                let heightPokemon = +pokemon.parameters.height.split('m')[0];
                if (height === "short" && heightPokemon < (valuesHeight[1] + valuesHeight[2]) / 2)
                    flag++;
                else if (height === "high" && heightPokemon >= (valuesHeight[1] + valuesHeight[0]) / 2)
                    flag++;
                else if (height === "medium" && heightPokemon >= (valuesHeight[1] + valuesHeight[2]) / 2 && heightPokemon < (valuesHeight[1] + valuesHeight[0]) / 2)
                    flag++;
            }
            if (objectParam.weight) {
                let weightPokemon = +pokemon.parameters.weight.split('kg')[0];
                if (weight === "thin" && weightPokemon < (valuesWeight[1] + valuesWeight[2]) / 2)
                    flag++;
                else if (weight === "heavy" && weightPokemon >= (valuesWeight[1] + valuesWeight[0]) / 2)
                    flag++;
                else if (weight === "medium" && weightPokemon >= (valuesWeight[1] + valuesWeight[2]) / 2 && weightPokemon < (valuesWeight[1] + valuesWeight[0]) / 2)
                    flag++;
            }
            if (objectParam.types) {
                let typesPokemon = pokemon.types.map(type => type.type.name);
                if (contains(types, typesPokemon))
                    flag++;
            }
            if (objectParam.weaknesses) {
                let weaknessesPokemon = pokemon.weaknesses.map(weakness => weakness);
                if (contains(weaknesses, weaknessesPokemon))
                    flag++;
            }
            if (flag === countTrueKey)
                filterPokemons.push(pokemon);
        });

        return filterPokemons;
    }

    return (
        <div className="wrapper">
            <div className={clsx("filters", {activeFilters: toggleFilters})}>
                <div className="filters_types">
                    <p className="filters-types_title">Type and weaknesses</p>
                    <div className="b-filters-types">
                        {
                            Object.keys(colors[0]).map(key => <LeftParam refresh = {props.refresh} setTAndW = {setTAndW}
                                                                         title={key} color={props.color} />
                            )
                        }
                    </div>
                    <div className="filters-types_range">
                        <p className="filters-types-range_title">Numbering range</p>
                        <div>
                            <input type="text" onChange={event => setRangeFrom(event.target.value)}
                                   className="filters-types-range_inp" placeholder="1" value={rangeFrom} />
                            <span className="filters-types-range_span">-</span>
                            <input type="text" onChange={event => setRangeTo(event.target.value)}
                                   className="filters-types-range_inp" placeholder="800" value={rangeTo} />
                        </div>
                    </div>
                </div>
                <div className="filters_param">
                    <RightParam refresh = {props.refresh} setHAndW = {setHAndW} />
                    <div className="filters-param_btns">
                        <button className="filters-param-btns_refresh"
                                onClick={() => props.refreshFilter()}>Refresh</button>
                        <button className="filters-param-btns_search"
                                onClick={() => props.filter(filters())}>Search</button>
                    </div>
                </div>
            </div>
            <div className="filters_open" onClick={() => setToggleFilters(!toggleFilters)}>
                <button className={clsx("filters-open_btn", {activeBtnFilters: toggleFilters})}>Filters</button>
                <img className={clsx("filters-open_img", {activeImgFilters: toggleFilters})} src="./images/arrow.png" />
            </div>
        </div>
    );
}

export default FilterPokemon;