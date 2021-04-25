import React, { useEffect } from 'react';

export default function Ingredient(props) {
    const { index, selection, selIndex, editedItem, handleEdit } = props;
    const { selectionType } = editedItem.selections[selIndex];
    const { id, name, enabled, preset } = editedItem.selections[selIndex].ingredients[index];

    useEffect(() => {
        // eslint-disable-next-line
    }, [editedItem]);

    const updateIngredient = async (prop, value) => {
        const copy = { ...editedItem };
        const selections = copy.selections;
        selections[selIndex].ingredients[index][prop] = value;
        await handleEdit('selections', selections);
    }

    const handleDeletion = async () => {
        const copy = { ...editedItem };
        const selections = copy.selections;
        selections[selIndex].ingredients.splice(index, 1);
        await handleEdit('selections', selections);
    }

    return (
        <div key={id} className="ingredient-item align-ctr flex-btwn">
            <input className="ingredient-name" name="name" type="text" value={name} onChange={e => updateIngredient(e.target.name, e.target.value)} />
            <div className="selector-controller align-ctr">
                <div className="preset-container col align-ctr">
                    <span className="preset-text">Preset</span>
                    {
                        selectionType === 'radio' ?
                            <input
                                type="radio"
                                name={`preset-radio-${selIndex}`}
                                id={'radio-ingredient-' + id}
                                className={`preset-radio ${preset && 'checked'}`}
                                onChange={() => updateIngredient('preset', !preset)}
                            />
                            :

                            <label className="preset-checkbox-container align-ctr" >
                                <input
                                    type="checkbox"
                                    name={`preset-checkbox-${selIndex}`}
                                    checked={preset}
                                    id={'checkbox-' + id}
                                    value={id}
                                    className={`preset-checkbox ${preset && 'checked'}`}
                                    onChange={() => updateIngredient('preset', !preset)}
                                />
                                <div htmlFor={'checkbox-' + id}></div>
                            </label>
                    }
                </div>
                <div className={`radio-toggle-button align-ctr flex-btwn ${!enabled && 'reversed'}`} onClick={() => updateIngredient('enabled', !enabled)}>
                    <span className="button-text">{enabled ? 'ON' : 'OFF'}</span>
                    <div className="circle-button"></div>
                </div>
                <svg onClick={() => handleDeletion()} width="28" height="28" viewBox="-1 -1 12 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.07812 1.375H6.1875V1.03125C6.1875 0.462623 5.72488 0 5.15625 0H3.78125C3.21262 0 2.75 0.462623 2.75 1.03125V1.375H0.859375C0.385516 1.375 0 1.76052 0 2.23438V3.4375C0 3.62734 0.153914 3.78125 0.34375 3.78125H0.531609L0.828588 10.0178C0.85482 10.5686 1.30728 11 1.85866 11H7.07884C7.63024 11 8.0827 10.5686 8.10891 10.0178L8.40589 3.78125H8.59375C8.78359 3.78125 8.9375 3.62734 8.9375 3.4375V2.23438C8.9375 1.76052 8.55198 1.375 8.07812 1.375ZM3.4375 1.03125C3.4375 0.841715 3.59171 0.6875 3.78125 0.6875H5.15625C5.34579 0.6875 5.5 0.841715 5.5 1.03125V1.375H3.4375V1.03125ZM0.6875 2.23438C0.6875 2.13961 0.764607 2.0625 0.859375 2.0625H8.07812C8.17289 2.0625 8.25 2.13961 8.25 2.23438V3.09375C8.14406 3.09375 1.12649 3.09375 0.6875 3.09375V2.23438ZM7.42219 9.9851C7.41344 10.1687 7.26262 10.3125 7.07884 10.3125H1.85866C1.67486 10.3125 1.52404 10.1687 1.51531 9.9851L1.21988 3.78125H7.71762L7.42219 9.9851Z" fill="black" /><path d="M4.46875 9.625C4.65859 9.625 4.8125 9.47109 4.8125 9.28125V4.8125C4.8125 4.62266 4.65859 4.46875 4.46875 4.46875C4.27891 4.46875 4.125 4.62266 4.125 4.8125V9.28125C4.125 9.47109 4.27889 9.625 4.46875 9.625Z" fill="black" /><path d="M6.1875 9.625C6.37734 9.625 6.53125 9.47109 6.53125 9.28125V4.8125C6.53125 4.62266 6.37734 4.46875 6.1875 4.46875C5.99766 4.46875 5.84375 4.62266 5.84375 4.8125V9.28125C5.84375 9.47109 5.99764 9.625 6.1875 9.625Z" fill="black" /><path d="M2.75 9.625C2.93984 9.625 3.09375 9.47109 3.09375 9.28125V4.8125C3.09375 4.62266 2.93984 4.46875 2.75 4.46875C2.56016 4.46875 2.40625 4.62266 2.40625 4.8125V9.28125C2.40625 9.47109 2.56014 9.625 2.75 9.625Z" fill="black" /></svg>
            </div>
        </div>
    )
}