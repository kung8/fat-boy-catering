import React from 'react';

export default function CartItem(props) {
    const { item, index, editCartItem } = props;
    const { menu_item_id, name, qty, instructions, selections } = item;

    const displayIngredients = () => {
        return selections.map((ingredient, num) => {
            if (num !== selections.length - 1) return ingredient + ', ';
            return ingredient;
        })
    }

    return (
        <div className="cart-item col">
            <div className="name-and-qty-container flex-btwn align-ctr">
                <h3 className="cart-item-name">{name}</h3>
                <div className="qty-and-edit-container align-ctr">
                    <h4 className="qty">Qty: {qty}</h4>
                    <svg onClick={() => editCartItem(menu_item_id, index)} className="edit-pencil" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 7.91646V10.0001H2.08362L8.23169 3.85199L6.14806 1.76837L0 7.91646Z" fill="black" /><path d="M9.83745 1.45992L8.54004 0.162522C8.32334 -0.0541741 7.9705 -0.0541741 7.75381 0.162522L6.737 1.17933L8.82062 3.26295L9.83743 2.24614C10.0542 2.02945 10.0542 1.67661 9.83745 1.45992Z" fill="black" /></svg>
                </div>
            </div>
            <p className="ingredients-list"><strong>Ingredients:</strong> {displayIngredients()}</p>
            <p className="special-instructions"><strong>Special Instructions:</strong> {instructions !== "" ? instructions : 'N/A'}</p>
        </div>
    )
}