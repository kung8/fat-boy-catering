SELECT s.id as selection_id, s.name as selection_name, selection_type_id, enabled, preset, i.id as ingredient_id, i.name as ingredient_name   
FROM selections s
LEFT JOIN selections_ingredients si ON si.selection_id = s.id
LEFT JOIN ingredients i ON si.ingredient_id = i.id
WHERE s.menu_item_id = ${id}
ORDER BY s.id ASC, ingredient_id ASC;