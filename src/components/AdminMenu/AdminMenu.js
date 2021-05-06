import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Footer from '../Footer';
import Loading from '../Loading';
import Category from './Category';
import { toast } from 'react-toastify'
import Toast from '../Toast';

export default function AdminMenu(props) {
    const { checkHeight } = props;
    const [hero, updateHero] = useState('');
    const [menu, updateMenu] = useState([]);
    const mini = 700;
    const [screenSize, updateScreenSize] = useState(window.screen.width);
    const [isLoaded, updateIsLoaded] = useState(false);
    const googleDriveURL = 'https://drive.google.com/uc?export=view&id=';
    const [categoryNum, updateCategoryNum] = useState(0);

    useEffect(() => {
        getAdminMenuPageData();
        getScreenWidth();
        handleScreenResize();
        // eslint-disable-next-line
    }, [screenSize]);

    const getAdminMenuPageData = async () => {
        const { data } = await axios.get('/api/menu/admin');
        const { hero, menu } = data;
        updateHero(hero);
        await updateMenu(menu);
        await updateIsLoaded(true);
    }

    const getScreenWidth = async () => {
        let width = window.screen.width;
        await updateScreenSize(width);
    }

    const handleScreenResize = () => {
        window.addEventListener('resize', async () => {
            await getScreenWidth();
        });
    }

    const updateCategory = async (arr, index) => {
        const copy = [...menu];
        copy[index] = arr;
        await updateMenu(copy);
    }

    const handleToggle = async (data) => {
        if (Object.keys(data).length === 1) {
            const copy = await menu.map(cat => {
                const foundItemIndex = cat.menuItems.findIndex(item => item.id === data.id)
                if (foundItemIndex > -1) cat.menuItems.splice(foundItemIndex, 1);
                return cat;
            })
            await updateMenu(copy);
        } else {
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
    }

    const showToast = (text, color) => {
        toast(text, { className: color })
    }

    const mapMenu = () => {
        return (
            <div className="menu">
                {menu.map((category, index) => {
                    return (
                        <Category
                            key={'category-' + category.id}
                            category={category}
                            index={index}
                            screenSize={screenSize}
                            mini={mini}
                            menuItemToggleFromAdmin={handleToggle}
                            updateCategory={updateCategory}
                            isLast={menu.length - 1 === index}
                            showToast={showToast}
                        />
                    )
                })}
            </div>
        )
    }

    const addCategoryGroup = () => {
        const copy = [...menu];
        copy.push({
            id: 'FPO-' + categoryNum,
            name: undefined,
            image: undefined,
            menuItems: []
        });
        updateCategoryNum(categoryNum + 1);
        updateMenu(copy);
    }

    return (
        <Loading loaded={isLoaded} checkHeight={checkHeight} image=".hero">
            <div className="admin-menu-page menu-page col align-ctr">
                <img src={googleDriveURL + hero} alt="hero" className="hero" />
                {mapMenu()}
                <button onClick={() => addCategoryGroup()} className="add-category-group-button">+ Add Additional Category</button>
                {Toast}
                <Footer />
            </div>
        </Loading>
    )
}