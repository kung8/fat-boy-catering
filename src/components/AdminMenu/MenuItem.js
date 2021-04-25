import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Selection from './Selection';

export default function MenuItem(props) {
    const { item, catIndex, catCollapsed, menuItemToggleFromAdmin } = props;
    const { id, name, description, enabled, image, selections } = item;
    const [collapsed, updateCollasped] = useState(true);
    const [editedItem, updateEditedItem] = useState(item);

    useEffect(() => {
        updateCollapsedWithCatChange();
        // eslint-disable-next-line
    }, [catCollapsed])

    const updateCollapsedWithCatChange = () => {
        if (catCollapsed) {
            updateCollasped(true);
            document.getElementById('save-item-' + id).classList.add('none');
        }
    }

    const handleItemCollapse = (bool) => {
        updateCollasped(bool);
        let arrow = document.getElementById('arrow-item-' + id);
        let save = document.getElementById('save-item-' + id);

        if (bool) {
            save.classList.add('none');
            arrow.classList.remove('none');
        } else {
            arrow.classList.add('right-side-up');
        }
        setTimeout(() => {
            if (bool) {
                arrow.classList.remove('right-side-up');
            } else {
                arrow.classList.add('none');
                save.classList.remove('none');
            }
        }, 225);
    }

    const handleMenuItemToggle = async (item) => {
        let { id, enabled } = item;
        item.enabled = !enabled;
        const { data } = await axios.put('/api/menu/' + id, { item });
        await menuItemToggleFromAdmin(data);
    }

    const handleEdit = async (prop, value) => {
        const copy = { ...editedItem };
        copy[prop] = value;
        await updateEditedItem(copy);
    }

    const displaySelections = () => {
        return (
            <div className="selections-container">
                {selections.map((selection, index) => {
                    return (
                        <Selection
                            key={'selection-' + selection.id}
                            selection={selection}
                            index={index}
                            handleEdit={handleEdit}
                            editedItem={editedItem}
                        />
                    )
                })}
            </div>
        )
    }

    return (
        <div id={'menu-item-' + id} className="menu-item-container">
            <button id={'menu-item-button-' + id} key={id} className="menu-item-card align-ctr flex-btwn">
                <div className="toggle-and-menu-item-name-container align-ctr">
                    <div
                        className={`radio-toggle-button align-ctr flex-btwn ${!enabled && 'reversed'}`}
                        onClick={() => handleMenuItemToggle(item)}>
                        <span className="button-text">{enabled ? 'ON' : 'OFF'}</span>
                        <div className="circle-button"></div>
                    </div>
                    {
                        collapsed ?
                            <div className="menu-item-name-and-description">
                                <h4 className="menu-item-name">{name}</h4>
                                {description && <p className="menu-item-description">{description}</p>}
                            </div>
                            :
                            <div className="menu-item-name-and-description">
                                <input type="text" className="menu-item-name" value={editedItem.name} onChange={(e) => handleEdit('name', e.target.value)} />
                            </div>
                    }
                </div>
                <svg id={`arrow-item-` + id}
                    className={`category-chevron-arrow ${collapsed && 'inverted'}`}
                    onClick={() => handleItemCollapse(!collapsed)}
                    viewBox="0 0 11 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.7387 0.684322L10.2093 0.22601C10.0258 0.0753511 9.81154 0 9.56694 0C9.3173 0 9.10557 0.0753511 8.9314 0.22601L5.50002 3.19558L2.06867 0.226096C1.89453 0.0754366 1.68275 8.5718e-05 1.43321 8.5718e-05C1.18849 8.5718e-05 0.974257 0.0754366 0.790766 0.226096L0.268287 0.684408C0.0893961 0.839112 0 1.0245 0 1.24041C0 1.46035 0.089495 1.64364 0.268263 1.79025L4.86453 5.76785C5.03405 5.92257 5.24576 6 5.5 6C5.74947 6 5.96367 5.9226 6.14239 5.76785L10.7387 1.79025C10.9129 1.63951 11 1.45624 11 1.24041C11 1.02853 10.9129 0.843242 10.7387 0.684322Z" fill="black" /></svg>
                <svg id={`save-item-` + id} className={`none save-item-cat-${catIndex}`} onClick={() => handleItemCollapse(!collapsed)} width="24" height="24" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.75781 8.24219H3.24219C3.08039 8.24219 2.94922 8.37336 2.94922 8.53516C2.94922 8.69695 3.08039 8.82812 3.24219 8.82812H6.75781C6.91961 8.82812 7.05078 8.69695 7.05078 8.53516C7.05078 8.37336 6.91961 8.24219 6.75781 8.24219Z" fill="black" /><path d="M6.75781 5.89844H3.24219C3.08039 5.89844 2.94922 6.02961 2.94922 6.19141C2.94922 6.3532 3.08039 6.48438 3.24219 6.48438H6.75781C6.91961 6.48438 7.05078 6.3532 7.05078 6.19141C7.05078 6.02961 6.91961 5.89844 6.75781 5.89844Z" fill="black" /><path d="M6.75781 7.07031H3.24219C3.08039 7.07031 2.94922 7.20148 2.94922 7.36328C2.94922 7.52508 3.08039 7.65625 3.24219 7.65625H6.75781C6.91961 7.65625 7.05078 7.52508 7.05078 7.36328C7.05078 7.20148 6.91961 7.07031 6.75781 7.07031Z" fill="black" /><path d="M6.46484 0H2.36328V2.53906H6.46484V0Z" fill="black" /><path d="M9.91418 1.64832L8.35168 0.0858203C8.29674 0.0308789 8.22223 0 8.14453 0H7.05078V2.83203C7.05078 2.99383 6.91961 3.125 6.75781 3.125H2.07031C1.90852 3.125 1.77734 2.99383 1.77734 2.83203V0H0.292969C0.131172 0 0 0.131172 0 0.292969V9.70703C0 9.86883 0.131172 10 0.292969 10C0.383691 10 9.5852 10 9.70703 10C9.86883 10 10 9.86883 10 9.70703V1.85547C10 1.77777 9.96912 1.70326 9.91418 1.64832ZM7.63672 9.41406H2.36328V5.3125H7.63672V9.41406Z" fill="black" /></svg>
            </button>
            <div className={`menu-item-selection-${id} ${collapsed && 'none'} col align-ctr`}>
                {image ?
                    <img id="item-image" className="item-image" src={image} alt={name} /> :
                    <div id="item-image" className="placeholder"></div>}
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
            </div>
        </div>
    )
}