import React from 'react';

export default function MenuItemModal(props) {
    const { menuItemModalData, updateShowMenuItemModal } = props;
    const { id, name, enabled, description, desc_enabled, ranges, selections } = menuItemModalData;

    const displaySelections = () => {
        return (
            <div className="selections-container">
                {selections.map((selection, index) => {
                    const { ingredients, selectionType } = selection;
                    return (
                        <div className="selection-container">
                            <div className="selection-heading align-ctr flex-btwn">
                                <input className="selection-name" value={selection.name} /* onChange={(e) => updateSelectionName(e.target.value)} */ />
                                <div className="radio-toggle-and-delete-button-container align-ctr">
                                    <div
                                        className={`radio-toggle-button radio-and-check-toggle-button align-ctr flex-btwn`}
                                        /* onClick={() => updateSelectionType()} */ >
                                        <span className="button-text">{/* {check ? 'check' : 'radio'} */}</span>
                                        <div className="circle-button"></div>
                                    </div>
                                    <button className="delete-selection-btn flex-ctr pointer" /* onClick={() => deleteSelection()} */>
                                        <svg height="12" viewBox="0 0 365.71733 365" width="12" xmlns="http://www.w3.org/2000/svg"><g fill="#ffffff"><path d="m356.339844 296.347656-286.613282-286.613281c-12.5-12.5-32.765624-12.5-45.246093 0l-15.105469 15.082031c-12.5 12.503906-12.5 32.769532 0 45.25l286.613281 286.613282c12.503907 12.5 32.769531 12.5 45.25 0l15.082031-15.082032c12.523438-12.480468 12.523438-32.75.019532-45.25zm0 0" /><path d="m295.988281 9.734375-286.613281 286.613281c-12.5 12.5-12.5 32.769532 0 45.25l15.082031 15.082032c12.503907 12.5 32.769531 12.5 45.25 0l286.632813-286.59375c12.503906-12.5 12.503906-32.765626 0-45.246094l-15.082032-15.082032c-12.5-12.523437-32.765624-12.523437-45.269531-.023437zm0 0" /></g></svg>
                                    </button>
                                </div>
                            </div>
                            {/* { displayIngredients()}
                        <button onClick={() => addIngredientItem()} className="add-item-btn">+ Add Item</button> */}
                        </div>
                    )
                })}
            </div>
        )
    }

    return (
        <div className="menu-item-modal-container flex-ctr">
            <div className="modal-wrapper"></div>
            <div className="menu-item-modal">
                <div className="menu-item-heading-container align-ctr flex-btwn">
                    <h2 className="menu-item-name">{name}</h2>
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
                        // value={editedItem.description} 
                        // onChange={(e) => handleEdit('description', e.target.value)}
                        ></textarea>
                    </div>
                    {selections && selections.length > 0 && displaySelections()}
                    {/* <button className="add-selection-group-btn" onClick={() => addSelectionGroup()}>+ Add Selection Group</button> */}
                </div>
            </div>
        </div>
    )
}