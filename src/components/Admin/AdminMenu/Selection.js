import React, { useState, useEffect } from 'react';
import Ingredient from './Ingredient';

export default function Selection(props) {
    const { selection, handleEdit, index: selIndex, editedItem } = props;
    const { name, ingredients, selectionType } = selection;
    const check = selectionType === 'check';
    const [placeholderNum, updatePlaceholderNum] = useState(0);

    useEffect(() => {
        // eslint-disable-next-line
    }, [editedItem]);

    const updateSelectionName = (name) => {
        let copy = { ...editedItem };
        const selections = copy.selections;
        selections[selIndex].name = name;
        handleEdit('selections', selections);
    }

    const updateSelectionType = async () => {
        const type = selectionType === 'radio' ? 'check' : 'radio';
        const copy = { ...editedItem };
        const selections = copy.selections;
        selections[selIndex].selectionType = type;
        if (type === 'radio') {
            let ingredients = selections[selIndex].ingredients.map((item, index) => {
                item.preset = false;
                if (index === 0) {
                    item.preset = true;
                }
                return item;
            });
            selections[selIndex].ingredients = ingredients;
        }
        await handleEdit('selections', selections);
    }

    const deleteSelection = () => {
        let copy = { ...editedItem };
        const selections = copy.selections;
        selections.splice(selIndex, 1);
        handleEdit('selections', selections);
    }

    const displayIngredients = () => {
        return (
            <div className="selector-list">
                {ingredients.map((ingredient, index) => {
                    return (
                        <Ingredient
                            key={'ingredient-' + ingredient.id}
                            index={index}
                            selection={selection}
                            selIndex={selIndex}
                            editedItem={editedItem}
                            handleEdit={handleEdit}
                        />
                    )
                })}
            </div>
        )
    }

    const addIngredientItem = async () => {
        let copy = { ...editedItem };
        let num = placeholderNum
        const selections = copy.selections;
        selections[selIndex].ingredients.push({ id: 'FPO-' + placeholderNum, name: null, preset: false, enabled: true });
        await handleEdit('selections', selections);
        updatePlaceholderNum(num + 1);
    }

    return (
        <div className="selection-container">
            <div className="selection-heading align-ctr flex-btwn">
                <input className="selection-name" value={name} onChange={(e) => updateSelectionName(e.target.value)} placeholder="New Selection Name..." />
                <div className="radio-toggle-and-delete-button-container align-ctr">
                    <div className={`radio-toggle-button radio-and-check-toggle-button align-ctr flex-btwn ${check && 'reversed'}`} onClick={() => updateSelectionType()} >
                        <span className="button-text">{check ? 'check' : 'radio'}</span>
                        <div className="circle-button"></div>
                    </div>
                    <button className="delete-selection-btn flex-ctr pointer" onClick={() => deleteSelection()}>
                        <svg height="12" viewBox="0 0 365.71733 365" width="12" xmlns="http://www.w3.org/2000/svg"><g fill="#ffffff"><path d="m356.339844 296.347656-286.613282-286.613281c-12.5-12.5-32.765624-12.5-45.246093 0l-15.105469 15.082031c-12.5 12.503906-12.5 32.769532 0 45.25l286.613281 286.613282c12.503907 12.5 32.769531 12.5 45.25 0l15.082031-15.082032c12.523438-12.480468 12.523438-32.75.019532-45.25zm0 0" /><path d="m295.988281 9.734375-286.613281 286.613281c-12.5 12.5-12.5 32.769532 0 45.25l15.082031 15.082032c12.503907 12.5 32.769531 12.5 45.25 0l286.632813-286.59375c12.503906-12.5 12.503906-32.765626 0-45.246094l-15.082032-15.082032c-12.5-12.523437-32.765624-12.523437-45.269531-.023437zm0 0" /></g></svg>
                    </button>
                </div>
            </div>
            { displayIngredients()}
            <button onClick={() => addIngredientItem()} className="add-item-btn">+ Add Item</button>
        </div>
    )
}