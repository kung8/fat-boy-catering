INSERT INTO menu_items (name, description, image, range_id, category_id)
VALUES (${name}, ${description}, ${image}, ${range}, ${category_id})
RETURNING *;