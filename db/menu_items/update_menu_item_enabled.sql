UPDATE menu_items
SET enabled = ${enabled} 
WHERE id = ${id}
returning *;