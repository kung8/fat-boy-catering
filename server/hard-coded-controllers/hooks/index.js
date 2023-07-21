const heroes = require('../data/heroes');
const delays = require('../data/delays');
const messages = require('../data/messages');
let { categories, currentCategoryId } = require('../data/categories');
let { menuItems, currentMenuItemId } = require('../data/menu_items');
let { selections, currentSelectionId } = require('../data/selections');
let { selectionsIngredients, currentSelectionIngredientId } = require('../data/selections_ingredients');
let { ingredients, currentIngredientId } = require('../data/ingredients');
let { orders, currentOrderId } = require('../data/orders');
let { lineItems, currentLineItemId } = require('../data/line_items');
const dayjs = require('dayjs');

const hooks = {
    getHero: () => heroes[0].hero,
    updateHero: (newHero) => heroes[0] = newHero,

    getOutOfOfficeMessage: () => messages[0],
    updateOutOfOfficeMessage: (newMessage) => messages[0] = newMessage,

    getDelay: () => delays[0],
    updateDelay: (newDelay) => delays[0] = newDelay,


    // CATEGORIES
    getCategory: (id) => categories.filter(category => category.id === id),
    updateCategory: (updatedCategory) => {
        const foundIndex = categories.findIndex(cat => cat.id === updatedCategory.id);
        if (foundIndex > -1) {
            const existingCategory = categories[foundIndex];
            categories[foundIndex] = { ...existingCategory, ...updatedCategory };
            return categories[foundIndex];
        }
        return {};
    },
    createCategory: (newCategory) => {
        categories.push({ ...newCategory, id: currentCategoryId });
        currentCategoryId++;
        return categories[categories.length - 1];
    },
    deleteCategory: (id) => {
        const foundIndex = categories.findIndex(cat => cat.id === id);
        if (foundIndex > -1) {
            categories.splice(foundIndex, 1);
        }
    },
    getComprehensiveCategory: (cat) => {
        const categoryWithMenuItems = hooks.getMenuItemsByCategory(cat.id);
        const menuItemsWithSelections = categoryWithMenuItems.map(item => {
            const selections = hooks.getSelectionsByMenuItem(item.id);
            return {
                ...item,
                categoryId: cat.id,
                categoryName: cat.name,
                categoryImage: cat.image,
                selections,
            }
        })
        const selectionItems = menuItemsWithSelections.map(item => {
            if (item.selections.length === 0) {
                delete item.selections;
                return item;
            }
            return item.selections.map(selection => {
                delete item.selections;
                const selectionsIngredients = hooks.getSelectionsIngredientsBySelection(selection.id);
                return {
                    ...item,
                    selectionId: selection.id,
                    selectionName: selection.name,
                    selectionTypeId: selection.selectionTypeId,
                    selectionsIngredients,
                }
            })
        }).flat();

        const ingredientItems = selectionItems.map(item => {
            if (!item?.selectionsIngredients || item.selectionsIngredients.length === 0) {
                delete item.selectionsIngredients;
                return item;
            }
            return item.selectionsIngredients.map(selectionsIngredients => {
                delete item.selectionsIngredients;
                const [ingredient] = hooks.getIngredient(selectionsIngredients.ingredientId);
                return {
                    ...item,
                    ingredientId: selectionsIngredients.id,
                    ingredientName: ingredient.name,
                    ingredientEnabled: selectionsIngredients.enabled,
                    preset: selectionsIngredients.preset,
                }
            })
        }).flat();
        return ingredientItems;
    },
    getComprehensiveCategories: () => categories.reduce((acc, cat) => {
        const ingredientItems = hooks.getComprehensiveCategory(cat);
        return [...acc, ...ingredientItems];
    }, []),
    getMenuItemsByCategory: (categoryId) =>
        menuItems.filter(item => item.categoryId === categoryId),
    getCategoriesWithMenuItems: () =>
        categories.map(cat => {
            cat.menuItems = hooks.getMenuItemsByCategory(cat.id);
            return cat;
        }),


    // MENU ITEMS    
    getMenuItem: (id) =>
        menuItems.filter(item => item.id === id),
    updateMenuItemEnabled: (id, enabled) => {
        const foundIndex = menuItems.findIndex(item => item.id === id);
        if (foundIndex > -1) {
            menuItems[foundIndex].enabled = enabled;
            return menuItems[foundIndex];
        }
    },
    updateMenuItem: (updatedMenuItem) => {
        const foundIndex = menuItems.findIndex(item => item.id === id);
        if (foundIndex > -1) {
            const existingMenuItem = menuItems[foundIndex];
            menuItems[foundIndex] = { ...existingMenuItem, ...updatedMenuItem };
            return menuItems[foundIndex];
        }
    },
    createMenuItem: (newMenuItem) => {
        menuItems.push({ ...newMenuItem, id: currentMenuItemId });
        currentMenuItemId++;
        return menuItems[menuItems.length - 1];
    },
    deleteMenuItem: (id) => {
        const foundIndex = menuItems.findIndex(item => item.id === id);
        if (foundIndex > -1) {
            menuItems.splice(foundIndex, 1);
        }
    },

    // SELECTIONS
    getSelectionsByMenuItem: (menuItemId) =>
        selections.filter(selection => selection.menuItemId === menuItemId),
    getSelection: (id) => selections.filter(selection => selection.id === id),
    updateSelection: (updatedSelection) => {
        const foundIndex = selections.findIndex(selection => selection.id === updatedSelection.id);
        if (foundIndex > -1) {
            const existingSelection = selections[foundIndex];
            selections[foundIndex] = { ...existingSelection, ...updatedSelection };
            return selections[foundIndex];
        }
    },
    createSelection: (newSelection) => {
        selections.push({ ...newSelection, id: currentSelectionId });
        currentSelectionId++;
        return selections[selections.length - 1];
    },
    deleteSelection: (id) => {
        const foundIndex = selections.findIndex(selection => selection.id === id);
        if (foundIndex > -1) {
            selections.splice(foundIndex, 1);
        }
    },

    // SELECTIONS INGREDIENTS
    getSelectionsIngredientsBySelection: (selectionId) =>
        selectionsIngredients.filter(selectionIngredient => selectionIngredient.selectionId === selectionId),
    getSelectionsIngredients: ({ selectionId, ingredientId }) => {
        const foundIndex = selectionsIngredients.findIndex(selectionIngredient => selectionIngredient.selectionId === selectionId && selectionIngredient.ingredientId === ingredientId);
        if (foundIndex > -1) {
            return selectionsIngredients[foundIndex];
        }
    },
    updateSelectionsIngredients: (updatedSelectionsIngredients) => {
        const foundIndex = selectionsIngredients.findIndex(selectionIngredient => selectionIngredient.selectionId === updatedSelectionsIngredients.selectionId && selectionIngredient.ingredientId === updatedSelectionsIngredients.ingredientId);
        if (foundIndex > -1) {
            const existingSelectionsIngredients = selectionsIngredients[foundIndex];
            selectionsIngredients[foundIndex] = { ...existingSelectionsIngredients, ...updatedSelectionsIngredients };
            return selectionsIngredients[foundIndex];
        }
    },
    createSelectionsIngredients: (newSelectionsIngredients) => {
        selectionsIngredients.push({ ...newSelectionsIngredients, id: currentSelectionIngredientId });
        currentSelectionIngredientId++;
        return selectionsIngredients[selectionsIngredients.length - 1];
    },
    deleteSelectionsIngredients: ({ selectionId, ingredientId }) => {
        const foundIndex = selectionsIngredients.findIndex(selectionIngredient => selectionIngredient.selectionId === selectionId && selectionIngredient.ingredientId === ingredientId);
        if (foundIndex > -1) {
            selectionsIngredients.splice(foundIndex, 1);
        }
    },

    // INGREDIENTS
    getIngredientsBySelection: (selectionId) =>
        ingredients.filter(ingredient => ingredient.selectionId === selectionId),
    getIngredient: (id) =>
        ingredients.filter(ingredient => ingredient.id === id),
    getIngredientByName: (name) =>
        ingredients.filter(ingredient => ingredient.name === name),
    updateIngredient: (updatedIngredient) => {
        const foundIndex = ingredients.findIndex(ingredient => ingredient.id === updatedIngredient.id);
        if (foundIndex > -1) {
            const existingIngredient = ingredients[foundIndex];
            ingredients[foundIndex] = { ...existingIngredient, ...updatedIngredient };
            return ingredients[foundIndex];
        }
    },
    createIngredient: (newIngredient) => {
        ingredients.push({ ...newIngredient, id: currentIngredientId });
        currentIngredientId++;
        return ingredients[ingredients.length - 1];
    },
    deleteIngredient: (id) => {
        const foundIndex = ingredients.findIndex(ingredient => ingredient.id === id);
        if (foundIndex > -1) {
            ingredients.splice(foundIndex, 1);
        }
    },


    // ORDERS
    getOrders: () => {
        return orders.map(order => {
            const lineItems = hooks.getLineItemsByOrderId(order.id);
            return lineItems.map(item => {
                return {
                    lineItemId: item.id,
                    qty: item.qty,
                    menuItemId: item.menuItemId,
                    ingredients: item.ingredients,
                    instructions: item.instructions,
                    date: item.date,
                    orderId: item.orderId,
                    name: order.name,
                    phone: order.phone,
                    department: order.department,
                    status: order.status,
                    menuItemName: hooks.getMenuItem(item.menuItemId)[0].name,
                }
            })
        }).flat();
    },
    getLineItemsByOrderId: (orderId) => lineItems.filter(lineItem => lineItem.orderId === orderId),
}

module.exports = hooks;