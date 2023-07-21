const bcrypt = require('bcryptjs');
const { loopThroughItems } = require('./menuItemController');
const users = require('../data/users');
const hooks = require('../hooks');

const adminCtrl = {
    getAdminMenuPage: async (_req, res) => {
        const items = await hooks.getComprehensiveCategories();
        const menu = await loopThroughItems(items);
        const hero = hooks.getHero();
        const time = hooks.getDelay().delay;
        const { message, enabled: messageEnabled } = hooks.getOutOfOfficeMessage();
        res.send({ menu, hero, time, message, messageEnabled });
    },

    updateHero: async (req, res) => {
        const { hero } = req.body;
        heroes[0].hero = hero;
        res.sendStatus(200);
    },

    login: async (req, res) => {
        const { username, password } = req.body;
        const [user] = users.filter(user => user.username === username && user.password === password);
        if (user) {
            delete user.password;
            return res.send(user);
        }
        return res.sendStatus(401);
    },

    register: async (req, res) => {
        const { username, password } = req.body;
        let salt = bcrypt.genSaltSync(10);
        let hash = bcrypt.hashSync(password, salt);
        const [user] = await users.push({ username, password: hash });
        if (!user) {
            return res.sendStatus(400);
        }
        delete user.password;
        return res.status(200).send(user);
    }
}

module.exports = adminCtrl;