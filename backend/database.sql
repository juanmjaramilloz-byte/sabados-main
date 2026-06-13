CREATE DATABASE IF NOT EXISTS sabados_db;
USE sabados_db;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255),
    phone VARCHAR(50),
    dob DATE,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    two_factor_secret VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS flight_forms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    destination VARCHAR(255) NOT NULL,
    origin VARCHAR(255) NOT NULL,
    departure_date DATE,
    return_date DATE,
    passengers INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
