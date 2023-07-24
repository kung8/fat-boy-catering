let room = 'menu page';
const { formatOrder } = require('../hard-coded-controllers/admin/orderController');
const hooks = require('./hooks');

module.exports = {
    socketListeners: async (socket, io) => {
        socket.join(room);

        socket.on('join page', () => {
            io.in(room).emit('joined menu page successfully', room);
        });

        socket.on('join item page', () => {
            io.in(room).emit('joined item successfully');
        });

        socket.on('update menu data', async (menu) => {
            io.in(room).emit('updated menu data', menu);
        });

        socket.on('update menu item', async menuItem => {
            io.in(room).emit('updated menu item ' + menuItem.id, menuItem);
        })

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
            const today = dayjs();
            let start = today.startOf('day').format('MM/DD/YYYY HH:mm:ss');
            let end = today.endOf('day').format('MM/DD/YYYY HH:mm:ss');
            const orders = await hooks.getOrders({ start, end });
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