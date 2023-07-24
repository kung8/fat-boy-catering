export const localStorageKeys = {
    adminMenu: 'admin-menu-items',
    menu: 'menu-items',
    menuItem: 'menu-item',
    hero: 'hero',
    outOfOfficeMessage: 'out-of-office-message',
    seenMessage: 'seen-out-of-office-message',
    delay: 'delay',
    admin: 'admin',
    cart: 'cart',
    customer: 'customer',
}

export const getLocalStorageKey = (key) =>
    JSON.parse(localStorage.getItem(key));


export const setLocalStorageKey = (key, value) =>
    localStorage.setItem(key, JSON.stringify(value));

export const removeLocalStorageKey = (key) =>
    localStorage.removeItem(key);