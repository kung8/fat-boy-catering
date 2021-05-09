import React, { useState } from 'react';
import Selection from './Selection';
import cloneDeep from 'lodash.clonedeep';
import axios from 'axios';

export default function MenuItemModal(props) {
    const { menuItemModalData, updateShowMenuItemModal, menuItemToggleFromAdmin } = props;
    const [editedItem, updateEditedItem] = useState(cloneDeep(menuItemModalData));
    const { id, name, description, selections, range } = editedItem;
    const [selectionNum, updateSelectionNum] = useState(1);

    const displaySelections = () => {
        return (
            <div className="selections-container">
                {selections.map((selection, index) => {
                    return (
                        <Selection
                            key={'modal-selection-' + index}
                            selection={selection}
                            selIndex={index}
                            handleDeletion={handleDeletion}
                            updateIngredient={updateIngredient}
                            handleEdit={handleEdit}
                            editedItem={editedItem}
                        />
                    )
                })}
            </div>
        )
    }

    const handleDeletion = () => {

    }

    const updateIngredient = () => {

    }

    const handleEdit = (prop, value) => {
        const copy = Object.assign({}, editedItem);
        copy[prop] = value;
        updateEditedItem(copy);
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
            ingredients: []
        })

        copy.selections = selections;

        updateSelectionNum(selectionNum + 1);
        handleEdit('selections', selections);
    }

    const sendEditToSave = async () => {
        const copy = Object.assign({}, editedItem);
        const original = { ...menuItemModalData };
        const deleted = {};
        const created = {};

        if (copy.name === '' && original.name) {
            copy.name = original.name;
        } else if (copy.name === '' || !copy.name) {
            menuItemToggleFromAdmin({ id });
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
                        copy.selections.splice(instanceIndex, 1)
                        return null
                    }
                } else if (instance.name === "" || !instance.name) {
                    copy.selections.splice(instanceIndex, 1)
                    return null
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
                                deleted[instance.id] = []
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
                                created[instance.id] = []
                            }
                            created[instance.id].push(element)
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
                            deleted[instance.id] = []
                        }
                        deleted[instance.id].push(i);
                    }
                })
            }
        }

        if (copy.name && copy.image) {
            const { data } = await axios.put('/api/menu/' + id, { item: copy, deleted, created });
            await menuItemToggleFromAdmin(data, true);
            await updateShowMenuItemModal(false);
        }
    }

    return (
        <div className="menu-item-modal-container flex-ctr">
            <div className="modal-wrapper"></div>
            <div className="menu-item-modal">
                <div className="menu-item-heading-container align-ctr flex-btwn">
                    <input className="menu-item-name" placeholder="Enter menu item name..." value={name} onChange={(e) => handleEdit('name', e.target.value)} />
                    <button className="close-menu-item-modal" onClick={() => updateShowMenuItemModal(false)}>
                        <svg height="14" viewBox="0 0 365.71733 365" width="14" xmlns="http://www.w3.org/2000/svg"><g fill="#ffffff"><path d="m356.339844 296.347656-286.613282-286.613281c-12.5-12.5-32.765624-12.5-45.246093 0l-15.105469 15.082031c-12.5 12.503906-12.5 32.769532 0 45.25l286.613281 286.613282c12.503907 12.5 32.769531 12.5 45.25 0l15.082031-15.082032c12.523438-12.480468 12.523438-32.75.019532-45.25zm0 0" /><path d="m295.988281 9.734375-286.613281 286.613281c-12.5 12.5-12.5 32.769532 0 45.25l15.082031 15.082032c12.503907 12.5 32.769531 12.5 45.25 0l286.632813-286.59375c12.503906-12.5 12.503906-32.765626 0-45.246094l-15.082032-15.082032c-12.5-12.523437-32.765624-12.523437-45.269531-.023437zm0 0" /></g></svg>
                    </button>
                </div>
                <div className="menu-item-body-container align-ctr col">
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
                        <textarea
                            className="description-box"
                            name="description"
                            placeholder="Enter text here..."
                            id=""
                            value={description}
                            onChange={(e) => handleEdit('description', e.target.value)}
                        ></textarea>
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
                    <button className="save-menu-item-btn" onClick={() => sendEditToSave()}>Save</button>
                </div>
            </div>
        </div>
    )
}