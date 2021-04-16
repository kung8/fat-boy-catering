import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Footer from './Footer';

export default function MenuItem(props) {
    const [menuItem, updateMenuItem] = useState({});
    const { image, name, enabled, description, desc_enabled, id, range, selections } = menuItem;
    const [selected, updateSelected] = useState({});

    useEffect(() => {
        if (Object.keys(menuItem).length === 0) {
            getMenuItemData();
        }
        // eslint-disable-next-line
    }, [])

    const getMenuItemData = async () => {
        let id = props.match.params.id;
        let { data } = await axios.get('/api/menu/' + id);
        console.log(data);
        await updateMenuItem(data);

        createSelection(data.selections);
    }

    const createSelection = async (arr) => {
        let selectionObj = {};
        arr.forEach((selection, index) => {
            let type = selection.selection_type_id;
            let newArr = [];
            selection.ingredients.forEach(item => {
                if (item.preset) {
                    if (type === 2) {
                        newArr.push(item.ingredient_id);
                    }

                    if (type === 1) {
                        newArr = item.ingredient_id;
                    }
                }
            })
            selectionObj[index] = newArr;
        })

        updateSelected(selectionObj);
    }

    const handleSelection = (index, id, radio) => {
        let selectedCopy = { ...selected };
        if (radio) {
            selectedCopy[index] = id;
        } else {
            let arr = selectedCopy[index];
            if (arr.includes(id)) {
                let pos = arr.findIndex(item => item === id);
                arr.splice(pos, 1);
            } else {
                arr.push(id);
            }
            selectedCopy[index] = arr;
        }
        updateSelected(selectedCopy);
    }

    const displaySelections = () => {
        return selections.map((obj, index) => {
            const { id, name, ingredients, selection_type_id: selectionType } = obj;
            return (
                <div key={id} className="selection-container">
                    <h3 className="selection-name">{name}</h3>
                    <div className="selector-list">
                        {ingredients.map(item => {
                            const { ingredient_id: ingredientId, enabled, name: ingredientName } = item;
                            if (enabled) {
                                if (selectionType === 1) {
                                    const boolean = selected && selected[index] && selected[index] === ingredientId;
                                    return (
                                        <div key={ingredientId} className={`ingredient-item radio-type align-ctr `}>
                                            <input className={`${boolean && 'checked'}`} type="radio" name={id} id={ingredientId} checked={boolean} value={ingredientId} onChange={() => handleSelection(index, ingredientId, true)} />
                                            <label htmlFor={ingredientId}>{ingredientName}</label>
                                        </div>
                                    )
                                } else {
                                    const boolean = selected && selected[index] && selected[index].includes(ingredientId);
                                    return (
                                        <label key={ingredientId} className="ingredient-item checkbox-type align-ctr" htmlFor={ingredientId}>
                                            <input checked={boolean} className={`${boolean && 'checked'}`} type="checkbox" name="checkbox" id={ingredientId} value={ingredientId} onChange={() => handleSelection(index, ingredientId)} />
                                            <span>{ingredientName}</span>
                                        </label>
                                    )
                                }
                            }
                            return null;
                        })}
                    </div>
                </div>
            )
        })
    }

    return (
        <div className="menu-item-page">
            {
                image ?
                    <img className="item-image" src={image} alt={name} /> :
                    <div className="placeholder"></div>
            }
            <div className="menu-item-name-container" onClick={() => props.history.push('/')}>
                <svg className="item-chevron-arrow" viewBox="0 0 6 11" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.684322 0.261289L0.22601 0.790717C0.0753511 0.974183 0 1.18846 0 1.43306C0 1.6827 0.0753511 1.89443 0.22601 2.0686L3.19558 5.49998L0.226096 8.93133C0.0754366 9.10547 8.5718e-05 9.31725 8.5718e-05 9.56679C8.5718e-05 9.81151 0.0754366 10.0257 0.226096 10.2092L0.684408 10.7317C0.839112 10.9106 1.0245 11 1.24041 11C1.46035 11 1.64364 10.9105 1.79025 10.7317L5.76785 6.13547C5.92257 5.96595 6 5.75424 6 5.5C6 5.25053 5.9226 5.03633 5.76785 4.85761L1.79025 0.261313C1.63951 0.0871458 1.45624 0 1.24041 0C1.02853 -2.47955e-05 0.843242 0.087121 0.684322 0.261289Z" fill="black" /></svg>
                <h2 className="menu-item-name">{name}</h2>
            </div>
            <div className="selection-notes-and-qty-container">
                {menuItem && Object.keys(menuItem).length > 0 && selections.length > 0 && displaySelections()}
            </div>
            <button className="add-to-cart-button">Add To Cart</button>
            <Footer />
        </div>
    )
}