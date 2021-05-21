import React from 'react';

export default function OutOfOfficeMessage(props) {
    const { message } = props;
    return (
        <div className="out-of-office-message-container flex-all-ctr">
            <p className="text-ctr">{message}</p>
        </div>
    )
}