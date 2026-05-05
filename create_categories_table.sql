-- Создание таблицы categories
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Индекс для быстрого поиска по названию
    INDEX idx_name (name),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Добавление тестовых данных
INSERT INTO categories (name, description, is_active) VALUES
('Электроника', 'Категория для электронных товаров', TRUE),
('Одежда', 'Категория для одежды и аксессуаров', TRUE),
('Книги', 'Категория для книг и учебных материалов', TRUE),
('Спорт', 'Спортивные товары и инвентарь', TRUE),
('Дом и сад', 'Товары для дома и сада', FALSE);