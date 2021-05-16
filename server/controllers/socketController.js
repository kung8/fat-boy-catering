let room = 'menu page';

module.exports = {
    socketListeners: async (socket, db, io) => {
        socket.join(room);

        socket.on('join menu page room', () => {
            io.in(room).emit('joined menu page successfully');
        });

        socket.on('join menu item page', id => {
            room = 'menu item ' + id;
            socket.join(room);
            io.in(room).emit('joined menu item page successfully');
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

        socket.on('convey menu item update', async id => {
            room = 'menu item ' + id;
            socket.join(room);
            const [item] = await db.menu_items.get_menu_item({ id });
            let range = 0;
            if (item.range === 1) {
                range = 1;
            }
            item.range = range;
            let selections = await db.selections.get_selections_by_menu_item({ id });
            let selectionsWithIngredients = await selections.map(async group => {
                const ingredients = await db.ingredients.get_ingredients_by_selection({ id: group.id });
                group.ingredients = ingredients;
                return group;
            });
            Promise.all(selectionsWithIngredients).then(async final => {
                item.selections = final;
                io.in(room).emit('updated menu item ' + id + ' data', item);
            });
        });
    }
}