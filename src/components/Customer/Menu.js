import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Footer from '../_Global/Footer';
import Loading from '../_Global/Loading';
import socket from '../_Global/Socket';
import OutOfOfficeMessage from '../_Global/OutOfOfficeMessage';

export default function Menu(props) {
    const { checkHeight, updateCartNum } = props;
    const [hero, updateHero] = useState('');
    const [menu, updateMenu] = useState([]);
    const [isCollapsedArr, updateIsCollapsedArr] = useState([]);
    const mini = 700;
    const [screenSize, updateScreenSize] = useState(window.screen.width);
    const [isLoaded, updateIsLoaded] = useState(false);
    const googleDriveURL = 'https://drive.google.com/uc?export=view&id=';
    const [room, updateRoom] = useState(null);
    const [outOfOfficeMessage, updateOutOfOfficeMessage] = useState(null);
    const [outOfOfficeMessageEnabled, updateOutOfOfficeMessageEnabled] = useState(false);
    const [user, updateUser] = useState(null);

    useEffect(() => {
        getLocalStorageCart();
        getLocalStorageUser();
        initialization();
        if (!room) {
            socket.emit('join page');
            socket.on('joined successfully', async roomName => await updateRoom(roomName));
            initializeCollapse(menu);
            socket.on('updated menu data', async data => {
                await updateMenu(data);
                initialization();
            });
            socket.on('updated category data', async data => {
                let copy = [...menu];
                let catIndex = copy.findIndex(cat => cat.id === data.id);
                if (catIndex > -1) copy[catIndex] = data;
                await updateMenu(copy);
                initialization();
            });
            socket.on('deleted category data', async id => {
                let copy = [...menu];
                let catIndex = copy.findIndex(cat => cat.id === id);
                if (catIndex > -1) copy.splice(catIndex, 1);
                await updateMenu(copy);
                initialization();
            });
            socket.on('updated out of office message', async message => {
                if (!localStorage.getItem('seen-out-of-office-message')) {
                    updateOutOfOfficeMessage(message);
                }
                if (!message && localStorage.getItem('seen-out-of-office-message')) {
                    localStorage.removeItem('seen-out-of-office-message');
                }
            });
        }
        // eslint-disable-next-line
    }, [screenSize]);

    const initialization = async () => {
        let menuData = await getMenuPageData();
        await getScreenWidth();
        await initializeCollapse(menuData);
        await handleScreenResize();
    }

    const getLocalStorageCart = async () => {
        let cart = await localStorage.getItem('cart');

        if (cart) {
            cart = Object.values(JSON.parse(cart));
            let values = cart.filter(item => item.qty > 0);
            localStorage.setItem('cart', JSON.stringify(values));
            cart = values;
            await updateCartNum(cart.length);
        }
    }

    const getLocalStorageUser = async () => {
        let user = await localStorage.getItem('user');

        if (user) {
            updateUser(user);
        }
    }

    const getMenuPageData = async () => {
        const { data } = await axios.get('/api/menu');
        const { hero, menu, message } = data;
        await updateHero(hero);
        await updateMenu(menu);
        if (!localStorage.getItem('seen-out-of-office-message')) {
            updateOutOfOfficeMessage(message.message);
            updateOutOfOfficeMessageEnabled(message.enabled);
        }
        await updateIsLoaded(true);
        return menu;
    }

    const getScreenWidth = async () => {
        let width = window.screen.width;
        await updateScreenSize(width);
    }

    const initializeCollapse = async (menuData) => {
        let arrLength = menuData.length;
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
            await initializeCollapse(menu);
        });
    }

    const handleCollapse = async (index, bool, categoryId) => {
        let isCollapsedArrCopy = [...isCollapsedArr];
        isCollapsedArrCopy[index] = bool;
        await updateIsCollapsedArr(isCollapsedArrCopy);

        if (!bool) {
            document.getElementById('arrow-' + categoryId).classList.add('right-side-up');
        } else {
            document.getElementById('arrow-' + categoryId).classList.remove('right-side-up');
        }
    }

    const routeToMenuItem = (id) => {
        props.history.push('/' + id);
    }

    const roundToEven = (num) => num % 2 !== 0 ? num + 1 : num;

    const mapMenu = () => {
        return (
            <div className="menu">
                {menu.map((category, index) => {
                    const { id: categoryId, name, image, menuItems } = category;
                    const collapsed = isCollapsedArr && isCollapsedArr[index];

                    const numOfEnabled = menuItems.filter(item => item.enabled).length;

                    let height;
                    if (screenSize > mini) {
                        let imageHeight = document.getElementById(`category-img-${index}`)?.offsetHeight;
                        if (!imageHeight) imageHeight = 275;
                        const numOfItems = menuItems.length;
                        const threeLiners = menuItems.filter(item => item.description.length > 80).length;
                        const twoLiners = menuItems.filter(item => item.description.length > 40 && item.description.length < 80).length;
                        const oneLiner = menuItems.filter(item => item.description.length && item.description.length < 40).length;
                        let noDesc = numOfItems - threeLiners - twoLiners - oneLiner;
                        const totalHeight = (imageHeight + 4) + (noDesc * 66) + (oneLiner * 80) + (twoLiners * 100) + (threeLiners * 120);
                        height = roundToEven(totalHeight / 2);
                        if (height < imageHeight) height = imageHeight;
                    }

                    if (numOfEnabled > 0) {
                        return (
                            <div key={categoryId} className={`category-card ${collapsed && 'collapsed-card'}`}>
                                <button className="category-name-container flex-btwn align-ctr" onClick={() => handleCollapse(index, !isCollapsedArr[index], categoryId)} disabled={screenSize > mini}>
                                    <h3 className="category-name">{name.replace("`", "'")}</h3>
                                    <svg id={`arrow-` + categoryId} className={`category-chevron-arrow ${collapsed && 'inverted'}`} viewBox="0 0 448 448" xmlns="http://www.w3.org/2000/svg"><path fill="#ffffff" d="m408 184h-136c-4.417969 0-8-3.582031-8-8v-136c0-22.089844-17.910156-40-40-40s-40 17.910156-40 40v136c0 4.417969-3.582031 8-8 8h-136c-22.089844 0-40 17.910156-40 40s17.910156 40 40 40h136c4.417969 0 8 3.582031 8 8v136c0 22.089844 17.910156 40 40 40s40-17.910156 40-40v-136c0-4.417969 3.582031-8 8-8h136c22.089844 0 40-17.910156 40-40s-17.910156-40-40-40zm0 0" /></svg>
                                </button>
                                <div className={`category-img-and-menu col wrap ${collapsed && 'none'}`} style={{ height: !collapsed && height }}>
                                    <img id={`category-img-${index}`} className="category-highlighted-img" src={googleDriveURL + image} alt="category highlights" />
                                    {menuItems.map(item => {
                                        const { id, name, description, enabled } = item;
                                        if (enabled) {
                                            return (
                                                <button key={id} className="menu-item-card" onClick={() => routeToMenuItem(id)}>
                                                    <h4>{name}</h4>
                                                    {description && <p className="menu-item-description">{description}</p>}
                                                    <svg className="item-chevron-arrow" viewBox="0 0 6 11" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.684322 0.261289L0.22601 0.790717C0.0753511 0.974183 0 1.18846 0 1.43306C0 1.6827 0.0753511 1.89443 0.22601 2.0686L3.19558 5.49998L0.226096 8.93133C0.0754366 9.10547 8.5718e-05 9.31725 8.5718e-05 9.56679C8.5718e-05 9.81151 0.0754366 10.0257 0.226096 10.2092L0.684408 10.7317C0.839112 10.9106 1.0245 11 1.24041 11C1.46035 11 1.64364 10.9105 1.79025 10.7317L5.76785 6.13547C5.92257 5.96595 6 5.75424 6 5.5C6 5.25053 5.9226 5.03633 5.76785 4.85761L1.79025 0.261313C1.63951 0.0871458 1.45624 0 1.24041 0C1.02853 -2.47955e-05 0.843242 0.087121 0.684322 0.261289Z" fill="black" /></svg>
                                                </button>
                                            )
                                        }
                                        return null;
                                    })}
                                </div>
                            </div>
                        )
                    } else {
                        return null;
                    }
                })}
            </div>
        )
    }

    const backToAdminPageContainer = () => {
        if (user) {
            return (
                <>
                    <button className="preview-customer-page" onClick={() => props.history.push('/admin')}>Back to Admin Page</button>
                    <hr className="separating-line" />
                </>
            )
        } else {
            return null;
        }
    }

    return (
        <Loading loaded={isLoaded} checkHeight={checkHeight} image='.hero'>
            <div className="menu-page col align-ctr">
                <img src={googleDriveURL + hero} alt="hero" className="hero" />
                {mapMenu()}
                {backToAdminPageContainer()}
                <Footer />
                {outOfOfficeMessageEnabled && outOfOfficeMessage && <OutOfOfficeMessage message={outOfOfficeMessage} />}
            </div>
        </Loading>
    )
}