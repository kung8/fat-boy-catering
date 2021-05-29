import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MenuItem from './MenuItem';
import clonedeep from 'lodash.clonedeep';
import socket from '../../_Global/Socket';
import Toast from '../../_Global/Toast';
import { toast } from 'react-toastify';

export default function Category(props) {
    const { category, index, screenSize, mini, menuItemToggleFromAdmin, isLast, removeCategoryGroup, updateMenuItemModal, updateCategory } = props;
    const [editedCategory, updateEditedCategory] = useState(clonedeep(category))
    const { id, name, image, menuItems } = editedCategory;
    const [collapsed, updateCollapsed] = useState(screenSize < mini);
    const [menuItemNum, updateMenuItemNum] = useState(0);
    const [showImage, updateShowImage] = useState(typeof id === 'number' ? true : typeof id === 'string' ? false : true);
    const googleDriveURL = 'https://drive.google.com/uc?export=view&id=';
    const [showArrow, updateShowArrow] = useState(true);
    const [showSave, updateShowSave] = useState(false);
    const [showX, updateShowX] = useState(false);
    const [isPaste, updateIsPaste] = useState(true);
    const [hit, updateHit] = useState(false);

    useEffect(() => {
        handleCollapseWithResize();
        // eslint-disable-next-line
    }, [screenSize]);

    const handleCollapseWithResize = async () => {
        if (screenSize < mini) {
            updateShowSave(false);
            updateShowX(false);
            await updateCollapsed(true);
            updateShowArrow(true);
        } else {
            if (name === '' || name === undefined || image === '' || !image) {
                updateShowX(true);
                updateShowSave(false);
            } else {
                updateShowX(false);
                updateShowSave(true);
            }
            await updateCollapsed(false);
        }
    }

    const handleCollapse = async (bool) => {
        await updateCollapsed(bool);
        await updateShowArrow(true);
        let arrow = document.getElementById(`category-arrow-${index}`);

        if (bool) {
            await updateShowSave(false);
            await updateShowX(false);
            updateShowArrow(true);
        } else {
            await arrow.classList.add('right-side-up');
        }

        setTimeout(async () => {
            if (bool) {
                if (arrow) await arrow.classList.remove('right-side-up');
            } else {
                updateShowArrow(false);
                if (name === '' || name === undefined || !image || image === '') {
                    await updateShowX(true);
                    await updateShowSave(false);
                } else {
                    await updateShowSave(true);
                    await updateShowX(false);
                }
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
        return menuItems.map((item, i) => {
            return (
                <MenuItem
                    key={'menu-item-' + item.id}
                    catIndex={index}
                    item={item}
                    index={i}
                    catCollapsed={collapsed}
                    menuItemToggleFromAdmin={menuItemToggleFromAdmin}
                    screenSize={screenSize}
                    mini={mini}
                    updateMenuItemModal={updateMenuItemModal}
                    catId={id}
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
            category_id: id,
            id: 'FPO-' + menuItemNum,
            image: undefined,
            name: '',
            range: 0,
            enabled: true,
            description: '',
            desc_enabled: false
        })

        await updateEditedCategory(copy);
        updateMenuItemNum(menuItemNum + 1);
    }

    const editCategory = async (prop, value, type) => {
        if (prop === 'image') {
            if (type === 'paste') {
                await updateIsPaste(true);
                await updateHit(true);
            } else {
                updateHit(false);
            }

            if (hit && type === 'change') {
                updateIsPaste(false);
            }
        }

        if (value === '' || name === '' || name === undefined || image === '' || !image) {
            await updateShowX(true);
            await updateShowSave(false);
        } else {
            await updateShowSave(true);
            await updateShowX(false);
        }

        if (prop === 'name' && showArrow) {
            handleCollapse(true);
        }

        const copy = { ...editedCategory };

        if ((isPaste && hit) || (!isPaste && !hit) || prop !== 'image') {
            copy[prop] = value;
            await updateEditedCategory(copy);
            updateIsPaste(false);
        }
    }

    const saveCategory = async () => {
        if (name !== '' && image !== '' && image) {
            const { data } = await axios.put('/api/category/' + id, editedCategory);
            await updateCategory(data, index);
            await updateEditedCategory(data);
            updateShowImage(true);
            socket.emit('update category data', data);
            await toast.dismiss();
            toast(`Updated ${name}!`, { className: 'lime' });
        } else {
            if (typeof id === 'number') {
                await axios.delete('/api/category/' + id);
                socket.emit('delete category data', id);
                await toast.dismiss();
                toast(`Removed ${name} successfully!`, { className: 'lime' });
            } else {
                await toast.dismiss();
                toast(`Removed successfully!`, { className: 'lime' });
            }
            await removeCategoryGroup(index);
        }
        if (screenSize < mini) {
            await updateShowSave(false);
            await updateShowX(false);
        }
    }

    const handleSaving = async (bool) => {
        await saveCategory();
        if (screenSize < mini && checkName() && checkImage()) {
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
                    id={`category-name-${id}`}
                    placeholder="Enter Category Name..."
                    value={name}
                    onClick={() => { if (collapsed) { handleCollapse(false) } }}
                    onChange={e => editCategory('name', e.target.value)}
                />
                {showArrow &&
                    <svg id={`category-arrow-${index}`}
                        onClick={() => handleCollapse(!collapsed)}
                        className={`category-chevron-arrow ${collapsed && 'inverted'}`} viewBox="0 0 448 448" xmlns="http://www.w3.org/2000/svg"><path fill="#ffffff" d="m408 184h-136c-4.417969 0-8-3.582031-8-8v-136c0-22.089844-17.910156-40-40-40s-40 17.910156-40 40v136c0 4.417969-3.582031 8-8 8h-136c-22.089844 0-40 17.910156-40 40s17.910156 40 40 40h136c4.417969 0 8 3.582031 8 8v136c0 22.089844 17.910156 40 40 40s40-17.910156 40-40v-136c0-4.417969 3.582031-8 8-8h136c22.089844 0 40-17.910156 40-40s-17.910156-40-40-40zm0 0" /></svg>}
                {showSave && <svg id={`category-save-${index}`} className={`category-save`} onClick={() => handleSaving(!collapsed)} width="24" height="24" viewBox="-2 -2 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.75781 8.24219H3.24219C3.08039 8.24219 2.94922 8.37336 2.94922 8.53516C2.94922 8.69695 3.08039 8.82812 3.24219 8.82812H6.75781C6.91961 8.82812 7.05078 8.69695 7.05078 8.53516C7.05078 8.37336 6.91961 8.24219 6.75781 8.24219Z" fill="black" /><path d="M6.75781 5.89844H3.24219C3.08039 5.89844 2.94922 6.02961 2.94922 6.19141C2.94922 6.3532 3.08039 6.48438 3.24219 6.48438H6.75781C6.91961 6.48438 7.05078 6.3532 7.05078 6.19141C7.05078 6.02961 6.91961 5.89844 6.75781 5.89844Z" fill="black" /><path d="M6.75781 7.07031H3.24219C3.08039 7.07031 2.94922 7.20148 2.94922 7.36328C2.94922 7.52508 3.08039 7.65625 3.24219 7.65625H6.75781C6.91961 7.65625 7.05078 7.52508 7.05078 7.36328C7.05078 7.20148 6.91961 7.07031 6.75781 7.07031Z" fill="black" /><path d="M6.46484 0H2.36328V2.53906H6.46484V0Z" fill="black" /><path d="M9.91418 1.64832L8.35168 0.0858203C8.29674 0.0308789 8.22223 0 8.14453 0H7.05078V2.83203C7.05078 2.99383 6.91961 3.125 6.75781 3.125H2.07031C1.90852 3.125 1.77734 2.99383 1.77734 2.83203V0H0.292969C0.131172 0 0 0.131172 0 0.292969V9.70703C0 9.86883 0.131172 10 0.292969 10C0.383691 10 9.5852 10 9.70703 10C9.86883 10 10 9.86883 10 9.70703V1.85547C10 1.77777 9.96912 1.70326 9.91418 1.64832ZM7.63672 9.41406H2.36328V5.3125H7.63672V9.41406Z" fill="black" /></svg>}
                {showX && <svg id={`category-x-${index}`} className="category-x" height="20" onClick={() => handleSaving(!collapsed)} viewBox="0 0 365.71733 365" width="20" xmlns="http://www.w3.org/2000/svg"><g fill="#E0115F"><path d="m356.339844 296.347656-286.613282-286.613281c-12.5-12.5-32.765624-12.5-45.246093 0l-15.105469 15.082031c-12.5 12.503906-12.5 32.769532 0 45.25l286.613281 286.613282c12.503907 12.5 32.769531 12.5 45.25 0l15.082031-15.082032c12.523438-12.480468 12.523438-32.75.019532-45.25zm0 0" /><path d="m295.988281 9.734375-286.613281 286.613281c-12.5 12.5-12.5 32.769532 0 45.25l15.082031 15.082032c12.503907 12.5 32.769531 12.5 45.25 0l286.632813-286.59375c12.503906-12.5 12.503906-32.765626 0-45.246094l-15.082032-15.082032c-12.5-12.523437-32.765624-12.523437-45.269531-.023437zm0 0" /></g></svg>}
            </button>
            <div className={`category-img-and-menu col wrap align-ctr ${collapsed && 'none'}`} style={{ height: !collapsed && getHeight() }}>
                {
                    showImage ?
                        <div id="category-image" className={`category-image`} style={{ backgroundImage: `url(${googleDriveURL + image})` }} aria-label={name}>
                            <svg onClick={() => updateShowImage(!showImage)} className="edit-pencil" width="12" height="12" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 7.91646V10.0001H2.08362L8.23169 3.85199L6.14806 1.76837L0 7.91646Z" fill="black" /><path d="M9.83745 1.45992L8.54004 0.162522C8.32334 -0.0541741 7.9705 -0.0541741 7.75381 0.162522L6.737 1.17933L8.82062 3.26295L9.83743 2.24614C10.0542 2.02945 10.0542 1.67661 9.83745 1.45992Z" fill="black" /></svg>
                        </div>
                        :
                        <div className={`category-image-container ${typeof id === 'string' && 'new-category'}`}>
                            <div className="image-label-container align-ctr flex-btwn">
                                <h4>Category Image</h4>
                                <button className="preview-btn flex-ctr">
                                    <svg onClick={() => updateShowImage(!showImage)} id="Layer_2" enableBackground="new 0 0 24 24" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg"><g><path d="m12 21c-5.196 0-9.815-3.067-11.767-7.814-.31-.753-.31-1.618 0-2.371 1.952-4.748 6.571-7.815 11.767-7.815s9.815 3.067 11.767 7.814c.31.753.31 1.618 0 2.371-1.952 4.748-6.571 7.815-11.767 7.815zm0-17c-4.789 0-9.045 2.824-10.842 7.194-.21.512-.21 1.099 0 1.611 1.797 4.371 6.053 7.195 10.842 7.195s9.045-2.824 10.842-7.194c.21-.512.21-1.099 0-1.611-1.797-4.371-6.053-7.195-10.842-7.195z" /></g><g><path d="m12 16c-2.206 0-4-1.794-4-4s1.794-4 4-4 4 1.794 4 4-1.794 4-4 4zm0-7c-1.654 0-3 1.346-3 3s1.346 3 3 3 3-1.346 3-3-1.346-3-3-3z" /></g></svg>
                                </button>
                            </div>
                            <input
                                onChange={(e) => editCategory('image', e.target.value, 'change')}
                                onPaste={(e) => editCategory('image', e.clipboardData.getData('text/plain'), 'paste')}
                                className="item-image-input"
                                placeholder="Hosted Image URL..."
                                type="text"
                                name="image"
                                id={`menu-item-${id}-image`}
                                value={image} />
                        </div>
                }
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
            {Toast}
        </div>
    )
}