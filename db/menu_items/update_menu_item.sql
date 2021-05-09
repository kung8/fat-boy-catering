UPDATE menu_items
SET name = ${name}, description = ${description}, image = ${image}, range_id = ${range}
WHERE id = ${id}
RETURNING *;