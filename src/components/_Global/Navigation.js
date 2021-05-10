import React from 'react';
import { withRouter } from 'react-router';

function Navigation(props) {
    const { history, isTransparent, cartNum, isAdmin } = props;

    return (
        <div className={`navigation align-ctr flex-btwn ${isTransparent && 'transparent'}`}>
            <h1 onClick={() => history.push('/')}>Fat Boy Catering</h1>
            {
                isAdmin ?
                    <svg onClick={() => history.push('/admin/status')} className="tracking-icon" width="36" height="36" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19.6801 1.34637C16.8682 -1.56297 12.1929 0.574815 12.1366 4.58961C12.1147 6.20063 12.8715 7.68657 14.1611 8.56338C14.4301 8.7463 14.3481 8.6772 15.9527 11.6516C15.9814 11.7047 16.015 11.752 16.052 11.794L13.7111 14.1606C12.8616 13.2756 11.4514 13.4397 10.8076 14.5046L7.68306 12.5531C7.67841 11.4725 6.83887 10.5944 5.80788 10.5944C4.17126 10.5944 3.32915 12.6486 4.43289 13.8982L2.38852 17.1397C1.1973 16.7821 0 17.7248 0 19.0324C0 20.1171 0.84082 21 1.8747 21C3.67811 21 4.43706 18.5744 2.98757 17.4499L4.96289 14.3183C5.93653 14.8383 7.14617 14.3672 7.55296 13.2813L10.5551 15.1565C10.3127 16.3746 11.2043 17.5242 12.3909 17.5242C13.7553 17.5242 14.6647 16.0334 14.0954 14.7371C16.9587 11.8424 16.7828 12.0247 16.8111 11.9837C16.9608 11.9272 17.095 11.8167 17.1839 11.6516C18.7877 8.67854 18.7063 8.7463 18.9763 8.56287C20.2436 7.70053 21 6.24065 21 4.65787C21 3.40361 20.5314 2.22737 19.6801 1.34637ZM3.08739 19.0324C3.08739 19.734 2.54329 20.3049 1.8747 20.3049C1.20612 20.3049 0.662498 19.734 0.662498 19.0324C0.662498 18.3306 1.20612 17.7598 1.8747 17.7598C2.54329 17.7598 3.08739 18.3306 3.08739 19.0324ZM4.81549 13.2921C4.25537 12.4586 4.82414 11.2896 5.80788 11.2896C6.47983 11.2896 7.02056 11.8645 7.02056 12.5622C7.02056 13.7961 5.49738 14.3104 4.81549 13.2921ZM12.3909 16.8292C11.5896 16.8292 11.1204 16.0376 11.179 15.5457C11.1862 14.4296 12.4728 13.8674 13.2338 14.6433C14.0105 15.4297 13.4829 16.8292 12.3909 16.8292ZM18.6384 8.01594C18.4248 8.16138 18.2468 8.35859 18.1238 8.58675C16.5283 11.5443 16.6414 11.3765 16.5684 11.3765C16.4952 11.3765 16.6108 11.549 15.0128 8.58675C14.8898 8.35859 14.7123 8.16138 14.4985 8.01628C13.3895 7.26204 12.7386 5.98476 12.7576 4.59919C12.8055 1.10981 16.8557 -0.660105 19.2442 1.81041C20.9797 3.60672 20.6833 6.62466 18.6384 8.01594Z" fill="white" />
                        <path d="M19.0499 2.73094C18.0092 1.25105 16.0715 1.01483 14.7367 2.04866C13.3964 3.0867 13.058 5.11234 14.0864 6.57491C15.1802 8.13029 17.2691 8.31456 18.6055 7.08317C18.743 6.95657 18.7566 6.73699 18.6359 6.59273C18.5153 6.44847 18.3061 6.43418 18.1684 6.56079C17.1155 7.5304 15.4766 7.3811 14.6195 6.16215C13.8123 5.01415 14.0776 3.42313 15.1301 2.60787C16.1819 1.79327 17.7022 1.98545 18.5169 3.1437C19.0426 3.89121 19.1196 4.83812 18.8005 5.63926C18.73 5.8163 18.8096 6.01991 18.9783 6.09406C19.147 6.16786 19.3412 6.08447 19.4117 5.90726C19.8068 4.91546 19.7342 3.70391 19.0499 2.73094Z" fill="white" />
                    </svg>
                    :
                    <div className="cart-container">
                        <svg onClick={() => history.push('/cart')} className="cart" viewBox="0 0 24 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.9174 25.4857C11.484 25.4857 12.754 24.1452 12.754 22.4917C12.754 20.8382 11.484 19.4978 9.9174 19.4978C8.3508 19.4978 7.08081 20.8382 7.08081 22.4917C7.08081 24.1452 8.3508 25.4857 9.9174 25.4857Z" fill={`${isTransparent ? '#797777' : 'white'}`} />
                            <path d="M18.1957 19.4978C16.6291 19.4978 15.3591 20.8383 15.3591 22.4917C15.3591 24.1452 16.6291 25.4857 18.1957 25.4857C19.7623 25.4857 21.0323 24.1452 21.0323 22.4917C21.0323 20.8383 19.7623 19.4978 18.1957 19.4978Z" fill={`${isTransparent ? '#797777' : 'white'}`} />
                            <path d="M23.0295 16.4424H8.23868L7.94924 14.6704H20.1061C20.4637 14.6716 20.7854 14.4411 20.9165 14.09L23.811 6.39129C23.9869 5.92039 23.7677 5.38815 23.3215 5.20258C23.2193 5.16003 23.1104 5.13837 23.0005 5.13873H6.4441L5.74943 0.922785C5.67808 0.477001 5.30938 0.152702 4.88108 0.159026H1.55243C1.07286 0.159026 0.684082 0.569368 0.684082 1.07554C0.684082 1.58171 1.07286 1.99205 1.55243 1.99205H4.15746L6.64672 17.5116C6.71806 17.9574 7.08677 18.2817 7.51506 18.2754H23.0295C23.5091 18.2754 23.8978 17.865 23.8978 17.3589C23.8978 16.8527 23.5091 16.4424 23.0295 16.4424Z" fill={`${isTransparent ? '#797777' : 'white'}`} />
                        </svg>
                        <span className="cart-num">{cartNum}</span>
                    </div>
            }
        </div>
    )
}

export default withRouter(Navigation);