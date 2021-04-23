import React from 'react';
import { withRouter } from 'react-router';

function Navigation(props) {
    const { history, isTransparent, cartNum } = props;

    return (
        <div className={`navigation align-ctr flex-btwn ${isTransparent && 'transparent'}`}>
            <h1 onClick={() => history.push('/')}>Fat Boy Catering</h1>
            <div className="cart-container">
                <svg onClick={() => history.push('/cart')} className="cart" viewBox="0 0 24 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.9174 25.4857C11.484 25.4857 12.754 24.1452 12.754 22.4917C12.754 20.8382 11.484 19.4978 9.9174 19.4978C8.3508 19.4978 7.08081 20.8382 7.08081 22.4917C7.08081 24.1452 8.3508 25.4857 9.9174 25.4857Z" fill={`${isTransparent ? '#797777' : 'white'}`} />
                    <path d="M18.1957 19.4978C16.6291 19.4978 15.3591 20.8383 15.3591 22.4917C15.3591 24.1452 16.6291 25.4857 18.1957 25.4857C19.7623 25.4857 21.0323 24.1452 21.0323 22.4917C21.0323 20.8383 19.7623 19.4978 18.1957 19.4978Z" fill={`${isTransparent ? '#797777' : 'white'}`} />
                    <path d="M23.0295 16.4424H8.23868L7.94924 14.6704H20.1061C20.4637 14.6716 20.7854 14.4411 20.9165 14.09L23.811 6.39129C23.9869 5.92039 23.7677 5.38815 23.3215 5.20258C23.2193 5.16003 23.1104 5.13837 23.0005 5.13873H6.4441L5.74943 0.922785C5.67808 0.477001 5.30938 0.152702 4.88108 0.159026H1.55243C1.07286 0.159026 0.684082 0.569368 0.684082 1.07554C0.684082 1.58171 1.07286 1.99205 1.55243 1.99205H4.15746L6.64672 17.5116C6.71806 17.9574 7.08677 18.2817 7.51506 18.2754H23.0295C23.5091 18.2754 23.8978 17.865 23.8978 17.3589C23.8978 16.8527 23.5091 16.4424 23.0295 16.4424Z" fill={`${isTransparent ? '#797777' : 'white'}`} />
                </svg>
                <span className="cart-num">{cartNum}</span>
            </div>
        </div>
    )
}

export default withRouter(Navigation);