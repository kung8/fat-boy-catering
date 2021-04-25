import React from 'react';
import Ingredient from './Ingredient';

export default function Selection(props) {
    const { selection, handleEdit, index: selIndex, editedItem } = props;
    const { name, ingredients, selectionType } = selection;
    const check = selectionType === 'check';

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

    return (
        <div className="selection-container">
            <div className="selection-heading align-ctr flex-btwn">
                <h3 className="selection-name">{name}</h3>
                <div className={`radio-toggle-button radio-and-check-toggle-button align-ctr flex-btwn ${check && 'reversed'}`}
                // onClick={() => handleToggle(selection)}
                >
                    <span className="button-text">{check ? 'check' : 'radio'}</span>
                    <div className="circle-button"></div>
                </div>
            </div>
            {displayIngredients()}
            <button className="add-item-btn">+ Add Item</button>
        </div>
    )
}