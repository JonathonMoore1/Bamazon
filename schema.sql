CREATE DATABASE bamazon_db;
USE bamazon_db;

CREATE TABLE products(
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(100) NULL,
    department_name VARCHAR(100) NULL,
    price DECIMAL(10, 2) NULL,
    stock_quantity INT NULL,
    PRIMARY KEY(item_id)
);

INSERT INTO products(product_name, department_name, price, stock_quantity) 
VALUES("Hitch-Hiker's Guide to the Galaxy", "Books", 23.95, 5),
    ("Chicken Scharma Incense Sticks", "Home Goods", 12.99, 40),
    ("Best of Wham!", "Music/Movies", 7.99, 100),
    ("Accepting Your Mediocrity: A Guide for the Vain and Desperate", "Books", 10.99, 7),
    ("Pink Flamingos", "Music/Movies", 9.99, 10),
    ("Troubadour Starter Kit (Includes lute and panpipes)", "Musical Instruments/Equipment", 98.00, 3),
    ("Dell 4k Monitor", "Computers/Electronics", 764.98, 12),
    ("Half-dozen farm fresh eggs", "Food/Produce", 1.60, 33),
    ("The Garden of Earthly Delights, Heironymus Bosch, c. 1490", "Art", 3500099.99, 1),
    ("Juicy Fruit", "Food/Produce", 1.29, 50),
    ("Violin, Pietro Guarneri, Venice 1722", "Musical Instruments/Equipment", 662850, 1);