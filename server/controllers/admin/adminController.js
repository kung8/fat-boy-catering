const { loopThroughItems } = require('./menuItemController');

const adminCtrl = {
    getAdminMenuPage: async (req, res) => {
        const db = req.app.get('db');
        const items = await db.categories.get_categories_with_menu_items();
        const [messageObj] = await db.message.get_out_of_office_message();
        const [heroInstance] = await db.hero.get_hero();
        const [delay] = await db.delay.get_delay();
        const finalMenu = await loopThroughItems(items);
        res.send({ menu: finalMenu, hero: heroInstance.hero, time: delay, message: messageObj });
    },

    updateHero: async (req, res) => {
        const db = req.app.get('db');
        const { hero } = req.body;
        await db.hero.update_hero({ hero });
        res.sendStatus(200);
    }
}

module.exports = adminCtrl;