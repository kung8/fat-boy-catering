INSERT INTO orders (name, department, phone, status)
VALUES (${name}, ${department}, ${phone}, ${status})
RETURNING *;