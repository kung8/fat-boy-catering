UPDATE selections
SET name = ${name}, selection_type_id = ${selectionType}
WHERE id = ${id}
RETURNING *;