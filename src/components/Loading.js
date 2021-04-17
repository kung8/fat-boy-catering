import React from 'react';

export default function Loading({ children, loaded }) {
    return (
        <div className="loading-page">
            {
                loaded ?
                    children
                    :
                    <div className='loader'></div>
            }
        </div>
    )
}