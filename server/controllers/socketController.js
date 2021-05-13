module.exports = {
    socketListeners: async (socket, db, io) => {
        let room = 'menu page';
        socket.join(room);
        socket.on('join room', () => {
            io.in(room).emit('joined successfully');
        })
        socket.on('update menu data', async menu => {
            socket.join(room);
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