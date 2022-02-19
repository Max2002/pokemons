import React from 'react';

function Loading () {
    return (
        <div className="b-loading">
            <p className="b-loading_title">Loading...</p>
            <img className="b-loading_img" src="./images/loading.gif" alt="" />
        </div>
    );
}

export default Loading;