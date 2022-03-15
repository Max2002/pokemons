import React from 'react';

function MixAndSort(props) {
    const clickSortLabel = () => {
        document.querySelector(".b-cards_sortList").classList.toggle("activeList");
        document.querySelector(".b-cards-sort_arrow").classList.toggle("arrowTop");
    }

    const selectSort = (valueForSort) => {
        let pokemonsSort = props.filterPokemon.length !== 0 ? props.filterPokemon : props.pokemons;
        let paramForSorting = document.querySelector(".b-cards-sort_label");
        let textContents = document.querySelectorAll(".b-cards-sortList_items");
        if (valueForSort === 'numberAsc') {
            pokemonsSort.sort((a, b) => a.id - b.id);
            paramForSorting.textContent = textContents[1].textContent;
        } else if (valueForSort === 'numberDesc') {
            pokemonsSort.sort((a, b) => b.id - a.id);
            paramForSorting.textContent = textContents[2].textContent;
        } else if (valueForSort === 'nameAsc') {
            pokemonsSort.sort((x, y) => x.name.localeCompare(y.name));
            paramForSorting.textContent = textContents[3].textContent;
        } else if (valueForSort === "nameDesc") {
            pokemonsSort.sort((x, y) => y.name.localeCompare(x.name));
            paramForSorting.textContent = textContents[4].textContent;
        } else
            paramForSorting.textContent = textContents[0].textContent;
        document.querySelector(".b-cards_sortList").classList.remove("activeList");
        document.querySelector(".b-cards-sort_arrow").classList.remove("arrowTop");

        return pokemonsSort;
    }

    return (
        <div className="b-cards_func">
            <button className="b-cards_mix" onClick={() => props.mix()}>Surprise me</button>
            <div className="b-cards-func_sort">
                <div className="b-cards_sort" onClick={() => clickSortLabel()}>
                    <p className="b-cards-sort_label">Sort</p>
                    <img src="./images/arrow.png" className="b-cards-sort_arrow" alt="" />
                </div>
                <ul className="b-cards_sortList">
                    <li className="b-cards-sortList_items"
                        onClick={() => props.sort(selectSort("noSort"))}>Sort</li>
                    <li className="b-cards-sortList_items"
                        onClick={() => props.sort(selectSort("numberAsc"))}>Ascending numbers</li>
                    <li className="b-cards-sortList_items"
                        onClick={() => props.sort(selectSort("numberDesc"))}>Descending numbers</li>
                    <li className="b-cards-sortList_items"
                        onClick={() => props.sort(selectSort("nameAsc"))}>A - Z</li>
                    <li className="b-cards-sortList_items"
                        onClick={() => props.sort(selectSort("nameDesc"))}>Z - A</li>
                </ul>
            </div>
        </div>
    );
}

export default MixAndSort;