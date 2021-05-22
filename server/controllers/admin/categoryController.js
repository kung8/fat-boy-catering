const { loopThroughItems } = require('./menuItemController');

module.exports = {
    updateCategory: async (req, res) => {
        const db = req.app.get('db');
        const { name, image } = req.body;
        let { id } = req.params;
        let category;

        if (!id.includes('FPO-')) {
            id = Number(id);
            await db.categories.update_category({ id, name, image });
            const items = await db.categories.get_single_category({ id });
            let [newCategory] = await loopThroughItems(items);
            category = newCategory;
        } else {
            let [newCategory] = await db.categories.add_new_category({ name, image });
            newCategory.menuItems = [];
            category = newCategory;
        }
        res.send(category);
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
}