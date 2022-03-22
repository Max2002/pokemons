import gender from "./findOutGender";
import weaknesses from "./weaknesses";
import CDE from "./findOutCategoryDescriptionEvolve";
import descriptionAbilities from "./descriptionAbilities";
import axios from "axios";

async function generatePokemon(name) {
    let pokemon = {};
    await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`)
        .then(async result => {
            const cde = await CDE(name, result.data.id);
            let allWeaknesses = [];
            let descriptionsAbilities = {};
            result.data.types.map(async type => {
                const partWeaknesses = await weaknesses(type.type.url, result.data.types);
                partWeaknesses.map(part => {
                    if (!allWeaknesses.includes(part))
                        allWeaknesses.push(part);
                });
            });
            result.data.abilities.map(async item => {
                descriptionsAbilities[item.ability.name] = await descriptionAbilities(item.ability.url)
            });

            pokemon = {
                id: result.data.id,
                name: result.data.name,
                types: result.data.types,
                weaknesses: allWeaknesses,
                image: result.data.sprites.other['official-artwork'].front_default,
                description: cde[1],
                parameters: {
                    height: result.data.height / 10 + " m",
                    weight: result.data.weight / 10 + " kg",
                    gender: await gender(name),
                    category: cde[0],
                    abilities: result.data.abilities,
                },
                descriptionAbilities: descriptionsAbilities,
                stats: {
                    HP: result.data.stats[0].base_stat,
                    attack: result.data.stats[1].base_stat,
                    defense: result.data.stats[2].base_stat,
                    special_Attack: result.data.stats[3].base_stat,
                    special_Defense: result.data.stats[4].base_stat,
                    speed: result.data.stats[5].base_stat
                },
                evolve: cde[2]
            };
        });
    return Promise.resolve(pokemon);
}

export default generatePokemon;