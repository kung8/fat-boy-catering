import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loading from '../../_Global/Loading';
import CartItem from './CartItem';
import Footer from '../../_Global/Footer';
import Toast from '../../_Global/Toast';
import { toast } from 'react-toastify';

export default function Cart(props) {
    const { checkHeight, updateCartNum } = props;
    const [isLoaded, updateIsLoaded] = useState(false);
    const [cartItems, updateCartItems] = useState([]);
    const [formData, updateFormData] = useState({ name: '', department: '', phone: '' });
    const { name, department, phone } = formData;

    useEffect(() => {
        getCart();
        // eslint-disable-next-line
    }, []);

    const getCart = async () => {
        let cart = sessionStorage.getItem('cart');
        if (cart) {
            cart = JSON.parse(cart);
            let newCart = [];
            for (let key in cart) {
                newCart.push(cart[key]);
            }
            await updateCartItems(newCart);
            await updateCartNum(newCart.length);
        }
        updateIsLoaded(true);
    }

    const editCartItem = (id, index) => {
        sessionStorage.setItem('selectedIndex', index);
        props.history.push('/cart/' + id);
    }

    const displayCart = () => {
        return (
            <div className="cart-container container-size">
                {cartItems.map((item, index) => {
                    return (
                        <CartItem
                            key={'cart-item-' + index}
                            item={item}
                            index={index}
                            editCartItem={editCartItem}
                        />
                    )
                })}
            </div>
        )
    }

    const handleFormDataUpdate = async (prop, value) => {
        const data = { ...formData };
        data[prop] = value;
        await updateFormData(data);
    }

    const handlePhoneUpdate = async (value) => {
        const data = { ...formData };
        let phone = value.replace(/\D/g, '');
        const match = phone.match(/^(\d{1,3})(\d{0,3})(\d{0,4})$/);
        if (match) {
            phone = `(${match[1]}${match[2] ? ') ' : ''}${match[2]}${match[3] ? ' - ' : ''}${match[3]}`;
        }
        data.phone = phone;
        updateFormData(data);
    }

    const handleCheckOut = async () => {
        const data = { name, department, phone, cartItems };
        if (name !== '' && department !== '' && phone !== '' && cartItems.length > 0) {
            await axios.post('/api/cart', data);
            updateFormData({ name: '', department: '', phone: '' });
            sessionStorage.removeItem('cart');
            updateCartNum(0);
            props.history.push('/');
        } else {
            toast('Please fill out all the fields', { className: 'salmon' })
        }
    }

    const displayCheckoutForm = () => {
        return (
            <div className="checkout-container container-size">
                <div className="form-container">
                    <h3 className="name-label">Name</h3>
                    <input
                        onChange={(e) => handleFormDataUpdate(e.target.name, e.target.value)}
                        required
                        value={name}
                        type="text"
                        name="name"
                        id="checkout-name-input"
                        className="name-input" />
                </div>
                <div className="form-container">
                    <h3 className="department-label">Department</h3>
                    <input
                        onChange={(e) => handleFormDataUpdate(e.target.name, e.target.value)}
                        required
                        type="text"
                        name="department"
                        id="checkout-department-input"
                        value={department}
                        className="department-input" />
                </div>
                <div className="form-container">
                    <h3 className="phone-label">Phone</h3>
                    <input
                        onChange={(e) => handlePhoneUpdate(e.target.value)}
                        required
                        maxLength={16}
                        type="text"
                        name="phone"
                        id="checkout-phone-input"
                        value={phone}
                        className="phone-input" />
                </div>
            </div>
        )
    }

    return (
        <Loading loaded={isLoaded} checkHeight={checkHeight} image=".cart-label-container">
            <div className="cart-page">
                {/* <div className="appreciation-container">
                    Thank you for letting me serve you!
                </div> */}
                <div className="cart-label-container" onClick={() => props.history.push('/')}>
                    <svg className="cart-chevron-arrow" viewBox="0 0 6 11" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.684322 0.261289L0.22601 0.790717C0.0753511 0.974183 0 1.18846 0 1.43306C0 1.6827 0.0753511 1.89443 0.22601 2.0686L3.19558 5.49998L0.226096 8.93133C0.0754366 9.10547 8.5718e-05 9.31725 8.5718e-05 9.56679C8.5718e-05 9.81151 0.0754366 10.0257 0.226096 10.2092L0.684408 10.7317C0.839112 10.9106 1.0245 11 1.24041 11C1.46035 11 1.64364 10.9105 1.79025 10.7317L5.76785 6.13547C5.92257 5.96595 6 5.75424 6 5.5C6 5.25053 5.9226 5.03633 5.76785 4.85761L1.79025 0.261313C1.63951 0.0871458 1.45624 0 1.24041 0C1.02853 -2.47955e-05 0.843242 0.087121 0.684322 0.261289Z" fill="black" /></svg>
                    <h2 className="cart-name">Cart</h2>
                </div>
                <div className="cart-and-checkout-container col align-ctr">
                    {displayCart()}
                    {displayCheckoutForm()}
                    <button onClick={() => handleCheckOut()} className="checkout-btn">Place Order</button>
                </div>
                <Footer />
                {Toast}
            </div>
        </Loading>
    )
}