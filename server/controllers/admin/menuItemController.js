const menuItemController = {
    loopThroughItems: async (items) => {
        const existingCategory = [];
        const finalMenu = [];
        await items.forEach(item => {
            const { category_id, category_name, category_image, id, name, enabled, description, desc_enabled, range_id, image, selection_id, selection_name, selection_type_id, ingredient_enabled, preset, ingredient_name, ingredient_id } = item;

            if (category_id) {
                const category = {
                    id: category_id,
                    name: category_name,
                    image: category_image,
                    menuItems: []
                }
    
                let range = 0;
    
                if (range_id === 1) {
                    range = 1;
                }
    
                let selectionType = selection_type_id === 1 ? 'radio' : 'check';
    
                const menuItem = {
                    id,
                    name,
                    enabled,
                    description,
                    desc_enabled: desc_enabled === 'true' ? true : false,
                    range,
                    image
                }
                const selections = {
                    id: selection_id,
                    name: selection_name,
                    selectionType,
                    ingredients: []
                }
                const ingredient = {
                    id: ingredient_id,
                    name: ingredient_name,
                    preset,
                    enabled: ingredient_enabled
                }
    
                if (existingCategory.includes(category_id)) {
                    const catIndex = finalMenu.findIndex(catItem => catItem.id === category_id);
                    let currentCategory = finalMenu[catIndex];
                    let menuItemIndex = currentCategory.menuItems.findIndex(meal => meal.id === id);
                    let currentMenuItem;
    
                    if (id && name) {
                        if (menuItemIndex > -1) {
                            currentMenuItem = currentCategory.menuItems[menuItemIndex];
                        } else {
                            if (currentCategory.menuItems) {
                                currentCategory.menuItems.push(menuItem);
                                menuItemIndex = currentCategory.menuItems.length - 1;
                                currentMenuItem = currentCategory.menuItems[menuItemIndex];
                            } else {
                                currentCategory.menuItems = [menuItem];
                                menuItemIndex = 0;
                                currentMenuItem = currentCategory.menuItems[0];
                            }
                        }
                        if (selection_id) {
                            if (currentMenuItem.selections) {
                                let selectionIndex = finalMenu[catIndex].menuItems[menuItemIndex].selections.findIndex(element => element.id === selection_id);
                                if (selectionIndex > -1) {
                                    currentMenuItem.selections[selectionIndex].ingredients.push(ingredient);
                                } else {
                                    selections.ingredients = [ingredient];
                                    currentMenuItem.selections.push(selections);
                                }
                            } else {
                                selections.ingredients = [ingredient];
                                currentMenuItem.selections = [selections];
                            }
                        }
                    }
    
                    finalMenu[catIndex].menuItems[menuItemIndex] = currentMenuItem;
                } else {
                    if (selection_id && ingredient_id) {
                        selections.ingredients.push(ingredient);
                        menuItem.selections = [selections];
                    }
                    if (id && name) {
                        category.menuItems.push(menuItem);
                    }
                    existingCategory.push(category_id);
                    finalMenu.push(category);
                }
            }
        })

        return finalMenu;
    },
    updateMenuItemEnabled: async (req, res) => {
        const db = req.app.get('db');
        const { item } = req.body;
        let { id } = req.params;
        id = Number(id);
        const [updatedItem] = await db.menu_items.update_menu_item_enabled({ id, enabled: item.enabled });
        res.send(updatedItem);
    },
    updateMenuItem: async (req, res) => {
        const db = req.app.get('db');
        const { deleted, created, item } = req.body;
        const { description, image, name, selections, range, category_id, enabled } = item;
        let { id } = req.params;
        let menuItem;

        if (id.includes('FPO-')) {
            let [newItem] = await db.menu_items.add_menu_item({ description, image, name, range, category_id, enabled });
            menuItem = newItem;
            id = newItem.id;
        } else {
            id = Number(id);
            let [updateItem] = await db.menu_items.update_menu_item({ id, description, image, name, range, enabled });
            menuItem = updateItem;
        }

        if (selections) {
            for (let key in deleted) {
                deleted[key].forEach(async element => {
                    await db.selections.delete_ingredient_from_selection({ selection_id: Number(key), ingredient_id: element });
                    let [filled] = await db.selections.check_ingredients_is_empty_from_selection({ id: Number(key) });
                    if (!filled) await db.selections.delete_selection({ id: Number(key) });
                })
            }

            for (let key in created) {
                created[key].forEach(async element => {
                    let newKey = key;
                    let newId = element.id;

                    if (key.includes('FPO-')) {
                        let foundSelection = selections.find(sel => sel.id === key);
                        let type = foundSelection.selectionType === 'radio' ? 1 : 2;
                        let [exist] = await db.selections.check_selection({ name: foundSelection.name, menu_item_id: id });
                        if (!exist) {
                            let [newSelection] = await db.selections.add_selection({ name: foundSelection.name, menu_item_id: id, selection_type_id: type });
                            newKey = Number(newSelection.id);
                        } else {
                            newKey = exist.id;
                        }
                    }

                    let [ingExist] = await db.ingredients.check_ingredient({ name: element.name });
                    if (!ingExist) {
                        let [newItem] = await db.ingredients.create_new_ingredient({ name: element.name });
                        newId = newItem.id;
                    } else {
                        newId = ingExist.id;
                    }

                    const [exist] = await db.selections.check_ingredient_and_selection({ selection_id: newKey, ingredient_id: newId });
                    if (!exist) await db.selections.add_ingredient_to_selections({ selection_id: newKey, ingredient_id: newId, enabled: element.enabled, preset: element.preset });
                })
            }

            selections.forEach(async variant => {
                if (typeof variantId === 'number') {
                    let variantId = variant.id;
                    let type = variant.selectionType === 'radio' ? 1 : 2;
                    await db.selections.update_selections_name_and_type({ id: variantId, selectionType: type, name: variant.name });
                }
            });

            res.send(menuItem);
        } else {
            menuItem.range = menuItem.range_id;
            delete menuItem.range_id;
            res.send(menuItem);
        }
    },
    deleteMenuItem: async (req, res) => {
        const db = req.app.get('db');
        const { category_id, menu_item_id } = req.params;
        await db.menu_items.delete_menu_item({ menu_item_id, category_id });
        const items = await db.categories.get_single_category({ id: category_id });
        let [newCategory] = await menuItemController.loopThroughItems(items);
        res.send(newCategory);
    }
}

module.exports = menuItemController;
