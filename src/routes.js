import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Menu from './components/Menu';
import AdminMenu from './components/AdminMenu/AdminMenu';
import MenuItem from './components/MenuItem';

// const path = '/craft-menu/';
const path = '/';

export default function route(routeProps) {
    return (
        <Switch>
            <Route path={`${path}admin/status`} component="" />
            <Route path={`${path}admin`} render={(props) => <AdminMenu {...props} {...routeProps}/>} />
            <Route path={`${path}:id`} render={(props) => <MenuItem {...props} {...routeProps}/>} />
            <Route exact path={`${path}`} render={(props) => <Menu {...props} {...routeProps}/>} />
        </Switch>
    )
}