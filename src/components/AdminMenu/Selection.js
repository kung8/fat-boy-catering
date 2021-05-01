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

    const addIngredientItem = async () => {
        let copy = { ...editedItem };
        let num = placeholderNum
        const selections = copy.selections;
        selections[selIndex].ingredients.push({ id: 'FPO-' + placeholderNum, name: null, preset: false, enabled: false });
        await handleEdit('selections', selections);
        updatePlaceholderNum(num + 1);
    }

    const updateSelectionName = (name) => {
        let copy = { ...editedItem };
        const selections = copy.selections;
        selections[selIndex].name = name;
        handleEdit('selections', selections);
    }

    return (
        <div className="selection-container">
            <div className="selection-heading align-ctr flex-btwn">
                <input className="selection-name" value={name} onChange={(e) => updateSelectionName(e.target.value)} />
                <div className={`radio-toggle-button radio-and-check-toggle-button align-ctr flex-btwn ${check && 'reversed'}`} onClick={() => updateSelectionType()} >
                    <span className="button-text">{check ? 'check' : 'radio'}</span>
                    <div className="circle-button"></div>
                </div>
            </div>
            { displayIngredients()}
            <button onClick={() => addIngredientItem()} className="add-item-btn">+ Add Item</button>
        </div>
    )
}