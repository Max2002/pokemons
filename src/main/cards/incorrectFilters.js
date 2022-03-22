import React from 'react';

function IncorrectFilters () {
    return (
        <div className="b-undefined">
            <h1 className="b-undefined_title">Unfortunately, no pokemon found for your search!</h1>
            <h2 className="b-undefined_subtitle">Here are some suggestion for search:</h2>
            <ul className="b-undefined_list">
                <li className="b-undefined-list_item">Try different heights and weights</li>
                <li className="b-undefined-list_item">Try selecting a larger search range</li>
                <li className="b-undefined-list_item">Try specifying fewer filters</li>
            </ul>
        </div>
    );
}

export default IncorrectFilters;