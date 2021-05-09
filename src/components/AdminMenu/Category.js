import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MenuItem from './MenuItem';
import clonedeep from 'lodash.clonedeep';

export default function Category(props) {
    const { category, index, screenSize, mini, menuItemToggleFromAdmin, isLast, removeCategoryGroup, updateMenuItemModal } = props;
    const [editedCategory, updateEditedCategory] = useState(clonedeep(category))
    const { id, name, image, menuItems } = editedCategory;
    const [collapsed, updateCollapsed] = useState(screenSize < mini);
    const [menuItemNum, updateMenuItemNum] = useState(0);
    const [showImage, updateShowImage] = useState(typeof id === 'number' ? true : typeof id === 'string' ? false : true);
    const googleDriveURL = 'https://drive.google.com/uc?export=view&id=';

    useEffect(() => {
        handleCollapseWithResize();
        // eslint-disable-next-line
    }, [screenSize]);

    const handleCollapseWithResize = () => {
        if (screenSize < mini) {
            document.getElementById('save-' + index)?.classList.add('none');
            document.getElementById('x-cat-item-' + index)?.classList.add('none');
            updateCollapsed(true);
        } else {
            document.getElementById('save-' + index)?.classList.remove('none');
            updateCollapsed(false);
        }
    }

    const handleCollapse = async (bool) => {
        updateCollapsed(bool);
        let arrow = document.getElementById('arrow-' + index);
        let saveOrX = document.getElementById('save-' + index) || document.getElementById('x-cat-item-' + index);

        if (bool) {
            saveOrX.classList.add('none');
            arrow.classList.remove('none');
        } else {
            arrow.classList.add('right-side-up');
        }

        setTimeout(() => {
            if (bool) {
                arrow.classList.remove('right-side-up');
            } else {
                arrow.classList.add('none');
                saveOrX.classList.remove('none');
            }
        }, 225);
    }

    const getHeight = () => {
        let height;
        if (menuItems.length > 0 && screenSize > mini) {
            const numOfItems = menuItems.length;
            const threeLiners = menuItems.filter(item => item.description && item.description.length > 80).length;
            const twoLiners = menuItems.filter(item => item.description && item.description.length > 40 && item.description.length < 80).length;
            const oneLiner = menuItems.filter(item => item.description && item.description.length && item.description.length < 40).length;
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
                    screenSize={screenSize}
                    mini={mini}
                    updateMenuItemModal={updateMenuItemModal}
                />
            )
        })
    }

    const addMenuItem = async () => {
        const copy = { ...category };
        if (!copy.menuItems) {
            copy.menuItems = [];
        }

        copy.menuItems.push({
            id: 'FPO-' + menuItemNum,
            image: undefined,
            name: '',
            range: [5, 10],
            enabled: true,
            description: '',
            desc_enabled: false
        })

        await updateEditedCategory(copy)
        updateMenuItemNum(menuItemNum + 1);
    }

    const editCategory = async (prop, value) => {
        const copy = { ...editedCategory };
        copy[prop] = value;
        await updateEditedCategory(copy);
    }

    const saveCategory = async () => {
        let check1 = await checkName();
        let check2 = await checkImage();
        if (check1 && check2) {
            const { data } = await axios.put('/api/category/' + id, editedCategory);
            await updateEditedCategory(data);
            updateShowImage(true);
        } else {
            if (typeof id === 'number') {
                await axios.delete('/api/category/' + id);
            }
            await removeCategoryGroup(index);
        }

        return { check1, check2 };
    }

    const handleSaving = async (bool) => {
        let { check1, check2 } = await saveCategory();
        if (screenSize < mini && check1 && check2) {
            await handleCollapse(bool);
        }
    }

    const checkName = async () => {
        if (name && name.length > 0) {
            return true;
        }
        return false;
    }

    const checkImage = async () => {
        if (image && image.length > 0) {
            return true;
        }
        return false;
    }

    return (
        <div className={`category-card col align-ctr ${collapsed && 'collapsed-card'} ${isLast && !collapsed && 'extra-spacing'}`}>
            <button
                className="category-name-container flex-btwn align-ctr"
                disabled={screenSize > mini}>
                <input
                    className="category-name"
                    type="text"
                    name="name"
                    id="category-name"
                    placeholder="Enter Category Name..."
                    value={name}
                    onChange={(e) => editCategory('name', e.target.value)}
                />
                <svg id={`arrow-` + index}
                    onClick={() => handleCollapse(!collapsed)}
                    className={`category-chevron-arrow ${collapsed && 'inverted'}`}
                    viewBox="0 0 11 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.7387 0.684322L10.2093 0.22601C10.0258 0.0753511 9.81154 0 9.56694 0C9.3173 0 9.10557 0.0753511 8.9314 0.22601L5.50002 3.19558L2.06867 0.226096C1.89453 0.0754366 1.68275 8.5718e-05 1.43321 8.5718e-05C1.18849 8.5718e-05 0.974257 0.0754366 0.790766 0.226096L0.268287 0.684408C0.0893961 0.839112 0 1.0245 0 1.24041C0 1.46035 0.089495 1.64364 0.268263 1.79025L4.86453 5.76785C5.03405 5.92257 5.24576 6 5.5 6C5.74947 6 5.96367 5.9226 6.14239 5.76785L10.7387 1.79025C10.9129 1.63951 11 1.45624 11 1.24041C11 1.02853 10.9129 0.843242 10.7387 0.684322Z" fill="white" /></svg>
                {
                    name !== '' && image ?
                        <svg id={`save-` + index} className={`save-cat-${index} category-save`} onClick={() => handleSaving(!collapsed)} width="24" height="24" viewBox="-2 -2 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.75781 8.24219H3.24219C3.08039 8.24219 2.94922 8.37336 2.94922 8.53516C2.94922 8.69695 3.08039 8.82812 3.24219 8.82812H6.75781C6.91961 8.82812 7.05078 8.69695 7.05078 8.53516C7.05078 8.37336 6.91961 8.24219 6.75781 8.24219Z" fill="black" /><path d="M6.75781 5.89844H3.24219C3.08039 5.89844 2.94922 6.02961 2.94922 6.19141C2.94922 6.3532 3.08039 6.48438 3.24219 6.48438H6.75781C6.91961 6.48438 7.05078 6.3532 7.05078 6.19141C7.05078 6.02961 6.91961 5.89844 6.75781 5.89844Z" fill="black" /><path d="M6.75781 7.07031H3.24219C3.08039 7.07031 2.94922 7.20148 2.94922 7.36328C2.94922 7.52508 3.08039 7.65625 3.24219 7.65625H6.75781C6.91961 7.65625 7.05078 7.52508 7.05078 7.36328C7.05078 7.20148 6.91961 7.07031 6.75781 7.07031Z" fill="black" /><path d="M6.46484 0H2.36328V2.53906H6.46484V0Z" fill="black" /><path d="M9.91418 1.64832L8.35168 0.0858203C8.29674 0.0308789 8.22223 0 8.14453 0H7.05078V2.83203C7.05078 2.99383 6.91961 3.125 6.75781 3.125H2.07031C1.90852 3.125 1.77734 2.99383 1.77734 2.83203V0H0.292969C0.131172 0 0 0.131172 0 0.292969V9.70703C0 9.86883 0.131172 10 0.292969 10C0.383691 10 9.5852 10 9.70703 10C9.86883 10 10 9.86883 10 9.70703V1.85547C10 1.77777 9.96912 1.70326 9.91418 1.64832ZM7.63672 9.41406H2.36328V5.3125H7.63672V9.41406Z" fill="black" /></svg>
                        :
                        <svg id={`x-cat-item-` + index} height="20" onClick={() => handleSaving(!collapsed)} viewBox="0 0 365.71733 365" width="20" xmlns="http://www.w3.org/2000/svg"><g fill="#E0115F"><path d="m356.339844 296.347656-286.613282-286.613281c-12.5-12.5-32.765624-12.5-45.246093 0l-15.105469 15.082031c-12.5 12.503906-12.5 32.769532 0 45.25l286.613281 286.613282c12.503907 12.5 32.769531 12.5 45.25 0l15.082031-15.082032c12.523438-12.480468 12.523438-32.75.019532-45.25zm0 0" /><path d="m295.988281 9.734375-286.613281 286.613281c-12.5 12.5-12.5 32.769532 0 45.25l15.082031 15.082032c12.503907 12.5 32.769531 12.5 45.25 0l286.632813-286.59375c12.503906-12.5 12.503906-32.765626 0-45.246094l-15.082032-15.082032c-12.5-12.523437-32.765624-12.523437-45.269531-.023437zm0 0" /></g></svg>
                }
            </button>
            <div className={`category-img-and-menu col wrap align-ctr ${collapsed && 'none'}`} style={{ height: !collapsed && getHeight() }}>
                {
                    showImage ?
                        <div id="category-image" className={`category-image`} style={{ backgroundImage: `url(${googleDriveURL + image})` }} aria-label={name}>
                            <svg onClick={() => updateShowImage(!showImage)} className="edit-pencil" width="12" height="12" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 7.91646V10.0001H2.08362L8.23169 3.85199L6.14806 1.76837L0 7.91646Z" fill="black" /><path d="M9.83745 1.45992L8.54004 0.162522C8.32334 -0.0541741 7.9705 -0.0541741 7.75381 0.162522L6.737 1.17933L8.82062 3.26295L9.83743 2.24614C10.0542 2.02945 10.0542 1.67661 9.83745 1.45992Z" fill="black" /></svg>
                        </div>
                        :
                        <div className="category-image-container">
                            <div className="image-label-container align-ctr flex-btwn">
                                <h4>Category Image</h4>
                                <button className="preview-btn flex-ctr">
                                    <svg onClick={() => updateShowImage(!showImage)} id="Layer_2" enableBackground="new 0 0 24 24" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg"><g><path d="m12 21c-5.196 0-9.815-3.067-11.767-7.814-.31-.753-.31-1.618 0-2.371 1.952-4.748 6.571-7.815 11.767-7.815s9.815 3.067 11.767 7.814c.31.753.31 1.618 0 2.371-1.952 4.748-6.571 7.815-11.767 7.815zm0-17c-4.789 0-9.045 2.824-10.842 7.194-.21.512-.21 1.099 0 1.611 1.797 4.371 6.053 7.195 10.842 7.195s9.045-2.824 10.842-7.194c.21-.512.21-1.099 0-1.611-1.797-4.371-6.053-7.195-10.842-7.195z" /></g><g><path d="m12 16c-2.206 0-4-1.794-4-4s1.794-4 4-4 4 1.794 4 4-1.794 4-4 4zm0-7c-1.654 0-3 1.346-3 3s1.346 3 3 3 3-1.346 3-3-1.346-3-3-3z" /></g></svg>
                                </button>
                            </div>
                            <input onChange={(e) => editCategory('image', e.target.value)} className="item-image-input" placeholder="Hosted Image URL..." type="text" name="image" id={`menu-item-${id}-image`} value={image} />
                        </div>
                }
                {/* <img className="category-highlighted-img" src={googleDriveURL + image} alt="category highlights" /> */}
                {displayMenuItem()}
                {typeof id === 'number'
                    &&
                    <button className="add-item-button mobile" onClick={() => addMenuItem()}>Add Item</button>
                }
            </div>
            {
                typeof id === 'number'
                &&
                <button className="add-item-button desktop" onClick={() => addMenuItem()}>Add Item</button>
            }
        </div>
    )
}