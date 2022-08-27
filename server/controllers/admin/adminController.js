const bcrypt = require('bcryptjs');
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
    },

    login: async (req, res) => {
        const db = req.app.get('db');
        const { username, password } = req.body;
        const [user] = await db.user.get_user({ username, password });
        const authenticated = bcrypt.compareSync(password, user.password);
        if (authenticated) {
            delete user.password;
            return res.send(user);
        }
        return res.sendStatus(401);
    },

    register: async (req, res) => {
        const db = req.app.get('db');
        const { username, password } = req.body;
        let salt = bcrypt.genSaltSync(10);
        let hash = bcrypt.hashSync(password, salt);
        const [user] = await db.user.add_user({ username, password: hash });
        if (!user) {
            return res.sendStatus(400);
        }
        delete user.password;
        return res.status(200).send(user);
    }
}

module.exports = adminCtrl;