const menuData = require('../data/menu');
const hero = './assets/background-menu-placeholder.png';

module.exports = {
    getMenuPage: async (req, res) => {
        const db = req.app.get('db');
        const categories = await db.categories.get_categories();
        const catWithMenuItems = await categories.map(async cat => {
            const menuItems = await db.menu_items.get_menu_items_by_category({ id: cat.id });
            cat.menuItems = menuItems;
            return cat;
        });

        Promise.all(catWithMenuItems).then(menu => {
            res.send({ menu, hero });
        });
    },
    getMenuItem: async (req, res) => {
        const db = req.app.get('db');
        const { id } = req.params;
        const [item] = await db.menu_items.get_menu_item({ id });

        let range = 0;

        if (item.range === 1) {
            range = 1;
        }

        item.range = range;

        let selections = await db.selections.get_selections_by_menu_item({ id });
        let selectionsWithIngredients = await selections.map(async group => {
            const ingredients = await db.ingredients.get_ingredients_by_selection({ id: group.id });
            group.ingredients = ingredients;
            return group;
        });
        Promise.all(selectionsWithIngredients).then(() => {
            item.selections = selections;
            res.send(item);
        });
    },
    checkout: async (req, res) => {
        const db = req.app.get('db');
        let { name, department, phone, cartItems } = req.body;
        const [newOrder] = await db.orders.add_order({ name, department, phone });
        const order_id = newOrder.id;

        const date = Date.now();

        await cartItems.forEach(async item => {
            let { instructions, selections: ingredients, menu_item_id } = item;
            if (instructions === '') instructions = null;
            await db.orders.add_line_item({ order_id, menu_item_id, ingredients, instructions, date });
        });
        return res.sendStatus(200);
    }
}