const adminCtrl = {
    getAdminMenuPage: async (req, res) => {
        const db = req.app.get('db');
        const items = await db.categories.get_categories_with_menu_items();
        const [heroInstance] = await db.hero.get_hero();
        const finalMenu = await adminCtrl.loopThroughItems(items);
        res.send({ menu: finalMenu, hero: heroInstance.hero });
    },

    updateHero: async (req, res) => {
        const db = req.app.get('db');
        const { hero } = req.body;
        await db.hero.update_hero({ hero });
        res.sendStatus(200);
    },

    deleteCategory: async (req, res) => {
        const db = req.app.get('db');
        let { id } = req.params;
        id = Number(id);
        const menuItems = await db.menu_items.get_menu_items_by_category({ id });
        menuItems.forEach(async item => {
            const { id: menu_item_id } = item;
            await db.selections.delete_selections_by_menu_item({ menu_item_id });
        });
        await db.categories.delete_category({ id });
        res.status(200);
    },

    loopThroughItems: async (items) => {
        const existingCategory = [];
        const finalMenu = [];
        await items.forEach(item => {
            const { category_id, category_name, category_image, id, name, enabled, description, desc_enabled, range_id, image, selection_id, selection_name, selection_type_id, ingredient_enabled, preset, ingredient_name, ingredient_id } = item
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
        })

        return finalMenu;
    },

    updateMenuItemEnabled: async (req, res) => {
        const db = req.app.get('db');
        const { item } = req.body;
        const { id } = req.params;

        const [updatedItem] = await db.menu_items.update_menu_item_enabled({ id, enabled: item.enabled });
        res.send(updatedItem);
    },
    updateMenuItem: async (req, res) => {
        const db = req.app.get('db');
        const { deleted, created, item } = req.body;
        const { description, image, name, selections, range, category_id } = item;
        let { id } = req.params;
        let menuItem;

        if (id.includes('FPO-')) {
            let [newItem] = await db.menu_items.add_menu_item({ description, image, name, range, category_id });
            menuItem = newItem;
        } else {
            id = Number(id);
            let [updateItem] = await db.menu_items.update_menu_item({ id, description, image, name, range });
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

            const updatedSelections = await db.selections.get_selections_and_ingredients({ id });

            let uniqueSelectionId = [];
            let selection = [];

            const mappedSelections = await updatedSelections.map(instance => {
                const { selection_id, selection_name, selection_type_id, enabled: ingredient_enabled, preset, ingredient_id, ingredient_name } = instance;
                const newObj = {
                    id: selection_id,
                    name: selection_name,
                    selectionType: selection_type_id === 1 ? 'radio' : 'check'
                }

                const ingredient = {
                    id: ingredient_id,
                    preset,
                    enabled: ingredient_enabled,
                    name: ingredient_name
                }

                if (!uniqueSelectionId.includes(selection_id)) {
                    uniqueSelectionId.push(selection_id);
                    newObj.ingredients = [ingredient];
                    selection.push(newObj);
                } else {
                    let foundIndex = selection.findIndex(item => item.id === selection_id);
                    if (foundIndex > -1) {
                        selection[foundIndex].ingredients.push(ingredient);
                    }
                }

                return instance;
            })

            Promise.all(mappedSelections).then(() => {
                menuItem.range = menuItem.range_id;
                delete menuItem.range_id;
                menuItem.selections = selection;
                res.send(menuItem);
            })
        } else {
            menuItem.range = menuItem.range_id;
            delete menuItem.range_id;
            res.send(menuItem);
        }
    },
    updateCategory: async (req, res) => {
        const db = req.app.get('db');
        const { name, image } = req.body;
        let { id } = req.params;
        let category;

        if (!id.includes('FPO-')) {
            id = Number(id);
            await db.categories.update_category({ id, name, image });
            const items = await db.categories.get_single_category({ id });
            let [newCategory] = await adminCtrl.loopThroughItems(items);
            category = newCategory;
        } else {
            let [newCategory] = await db.categories.add_new_category({ name, image });
            newCategory.menuItems = [];
            category = newCategory;
        }
        res.send(category);
    },

    getOrders: async (req, res) => {
        const db = req.app.get('db');
        const orders = await db.orders.get_orders();
        const organizedOrders = [];
        const existing = [];
        await orders.forEach(async order => {
            const { line_item_id, qty, menu_item_id, toppings, instructions, date, order_id, name, phone, department, status, menu_item_name } = order;
            
            const orderObj = {
                order_id,
                name,
                phone,
                department,
                date,
                status
            }

            const lineItem = {
                line_item_id,
                menu_item_id,
                ingredients: toppings,
                instructions,
                menu_item_name,
                qty
            }

            if (!existing.includes(order_id)) {
                existing.push(order_id);
                if (!orderObj.lineItems) {
                    orderObj.lineItems = [];
                }
                orderObj.lineItems.push(lineItem);
                organizedOrders.push(orderObj);
            } else {
                let index = organizedOrders.findIndex(item => item.order_id === order_id);
                if (index > -1) organizedOrders[index].lineItems.push(lineItem);
            }
        });
        res.send(organizedOrders);
    }
}

module.exports = adminCtrl;