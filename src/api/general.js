import axios from "axios";
import generatePokemon from "./generatePokemon";

async function General(num) {
    let results = [];
    await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${num}`)
        .then(result => results = result.data.results);

    return Promise.all(results.map(pokemon => generatePokemon(pokemon.name)));
}

export default General;