import axios from "axios";

async function FindOutGender(name) {
    let female, male = false;
    let gender = "";
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
    if (female && male)
        gender = "♀ ♂";
    else if (female && !male)
        gender = "♀";
    else if (!female && male)
        gender = "♂";
    else
        gender = "unknown";

    return gender;
}

export default FindOutGender;