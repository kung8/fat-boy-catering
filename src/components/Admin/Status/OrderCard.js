import React, { useState, useEffect } from 'react';
import DateFormatter from '../../_Global/DateFormatter';
import axios from 'axios';
import socket from '../../_Global/Socket';

export default function OrderCard(props) {
    const { order, updateOrder } = props;
    let { lineItems, date, order_id, name, phone, department, status } = order;
    const statuses = ['Open', 'In Progress', 'Fulfilled'];
    const [selected, updateSelected] = useState(status);

    useEffect(() => {
        socket.emit('join page');
    }, [])

    const mapLineItems = () => {
        return (
            lineItems.map(item => {
                const { line_item_id, qty, ingredients, instructions, menu_item_name } = item;
                return (
                    <div key={order_id + '-' + line_item_id} className="line-item-card flex col">
                        <div className="line-item-heading flex-btwn">
                            <h3 className="menu-item-name">{menu_item_name}</h3>
                            <span className="qty">Qty: {qty}</span>
                        </div>
                        {ingredients && ingredients.length > 0 && <p className="ingredients">{mapIngredients(ingredients)}</p>}
                        {instructions && instructions.length > 0 && <p className="instructions">Note: {instructions}</p>}
                    </div>
                )
            })
        )
    }

    const mapIngredients = (ingredients) => {
        const lastIndex = ingredients.length - 1;
        return ingredients.map((ingredient, index) => {
            if (index !== lastIndex) return <span key={order_id + '-' + ingredient}>{ingredient + ', '}</span>;
            return <span key={order_id + '-' + ingredient}>{ingredient}</span>;
        })
    }

    status = status.toLowerCase().replace(' ', '-');

    const handleSelection = async (value) => {
        if (value !== selected) {
            await updateSelected(value);
            const { data } = await axios.put('/api/order/' + order_id, { status: value, phone });
            await updateOrder(data);
            socket.emit('update orders admin');
        }
    }

    return (
        <div className={`order-card ${status}`}>
            <div className="order-heading flex-btwn align-ctr">
                <h3 className="order-id">Order #{order_id}</h3>
                <select id="selection" className="status-label" value={selected} onChange={(e) => handleSelection(e.target.value)}>
                    {statuses.map(item => {
                        return (
                            <option key={order_id + '-' + item} value={item}>{item}</option>
                        )
                    })}
                </select>
            </div>
            {mapLineItems()}
            <div className="contact-info-container">
                <h3 className="name-and-department">{name}, {department}</h3>
                <div className="phone-and-date flex-btwn align-ctr">
                    <h4 className="phone">{phone}</h4>
                    <h4 className="date">{DateFormatter(date)}</h4>
                </div>
            </div>
        </div>
    )
}