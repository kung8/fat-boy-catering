const { sendSMS } = require('./msgController');

const orderCtrl = {
    getOrders: async (req, res) => {
        const db = req.app.get('db');
        const orders = await db.orders.get_orders();
        const organizedOrders = await orderCtrl.formatOrder(orders);
        res.send(organizedOrders);
    },

    formatOrder: async (orders) => {
        const organizedOrders = [];
        const existing = [];
        await orders.forEach(async order => {
            const { line_item_id, qty, menu_item_id, toppings, instructions, date, order_id, name, phone, department, status, menu_item_name } = order;

            const orderObj = {
                order_id,
                name,
                phone,
                department,
                date,
                status
            }

            const lineItem = {
                line_item_id,
                menu_item_id,
                ingredients: toppings,
                instructions,
                menu_item_name,
                qty
            }

            if (!existing.includes(order_id)) {
                existing.push(order_id);
                if (!orderObj.lineItems) {
                    orderObj.lineItems = [];
                }
                orderObj.lineItems.push(lineItem);
                organizedOrders.push(orderObj);
            } else {
                let index = organizedOrders.findIndex(item => item.order_id === order_id);
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
            sendSMS(formattedNumber);
        }
        const [order] = await orderCtrl.formatOrder(updatedOrder);
        res.send(order);
    },
}

module.exports = orderCtrl;