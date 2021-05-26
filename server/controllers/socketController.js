let room = 'menu page';
const { formatOrder } = require('../controllers/admin/orderController');

module.exports = {
    socketListeners: async (socket, db, io) => {
        socket.join(room);

        socket.on('join page', () => {
            io.in(room).emit('joined menu page successfully', room);
        });

        socket.on('join item page', () => {
            io.in(room).emit('joined item successfully');
        });

        socket.on('update menu data', async menu => {
            io.in(room).emit('updated menu data', menu);
        });

        socket.on('update category data', async category => {
            io.in(room).emit('updated category data', category);
        });

        socket.on('delete category data', async id => {
            io.in(room).emit('deleted category data', id);
        });

        socket.on('update orders', async () => {
            const formattedOrders = await getFormattedOrders();
            io.in(room).emit('updated orders', formattedOrders);
        });

        socket.on('update orders admin', async () => {
            const formattedOrders = await getFormattedOrders();
            io.in(room).emit('updated orders admin', formattedOrders);
        });

        const getFormattedOrders = async () => {
            let date = new Date();
            let month = date.getMonth();
            let year = date.getFullYear();
            let day = date.getDate();
            if (month < 10) month = '0' + month;
            if (day < 10) day = '0' + day;
            date = year + '-' + month + '-' + day;

            let start = new Date(date + 'T00:00:00.000Z').getTime().toString();
            let end = new Date(date + 'T23:59:59.999Z').getTime().toString();

            const orders = await db.orders.get_orders({ start, end });
            const formattedOrders = await formatOrder(orders);
            return formattedOrders;
        }

        socket.on('update delay', delay => {
            io.in(room).emit('updated delay', delay);
        });

        socket.on('update out of office message', message => {
            io.in(room).emit('updated out of office message', message);
        })
    }
}