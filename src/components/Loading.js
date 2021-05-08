import React from 'react';

export default function Loading({ children, loaded, checkHeight, image, showMenuItemModal }) {

    return (
        <div className={`loading-page ${showMenuItemModal && 'show-wrapper'}`} onScroll={() => checkHeight(image)}>
            {
                loaded ?
                    children
                    :
                    <div className='loader'></div>
            }
        </div>
    )
}