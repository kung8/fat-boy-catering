let room = 'menu page';

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
    }
}