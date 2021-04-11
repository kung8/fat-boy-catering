import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Footer from './Footer';

export default function MenuItem(props) {
    const [menuItem, updateMenuItem] = useState({});

    useEffect(() => {
        getMenuItemData();
    }, [])

    const getMenuItemData = () => {
        let id = props.match.params.id;
        let { data } = axios.get('/api/menu/' + id);
    }

    return (
        <div>
            MenuItem
            <Footer />
        </div>
    )
}