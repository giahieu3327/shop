SET NAMES utf8mb4;

CREATE DATABASE IF NOT EXISTS shopdb
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE shopdb;

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    price INT,
    description TEXT
);

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50),
    password VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    product_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO products (name, price, description) VALUES
('iPhone 15', 20000000, 'Điện thoại Apple'),
('Laptop Dell', 25000000, 'Laptop cho dev'),
('Tai nghe Sony', 3000000, 'Âm thanh xịn');
