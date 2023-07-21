require('dotenv').config();
const { SERVER_PORT } = process.env;

const socket = require('socket.io');
const express = require('express');

const adminCtrl2 = require('./hard-coded-controllers/admin/adminController');
const catCtrl2 = require('./hard-coded-controllers/admin/categoryController');
const menuItemCtrl2 = require('./hard-coded-controllers/admin/menuItemController');
const orderCtrl2 = require('./hard-coded-controllers/admin/orderController');
const msgCtrl2 = require('./hard-coded-controllers/admin/msgController');
const customerCtrl2 = require('./hard-coded-controllers/customerController');
const socketCtrl = require('./hard-coded-controllers/socketController');

const app = express();
app.use(express.json());
app.use(express.static(__dirname + '/../public/assets'));
app.use(express.static(`${__dirname}/../build`));

const io = socket(app.listen(SERVER_PORT, () => {
    console.log('Get \'er done!');
}));

//SOCKET ENDPOINTS
io.on('connection', socket => {
    socketCtrl.socketListeners(socket, io);
});

// ADMIN PAGE
app.get('/api/menu/admin', adminCtrl2.getAdminMenuPage);
app.put('/api/menu/hero', adminCtrl2.updateHero);
app.post('/api/user', adminCtrl2.login);
app.post('/api/register', adminCtrl2.register);

// CATEGORY
app.put('/api/category/:id', catCtrl2.updateCategory);
app.delete('/api/category/:id', catCtrl2.deleteCategory);

// MENU ITEM
app.delete('/api/category/:category_id/menu/:menu_item_id', menuItemCtrl2.deleteMenuItem);
app.put('/api/menu/:id/enabled', menuItemCtrl2.updateMenuItemEnabled);
app.put('/api/menu/:id', menuItemCtrl2.updateMenuItem);

// CUSTOMER PAGES
app.get('/api/menu/:id', customerCtrl2.getMenuItem);
app.get('/api/menu', customerCtrl2.getMenuPage);
app.get('/api/messaging', customerCtrl2.getMessaging);
app.post('/api/cart', customerCtrl2.checkout);

// ORDER
app.get('/api/orders', orderCtrl2.getOrders);
app.put('/api/order/:id', orderCtrl2.updateOrderStatus);

// MESSAGES
app.post('/api/delay', msgCtrl2.updateDelay);
app.post('/api/message', msgCtrl2.updateOutOfOfficeMessage);