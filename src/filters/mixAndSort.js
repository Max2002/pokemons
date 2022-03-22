import React, {useState} from 'react';
import clsx from "clsx";

function MixAndSort(props) {
    const [toggleSort, setToggleSort] = useState(false);
    const [labelSort, setLabelSort] = useState("");

    const selectSort = (valueForSort) => {
        let pokemonsSort = props.filterPokemon.length !== 0 ? props.filterPokemon.slice() : props.pokemons.slice();
        if (valueForSort === 'Ascending numbers') {
            pokemonsSort.sort((a, b) => a.id - b.id);
            setLabelSort(valueForSort);
        } else if (valueForSort === 'Descending numbers') {
            pokemonsSort.sort((a, b) => b.id - a.id);
            setLabelSort(valueForSort);
        } else if (valueForSort === 'A - Z') {
            pokemonsSort.sort((x, y) => x.name.localeCompare(y.name));
            setLabelSort(valueForSort);
        } else if (valueForSort === "Z - A") {
            pokemonsSort.sort((x, y) => y.name.localeCompare(x.name));
            setLabelSort(valueForSort);
        } else
            setLabelSort(valueForSort);
        setToggleSort(false);

        return pokemonsSort;
    }

    return (
        <div className="b-cards_func">
            <button className="b-cards_mix" onClick={() => props.mix()}>Surprise me</button>
            <div className="b-cards-func_sort">
                <div className="b-cards_sort" onClick={() => setToggleSort(!toggleSort)}>
                    <p className="b-cards-sort_label">{labelSort === "" ? "Sort" : labelSort}</p>
                    <img src="./images/arrow.png" className={clsx("b-cards-sort_arrow", {arrowTop: toggleSort})} alt="" />
                </div>
                <ul className={clsx("b-cards_sortList", {activeList: toggleSort})}>
                    <li className="b-cards-sortList_items"
                        onClick={() => props.sort(selectSort("Sort"))}>Sort</li>
                    <li className="b-cards-sortList_items"
                        onClick={() => props.sort(selectSort("Ascending numbers"))}>Ascending numbers</li>
                    <li className="b-cards-sortList_items"
                        onClick={() => props.sort(selectSort("Descending numbers"))}>Descending numbers</li>
                    <li className="b-cards-sortList_items"
                        onClick={() => props.sort(selectSort("A - Z"))}>A - Z</li>
                    <li className="b-cards-sortList_items"
                        onClick={() => props.sort(selectSort("Z - A"))}>Z - A</li>
                </ul>
            </div>
        </div>
    );
}

export default MixAndSort;