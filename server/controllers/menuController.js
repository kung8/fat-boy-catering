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
        })


    },
    getMenuItem: async (req, res) => {
        const db = req.app.get('db');
        const { id } = req.params;
        const [item] = await db.menu_items.get_specific_item({ id });
        res.send(item);
    },

    updateMenuItemEnabled: async (req, res, next) => {
        const db = req.app.get('db');
        const { item } = req.body;
        const { id } = req.params;
        const [updatedItem] = await db.menu_items.update_menu_item_enabled({ id, enabled: item.enabled });
        res.send(updatedItem);
    }
}