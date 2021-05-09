DELETE 
FROM selections 
WHERE menu_item_id = ${menu_item_id};

DELETE 
FROM menu_items
WHERE id = ${menu_item_id};