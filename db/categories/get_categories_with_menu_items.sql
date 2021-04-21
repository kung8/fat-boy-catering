SELECT c.id as category_id, c.name as category_name, c.image as category_image, mi.id as id, mi.name, enabled, description, desc_enabled, range_id, mi.image   
FROM categories c
JOIN menu_items mi ON mi.category_id = c.id
ORDER BY c.id ASC, mi.id ASC;