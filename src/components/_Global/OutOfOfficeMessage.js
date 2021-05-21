import React, { useState } from 'react';

export default function OutOfOfficeMessage(props) {
    const { message } = props;
    const [closed, updateClosed] = useState(false);

    const handleClose = () => {
        sessionStorage.setItem('seen-out-of-office-message', true);
        updateClosed(true);
    }

    return (
        <div className={`out-of-office-message-container flex-all-ctr ${closed && 'none'}`}>
            <button className="close-btn" onClick={handleClose}>X</button>
            <p>{message}</p>
        </div>
    )
}