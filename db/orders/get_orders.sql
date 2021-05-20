SELECT li.id as line_item_id, qty, menu_item_id, toppings, instructions, date, order_id, o.name, phone, department, status, mi.name AS menu_item_name
FROM line_items li
JOIN orders o ON li.order_id = o.id
JOIN menu_items mi ON mi.id = li.menu_item_id 
-- WHERE date = ${start} or date ${end}
ORDER BY li.id ASC;