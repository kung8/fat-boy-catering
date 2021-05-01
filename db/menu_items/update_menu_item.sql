UPDATE menu_items
SET name = ${name}, description = ${description}, image = ${image}
WHERE id = ${id}
RETURNING *;