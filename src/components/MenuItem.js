import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Footer from './Footer';

export default function MenuItem(props) {
    const [menuItem, updateMenuItem] = useState({});

    useEffect(() => {
        getMenuItemData();
        // eslint-disable-next-line
    }, [])

    const getMenuItemData = async () => {
        let id = props.match.params.id;
        let { data } = await axios.get('/api/menu/' + id);
        console.log(data);
        updateMenuItem(data);
    }

    return (
        <div>
            MenuItem
            <Footer />
        </div>
    )
}