import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Footer from '../../_Global/Footer';
import Loading from '../../_Global/Loading';
import Category from './Category';
import MenuItemModal from '../MenuItemModal/MenuItemModal';

export default function AdminMenu(props) {
    const { checkHeight } = props;
    const [hero, updateHero] = useState('');
    const [menu, updateMenu] = useState([]);
    const mini = 700;
    const [screenSize, updateScreenSize] = useState(window.screen.width);
    const [isLoaded, updateIsLoaded] = useState(false);
    const googleDriveURL = 'https://drive.google.com/uc?export=view&id=';
    const [categoryNum, updateCategoryNum] = useState(0);
    const [showMenuItemModal, updateShowMenuItemModal] = useState(false);
    const [menuItemModalData, updateMenuItemModalData] = useState({});
    const [showHero, updateShowHero] = useState(true);

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

    const handleToggle = async (data, reload) => {
        if (Object.keys(data).length === 1) {
            const copy = await menu.map(cat => {
                const foundItemIndex = cat.menuItems.findIndex(item => item.id === data.id)
                if (foundItemIndex > -1) cat.menuItems.splice(foundItemIndex, 1);
                return cat;
            })
            await updateMenu(copy);
        } else {
            const copy = await menu.map(async cat => {
                let menuItems = await cat.menuItems.map(item => {
                    if (item.id === data.id) return data;
                    return item;
                });
                cat.menuItems = menuItems;
                return cat;
            });
            Promise.all(copy).then(async newMenu => {
                await updateMenu(newMenu);
            })
        }

        if (reload) {
            window.location.reload();
        }
    }

    const updateMenuItemModal = (boolean, data) => {
        updateShowMenuItemModal(boolean);
        updateMenuItemModalData(data);
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
                            removeCategoryGroup={removeCategoryGroup}
                            updateMenuItemModal={updateMenuItemModal}
                        />
                    )
                })}
            </div>
        )
    }

    const addCategoryGroup = async () => {
        const lastIndex = menu.length - 1;
        const copy = [...menu];
        copy.push({
            id: 'FPO-' + categoryNum,
            name: undefined,
            image: undefined,
            menuItems: []
        });
        updateCategoryNum(categoryNum + 1);
        await updateMenu(copy);

        document.getElementById('x-cat-item-' + lastIndex)?.classList.remove('none');
    }

    const removeCategoryGroup = async (index) => {
        const copy = [...menu];
        copy.splice(index, 1);
        await updateMenu(copy);
    }

    const handleHeroInput = async (value) => {
        if (value !== "") {
            updateHero(value);
        }
    }

    const editHero = async () => {
        if (hero !== "") {
            await axios.put('/api/menu/hero', { hero });
        }
    }

    return (
        <Loading loaded={isLoaded} checkHeight={checkHeight} image=".hero" showMenuItemModal={showMenuItemModal}>
            <div className="admin-menu-page menu-page col align-ctr">
                {
                    showHero ?
                        <div className="hero" style={{ backgroundImage: `url(${googleDriveURL + hero})` }} aria-label="hero">
                            <svg onClick={() => updateShowHero(!showHero)} className="edit-pencil" width="12" height="12" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 7.91646V10.0001H2.08362L8.23169 3.85199L6.14806 1.76837L0 7.91646Z" fill="black" /><path d="M9.83745 1.45992L8.54004 0.162522C8.32334 -0.0541741 7.9705 -0.0541741 7.75381 0.162522L6.737 1.17933L8.82062 3.26295L9.83743 2.24614C10.0542 2.02945 10.0542 1.67661 9.83745 1.45992Z" fill="black" /></svg>
                        </div>
                        :
                        <div className="hero hero-container">
                            <div className="hero-label-container align-ctr flex-btwn">
                                <h4 className="hero-label">Hero</h4>
                                <button className="preview-btn flex-ctr">
                                    <svg onClick={() => updateShowHero(!showHero)} id="Layer_2" enableBackground="new 0 0 24 24" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg"><g><path d="m12 21c-5.196 0-9.815-3.067-11.767-7.814-.31-.753-.31-1.618 0-2.371 1.952-4.748 6.571-7.815 11.767-7.815s9.815 3.067 11.767 7.814c.31.753.31 1.618 0 2.371-1.952 4.748-6.571 7.815-11.767 7.815zm0-17c-4.789 0-9.045 2.824-10.842 7.194-.21.512-.21 1.099 0 1.611 1.797 4.371 6.053 7.195 10.842 7.195s9.045-2.824 10.842-7.194c.21-.512.21-1.099 0-1.611-1.797-4.371-6.053-7.195-10.842-7.195z" /></g><g><path d="m12 16c-2.206 0-4-1.794-4-4s1.794-4 4-4 4 1.794 4 4-1.794 4-4 4zm0-7c-1.654 0-3 1.346-3 3s1.346 3 3 3 3-1.346 3-3-1.346-3-3-3z" /></g></svg>
                                </button>
                            </div>
                            <div className="hero-input-and-save-container align-ctr flex-btwn">
                                <input onChange={(e) => handleHeroInput(e.target.value)} className="hero-input" placeholder="Hosted Image URL..." type="text" name="image" id={`hero-image`} value={hero} />
                                <svg className="hero-save-btn" onClick={() => editHero()} width="24" height="24" viewBox="-2 -2 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.75781 8.24219H3.24219C3.08039 8.24219 2.94922 8.37336 2.94922 8.53516C2.94922 8.69695 3.08039 8.82812 3.24219 8.82812H6.75781C6.91961 8.82812 7.05078 8.69695 7.05078 8.53516C7.05078 8.37336 6.91961 8.24219 6.75781 8.24219Z" fill="black" /><path d="M6.75781 5.89844H3.24219C3.08039 5.89844 2.94922 6.02961 2.94922 6.19141C2.94922 6.3532 3.08039 6.48438 3.24219 6.48438H6.75781C6.91961 6.48438 7.05078 6.3532 7.05078 6.19141C7.05078 6.02961 6.91961 5.89844 6.75781 5.89844Z" fill="black" /><path d="M6.75781 7.07031H3.24219C3.08039 7.07031 2.94922 7.20148 2.94922 7.36328C2.94922 7.52508 3.08039 7.65625 3.24219 7.65625H6.75781C6.91961 7.65625 7.05078 7.52508 7.05078 7.36328C7.05078 7.20148 6.91961 7.07031 6.75781 7.07031Z" fill="black" /><path d="M6.46484 0H2.36328V2.53906H6.46484V0Z" fill="black" /><path d="M9.91418 1.64832L8.35168 0.0858203C8.29674 0.0308789 8.22223 0 8.14453 0H7.05078V2.83203C7.05078 2.99383 6.91961 3.125 6.75781 3.125H2.07031C1.90852 3.125 1.77734 2.99383 1.77734 2.83203V0H0.292969C0.131172 0 0 0.131172 0 0.292969V9.70703C0 9.86883 0.131172 10 0.292969 10C0.383691 10 9.5852 10 9.70703 10C9.86883 10 10 9.86883 10 9.70703V1.85547C10 1.77777 9.96912 1.70326 9.91418 1.64832ZM7.63672 9.41406H2.36328V5.3125H7.63672V9.41406Z" fill="black" /></svg>
                            </div>
                        </div>
                }

                {mapMenu()}
                <button onClick={() => addCategoryGroup()} className="add-category-group-button">+ Add Additional Category</button>
                {
                    showMenuItemModal &&
                    <MenuItemModal
                        key="menu-item-modal"
                        menuItemModalData={menuItemModalData}
                        updateShowMenuItemModal={updateShowMenuItemModal}
                        menuItemToggleFromAdmin={handleToggle}
                    />
                }
                <Footer />
            </div>
        </Loading>
    )
}