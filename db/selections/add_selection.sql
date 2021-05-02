INSERT INTO selections (name, menu_item_id, selection_type_id)
VALUES (${name}, ${menu_item_id}, ${selection_type_id})
RETURNING *;