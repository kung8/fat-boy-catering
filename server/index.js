require('dotenv').config();
const { SERVER_PORT, CONNECTION_STRING } = process.env;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const massive = require('massive');
const socket = require('socket.io');
const express = require('express');

const menuCtrl = require('./controllers/menuController');
const adminCtrl = require('./controllers/menuController');

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
        SocketCtrl.socketListeners(socket, db, io);
    });

    app.get('/api/menu/:id', menuCtrl.getMenuItem);
    app.get('/api/menu', menuCtrl.getMenuPage);
});