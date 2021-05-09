import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loading from '../_Global/Loading';

export default function Checkout(props) {
    const { checkHeight, updateCartNum } = props;
    const [isLoaded, updateIsLoaded] = useState(false);
    
    useEffect(() => {
        checkOut();
    }, [])

    const checkOut = () => {
        updateIsLoaded(true);
    }

    return (
        <Loading loaded={isLoaded} checkHeight={checkHeight} image='.hero'>
            <div className="checkout-page">
                <h2>Checkout</h2>
            </div>
        </Loading>
    )
}