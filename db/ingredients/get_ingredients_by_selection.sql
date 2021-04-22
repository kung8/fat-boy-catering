SELECT si.id, preset, enabled, ingredient_id, name  
FROM selections_ingredients si
LEFT JOIN ingredients i ON si.ingredient_id = i.id
WHERE selection_id = ${id}
ORDER BY id;