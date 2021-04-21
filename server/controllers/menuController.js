const menuData = require('../data/menu');
const hero = './assets/background-menu-placeholder.png';

module.exports = {
    getMenuPage: async (req, res) => {
        const db = req.app.get('db');
        const categories = await db.categories.get_categories();
        const catWithMenuItems = await categories.map(async cat => {
            const menuItems = await db.menu_items.get_menu_items({ id: cat.id });
            cat.menuItems = menuItems;
            return cat;
        });

        Promise.all(catWithMenuItems).then(menu => {
            res.send({ menu, hero });
        });
    },
    getAdminMenuPage: async (req, res) => {
        
    },
    getMenuItem: async (req, res) => {
        const db = req.app.get('db');
        const { id } = req.params;
        const [item] = await db.menu_items.get_specific_item({ id });

        let range = [5, 10];

        if (item.range === 1) {
            range = [10, 15];
        }

        item.range = range;

        let selections = await db.selections.get_selections_for_menu_item({ id });
        let selectionsWithIngredients = await selections.map(async group => {
            const ingredients = await db.ingredients.get_ingredients_for_selection({ id: group.id });
            group.ingredients = ingredients;
            return group;
        });
        Promise.all(selectionsWithIngredients).then(() => {
            item.selections = selections;
            res.send(item);
        });
    },

    updateMenuItemEnabled: async (req, res) => {
        const db = req.app.get('db');
        const { item } = req.body;
        const { id } = req.params;
        const [updatedItem] = await db.menu_items.update_menu_item_enabled({ id, enabled: item.enabled });
        res.send(updatedItem);
    }
}