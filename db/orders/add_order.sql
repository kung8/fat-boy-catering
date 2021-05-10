INSERT INTO orders (name, department, phone)
VALUES (${name}, ${department}, ${phone})
RETURNING *;