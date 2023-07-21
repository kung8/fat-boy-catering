const dayjs = require('dayjs');
let { orders, currentOrderId } = require('./data/orders');
let { lineItems, currentLineItemId } = require('./data/line_items');

const hooks = require('./hooks');

module.exports = {
    getMenuPage: async (_req, res) => {
        const menu = hooks.getCategoriesWithMenuItems();
        const hero = hooks.getHero();
        const delay = hooks.getDelay().delay;
        const message = hooks.getOutOfOfficeMessage();
        res.send({ menu, hero, delay, message });
    },
    getMenuItem: async (req, res) => {
        let { id } = req.params;
        id = Number(id);
        const delay = hooks.getDelay().delay;
        const [item] = hooks.getMenuItem(id);
        if (item) {
            let range = 0;
            if (item.range === 1) {
                range = 1;
            }
            item.range = range;
            delete item.rangeId;

            const selectionsByMenuItem = hooks.getSelectionsByMenuItem(id);
            let selectionsWithIngredients = selectionsByMenuItem.map(async group => {
                const selectionsIngredients = hooks.getSelectionsIngredientsBySelection(group.id);
                group.ingredients = selectionsIngredients.map(selectionIngredient => {
                    const [ingredient] = hooks.getIngredient(selectionIngredient.ingredientId);
                    return { ...ingredient, ...selectionIngredient };
                })
                return group;
            });
            Promise.all(selectionsWithIngredients).then((finalSelections) => {
                item.selections = finalSelections;
                return res.send({ item, delay });
            });
        } else {
            return res.send({ item, delay });
        }
    },
    getMessaging: async (_req, res) => res.send(hooks.getOutOfOfficeMessage()),
    checkout: async (req, res) => {
        let { name, department, phone, cartItems, status } = req.body;

        orders.push({
            id: currentOrderId,
            name,
            department,
            phone,
            status,
        })

        const today = dayjs().format('MM/DD/YYYY HH:mm:ss');

        await cartItems.forEach(async item => {
            let { instructions, selections: ingredients, menuItemId, qty } = item;
            if (instructions === '') instructions = null;
            lineItems.push({
                id: currentLineItemId,
                orderId: currentOrderId,
                menuItemId,
                ingredients,
                instructions,
                date: today,
                qty
            })

            currentLineItemId++;
        });
        currentOrderId++;
        return res.sendStatus(200);
    }
}