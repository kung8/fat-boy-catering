const hooks = require('../hooks');
const { sendSMS } = require('./msgController');

const orderCtrl = {
    getOrders: async (_req, res) => {
        const orders = hooks.getOrders();
        const organizedOrders = await orderCtrl.formatOrder(orders);
        res.send(organizedOrders);
    },

    formatOrder: async (orders) => {
        const organizedOrders = [];
        const existing = [];
        await orders.forEach(async order => {
            const { lineItemId, qty, menuItemId, ingredients, instructions, date, orderId, name, phone, department, status, menuItemName } = order;

            const orderObj = {
                orderId,
                name,
                phone,
                department,
                date,
                status
            }

            const lineItem = {
                lineItemId,
                menuItemId,
                ingredients,
                instructions,
                menuItemName,
                qty
            }

            if (!existing.includes(orderId)) {
                existing.push(orderId);
                if (!orderObj.lineItems) {
                    orderObj.lineItems = [];
                }
                orderObj.lineItems.push(lineItem);
                organizedOrders.push(orderObj);
            } else {
                let index = organizedOrders.findIndex(item => item.orderId === orderId);
                if (index > -1) organizedOrders[index].lineItems.push(lineItem);
            }
        });

        return organizedOrders;
    },

    updateOrderStatus: async (req, res) => {
        const db = req.app.get('db');
        const { id } = req.params;
        const { status, phone } = req.body;
        const updatedOrder = await db.orders.update_status({ id, status });
        if (status === 'Fulfilled') {
            const formattedNumber = '+1' + phone.replace(/[^0-9.]/gi, '');
            console.log('this has been fulfilled: ', formattedNumber);
            // sendSMS(formattedNumber);
        }
        const [order] = await orderCtrl.formatOrder(updatedOrder);
        res.send(order);
    },
}

module.exports = orderCtrl;