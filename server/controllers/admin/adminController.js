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
        let [user] = await db.user.get_user({ username, password });
        if (!user) {
            const newUser = await adminCtrl.register(db, username, password);
            return res.send(newUser);
        } else {
            let authenticated = bcrypt.compareSync(password, user.password);
            if (authenticated) {
                delete user.password;
                return res.send(user);
            }
            return res.sendStatus(401);
        }
    },

    register: async (db, username, password) => {
        let salt = bcrypt.genSaltSync(10);
        let hash = bcrypt.hashSync(password, salt);
        const [user] = await db.user.add_user({ username, password: hash });
        return user;
    }
}

module.exports = adminCtrl;