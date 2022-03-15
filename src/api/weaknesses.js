import axios from "axios";

async function Weaknesses(url, types) {
    let weaknessesList = [];
    let typeList = types.map(type => type.type.name);
    await axios.get(url)
        .then(weaknesses => {
            weaknesses.data.damage_relations.double_damage_from.map(weakness => {
                if (!typeList.includes(weakness.name) && !weaknessesList.includes(weakness.name))
                    weaknessesList.push(weakness.name);
            });
        });

    return weaknessesList;
}

export default Weaknesses;