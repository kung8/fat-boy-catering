import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Menu from './components/Menu';

// const path = '/craft-menu/';
const path = '/';

export default function route(routeProps) {
    return (
        <Switch>
            <Route path={`${path}admin/status`} component="" />
            <Route path={`${path}admin`} component="" />
            <Route path={`${path}`} render={(props) => <Menu {...props} {...routeProps}/>} />
        </Switch>
    )
}