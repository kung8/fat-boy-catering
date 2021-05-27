INSERT INTO menu_items (name, description, image, range_id, category_id, enabled)
VALUES (${name}, ${description}, ${image}, ${range}, ${category_id}, ${enabled})
RETURNING *;