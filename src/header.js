import React from 'react';

function Header(props) {
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
            </div>
        </header>
    );
}

export default Header;