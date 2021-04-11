const menuData = require('../data/menu');

module.exports = {
    getMenuPage: (req, res) => {
        res.send(menuData);
    }, 
    getMenuItem: (req, res) => {
        
    }
}