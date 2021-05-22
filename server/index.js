require('dotenv').config();
const { SERVER_PORT, CONNECTION_STRING } = process.env;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const massive = require('massive');
const socket = require('socket.io');
const express = require('express');

const adminCtrl = require('./controllers/admin/adminController');
const catCtrl = require('./controllers/admin/categoryController');
const menuItemCtrl = require('./controllers/admin/menuItemController');
const orderCtrl = require('./controllers/admin/orderController');
const msgCtrl = require('./controllers/admin/msgController');
const menuCtrl = require('./controllers/menuController');
const socketCtrl = require('./controllers/socketController');

const app = express();
app.use(express.json());
app.use(express.static(__dirname + '/../public/assets'));

massive(CONNECTION_STRING).then(db => {
    app.set('db', db);
    const io = socket(app.listen(SERVER_PORT, () => {
        console.log('Get \'er done!');
    }));

    //SOCKET ENDPOINTS
    io.on('connection', socket => {
        socketCtrl.socketListeners(socket, db, io);
    });
    
    //ADMIN PAGE
    app.get('/api/menu/admin', adminCtrl.getAdminMenuPage);
    app.put('/api/menu/hero', adminCtrl.updateHero);

    //CATEGORY
    app.put('/api/category/:id', catCtrl.updateCategory);
    app.delete('/api/category/:id', catCtrl.deleteCategory);

    //MENU ITEM
    app.put('/api/menu/:id/enabled', menuItemCtrl.updateMenuItemEnabled);
    app.put('/api/menu/:id', menuItemCtrl.updateMenuItem);
    
    //CUSTOMER PAGES
    app.get('/api/menu/:id', menuCtrl.getMenuItem);
    app.get('/api/menu', menuCtrl.getMenuPage);
    app.get('/api/messaging', menuCtrl.getMessaging);
    app.post('/api/cart', menuCtrl.checkout);

    //ORDER
    app.get('/api/orders', orderCtrl.getOrders);
    app.put('/api/order/:id', orderCtrl.updateOrderStatus);

    //MESSAGES
    app.post('/api/delay', msgCtrl.updateDelay);
    app.post('/api/message', msgCtrl.updateOutOfOfficeMessage);
})