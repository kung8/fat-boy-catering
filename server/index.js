require('dotenv').config();
const { SERVER_PORT, CONNECTION_STRING } = process.env;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const massive = require('massive');
const socket = require('socket.io');
const express = require('express');

const menuCtrl = require('./controllers/menuController');
const adminCtrl = require('./controllers/adminController');
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
    
    app.get('/api/menu/admin', adminCtrl.getAdminMenuPage);
    app.put('/api/menu/hero', adminCtrl.updateHero);
    app.put('/api/category/:id', adminCtrl.updateCategory);
    app.delete('/api/category/:id', adminCtrl.deleteCategory);
    app.put('/api/menu/:id/enabled', adminCtrl.updateMenuItemEnabled);
    app.put('/api/menu/:id', adminCtrl.updateMenuItem);
    app.get('/api/menu/:id', menuCtrl.getMenuItem);
    app.get('/api/menu', menuCtrl.getMenuPage);
    app.post('/api/cart', menuCtrl.checkout);
    app.get('/api/orders', adminCtrl.getOrders);
    app.put('/api/order/:id', adminCtrl.updateOrderStatus);
    app.post('/api/delay', adminCtrl.updateDelay);
})