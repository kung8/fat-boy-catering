import React from 'react';

export default function Loading({ children, loaded, checkHeight, image, showMenuItemModal }) {

    const handleOnScroll = () => {
        if (image) {
            checkHeight(image)
        }
    }

    return (
        <div className={`loading-page ${showMenuItemModal && 'show-wrapper'}`} onScroll={() => handleOnScroll()}>
            {
                loaded ?
                    children
                    :
                    <div className='loader'></div>
            }
        </div>
    )
}