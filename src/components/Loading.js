import React from 'react';

export default function Loading({ children, loaded, checkHeight, image }) {

    return (
        <div className="loading-page" onScroll={() => checkHeight(image)}>
            {
                loaded ?
                    children
                    :
                    <div className='loader'></div>
            }
        </div>
    )
}