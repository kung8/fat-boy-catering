UPDATE categories
SET name = ${name}, image = ${image}
WHERE id = ${id}
RETURNING *;