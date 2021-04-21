import React, { useState, useEffect } from 'react';
import Footer from './Footer';
import axios from 'axios';
import Loading from './Loading';

export default function AdminMenu(props) {
    const { checkHeight } = props;
    const [hero, updateHero] = useState('');
    const [menu, updateMenu] = useState([]);
    const [isCollapsedArr, updateIsCollapsedArr] = useState({});
    const mini = 700;
    const [screenSize, updateScreenSize] = useState(window.screen.width);
    const [isLoaded, updateIsLoaded] = useState(false);

    useEffect(() => {
        getMenuPageData();
        getScreenWidth();
        handleScreenResize();
        // eslint-disable-next-line
    }, [screenSize]);

    const getMenuPageData = async () => {
        const { data } = await axios.get('/api/menu');
        const { hero, menu } = data;
        updateHero(hero);
        await updateIsLoaded(true);
        await updateMenu(menu);
        await initializeCollapse(menu);
    }

    const getScreenWidth = async () => {
        let width = window.screen.width;
        await updateScreenSize(width);
    }

    const initializeCollapse = async (menu) => {
        let newIsCollapsedArr = {};
        let bool = screenSize < mini;
        menu.forEach((item, index) => {
            newIsCollapsedArr[index] = {
                category: bool,
                menuItems: []
            }
            let numOfItems = item.menuItems.length;
            for (let i = 0; i < numOfItems; i++) {
                newIsCollapsedArr[index].menuItems[i] = true;
            }
        })

        await updateIsCollapsedArr(newIsCollapsedArr);
    }

    const handleScreenResize = () => {
        window.addEventListener('resize', async () => {
            await getScreenWidth();
            await initializeCollapse(menu);
        });
    }

    const handleCollapse = async (index, bool, categoryId) => {
        let isCollapsedArrCopy = { ...isCollapsedArr };
        isCollapsedArrCopy[index].category = bool;
        await updateIsCollapsedArr(isCollapsedArrCopy);

        if (!bool) {
            document.getElementById('arrow-' + categoryId).classList.add('right-side-up');
        } else {
            document.getElementById('arrow-' + categoryId).classList.remove('right-side-up');
        }
    }

    const handleToggle = async (item) => {
        let { id, enabled } = item;
        item.enabled = !enabled;
        const { data } = await axios.put('/api/menu/' + id, { item });
        const copy = menu.map(cat => {
            let menuItems = cat.menuItems.map(item => {
                if (item.id === data.id) return data;
                return item;
            });
            cat.menuItems = menuItems;
            return cat;
        });
        await updateMenu(copy);
    }

    const handleItemCollapse = async (categoryIndex, index, bool, id, item) => {
        let isCollapsedArrCopy = { ...isCollapsedArr };
        isCollapsedArrCopy[categoryIndex].menuItems[index] = bool;
        await updateIsCollapsedArr(isCollapsedArrCopy);

        if (!bool) {
            document.getElementById('arrow-item-' + id).classList.add('right-side-up');
        } else {
            document.getElementById('arrow-item-' + id).classList.remove('right-side-up');
        }
    }

    const mapMenu = () => {
        return (
            <div className="menu">
                {menu.map((category, index) => {
                    const { id: categoryId, name, image, menuItems } = category;
                    const collapsed = isCollapsedArr && isCollapsedArr[index] && isCollapsedArr[index].category;

                    let height;
                    if (screenSize > mini) {
                        const numOfItems = menuItems.length;
                        const threeLiners = menuItems.filter(item => item.description.length > 80).length;
                        const twoLiners = menuItems.filter(item => item.description.length > 40 && item.description.length < 80).length;
                        const oneLiner = menuItems.filter(item => item.description.length && item.description.length < 40).length;
                        let noDesc = numOfItems - threeLiners - twoLiners - oneLiner;
                        height = (275 + (noDesc * 65) + (oneLiner * 80) + (twoLiners * 100) + (threeLiners * 120)) / 2;
                    }

                    return (
                        <div key={categoryId} className={`category-card col align-ctr ${collapsed && 'collapsed-card'}`}>
                            <button
                                className="category-name-container flex-btwn align-ctr"
                                onClick={() => handleCollapse(index, !isCollapsedArr[index].category, categoryId)}
                                disabled={screenSize > mini}>
                                <h3 className="category-name">{name}</h3>
                                <svg id={`arrow-` + categoryId} className={`category-chevron-arrow ${collapsed && 'inverted'}`} viewBox="0 0 11 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.7387 0.684322L10.2093 0.22601C10.0258 0.0753511 9.81154 0 9.56694 0C9.3173 0 9.10557 0.0753511 8.9314 0.22601L5.50002 3.19558L2.06867 0.226096C1.89453 0.0754366 1.68275 8.5718e-05 1.43321 8.5718e-05C1.18849 8.5718e-05 0.974257 0.0754366 0.790766 0.226096L0.268287 0.684408C0.0893961 0.839112 0 1.0245 0 1.24041C0 1.46035 0.089495 1.64364 0.268263 1.79025L4.86453 5.76785C5.03405 5.92257 5.24576 6 5.5 6C5.74947 6 5.96367 5.9226 6.14239 5.76785L10.7387 1.79025C10.9129 1.63951 11 1.45624 11 1.24041C11 1.02853 10.9129 0.843242 10.7387 0.684322Z" fill="white" /></svg>
                            </button>
                            <div className={`category-img-and-menu col wrap ${collapsed && 'none'}`} style={{ height: !collapsed && height }}>
                                <img className="category-highlighted-img" src={image} alt="category highlights" />
                                {displayMenuItem(menuItems, index)}
                                <button className="add-item-button mobile">Add Item</button>
                            </div>
                            <button className="add-item-button desktop">Add Item</button>
                        </div>
                    )
                })}
            </div>
        )
    }

    const displayMenuItem = (menuItems, index) => {
        return menuItems.map((item, itemIndex) => {
            const { id, name, description, enabled, image, selections } = item;
            const collapsed = isCollapsedArr && isCollapsedArr[index] && isCollapsedArr[index].menuItems && isCollapsedArr[index].menuItems[itemIndex];

            return (
                <div id={'menu-item-' + id} className="menu-item-container">
                    <button id={'menu-item-button-' + id} key={id} className="menu-item-card align-ctr">
                        <div
                            className={`radio-toggle-button align-ctr flex-btwn ${!enabled && 'reversed'}`}
                            onClick={() => handleToggle(item)}>
                            <span className="button-text">{enabled ? 'ON' : 'OFF'}</span>
                            <div className="circle-button"></div>
                        </div>
                        <div>
                            <h4 className="menu-item-name">{name}</h4>
                            {description && <p className="menu-item-description">{description}</p>}
                        </div>
                        <svg id={`arrow-item-` + id}
                            className={`category-chevron-arrow ${collapsed && 'inverted'}`}
                            onClick={() => handleItemCollapse(index, itemIndex, !isCollapsedArr[index].menuItems[itemIndex], id, item)}
                            viewBox="0 0 11 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.7387 0.684322L10.2093 0.22601C10.0258 0.0753511 9.81154 0 9.56694 0C9.3173 0 9.10557 0.0753511 8.9314 0.22601L5.50002 3.19558L2.06867 0.226096C1.89453 0.0754366 1.68275 8.5718e-05 1.43321 8.5718e-05C1.18849 8.5718e-05 0.974257 0.0754366 0.790766 0.226096L0.268287 0.684408C0.0893961 0.839112 0 1.0245 0 1.24041C0 1.46035 0.089495 1.64364 0.268263 1.79025L4.86453 5.76785C5.03405 5.92257 5.24576 6 5.5 6C5.74947 6 5.96367 5.9226 6.14239 5.76785L10.7387 1.79025C10.9129 1.63951 11 1.45624 11 1.24041C11 1.02853 10.9129 0.843242 10.7387 0.684322Z" fill="black" /></svg>
                    </button>
                    <div className={`menu-item-selection-${id} ${collapsed && 'none'}`}>
                        {
                            image ?
                                <img id="item-image" className="item-image" src={image} alt={name} /> :
                                <div id="item-image" className="placeholder"></div>
                        }
                        <div className="selections-container">
                            {selections && selections.map(selection => {
                                return (
                                    <div>{selection.selection_name}</div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            )
        })
    }

    const displaySelections = async (selections) => {
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
                                    // const boolean = selected && selected[index] && selected[index] === ingredientName;
                                    // return (
                                    //     <div key={ingredientId} className={`ingredient-item radio-type align-ctr `}>
                                    //         <input className={`${boolean && 'checked'}`} type="radio" name={id} id={ingredientId} checked={boolean} value={ingredientId} onChange={() => handleSelection(index, ingredientName, true)} />
                                    //         <label htmlFor={ingredientId}>{ingredientName}</label>
                                    //     </div>
                                    // )
                                } else {
                                    // const boolean = selected && selected[index] && selected[index].includes(ingredientName);
                                    // return (
                                    //     <label key={ingredientId} className="ingredient-item checkbox-type align-ctr" htmlFor={ingredientId}>
                                    //         <input checked={boolean} className={`${boolean && 'checked'}`} type="checkbox" name="checkbox" id={ingredientId} value={ingredientId} onChange={() => handleSelection(index, ingredientName)} />
                                    //         <span>{ingredientName}</span>
                                    //     </label>
                                    // )
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
        <Loading loaded={isLoaded} checkHeight={checkHeight} image=".hero">
            <div className="admin-menu-page menu-page col align-ctr">
                <img src={hero} alt="hero" className="hero" />
                {mapMenu()}
                <button className="add-category-group-button">+ Add Category Group</button>
                <Footer />
            </div>
        </Loading>
    )
}