import React from 'react';
import {render} from 'react-dom';
import Pokemons from "./pokemons";
import "./styles/general.css";
import "bootstrap/dist/css/bootstrap-grid.css";

function App() {
    return <Pokemons />;
}

render(<App />, document.getElementById('root'));
