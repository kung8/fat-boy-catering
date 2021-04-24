const hero = './assets/background-menu-placeholder.png';

module.exports = {
    getAdminMenuPage: async (req, res) => {
        const db = req.app.get('db');
        const items = await db.categories.get_categories_with_menu_items();
        const existingCategory = [];
        const finalMenu = [];
        await items.forEach(item => {
            const { category_id, category_name, category_image, id, name, enabled, description, desc_enabled, range_id, image, selection_id, selection_name, selection_type_id, ingredient_enabled, preset, ingredient_name, ingredient_id } = item;
            const category = {
                id: category_id,
                name: category_name,
                image: category_image,
                menuItems: []
            }

            let range = [5, 10];

            if (range_id === 1) {
                range = [10, 15];
            }

            let selectionType = selection_type_id ? (selection_type_id === 1 ? 'radio' : 'check') : null;

            const menuItem = {
                id,
                name,
                enabled,
                description,
                desc_enabled: desc_enabled === 'true' ? true : false,
                range,
                image
            };
            const selections = {
                id: selection_id,
                name: selection_name,
                selectionType,
                ingredients: []
            };
            const ingredient = {
                id: ingredient_id,
                name: ingredient_name,
                preset,
                enabled: ingredient_enabled
            };

            if (existingCategory.includes(category_id)) {
                const catIndex = finalMenu.findIndex(catItem => catItem.id === category_id);
                let currentCategory = finalMenu[catIndex];
                let menuItemIndex = currentCategory.menuItems.findIndex(meal => meal.id === id);
                let currentMenuItem;

                if (menuItemIndex > -1) {
                    currentMenuItem = currentCategory.menuItems[menuItemIndex]
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
                            currentMenuItem.selections[selectionIndex].ingredients.push(ingredient)
                        } else {
                            selections.ingredients = [ingredient];
                            currentMenuItem.selections.push(selections);
                        }
                    } else {
                        selections.ingredients = [ingredient];
                        currentMenuItem.selections = [selections];
                    }
                }

                finalMenu[catIndex].menuItems[menuItemIndex] = currentMenuItem;
            } else {
                if (selection_id && ingredient_id) {
                    selections.ingredients.push(ingredient);
                    menuItem.selections = [selections];
                }
                category.menuItems.push(menuItem);
                existingCategory.push(category_id);
                finalMenu.push(category);
            }
        })

        res.send({ menu: finalMenu, hero });
    },
    updateMenuItemEnabled: async (req, res) => {
        const db = req.app.get('db');
        const { item } = req.body;
        const { id } = req.params;
        const [updatedItem] = await db.menu_items.update_menu_item_enabled({ id, enabled: item.enabled });
        res.send(updatedItem);
    }
}