SELECT mi.id, name, enabled, description, desc_enabled, category_id, image, range_id as range 
FROM menu_items mi
LEFT JOIN ranges r ON r.id = mi.range_id 
WHERE mi.id = ${id};