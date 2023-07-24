import React, { useState } from 'react';
import { localStorageKeys, setLocalStorageKey } from '../../utils/local-storage';

export default function OutOfOfficeMessage(props) {
    const { message } = props;
    const [closed, updateClosed] = useState(false);

    const handleClose = () => {
        setLocalStorageKey(localStorageKeys.seenMessage, true)
        updateClosed(true);
    }

    return (
        <div className={`out-of-office-message-container flex-all-ctr ${closed && 'none'}`}>
            <button className="close-btn" onClick={handleClose}>X</button>
            <p>{message}</p>
        </div>
    )
}