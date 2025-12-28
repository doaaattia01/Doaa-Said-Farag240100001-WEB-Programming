CREATE DATABASE IF NOT EXISTS weather_app;
USE weather_app;


CREATE TABLE IF NOT EXISTS searches (
    id INT AUTO_INCREMENT PRIMARY KEY,
    city_name VARCHAR(100) NOT NULL,
    country_name VARCHAR(100),
    search_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_search_time (search_time)
);



INSERT INTO searches (city_name, country_name) VALUES
('Cairo', 'Egypt'),
('London', 'United Kingdom'),
('Tokyo', 'Japan');
