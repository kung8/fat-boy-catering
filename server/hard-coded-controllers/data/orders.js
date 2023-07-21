const orders = [
    {
        id: 1,
        name: 'Harry Potter',
        phone: '801-123-4567',
        department: 'camera',
        status: 'Fulfilled',
    },
    {
        id: 2,
        name: 'Hermione Granger',
        phone: '801-555-1234',
        department: 'audio',
        status: 'In Progress',
    },
    {
        id: 3,
        name: 'Ron Weasley',
        phone: '801-999-4321',
        department: 'accounting',
        status: 'Cancelled',
    },
    {
        id: 4,
        name: 'Ginny Weasley',
        phone: '801-888-0203',
        department: 'hr',
        status: 'Open',
    },
    {
        id: 5,
        name: 'Luna Lovegood',
        phone: '801-777-8493',
        department: 'engineering',
        status: 'Open',
    },
];

const currentOrderId = 6;

module.exports = {
    orders,
    currentOrderId,
};

// const statuses = ['Open', 'In Progress', 'Fulfilled', 'Cancelled'];
