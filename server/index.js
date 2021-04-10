const express = require('express');
const app = express();

const menuCtrl = require('./controllers/menuController');
const adminCtrl = require('./controllers/menuController');

app.use(express.json());
app.use(express.static(__dirname + '/../public/assets'));
app.get('/api/page/menu', menuCtrl.getMenuPage);

app.listen(8586, () => console.log('Get \'er done!'));