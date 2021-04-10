import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Menu(props) {
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

    const handleScreenResize = () => {
        window.addEventListener('resize', async () => {
            await getScreenWidth(screenSize);
            initializeCollapse();
        })
    }

    const getScreenWidth = async () => {
        let width = window.screen.width;
        await updateScreenSize(width);
    }

    const getMenuPageData = async () => {
        const { data } = await axios.get('/api/page/menu');
        const { hero, menu } = data;
        updateHero(hero);
        await updateMenu(menu);
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

    const mapMenu = () => {
        return (
            <div className="menu">
                {menu.map((category, index) => {
                    const { categoryId, categoryName, categoryImage, menuItems } = category;
                    const collapsed = isCollapsedArr && isCollapsedArr[index];

                    return (
                        <div key={categoryId} className={`category-card ${collapsed && 'collapsed-card'}`}>
                            <button className="category-name-container flex-btwn align-ctr" onClick={() => handleCollapse(index, !isCollapsedArr[index])} disabled={screenSize > mini}>
                                <h3 className="category-name">{categoryName}</h3>
                                <svg id={`arrow-` + index} className={`category-chevron-arrow ${collapsed && 'inverted'}`} viewBox="0 0 11 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.7387 0.684322L10.2093 0.22601C10.0258 0.0753511 9.81154 0 9.56694 0C9.3173 0 9.10557 0.0753511 8.9314 0.22601L5.50002 3.19558L2.06867 0.226096C1.89453 0.0754366 1.68275 8.5718e-05 1.43321 8.5718e-05C1.18849 8.5718e-05 0.974257 0.0754366 0.790766 0.226096L0.268287 0.684408C0.0893961 0.839112 0 1.0245 0 1.24041C0 1.46035 0.089495 1.64364 0.268263 1.79025L4.86453 5.76785C5.03405 5.92257 5.24576 6 5.5 6C5.74947 6 5.96367 5.9226 6.14239 5.76785L10.7387 1.79025C10.9129 1.63951 11 1.45624 11 1.24041C11 1.02853 10.9129 0.843242 10.7387 0.684322Z" fill="white" /></svg>
                            </button>
                            <div className={`category-img-and-menu col wrap ${collapsed && 'none'}`} >
                                <img className="category-highlighted-img" src={categoryImage} alt="category highlights" />
                                {menuItems.map(item => {
                                    const { id, name, description } = item;
                                    return (
                                        <button key={id} className="menu-item-card">
                                            <h4>{name}</h4>
                                            {description && <p className="menu-item-description">{description}</p>}
                                            <svg className="item-chevron-arrow" viewBox="0 0 6 11" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.684322 0.261289L0.22601 0.790717C0.0753511 0.974183 0 1.18846 0 1.43306C0 1.6827 0.0753511 1.89443 0.22601 2.0686L3.19558 5.49998L0.226096 8.93133C0.0754366 9.10547 8.5718e-05 9.31725 8.5718e-05 9.56679C8.5718e-05 9.81151 0.0754366 10.0257 0.226096 10.2092L0.684408 10.7317C0.839112 10.9106 1.0245 11 1.24041 11C1.46035 11 1.64364 10.9105 1.79025 10.7317L5.76785 6.13547C5.92257 5.96595 6 5.75424 6 5.5C6 5.25053 5.9226 5.03633 5.76785 4.85761L1.79025 0.261313C1.63951 0.0871458 1.45624 0 1.24041 0C1.02853 -2.47955e-05 0.843242 0.087121 0.684322 0.261289Z" fill="black" /></svg>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }

    return (
        <div className="menu-page" onScroll={() => checkHeight('.hero')}>
            <img src={hero} alt="hero" className="hero" />
            {mapMenu()}
        </div>
    )
}