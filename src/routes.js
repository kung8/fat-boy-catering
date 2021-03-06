import React from 'react';
import { Switch, Route } from 'react-router-dom';
import AdminMenu from './components/Admin/AdminMenu/AdminMenu';
import Menu from './components/Customer/Menu';
import MenuItem from './components/Customer/MenuItem';
import Status from './components/Admin/Status/Status';
import Cart from './components/Customer/Cart/Cart';
import EditMenuItem from './components/Customer/Cart/EditMenuItem';

// const path = '/craft-menu/';
const path = '/';

export default function route(routeProps) {
    return (
        <Switch>
            <Route path={`${path}cart/:id`} render={(props) => <EditMenuItem {...props} {...routeProps} />} />
            <Route path={`${path}cart`} render={(props) => <Cart {...props} {...routeProps} />} />
            <Route path={`${path}admin/status`} render={(props) => <Status {...props} {...routeProps} />} />
            <Route path={`${path}admin`} render={(props) => <AdminMenu {...props} {...routeProps} />} />
            <Route path={`${path}:id`} render={(props) => <MenuItem {...props} {...routeProps} />} />
            <Route exact path={`${path}`} render={(props) => <Menu {...props} {...routeProps} />} />
        </Switch>
    )
}