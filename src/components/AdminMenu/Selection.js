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

    return (
        <div className="selection-container">
            <div className="selection-heading align-ctr flex-btwn">
                <h3 className="selection-name">{name}</h3>
                <div className={`radio-toggle-button radio-and-check-toggle-button align-ctr flex-btwn ${check && 'reversed'}`} onClick={() => updateSelectionType()} >
                    <span className="button-text">{check ? 'check' : 'radio'}</span>
                    <div className="circle-button"></div>
                </div>
            </div>
            {displayIngredients()}
            <button onClick={() => addIngredientItem()} className="add-item-btn">+ Add Item</button>
        </div>
    )
}