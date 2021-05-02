import React, { useEffect, useState } from 'react';
import MenuItem from './MenuItem';

export default function Category(props) {
    const { category, index, screenSize, mini, menuItemToggleFromAdmin } = props;
    const { id, name, image, menuItems } = category;
    const [collapsed, updateCollapsed] = useState(screenSize < mini);
    const [menuItemNum, updateMenuItemNum] = useState(0);

    useEffect(() => {
        handleCollapseWithResize();
        // eslint-disable-next-line
    }, [screenSize]);

    const handleCollapseWithResize = () => {
        if (screenSize < mini) {
            updateCollapsed(true);
        } else {
            updateCollapsed(false);
        }
    }

    const handleCollapse = async (bool) => {
        updateCollapsed(bool);
    }

    const getHeight = () => {
        let height;
        if (screenSize > mini) {
            const numOfItems = menuItems.length;
            const threeLiners = menuItems.filter(item => item.description.length > 80).length;
            const twoLiners = menuItems.filter(item => item.description.length > 40 && item.description.length < 80).length;
            const oneLiner = menuItems.filter(item => item.description.length && item.description.length < 40).length;
            let noDesc = numOfItems - threeLiners - twoLiners - oneLiner;
            height = (275 + (noDesc * 65) + (oneLiner * 80) + (twoLiners * 100) + (threeLiners * 120)) / 2;
        }
        return height;
    }

    const displayMenuItem = () => {
        return menuItems.map(item => {
            return (
                <MenuItem
                    key={'menu-item-' + item.id}
                    item={item}
                    catIndex={index}
                    catCollapsed={collapsed}
                    menuItemToggleFromAdmin={menuItemToggleFromAdmin}
                />
            )
        })
    }

    const addMenuItem = () => {
        menuItems.push({
            id: 'FPO-' + menuItemNum, 
            image: null, 
            name: '',
            range: [5, 10], 
            enabled: true,
            description: '',
            desc_enabled: false
        })

        updateMenuItemNum(menuItemNum + 1);
    }

    return (
        <div className={`category-card col align-ctr ${collapsed && 'collapsed-card'}`}>
            <button
                className="category-name-container flex-btwn align-ctr"
                onClick={() => handleCollapse(!collapsed)}
                disabled={screenSize > mini}>
                <h3 className="category-name">{name}</h3>
                <svg id={`arrow-` + id} className={`category-chevron-arrow ${collapsed && 'inverted'}`} viewBox="0 0 11 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.7387 0.684322L10.2093 0.22601C10.0258 0.0753511 9.81154 0 9.56694 0C9.3173 0 9.10557 0.0753511 8.9314 0.22601L5.50002 3.19558L2.06867 0.226096C1.89453 0.0754366 1.68275 8.5718e-05 1.43321 8.5718e-05C1.18849 8.5718e-05 0.974257 0.0754366 0.790766 0.226096L0.268287 0.684408C0.0893961 0.839112 0 1.0245 0 1.24041C0 1.46035 0.089495 1.64364 0.268263 1.79025L4.86453 5.76785C5.03405 5.92257 5.24576 6 5.5 6C5.74947 6 5.96367 5.9226 6.14239 5.76785L10.7387 1.79025C10.9129 1.63951 11 1.45624 11 1.24041C11 1.02853 10.9129 0.843242 10.7387 0.684322Z" fill="white" /></svg>
            </button>
            <div className={`category-img-and-menu col wrap ${collapsed && 'none'}`} style={{ height: !collapsed && getHeight() }}>
                <img className="category-highlighted-img" src={image} alt="category highlights" />
                {displayMenuItem()}
                <button className="add-item-button mobile" onClick={() => addMenuItem()}>Add Item</button>
            </div>
            <button className="add-item-button desktop" onClick={() => addMenuItem()}>Add Item</button>
        </div>
    )
}