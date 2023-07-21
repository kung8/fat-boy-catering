const dayjs = require('dayjs');
const today = dayjs().format('MM/DD/YYYY HH:mm:ss');

const lineItems = [
    {
        id: 1,
        orderId: 1,
        menuItemId: 3,
        ingredients: [],
        instructions: '',
        date: today,
        qty: 1,
    },
    {
        id: 2,
        orderId: 1,
        menuItemId: 1,
        ingredients: [],
        instructions: '',
        date: today,
        qty: 1,
    },
    {
        id: 3,
        orderId: 2,
        menuItemId: 1,
        ingredients: [],
        instructions: '',
        date: today,
        qty: 1,
    },
    {
        id: 4,
        orderId: 3,
        menuItemId: 1,
        ingredients: [],
        instructions: '',
        date: today,
        qty: 1,
    },
    {
        id: 5,
        orderId: 4,
        menuItemId: 1,
        ingredients: [],
        instructions: '',
        date: today,
        qty: 1,
    },
    {
        id: 6,
        orderId: 5,
        menuItemId: 1,
        ingredients: [],
        instructions: '',
        date: today,
        qty: 1,
    },
    {
        id: 7,
        orderId: 5,
        menuItemId: 1,
        ingredients: [],
        instructions: '',
        date: today,
        qty: 1,
    },
];

const currentLineItemId = 8;

module.exports = {
    lineItems,
    currentLineItemId,
};