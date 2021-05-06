INSERT INTO categories (name, image)
VALUES (${name}, ${image})
RETURNING *;