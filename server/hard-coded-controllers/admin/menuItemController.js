const hooks = require('../hooks');

const menuItemController = {
    loopThroughItems: async (items) => {
        const existingCategory = [];
        const finalMenu = [];
        await items.forEach(item => {
            const { categoryId, categoryName, categoryImage, id, name, enabled, description, descEnabled, rangeId, image, selectionId, selectionName, selectionTypeId, ingredientEnabled, preset, ingredientName, ingredientId } = item;

            if (categoryId) {
                const category = {
                    id: categoryId,
                    name: categoryName,
                    image: categoryImage,
                    menuItems: []
                }

                let range = 0;

                if (rangeId === 1) {
                    range = 1;
                }

                let selectionType = selectionTypeId === 1 ? 'radio' : 'check';

                const menuItem = {
                    id,
                    name,
                    enabled,
                    description,
                    descEnabled: descEnabled === 'true' ? true : false,
                    range,
                    image
                }
                const selections = {
                    id: selectionId,
                    name: selectionName,
                    selectionType,
                    ingredients: []
                }
                const ingredient = {
                    id: ingredientId,
                    name: ingredientName,
                    preset,
                    enabled: ingredientEnabled
                }

                if (existingCategory.includes(categoryId)) {
                    const catIndex = finalMenu.findIndex(catItem => catItem.id === categoryId);
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
                        if (selectionId) {
                            if (currentMenuItem.selections) {
                                let selectionIndex = finalMenu[catIndex].menuItems[menuItemIndex].selections.findIndex(element => element.id === selectionId);
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
                    if (selectionId && ingredientId) {
                        selections.ingredients.push(ingredient);
                        menuItem.selections = [selections];
                    }
                    if (id && name) {
                        category.menuItems.push(menuItem);
                    }
                    existingCategory.push(categoryId);
                    finalMenu.push(category);
                }
            }
        })

        return finalMenu;
    },
    updateMenuItemEnabled: async (req, res) => {
        const { item } = req.body;
        let { id } = req.params;
        id = Number(id);
        const updatedMenuItem = hooks.updateMenuItemEnabled(id, item.enabled);
        res.send(updatedMenuItem);
    },
    updateMenuItem: async (req, res) => {
        const { deleted, created, item } = req.body;
        const { selections, ...rest } = item;
        let { id } = req.params;
        let menuItem;

        if (id.includes('FPO-')) {
            const newItem = hooks.createMenuItem(rest);
            menuItem = newItem;
            id = newItem.id;
        } else {
            id = Number(id);
            const updatedItem = hooks.updateMenuItem(rest);
            menuItem = updatedItem;
        }

        if (selections) {
            let newSelections = [...selections];
            for (let key in deleted) {
                deleted[key].forEach(async element => {
                    const selectionId = Number(key);
                    await hooks.deleteSelectionsIngredients({ selectionId, ingredientId: element });
                    const [existing] = hooks.getSelectionsIngredientsBySelection(selectionId);
                    if (!existing) await hooks.deleteSelection(selectionId);
                })
            }

            for (let key in created) {
                const foundIndex = newSelections.findIndex(sel => sel.id === Number(key));

                created[key].forEach(async element => {
                    let selectionId = key;
                    let ingredientId = element.id;

                    if (key.includes('FPO-')) {
                        let foundSelection = selections.find(sel => sel.id === key);
                        let type = foundSelection.selectionType === 'radio' || foundSelection.selectionType === 1 ? 1 : 2;

                        if (foundSelection) {
                            const [existing] = await hooks.getSelection(foundSelection.id);
                            if (!existing) {
                                const newSelection = await hooks.createSelection({ name: foundSelection.name, menuItemId: id, selectionTypeId: type });
                                selectionId = Number(newSelection.id);
                                newSelections[foundIndex] = newSelection;
                            } else {
                                selectionId = existing.id;
                            }
                        }
                    }

                    const [ingExist] = await hooks.getIngredientByName(element.name);
                    if (!ingExist) {
                        const newIngredient = await hooks.createIngredient({ name: element.name });
                        ingredientId = newIngredient.id;
                        const ingIndex = newSelections[foundIndex].ingredients.findIndex(ing => ing.name === element.name);
                        if (ingIndex > -1) {
                            newSelections[foundIndex].ingredients[ingIndex].id = ingredientId;
                        }
                    } else {
                        ingredientId = ingExist.id;
                    }

                    const existing = await hooks.getSelectionsIngredients({ selectionId, ingredientId });
                    if (!existing) {
                        await hooks.createSelectionsIngredients({
                            selectionId,
                            ingredientId,
                            enabled: element.enabled,
                            preset: element.preset
                        })
                    }
                })
            }

            selections.forEach(async selection => {
                if (Number(selection.id)) {
                    let selectionId = selection.id;
                    let selectionType = selection.selectionType === 'radio' || selection.selectionType === 1 ? 1 : 2;
                    await hooks.updateSelection({
                        id: selectionId,
                        selectionType,
                        name: selection.name,
                    })
                }
            });
            await hooks.getSelectionsWithIngredients(id);
            menuItem.selections = newSelections;
            return res.send(menuItem);
        } else {
            menuItem.range = menuItem.rangeId;
            delete menuItem.rangeId;
            res.send(menuItem);
        }
    },
    deleteMenuItem: async (req, res) => {
        const { categoryId, menuItemId } = req.params;
        await hooks.deleteMenuItem(menuItemId);
        const items = hooks.getComprehensiveCategory(categoryId);
        let [newCategory] = await menuItemController.loopThroughItems(items);
        res.send(newCategory);
    }
}

module.exports = menuItemController;
