import React, {useState, useEffect, useRef} from 'react';

function Header(props) {
    const b_circles = useRef([]);
    const [searchInp, setSearchInp] = useState("");
    const [placeholder, setPlaceholder] = useState("ID or Name");
    const time = new Date();
    const [dateTime, setDateTime] = useState({
        hours: time.getHours() < 10 ? `0${time.getHours()}` : time.getHours(),
        minutes: time.getMinutes() < 10 ? `0${time.getMinutes()}` : time.getMinutes(),
        seconds: time.getSeconds() < 10 ? `0${time.getSeconds()}` : time.getSeconds()
    });

    const search = () => {
        let pokemon;
        props.pokemons.map(one => {
            if (!isNaN(+searchInp) && one.id === +searchInp)
                pokemon = one;
            else if (one.name === searchInp.toLowerCase())
                pokemon = one;
        });
        if (pokemon === undefined) {
            setSearchInp("");
            setPlaceholder("Not correct!");
        }
        else {
            setSearchInp("");
            setPlaceholder("ID or Name");
            props.searchPokemon(pokemon.id);
        }
    }

    useEffect(() => {
        const timer = setInterval(() => {
            setDateTime({
                hours: time.getHours() < 10 ? `0${time.getHours()}` : time.getHours(),
                minutes: time.getMinutes() < 10 ? `0${time.getMinutes()}` : time.getMinutes(),
                seconds: time.getSeconds() < 10 ? `0${time.getSeconds()}` : time.getSeconds()
            });
        }, 1000);
        const circles = b_circles.current.children;
        const values = [(dateTime.seconds * 100) / 60, (dateTime.minutes * 100) / 60, (dateTime.hours * 100) / 24];
        circles[0].style.background = `linear-gradient(#ffa500 ${values[2]}%, #585858 ${values[2]}%)`;
        circles[1].style.background = `linear-gradient(#ffa500 ${values[1]}%, #585858 ${values[1]}%)`;
        circles[2].style.background = `linear-gradient(#ffa500 ${values[0]}%, #585858 ${values[0]}%)`;
        return () => clearInterval(timer);
    }, [time]);

    return (
        <header className="header">
            <div className="container header_container">
                <a href="/" className="header_linkLogo">
                    <img className="header-linkLogo_logo" src="images/logo.png" alt="" />
                </a>
                <div className="header_search">
                    <input type="text" className="header-search_inp" placeholder={placeholder} value={searchInp}
                           onChange={event => setSearchInp(event.target.value)} />
                    <button className="header-search_btn" onClick={() => search()} />
                </div>
                <div className="header_clock" ref={b_circles}>
                    <div className="wrapper-clock">
                        <span>{dateTime.hours}</span>
                    </div>
                    <div className="wrapper-clock">
                        <span>{dateTime.minutes}</span>
                    </div>
                    <div className="wrapper-clock">
                        <span>{dateTime.seconds}</span>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;