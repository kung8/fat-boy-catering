SELECT c.id as category_id, c.name as category_name, c.image as category_image, mi.id as id, mi.name, mi.enabled, description, desc_enabled, range_id, mi.image, s.id as selection_id, s.name as selection_name, selection_type_id, si.enabled as ingredient_enabled, preset, i.id as ingredient_id, i.name as ingredient_name   
FROM categories c
FULL OUTER JOIN menu_items mi ON mi.category_id = c.id
FULL OUTER JOIN selections s ON s.menu_item_id = mi.id
FULL OUTER JOIN selections_ingredients si ON si.selection_id = s.id
FULL OUTER JOIN ingredients i ON si.ingredient_id = i.id
WHERE c.id = ${id}
ORDER BY c.id ASC, mi.id ASC, s.id ASC, i.id ASC;