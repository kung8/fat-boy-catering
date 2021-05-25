import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Selection from './Selection';
import cloneDeep from 'lodash.clonedeep';
import Toast from '../../_Global/Toast';
import { toast } from 'react-toastify';

export default function MenuItem(props) {
    const { index, item, catIndex, catId, catCollapsed, menuItemToggleFromAdmin, screenSize, mini, updateMenuItemModal } = props;
    const [collapsed, updateCollasped] = useState(true);
    const [editedItem, updateEditedItem] = useState(cloneDeep(item));
    const { enabled } = item;
    const { id, name, description, image, selections, range } = editedItem;
    const [selectionNum, updateSelectionNum] = useState(1);
    const [showImage, updateShowImage] = useState(image ? true : false);
    const googleDriveURL = 'https://drive.google.com/uc?export=view&id=';
    const [showArrow, updateShowArrow] = useState(true);
    const [showSave, updateShowSave] = useState(false);
    const [showX, updateShowX] = useState(false);

    useEffect(() => {
        updateCollapsedWithCatChange();
        // eslint-disable-next-line
    }, [catCollapsed])

    const updateCollapsedWithCatChange = () => {
        if (catCollapsed) {
            updateCollasped(true);
        }
        updateShowSave(false);
        updateShowX(false);
    }

    const handleItemCollapse = async (bool) => {
        await updateCollasped(bool);
        updateShowArrow(true);
        let arrow = document.getElementById(`menu-item-arrow-${catIndex}-${index}`);

        if (bool) {
            updateShowSave(false);
            updateShowX(false);
            updateShowArrow(true);
        } else {
            await arrow.classList.add('right-side-up');
        }

        setTimeout(async () => {
            if (bool) {
                await arrow.classList.remove('right-side-up');
            } else {
                updateShowArrow(false);
                if (name === '') {
                    updateShowX(true)
                    updateShowSave(false);
                } else {
                    updateShowSave(true);
                    updateShowX(false);
                }
            }
        }, 250);
    }

    const handleMenuItemToggle = async () => {
        if (typeof id === 'number') {
            item.enabled = !enabled;
            const { data } = await axios.put('/api/menu/' + id + '/enabled', { item });
            await menuItemToggleFromAdmin(data);
        }
    }

    const handleEdit = async (prop, value) => {
        const copy = Object.assign({}, editedItem);
        copy[prop] = value;
        await updateEditedItem(copy);

        if (prop === 'name' && value === '') {
            updateShowSave(false);
            updateShowX(true);
        } else {
            updateShowX(false);
            updateShowSave(true);
        }
    }

    const sendEditToSave = async (boolean) => {
        const copy = Object.assign({}, editedItem);
        const original = { ...item };
        const deleted = {};
        const created = {};

        if (copy.name === '' && original.name && showSave) {
            copy.name = original.name;
        } else if (copy.name === '' || !copy.name) {
            await menuItemToggleFromAdmin({ id, index: catIndex, menuItemIndex: index, catId }, true);
            return;
        }

        let old = {};
        let oldIng = {};

        if (original.selections) {
            original.selections.forEach(selection => {
                let ids = selection.ingredients.map(el => el.id);
                let els = selection.ingredients.map(el => el);
                old[selection.id] = ids;
                oldIng[selection.id] = els;
            })
        }

        if (copy.selections && copy.selections.length > 0) {
            let selectionIds = Object.keys(old)
            selectionIds = selectionIds.map(id => Number(id));

            let selections = copy.selections.map((instance, instanceIndex) => {
                if ((instance.name === "" || !instance.name) && original.selections) {
                    let index = original.selections.findIndex(el => el.id === instance.id);
                    if (index > -1) {
                        instance.name = original.selections[index].name;
                    } else {
                        copy.selections.splice(instanceIndex, 1);
                        return null;
                    }
                } else if (instance.name === "" || !instance.name) {
                    copy.selections.splice(instanceIndex, 1);
                    return null;
                }

                // Isolate deleted selections
                if (selectionIds.includes(instance.id)) {
                    for (let num = 0; num < selectionIds.length; num++) {
                        if (selectionIds[num] === instance.id) {
                            selectionIds.splice(num, 1);
                            break;
                        }
                    }
                }

                // Check for deleted ingredients
                let current = instance.ingredients.map(el => el.id);
                if (old[instance.id]) {
                    for (let i of old[instance.id]) {
                        if (!current.includes(i) && i) {
                            if (!deleted[instance.id]) {
                                deleted[instance.id] = [];
                            }
                            deleted[instance.id].push(i);
                        }
                    }
                }

                if (instance.ingredients) {
                    // Check for newly created ingredients
                    instance.ingredients.forEach(element => {
                        if (typeof element.id == 'string' || !element.id) {
                            if (!created[instance.id]) {
                                created[instance.id] = [];
                            }
                            created[instance.id].push(element);
                        }
                    })

                    let selectionType = instance.selectionType;
                    let isPreset;
                    let ingredients = instance.ingredients.map(el => {
                        if (selectionType === 'radio' && el.preset) {
                            isPreset = true;
                        }
                        if (el.name === "" && el.id.includes('FPO-')) {
                            return null;
                        } else if (el.name === "") {
                            let index = original.selections[instanceIndex].ingredients.findIndex(ing => ing.id === el.id);
                            if (index > -1) {
                                el.name = original.selections[instanceIndex].ingredients[index].name;
                            }
                        }
                        return el;
                    })

                    ingredients = ingredients.filter((i, index) => i.name && ingredients.findIndex(j => j.name === i.name) === index);

                    if (selectionType === 'radio' && !isPreset) {
                        let ing = [...ingredients]
                        if (!ing[0]) {
                            ing[0] = { id: null, enabled: false, preset: true, name: '' };
                        } else {
                            ing[0].preset = true;
                        }
                        ingredients = ing;
                    }

                    instance.ingredients = ingredients;
                }

                return instance;
            }).filter(selection => selection);

            // Delete ingredients from deleted selections 
            for (let item of selectionIds) {
                old[item].forEach(id => {
                    if (!deleted[item]) {
                        deleted[item] = []
                    }
                    deleted[item].push(id);
                })
            }
            copy.selections = selections;
        } else {
            if (original.selections) {
                original.selections.forEach(instance => {
                    for (let i of old[instance.id]) {
                        if (!deleted[instance.id]) {
                            deleted[instance.id] = [];
                        }
                        deleted[instance.id].push(i);
                    }
                })
            }
        }

        if (copy.name !== '') {
            let newItem = typeof id !== 'number';
            const { data } = await axios.put('/api/menu/' + id, { item: copy, deleted, created });
            await menuItemToggleFromAdmin(data);
            await updateEditedItem(data);
            handleItemCollapse(boolean);
            if (newItem) {
                toast(`Added ${name}!`, { className: 'lime' });
            } else {
                toast(`Updated ${name} successfully!`, { className: 'lime' });
            }
        }
    }

    const addSelectionGroup = async () => {
        let copy = { ...editedItem };
        let selections = copy.selections;

        if (!selections) {
            selections = [];
        }

        selections.push({
            id: 'FPO-' + selectionNum,
            name: null,
            selectionType: 'radio',
            ingredients: [],
            range: 0
        })

        copy.selections = selections;

        updateSelectionNum(selectionNum + 1);

        await menuItemToggleFromAdmin(copy);
        handleEdit('selections', selections)
    }

    const displaySelections = () => {
        return (
            <div className="selections-container">
                {selections.map((selection, index) => {
                    return (
                        <Selection
                            key={'selection-' + selection.id}
                            selection={selection}
                            collapses={collapsed}
                            index={index}
                            handleEdit={handleEdit}
                            editedItem={editedItem}
                        />
                    )
                })}
            </div>
        )
    }

    const handleEditing = (collapsed) => {
        if (screenSize < mini) {
            handleItemCollapse(collapsed);
        } else {
            updateMenuItemModal(true, editedItem);
        }
    }

    return (
        <div id={'menu-item-' + id} className="menu-item-container">
            <button id={'menu-item-button-' + id} key={id} className="menu-item-card align-ctr flex-btwn">
                <div className="toggle-and-menu-item-name-container align-ctr">
                    <div
                        className={`radio-toggle-button align-ctr flex-btwn ${!enabled && 'reversed'} ${typeof id !== 'number' && 'not-visible'}`}
                        onClick={() => handleMenuItemToggle()}>
                        <span className="button-text">{enabled ? 'ON' : 'OFF'}</span>
                        <div className="circle-button"></div>
                    </div>
                    {
                        collapsed ?
                            <div className="menu-item-name-and-description" onClick={() => handleEditing(!collapsed)}>
                                <input type="text" placeholder="New Menu Item..." className="menu-item-name" value={name} onChange={(e) => handleEdit('name', e.target.value)} />
                                {description && <p className="menu-item-description">{description}</p>}
                            </div>
                            :
                            <div className="menu-item-name-and-description">
                                <input type="text" placeholder="New Menu Item..." className="menu-item-name" value={name} onChange={(e) => handleEdit('name', e.target.value)} />
                            </div>
                    }
                </div>
                {showArrow && <svg id={`menu-item-arrow-${catIndex}-${index}`}
                    className={`category-chevron-arrow ${collapsed && 'inverted'}`}
                    onClick={() => handleItemCollapse(!collapsed)}
                    viewBox="0 0 11 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.7387 0.684322L10.2093 0.22601C10.0258 0.0753511 9.81154 0 9.56694 0C9.3173 0 9.10557 0.0753511 8.9314 0.22601L5.50002 3.19558L2.06867 0.226096C1.89453 0.0754366 1.68275 8.5718e-05 1.43321 8.5718e-05C1.18849 8.5718e-05 0.974257 0.0754366 0.790766 0.226096L0.268287 0.684408C0.0893961 0.839112 0 1.0245 0 1.24041C0 1.46035 0.089495 1.64364 0.268263 1.79025L4.86453 5.76785C5.03405 5.92257 5.24576 6 5.5 6C5.74947 6 5.96367 5.9226 6.14239 5.76785L10.7387 1.79025C10.9129 1.63951 11 1.45624 11 1.24041C11 1.02853 10.9129 0.843242 10.7387 0.684322Z" fill="black" /></svg>}
                {showSave && <svg id={`menu-item-save-${catIndex}-${index}`} className="" onClick={() => sendEditToSave(!collapsed)} width="24" height="24" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.75781 8.24219H3.24219C3.08039 8.24219 2.94922 8.37336 2.94922 8.53516C2.94922 8.69695 3.08039 8.82812 3.24219 8.82812H6.75781C6.91961 8.82812 7.05078 8.69695 7.05078 8.53516C7.05078 8.37336 6.91961 8.24219 6.75781 8.24219Z" fill="black" /><path d="M6.75781 5.89844H3.24219C3.08039 5.89844 2.94922 6.02961 2.94922 6.19141C2.94922 6.3532 3.08039 6.48438 3.24219 6.48438H6.75781C6.91961 6.48438 7.05078 6.3532 7.05078 6.19141C7.05078 6.02961 6.91961 5.89844 6.75781 5.89844Z" fill="black" /><path d="M6.75781 7.07031H3.24219C3.08039 7.07031 2.94922 7.20148 2.94922 7.36328C2.94922 7.52508 3.08039 7.65625 3.24219 7.65625H6.75781C6.91961 7.65625 7.05078 7.52508 7.05078 7.36328C7.05078 7.20148 6.91961 7.07031 6.75781 7.07031Z" fill="black" /><path d="M6.46484 0H2.36328V2.53906H6.46484V0Z" fill="black" /><path d="M9.91418 1.64832L8.35168 0.0858203C8.29674 0.0308789 8.22223 0 8.14453 0H7.05078V2.83203C7.05078 2.99383 6.91961 3.125 6.75781 3.125H2.07031C1.90852 3.125 1.77734 2.99383 1.77734 2.83203V0H0.292969C0.131172 0 0 0.131172 0 0.292969V9.70703C0 9.86883 0.131172 10 0.292969 10C0.383691 10 9.5852 10 9.70703 10C9.86883 10 10 9.86883 10 9.70703V1.85547C10 1.77777 9.96912 1.70326 9.91418 1.64832ZM7.63672 9.41406H2.36328V5.3125H7.63672V9.41406Z" fill="black" /></svg>}
                {showX && <svg id={`menu-item-x-${catIndex}-${index}`} className="x-menu-item" height="20" onClick={() => sendEditToSave(!collapsed)} viewBox="0 0 365.71733 365" width="20" xmlns="http://www.w3.org/2000/svg"><g fill="#E0115F"><path d="m356.339844 296.347656-286.613282-286.613281c-12.5-12.5-32.765624-12.5-45.246093 0l-15.105469 15.082031c-12.5 12.503906-12.5 32.769532 0 45.25l286.613281 286.613282c12.503907 12.5 32.769531 12.5 45.25 0l15.082031-15.082032c12.523438-12.480468 12.523438-32.75.019532-45.25zm0 0" /><path d="m295.988281 9.734375-286.613281 286.613281c-12.5 12.5-12.5 32.769532 0 45.25l15.082031 15.082032c12.503907 12.5 32.769531 12.5 45.25 0l286.632813-286.59375c12.503906-12.5 12.503906-32.765626 0-45.246094l-15.082032-15.082032c-12.5-12.523437-32.765624-12.523437-45.269531-.023437zm0 0" /></g></svg>}
            </button>
            <div className={`menu-item-selection-${id} ${collapsed && 'none'} col align-ctr`}>
                {
                    showImage ?
                        <div id="item-image" className="item-image" style={{ backgroundImage: `url(${googleDriveURL + image})` }} aria-label={name}>
                            <svg onClick={() => updateShowImage(!showImage)} className="edit-pencil" width="12" height="12" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 7.91646V10.0001H2.08362L8.23169 3.85199L6.14806 1.76837L0 7.91646Z" fill="black" /><path d="M9.83745 1.45992L8.54004 0.162522C8.32334 -0.0541741 7.9705 -0.0541741 7.75381 0.162522L6.737 1.17933L8.82062 3.26295L9.83743 2.24614C10.0542 2.02945 10.0542 1.67661 9.83745 1.45992Z" fill="black" /></svg>
                        </div>
                        :
                        <div className="image-container">
                            <div className="image-label-container align-ctr flex-btwn">
                                <h4>Menu Item Image</h4>
                                <button className="preview-btn flex-ctr">
                                    <svg onClick={() => updateShowImage(!showImage)} id="Layer_2" enableBackground="new 0 0 24 24" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg"><g><path d="m12 21c-5.196 0-9.815-3.067-11.767-7.814-.31-.753-.31-1.618 0-2.371 1.952-4.748 6.571-7.815 11.767-7.815s9.815 3.067 11.767 7.814c.31.753.31 1.618 0 2.371-1.952 4.748-6.571 7.815-11.767 7.815zm0-17c-4.789 0-9.045 2.824-10.842 7.194-.21.512-.21 1.099 0 1.611 1.797 4.371 6.053 7.195 10.842 7.195s9.045-2.824 10.842-7.194c.21-.512.21-1.099 0-1.611-1.797-4.371-6.053-7.195-10.842-7.195z" /></g><g><path d="m12 16c-2.206 0-4-1.794-4-4s1.794-4 4-4 4 1.794 4 4-1.794 4-4 4zm0-7c-1.654 0-3 1.346-3 3s1.346 3 3 3 3-1.346 3-3-1.346-3-3-3z" /></g></svg>
                                </button>
                            </div>
                            <input
                                onPaste={(e) => handleEdit('image', e.clipboardData.getData('text/plain'))}
                                onChange={(e) => handleEdit('image', e.target.value)}
                                className="item-image-input"
                                placeholder="Hosted Image URL..."
                                type="text"
                                name="image"
                                id={`menu-item-${id}-image`}
                                value={image} />
                        </div>
                }

                <div className="description-container">
                    <div className="description-heading flex-btwn align-ctr">
                        <h4 className="description-text">Description</h4>
                        {/* <div className={`radio-toggle-button description-toggle-button align-ctr flex-btwn ${!desc_enabled && 'reversed'}`}
                        // onClick={() => handleToggle(selection)}
                        >
                            <span className="button-text">{desc_enabled ? 'ON' : 'OFF'}</span>
                            <div className="circle-button"></div>
                        </div> */}
                    </div>
                    <textarea className="description-box" name="description" placeholder="Enter text here..." id="" value={editedItem.description} onChange={(e) => handleEdit('description', e.target.value)}></textarea>
                </div>
                {selections && selections.length > 0 && displaySelections()}
                <button className="add-selection-group-btn" onClick={() => addSelectionGroup()}>+ Add Selection Group</button>
                <div className="range-container">
                    <h4 className="range-text">Range</h4>
                    <div className="range-btn-container align-ctr flex-btwn">
                        <button onClick={() => handleEdit('range', 0)} className={`range-btn ${range === 0 && 'selected'}`}>5 - 10 m</button>
                        <button onClick={() => handleEdit('range', 1)} className={`range-btn ${range === 1 && 'selected'}`}>10 - 15 m</button>
                    </div>
                </div>
            </div>
            {(showSave || showX) && Toast}
        </div>
    )
}