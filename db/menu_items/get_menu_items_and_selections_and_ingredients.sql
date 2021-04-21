SELECT s.id, s.name as selection_name, selection_type_id, preset, enabled, ingredient_id, i.name as ingredient_name
FROM selections s 
join selections_ingredients si ON si.selection_id = s.id
join ingredients i ON si.ingredient_id = i.id
Where menu_item_id = ${id}; 