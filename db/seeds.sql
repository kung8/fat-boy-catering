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
    range_id integer, 
    image varchar 
);

CREATE TABLE ranges (
    id serial primary key, 
    range integer
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

-- INITIALIZE TABLES --  
INSERT INTO categories (name, image)
VALUES  ('Today`s Special', 'https://drive.google.com/file/d/1PslYKPq4VhxmDxjSufWgGophGsPWSF0w/view?usp=sharing'),        
        ('Sandwiches, Salads & Such', 'https://drive.google.com/file/d/1PslYKPq4VhxmDxjSufWgGophGsPWSF0w/view?usp=sharing'),
        ('Snack Boxes', 'https://drive.google.com/file/d/1PslYKPq4VhxmDxjSufWgGophGsPWSF0w/view?usp=sharing'),
        ('Cold Drinks', 'https://drive.google.com/file/d/1PslYKPq4VhxmDxjSufWgGophGsPWSF0w/view?usp=sharing'),
        ('Energy Drinks', 'https://drive.google.com/file/d/1PslYKPq4VhxmDxjSufWgGophGsPWSF0w/view?usp=sharing'),
        ('Protein Shakes', 'https://drive.google.com/file/d/1PslYKPq4VhxmDxjSufWgGophGsPWSF0w/view?usp=sharing'),
        ('Hot Beverages', 'https://drive.google.com/file/d/1PslYKPq4VhxmDxjSufWgGophGsPWSF0w/view?usp=sharing');

INSERT INTO menu_items (name, enabled, description, desc_enabled, category_id, range_id, image)
VALUES  ('カレーライス (JAPANESE CURRY RICE)', true, '', false, 1, 0, 'https://drive.google.com/file/d/1PslYKPq4VhxmDxjSufWgGophGsPWSF0w/view?usp=sharing'),
        ('PB&J', true, '', false, 2, 0, 'https://drive.google.com/file/d/1PslYKPq4VhxmDxjSufWgGophGsPWSF0w/view?usp=sharing'),
        ('Nutella Sandwich', true, '', false, 2, 0, 'https://drive.google.com/file/d/1PslYKPq4VhxmDxjSufWgGophGsPWSF0w/view?usp=sharing'),
        ('Grilled Sandwich', true, '', false, 2, 0, 'https://drive.google.com/file/d/1PslYKPq4VhxmDxjSufWgGophGsPWSF0w/view?usp=sharing'),
        ('Build Custom Sandwich', true, '', false, 2, 0, 'https://drive.google.com/file/d/1PslYKPq4VhxmDxjSufWgGophGsPWSF0w/view?usp=sharing'),
        ('The Big Al', true, 'Ham, turkey, roast beef, pastrami, bacon, cheddar, swiss, pepper jack, lettuce, tomato, and pickles.', true, 2, 0, 'https://drive.google.com/file/d/1PslYKPq4VhxmDxjSufWgGophGsPWSF0w/view?usp=sharing'),
        ('Hamburger', true, '', false, 2, 0, 'https://drive.google.com/file/d/1PslYKPq4VhxmDxjSufWgGophGsPWSF0w/view?usp=sharing'),
        ('Cheese Burger', true, '', false, 2, 0, 'https://drive.google.com/file/d/1PslYKPq4VhxmDxjSufWgGophGsPWSF0w/view?usp=sharing'),
        ('All Beef Hot Dog', true, '', false, 2, 0, 'https://drive.google.com/file/d/1PslYKPq4VhxmDxjSufWgGophGsPWSF0w/view?usp=sharing'),
        ('Potato Salad', true, '', false, 2, 0, 'https://drive.google.com/file/d/1PslYKPq4VhxmDxjSufWgGophGsPWSF0w/view?usp=sharing'),
        ('Miso Soup', true, '', false, 2, 0, 'https://drive.google.com/file/d/1PslYKPq4VhxmDxjSufWgGophGsPWSF0w/view?usp=sharing'),
        ('Veggie Snack Box', true, '', false, 3, 0, 'https://drive.google.com/file/d/1PslYKPq4VhxmDxjSufWgGophGsPWSF0w/view?usp=sharing'),
        ('Pita & Hummus', true, '', false, 3, 0, 'https://drive.google.com/file/d/1PslYKPq4VhxmDxjSufWgGophGsPWSF0w/view?usp=sharing'),
        ('Apples & Cheese', true, '', false, 3, 0, 'https://drive.google.com/file/d/1PslYKPq4VhxmDxjSufWgGophGsPWSF0w/view?usp=sharing'),
        ('Apples & Peanut Butter', true, '', false, 3, 0, 'https://drive.google.com/file/d/1PslYKPq4VhxmDxjSufWgGophGsPWSF0w/view?usp=sharing'),
        ('Boiled Eggs', true, '', false, 3, 0, 'https://drive.google.com/file/d/1PslYKPq4VhxmDxjSufWgGophGsPWSF0w/view?usp=sharing'),
        ('String Cheese', true, '', false, 3, 0, 'https://drive.google.com/file/d/1PslYKPq4VhxmDxjSufWgGophGsPWSF0w/view?usp=sharing'),
        ('Turkey Lunchable', true, '', false, 3, 0, 'https://drive.google.com/file/d/1PslYKPq4VhxmDxjSufWgGophGsPWSF0w/view?usp=sharing'),
        ('Meat & Cheese Rolls', true, '', false, 3, 0, 'https://drive.google.com/file/d/1PslYKPq4VhxmDxjSufWgGophGsPWSF0w/view?usp=sharing'),
        ('Tortilla Chips & Guacamole', true, '', false, 3, 0, 'https://drive.google.com/file/d/1PslYKPq4VhxmDxjSufWgGophGsPWSF0w/view?usp=sharing'),
        ('Pita Chips & Hummus', true, '', false, 3, 0, 'https://drive.google.com/file/d/1PslYKPq4VhxmDxjSufWgGophGsPWSF0w/view?usp=sharing'),
        ('Yogurt Noosa', true, '', false, 3, 0, 'https://drive.google.com/file/d/1PslYKPq4VhxmDxjSufWgGophGsPWSF0w/view?usp=sharing'),
        ('Coke', true, '', false, 4, 0, 'https://drive.google.com/file/d/1PslYKPq4VhxmDxjSufWgGophGsPWSF0w/view?usp=sharing'),
        ('Diet Coke', true, '', false, 4, 0, 'https://drive.google.com/file/d/1PslYKPq4VhxmDxjSufWgGophGsPWSF0w/view?usp=sharing'),
        ('Dr. Pepper', true, '', false, 4, 0, 'https://drive.google.com/file/d/1PslYKPq4VhxmDxjSufWgGophGsPWSF0w/view?usp=sharing'),
        ('Diet Dr. Pepper', true, '', false, 4, 0, 'https://drive.google.com/file/d/1PslYKPq4VhxmDxjSufWgGophGsPWSF0w/view?usp=sharing'),
        ('Mt. Dew', true, '', false, 4, 0, 'https://drive.google.com/file/d/1PslYKPq4VhxmDxjSufWgGophGsPWSF0w/view?usp=sharing'),
        ('Water', true, '', false, 4, 0, 'https://drive.google.com/file/d/1PslYKPq4VhxmDxjSufWgGophGsPWSF0w/view?usp=sharing'),
        ('La Croix', true, '', false, 4, 0, 'https://drive.google.com/file/d/1PslYKPq4VhxmDxjSufWgGophGsPWSF0w/view?usp=sharing'),
        ('Gatorade', true, '', false, 4, 0, 'https://drive.google.com/file/d/1PslYKPq4VhxmDxjSufWgGophGsPWSF0w/view?usp=sharing'),
        ('Red Bull Reg.', true, '', false, 5, 0, 'https://drive.google.com/file/d/1PslYKPq4VhxmDxjSufWgGophGsPWSF0w/view?usp=sharing'),
        ('Red Bull Sugar Free', true, '', false, 5, 0, 'https://drive.google.com/file/d/1PslYKPq4VhxmDxjSufWgGophGsPWSF0w/view?usp=sharing'),
        ('Monster White', true, '', false, 5, 0, 'https://drive.google.com/file/d/1PslYKPq4VhxmDxjSufWgGophGsPWSF0w/view?usp=sharing'),
        ('Monster Teal', true, '', false, 5, 0, 'https://drive.google.com/file/d/1PslYKPq4VhxmDxjSufWgGophGsPWSF0w/view?usp=sharing'),
        ('Monster Pink', true, '', false, 5, 0, 'https://drive.google.com/file/d/1PslYKPq4VhxmDxjSufWgGophGsPWSF0w/view?usp=sharing'),
        ('Monster Orange', true, '', false, 5, 0, 'https://drive.google.com/file/d/1PslYKPq4VhxmDxjSufWgGophGsPWSF0w/view?usp=sharing'),
        ('Monster Java', true, '', false, 5, 0, 'https://drive.google.com/file/d/1PslYKPq4VhxmDxjSufWgGophGsPWSF0w/view?usp=sharing'),
        ('Bang Peach Mango', true, '', false, 5, 0, 'https://drive.google.com/file/d/1PslYKPq4VhxmDxjSufWgGophGsPWSF0w/view?usp=sharing'),
        ('Bang Unicorn Farts', true, '', false, 5, 0, 'https://drive.google.com/file/d/1PslYKPq4VhxmDxjSufWgGophGsPWSF0w/view?usp=sharing'),
        ('Bang Whatever I Have', true, '', false, 5, 0, 'https://drive.google.com/file/d/1PslYKPq4VhxmDxjSufWgGophGsPWSF0w/view?usp=sharing'),
        ('Premier Protein Vanilla', true, '', false, 6, 0, 'https://drive.google.com/file/d/1PslYKPq4VhxmDxjSufWgGophGsPWSF0w/view?usp=sharing'),
        ('Premier Protein Coffee Latte', true, '', false, 6, 0, 'https://drive.google.com/file/d/1PslYKPq4VhxmDxjSufWgGophGsPWSF0w/view?usp=sharing'),
        ('Muscle Milk Chocolate', true, '', false, 6, 0, 'https://drive.google.com/file/d/1PslYKPq4VhxmDxjSufWgGophGsPWSF0w/view?usp=sharing'),
        ('Hot Cocoa', true, '', false, 7, 0, 'https://drive.google.com/file/d/1PslYKPq4VhxmDxjSufWgGophGsPWSF0w/view?usp=sharing'),
        ('Hot Teas', true, '', false, 7, 0, 'https://drive.google.com/file/d/1PslYKPq4VhxmDxjSufWgGophGsPWSF0w/view?usp=sharing'),
        ('Coffee', true, '', false, 7, 0, 'https://drive.google.com/file/d/1PslYKPq4VhxmDxjSufWgGophGsPWSF0w/view?usp=sharing'),
        ('Espresso', true, '', false, 7, 0, 'https://drive.google.com/file/d/1PslYKPq4VhxmDxjSufWgGophGsPWSF0w/view?usp=sharing');

INSERT INTO ranges (range)
VALUES  (0),
        (1);

INSERT INTO selections (name, menu_item_id, selection_type_id)
VALUES  ('Select Bread', 2, 1), 
        ('Select Bread', 3, 1),
        ('Select Bread', 4, 1),
        ('Select Cheese', 4, 1),
        ('Select Bread', 5, 1),
        ('Select Meat', 5, 2),
        ('Select Cheese', 5, 2),
        ('Select Topping', 5, 2),
        ('Select Bread', 6, 1),
        ('Select Meat', 6, 2), 
        ('Select Cheese', 6, 2), 
        ('Select Toppings', 6, 2), 
        ('Select Toppings', 7, 2),
        ('Select Cheese', 8, 1),
        ('Select Toppings', 8, 2),
        ('Select Toppings', 9, 2),
        ('Select Dip', 12, 1),
        ('Select Meat', 19, 2),
        ('Select Cheese', 19, 2),
        ('Select Toppings', 19, 2),
        ('Select Tea', 45, 1),
        ('Select Condiments', 45, 2),
        ('Select Condiments', 46, 2),
        ('Select Size', 47, 1),
        ('Select Condiments', 47, 2);

INSERT INTO selections_ingredients (selection_id, ingredient_id, preset, enabled)
VALUES  
        -- select bread for peanut butter --
        (1, 1, true, true),
        (1, 2, false, true),
        (1, 3, false, true),
        (1, 4, false, true),

        -- select bread for nutella -- 
        (2, 1, true, true),
        (2, 2, false, true),
        (2, 3, false, true),
        (2, 4, false, true),

        -- select bread for grilled cheese --
        (3, 1, true, true),
        (3, 2, false, true),
        (3, 3, false, true),
        (3, 4, false, true),

        -- select cheese for grilled cheese --
        (4, 5, true, true), 
        (4, 6, false, true), 
        (4, 7, false, true), 

        -- select bread for custom sandwich --
        (5, 1, true, true),
        (5, 2, false, true),
        (5, 3, false, true),
        (5, 4, false, true), 
        -- select meat for custom sandwich -- 
        (6, 8, false, true),
        (6, 9, false, true),
        (6, 10, false, true),
        (6, 11, false, true), 
        (6, 12, false, true), 
        (6, 13, false, true), 
        (6, 14, false, true),
        -- select cheese for custom sandwich -- 
        (7, 5, false, true), 
        (7, 6, false, true), 
        (7, 7, false, true), 
        -- select toppings for custom sandwich -- 
        (8, 15, false, true),
        (8, 16, false, true),
        (8, 17, false, true),
        (8, 18, false, true),
        (8, 19, false, true),
        (8, 20, false, true),
        (8, 21, false, true),
        (8, 22, false, true),


        -- select bread for big al --
        (9, 1, true, true),
        (9, 2, false, true),
        (9, 3, false, true),
        (9, 4, false, true), 
        -- select meat for big al --
        (10, 8, true, true),
        (10, 9, true, true),
        (10, 10, true, true),
        (10, 11, false, true), 
        (10, 12, true, true), 
        (10, 13, false, true), 
        (10, 14, true, true), 
        -- select cheese for big al -- 
        (11, 5, false, true), 
        (11, 6, false, true), 
        (11, 7, false, true), 
        -- select toppings for big al --
        (12, 15, false, true),
        (12, 16, false, true),
        (12, 17, false, true),
        (12, 18, false, true),
        (12, 19, false, true),
        (12, 20, false, true),
        (12, 21, false, true),
        (12, 22, false, true),

        -- select toppings for hamburger -- 
        (13, 15, false, true),
        (13, 16, false, true),
        (13, 17, false, true),
        (13, 18, false, true),
        (13, 19, false, true),
        (13, 20, false, true),
        (13, 21, false, true),
        (13, 22, false, true),

        -- select cheese for cheeseburger -- 
        (14, 5, true, true), 
        (14, 6, false, true), 
        (14, 7, false, true), 
        -- select toppings for cheeseburger -- 
        (15, 15, false, true),
        (15, 16, false, true),
        (15, 17, false, true),
        (15, 18, false, true),
        (15, 19, false, true),
        (15, 20, false, true),
        (15, 21, false, true),
        (15, 22, false, true),        

        -- select toppings for all beef hot dog --
        (16, 17, false, true), 
        (16, 16, false, true), 
        (16, 15, false, true), 
        (16, 22, false, true), 

        -- select dip for veggie snack box -- 
        (17, 23, true, true),
        (17, 24, false, true),

        -- select meat for meat & cheese rolls --
        (18, 8, false, true),
        (18, 9, false, true),
        (18, 10, false, true),
        (18, 11, false, true), 
        (18, 12, false, true), 
        (18, 13, false, true), 
        (18, 14, false, true), 
        -- select cheese for meat & cheese rolls --
        (19, 5, false, true), 
        (19, 6, false, true), 
        (19, 7, false, true),  
        -- select toppings for meat & cheese rolls --
        (20, 17, false, true),
        (20, 16, false, true),
        (20, 15, false, true),
        (20, 22, false, true),

        -- select tea for hot teas -- 
        (21, 25, true, true),
        (21, 26, false, true),
        (21, 27, false, true),
        (21, 28, false, true),
        (21, 29, false, true),
        (21, 30, false, true),
        -- select condiments for hot teas -- 
        (22, 31, false, true),
        (22, 32, false, true),
        (22, 33, false, true),
        (22, 34, false, true),
        (22, 35, false, true),
        
        -- select condiments for coffee -- 
        (23, 31, false, true),
        (23, 32, false, true),
        (23, 33, false, true),
        (23, 34, false, true),
        (23, 35, false, true),

        -- select size for espressso --
        (24, 36, true, true), 
        (24, 37, false, true), 
        -- select condiments for espresso -- 
        (25, 31, false, true),
        (25, 32, false, true),
        (25, 33, false, true),
        (25, 34, false, true),
        (25, 35, false, true);

INSERT INTO selection_types (type)
VALUES  ('radio'), 
        ('check');

INSERT INTO ingredients (name)
VALUES  ('white'),
        ('wheat'), 
        ('croissant'),
        ('wrap'), 
        ('cheddar'), 
        ('swiss'), 
        ('pepper jack'), 
        ('ham'),
        ('turkey'),
        ('pastrami'),
        ('tuna salad'),
        ('bacon'),
        ('chicken salad'),
        ('roast beef'),
        ('mayo'),
        ('mustard'),
        ('ketchup'),
        ('lettuce'),
        ('tomato'),
        ('pickles'),
        ('avocado'),
        ('pickle relish'),
        ('ranch'),
        ('hummus'),
        ('english breakfast'),
        ('camomile'),
        ('peppermint'),
        ('green tea'),
        ('lemon ginger'),
        ('jasmine'),
        ('half & half'),
        ('vanilla creamer'),
        ('sugar'),
        ('splenda'),
        ('honey'),
        ('single shot'),
        ('double shot');