import React from 'react';

function Information(props) {
    const clickDescriptionAbilities = (index) => {
        const descriptions = [...document.querySelectorAll(".pokemon-information-dAbility_one")];
        descriptions[index].classList.toggle("activeDescriptionAbilities");
    }
    let descriptionAbilities;

    return (
        <div className="pokemon_information">
            <p className="pokemon-information_description">{props.pokemon.description}</p>
            <div className="pokemon-information_parameters">
                { Object.keys(props.pokemon.parameters).map(param => {
                    const classForValue = param === 'abilities' ? "param_value description capitalize" : "param_value";
                    const value = param !== 'abilities' ? props.pokemon.parameters[param] :
                        props.pokemon.parameters[param].map(ability => ability.ability.name);
                    descriptionAbilities = props.pokemon.parameters.abilities.map(ability =>
                        <p className="pokemon-information-dAbility_one">
                            {props.pokemon.descriptionAbilities[ability.ability.name]}
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
                                                      onClick={() => clickDescriptionAbilities(index)}>
                                                                {val},</span> :
                                                <span className={classForValue}
                                                      onClick={() => clickDescriptionAbilities(index)}>
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
                            props.pokemon.types.map(type =>
                                <p key={type.type.name} className="pokemon-information-main-types_type capitalize"
                                   style={{background: props.color(type.type.name)}}>
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
                            props.pokemon.weaknesses.map(weakness =>
                                <p key={weakness} className="pokemon-information-main-weaknesses_weakness capitalize"
                                   style={{background: props.color(weakness)}}>
                                   {weakness}
                                </p>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Information;