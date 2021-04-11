DROP TABLE users; 
DROP TABLE categories;
DROP TABLE menu_items;
DROP TABLE selections;
DROP TABLE ranges;
DROP TABLE selection_types;
DROP TABLE selections_ingredients;
DROP TABLE ingredients;
DROP TABLE orders;
DROP TABLE line_items;

-- CREATION OF TABLES -- 
CREATE TABLE users (
    id serial primary key,
    username varchar unique, 
    password varchar
);

CREATE TABLE categories (
    id serial primary key,
    name varchar, 
    image varchar
);

CREATE TABLE menu_items (
    id serial primary key,
    name varchar,
    enabled boolean,
    description varchar, 
    desc_enabled varchar, 
    category_id integer, 
    range_id integer 
);

CREATE TABLE ranges (
    id serial primary key, 
    range boolean
);

CREATE TABLE selections (
    id serial primary key,
    name varchar,
    menu_item_id integer, 
    selection_type_id integer
);

CREATE TABLE selection_types (
    id serial primary key,
    type varchar
);

CREATE TABLE selections_ingredients (
    id serial primary key,
    selection_id integer, 
    ingredient_id integer,
    preset boolean, 
    enabled boolean
);

CREATE TABLE ingredients (
    id serial primary key,
    name varchar
);

CREATE TABLE orders (
    id serial primary key,
    name varchar, 
    phone varchar, 
    department varchar
);

CREATE TABLE line_items (
    id serial primary key,
    order_id integer, 
    menu_item_id integer, 
    toppings varchar[],
    instructions varchar
);

INSERT INTO selection_types (type)
VALUES  ('radio'), 
        ('check');