import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Footer from '../_Global/Footer';
import Loading from '../_Global/Loading';
import socket from '../_Global/Socket';

export default function MenuItem(props) {
    const { checkHeight, updateCartNum } = props;
    const [menuItem, updateMenuItem] = useState({});
    const { id, image, name, selections, range } = menuItem;
    const [selected, updateSelected] = useState({});
    const [qty, updateQty] = useState(1);
    const [isLoaded, updateIsLoaded] = useState(false);
    const [instructions, updateInstructions] = useState('');
    const googleDriveURL = 'https://drive.google.com/uc?export=view&id=';
    const [delay, updateDelay] = useState(0);

    useEffect(() => {
        getSessionStorage();
        socket.emit('join item page');
        socket.on('joined item successfully', async () => await getMenuItemData());
        socket.on('updated menu data', async () => await getMenuItemData());
        socket.on('updated delay', time => updateDelay(time));
        // eslint-disable-next-line
    }, [delay])

    const getSessionStorage = async () => {
        let cart = await sessionStorage.getItem('cart');
        if (cart) {
            cart = Object.values(JSON.parse(cart));
            let values = cart.filter(item => item.qty > 0);
            sessionStorage.setItem('cart', JSON.stringify(values));
            cart = values;
            await updateCartNum(cart.length);
        }
    }

    const getMenuItemData = async () => {
        let id = props.match.params.id;
        let { data } = await axios.get('/api/menu/' + id);
        let { item, delayObj } = data;
        await updateMenuItem(item);
        updateDelay(delayObj.delay);
        await updateIsLoaded(true);
        createSelection(item.selections);
    }

    const createSelection = async (arr) => {
        let selectionObj = {};
        arr.forEach((selection, index) => {
            let type = selection.selection_type_id;
            let newArr = [];
            selection.ingredients.forEach(item => {
                if (item.preset) {
                    if (type === 2) {
                        newArr.push(item.name);
                    }

                    if (type === 1) {
                        newArr = item.name;
                    }
                }
            })
            selectionObj[index] = newArr;
        })

        updateSelected(selectionObj);
    }

    const handleSelection = (index, name, radio) => {
        let selectedCopy = { ...selected };
        if (radio) {
            selectedCopy[index] = name;
        } else {
            let arr = selectedCopy[index];
            if (arr.includes(name)) {
                let pos = arr.findIndex(item => item === name);
                arr.splice(pos, 1);
            } else {
                arr.push(name);
            }
            selectedCopy[index] = arr;
        }
        updateSelected(selectedCopy);
    }

    const addToCart = async () => {
        let cart = sessionStorage.getItem('cart');
        cart = JSON.parse(cart);

        if (!cart) {
            cart = {};
        }

        let num = Object.keys(cart).length;

        let item = {
            menu_item_id: id,
            name,
            selections: loopThroughSelection(),
            qty,
            instructions
        }

        cart[num] = item;
        cart = JSON.stringify(cart);
        sessionStorage.setItem('cart', cart);

        props.history.push('/');
    }

    const loopThroughSelection = () => {
        let selections = []
        for (let key in selected) {
            let data = selected[key];
            if ((typeof data).toLowerCase() === 'string') {
                selections = [...selections, data];
            } else {
                selections = [...selections, ...data];
            }
        }
        return selections;
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
                                    const boolean = selected && selected[index] && selected[index] === ingredientName;
                                    return (
                                        <div key={ingredientId} className="ingredient-item radio-type align-ctr">
                                            <input
                                                className={`${boolean && 'checked'}`}
                                                type="radio"
                                                name={id}
                                                id={ingredientId}
                                                checked={boolean}
                                                value={ingredientId}
                                                onChange={() => handleSelection(index, ingredientName, true)} />
                                            <label htmlFor={ingredientId}>{ingredientName}</label>
                                        </div>
                                    )
                                } else {
                                    const boolean = selected && selected[index] && selected[index].includes(ingredientName);
                                    return (
                                        <label key={ingredientId} className="ingredient-item checkbox-type align-ctr" htmlFor={ingredientId}>
                                            <input checked={boolean} className={`${boolean && 'checked'}`} type="checkbox" name="checkbox" id={ingredientId} value={ingredientId} onChange={() => handleSelection(index, ingredientName)} />
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

    const determineRange = () => {
        let lowerRange = 5;
        let higherRange = 10;
        if (range === 1) {
            lowerRange = 10;
            higherRange = 15;
        }

        if (delay) {
            lowerRange += delay;
            higherRange += delay;
        }

        let message = 'Estimated ' + lowerRange + ' to ' + higherRange + ' minute wait';

        return message;
    }

    return (
        <Loading loaded={isLoaded} checkHeight={checkHeight} image="#item-image">
            <div className="menu-item-page">
                {
                    image ?
                        <img id="item-image" className="item-image" src={googleDriveURL + image} alt={name} /> :
                        <div id="item-image" className="placeholder"></div>
                }
                <div className="menu-item-name-container align-ctr flex-btwn" onClick={() => props.history.push('/')}>
                    <div className="menu-item-left-side">
                        <svg className="item-chevron-arrow" viewBox="0 0 6 11" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.684322 0.261289L0.22601 0.790717C0.0753511 0.974183 0 1.18846 0 1.43306C0 1.6827 0.0753511 1.89443 0.22601 2.0686L3.19558 5.49998L0.226096 8.93133C0.0754366 9.10547 8.5718e-05 9.31725 8.5718e-05 9.56679C8.5718e-05 9.81151 0.0754366 10.0257 0.226096 10.2092L0.684408 10.7317C0.839112 10.9106 1.0245 11 1.24041 11C1.46035 11 1.64364 10.9105 1.79025 10.7317L5.76785 6.13547C5.92257 5.96595 6 5.75424 6 5.5C6 5.25053 5.9226 5.03633 5.76785 4.85761L1.79025 0.261313C1.63951 0.0871458 1.45624 0 1.24041 0C1.02853 -2.47955e-05 0.843242 0.087121 0.684322 0.261289Z" fill="black" /></svg>
                        <h2 className="menu-item-name">{name}</h2>
                    </div>
                    <div className="eta-container">
                        <p className="range">{determineRange()}</p>
                    </div>
                </div>
                <div className="selections-container">
                    {menuItem && Object.keys(menuItem).length > 0 && selections.length > 0 && displaySelections()}
                </div>
                <div className="special-instructions-container">
                    <h2 className="special-instructions-text">Special Instructions</h2>
                    <textarea className="special-instructions" placeholder="e.g. Allergies to peanuts, specify preferred time to place the order, etc." name="instructions" id="instructions" value={instructions} onChange={(e) => updateInstructions(e.target.value)}></textarea>
                </div>
                <div className="quantity-container">
                    <h2 className="quantity-text">Quantity</h2>
                    <div className="qty-btn-container align-ctr">
                        <button disabled={qty === 1} onClick={() => updateQty(qty - 1)} className={`decrement-btn ${qty === 1 && 'transparent'}`}>
                            <svg width="12" height="10" viewBox="0 0 9 2" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.12903 0H0.870968C0.391935 0 0 0.45 0 1C0 1.55 0.391935 2 0.870968 2H8.12903C8.60806 2 9 1.55 9 1C9 0.45 8.60806 0 8.12903 0Z" fill="white" /></svg>
                        </button>
                        <div className="qty-display">{qty}</div>
                        <button onClick={() => updateQty(qty + 1)} className="increment-btn">
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.52055 3.87297H5.42219V0.774609C5.42219 0.347031 5.07594 0 4.64758 0C4.21922 0 3.87297 0.347031 3.87297 0.774609V3.87297H0.77461C0.34625 3.87297 0 4.22 0 4.64758C0 5.07516 0.34625 5.42219 0.77461 5.42219H3.87297V8.52055C3.87297 8.94813 4.21922 9.29516 4.64758 9.29516C5.07594 9.29516 5.42219 8.94813 5.42219 8.52055V5.42219H8.52055C8.94891 5.42219 9.29516 5.07516 9.29516 4.64758C9.29516 4.22 8.94891 3.87297 8.52055 3.87297Z" fill="white" /></svg>
                        </button>
                    </div>
                </div>
                <button className="add-to-cart-button" onClick={() => addToCart()}>Add To Cart</button>
                <Footer />
            </div>
        </Loading>
    )
}