import React, {useState, useEffect} from 'react';

function Header(props) {
    const time = new Date();
    const [dateTime, setDateTime] = useState({
        hours: time.getHours() < 10 ? `0${time.getHours()}` : time.getHours(),
        minutes: time.getMinutes() < 10 ? `0${time.getMinutes()}` : time.getMinutes(),
        seconds: time.getSeconds() < 10 ? `0${time.getSeconds()}` : time.getSeconds()
    });

    useEffect(() => {
        const timer = setInterval(() => {
            setDateTime({
                hours: time.getHours() < 10 ? `0${time.getHours()}` : time.getHours(),
                minutes: time.getMinutes() < 10 ? `0${time.getMinutes()}` : time.getMinutes(),
                seconds: time.getSeconds() < 10 ? `0${time.getSeconds()}` : time.getSeconds()
            });
        }, 1000);
        const circles = document.querySelectorAll(".wrapper-clock");
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
                    <input type="text" className="header-search_inp" placeholder="ID or Name" />
                    <button className="header-search_btn"
                            onClick={() => props.onClick()} />
                </div>
                <div className="header_clock">
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