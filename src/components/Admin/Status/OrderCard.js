import React from 'react';
import DateFormatter from '../../_Global/DateFormatter';

export default function OrderCard(props) {
    const { order } = props;
    let { lineItems, date, order_id, name, phone, department, status } = order;

    const mapLineItems = () => {
        return (
            lineItems.map(item => {
                const { line_item_id, qty, ingredients, instructions, menu_item_name } = item;
                return (
                    <div key={line_item_id} className="line-item-card">
                        <div className="line-item-heading flex-btwn align-ctr">
                            <h3 className="menu-item-name">{menu_item_name}</h3>
                            <span className="qty">Qty: {qty}</span>
                        </div>
                        {ingredients && ingredients.length > 0 && <p className="ingredients">{mapIngredients(ingredients)}</p>}
                        {instructions && instructions.length > 0 && <p className="instructions">{instructions}</p>}
                    </div>
                )
            })
        )
    }

    const mapIngredients = (ingredients) => {
        const lastIndex = ingredients.length - 1;
        return ingredients.map((ingredient, index) => {
            if (index !== lastIndex) return ingredient + ', ';
            return ingredient;
        })
    }

    status = status.toLowerCase().replace(' ', '-');

    return (
        <div className={`order-card ${status}`}>
            <div className="order-heading flex-btwn align-ctr">
                <h3 className="order-id">Order #{order_id}</h3>
                <button className="status-label">
                    <span>{status}</span>
                </button>
            </div>
            {mapLineItems()}
            <div className="contact-info-container">
                <h3 className="name-and-department">{name}, {department}</h3>
                <div className="phone-and-date flex-btwn align-ctr">
                    <h4>{phone}</h4>
                    <h4>{DateFormatter(date)}</h4>
                </div>
            </div>
        </div>
    )
}