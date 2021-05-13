module.exports = {
    socketListeners: async (socket, db, io) => {
        socket.on('update menu data', async (data) => {
            console.log(data);
            socket.join('menu page');
            io.in('menu page').emit('update menu data', data);
        });

        socket.on('', async () => {

        });
    }
}