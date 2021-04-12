import React, { useState, useEffect } from 'react';
import Footer from './Footer';
import axios from 'axios';

export default function AdminMenu(props) {
    const { checkHeight } = props;
    const [hero, updateHero] = useState('');
    const [menu, updateMenu] = useState([]);
    const [isCollapsedArr, updateIsCollapsedArr] = useState([]);
    const mini = 700;
    const [screenSize, updateScreenSize] = useState(window.screen.width);

    useEffect(() => {
        getMenuPageData();
        getScreenWidth();
        initializeCollapse();
        handleScreenResize();
    }, [screenSize]);

    const getMenuPageData = async () => {
        const { data } = await axios.get('/api/menu');
        const { hero, menu } = data;
        updateHero(hero);
        await updateMenu(menu);
    }

    const getScreenWidth = async () => {
        let width = window.screen.width;
        await updateScreenSize(width);
    }

    const initializeCollapse = async () => {
        let arrLength = menu.length;
        let newIsCollapsedArr = [...isCollapsedArr];
        let bool = screenSize < mini;
        for (let num = 0; num < arrLength; num++) {
            newIsCollapsedArr[num] = bool;
        }
        await updateIsCollapsedArr(newIsCollapsedArr);
    }

    const handleScreenResize = () => {
        window.addEventListener('resize', async () => {
            await getScreenWidth();
            await initializeCollapse();
        });
    }

    const handleCollapse = async (index, bool) => {
        let isCollapsedArrCopy = [...isCollapsedArr];
        isCollapsedArrCopy[index] = bool;
        await updateIsCollapsedArr(isCollapsedArrCopy);

        if (!bool) {
            document.getElementById('arrow-' + index).classList.add('right-side-up');
        } else {
            document.getElementById('arrow-' + index).classList.remove('right-side-up');
        }
    }

    const handleToggle = async (id, index) => {
        console.log({ id, index });
        const copy = [...menu];
        const { menuItems } = copy[index];
        const menuItemIndex = menuItems.findIndex(item => item.id === id);
        console.log(menuItemIndex, menuItems[menuItemIndex]);
        let enabled = menuItems[menuItemIndex].enabled;
        copy[index].menuItems[menuItemIndex].enabled = !enabled;
        await updateMenu(copy);
    }

    const mapMenu = () => {
        return (
            <div className="menu">
                {menu.map((category, index) => {
                    const { categoryId, categoryName, categoryImage, menuItems } = category;
                    const collapsed = isCollapsedArr && isCollapsedArr[index];

                    let height;
                    if (screenSize > mini) {
                        const numOfItems = menuItems.length;
                        const threeLiners = menuItems.filter(item => item.description.length > 80).length;
                        const twoLiners = menuItems.filter(item => item.description.length > 40 && item.description.length < 80).length;
                        const oneLiner = menuItems.filter(item => item.description.length && item.description.length < 40).length;
                        let noDesc = numOfItems - threeLiners - twoLiners - oneLiner;
                        height = (250 + (noDesc * 65) + (oneLiner * 80) + (twoLiners * 100) + (threeLiners * 120)) / 2;
                    }

                    return (
                        <div key={categoryId} className={`category-card col align-ctr ${collapsed && 'collapsed-card'}`}>
                            <button className="category-name-container flex-btwn align-ctr" onClick={() => handleCollapse(index, !isCollapsedArr[index])} disabled={screenSize > mini}>
                                <h3 className="category-name">{categoryName}</h3>
                                <svg id={`arrow-` + index} className={`category-chevron-arrow ${collapsed && 'inverted'}`} viewBox="0 0 11 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.7387 0.684322L10.2093 0.22601C10.0258 0.0753511 9.81154 0 9.56694 0C9.3173 0 9.10557 0.0753511 8.9314 0.22601L5.50002 3.19558L2.06867 0.226096C1.89453 0.0754366 1.68275 8.5718e-05 1.43321 8.5718e-05C1.18849 8.5718e-05 0.974257 0.0754366 0.790766 0.226096L0.268287 0.684408C0.0893961 0.839112 0 1.0245 0 1.24041C0 1.46035 0.089495 1.64364 0.268263 1.79025L4.86453 5.76785C5.03405 5.92257 5.24576 6 5.5 6C5.74947 6 5.96367 5.9226 6.14239 5.76785L10.7387 1.79025C10.9129 1.63951 11 1.45624 11 1.24041C11 1.02853 10.9129 0.843242 10.7387 0.684322Z" fill="white" /></svg>
                            </button>
                            <div className={`category-img-and-menu col wrap ${collapsed && 'none'}`} style={{ minHeight: !collapsed && height }}>
                                <img className="category-highlighted-img" src={categoryImage} alt="category highlights" />
                                {menuItems.map(item => {
                                    const { id, name, description, enabled } = item;
                                    return (
                                        <button key={id} className="menu-item-card align-ctr">
                                            <div className={`radio-toggle-button align-ctr flex-btwn ${!enabled && 'reversed'}`} onClick={() => handleToggle(id, index)}>
                                                <span className="button-text">{enabled ? 'ON' : 'OFF'}</span>
                                                <div className="circle-button"></div>
                                            </div>
                                            <div>
                                                <h4>{name}</h4>
                                                {description && <p className="menu-item-description">{description}</p>}
                                            </div>
                                        </button>
                                    )
                                })}
                                <button className="add-item-button mobile">Add Item</button>
                            </div>
                            <button className="add-item-button desktop">Add Item</button>
                        </div>
                    )
                })}
            </div>
        )
    }

    return (
        <div className="admin-menu-page menu-page col align-ctr" onScroll={() => checkHeight('.hero')}>
            <img src={hero} alt="hero" className="hero" />
            {mapMenu()}
            <button className="add-category-group-button">+ Add Category Group</button>
            <Footer />
        </div>
    )
}