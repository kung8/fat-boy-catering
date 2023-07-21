const { loopThroughItems } = require('./menuItemController');
const hooks = require('../hooks');

module.exports = {
    updateCategory: async (req, res) => {
        const { name, image } = req.body;
        let { id } = req.params;
        let category;

        if (!id.includes('FPO-')) {
            id = Number(id);
            const updatedCategory = await hooks.updateCategory({ id, name, image });
            const items = await hooks.getComprehensiveCategory(updatedCategory)
            let [newCategory] = await loopThroughItems(items);
            category = newCategory;
        } else {
            const newCategory = await hooks.createCategory({ name, image });
            newCategory.menuItems = [];
            category = newCategory;
        }
        res.send(category);
    },

    deleteCategory: async (req, res) => {
        let { id } = req.params;
        id = Number(id);
        const menuItems = hooks.getMenuItemsByCategory(id);
        menuItems.forEach(async item => {
            hooks.deleteMenuItem(item.id);
        });
        hooks.deleteCategory(id);
        res.status(200);
    },
}