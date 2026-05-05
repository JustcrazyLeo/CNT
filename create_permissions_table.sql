-- Создание таблицы permissions
CREATE TABLE IF NOT EXISTS permissions (
    permission_id INT PRIMARY KEY AUTO_INCREMENT,
    permission_name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Создание связующей таблицы для назначения прав админам
CREATE TABLE IF NOT EXISTS admin_permissions_relations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    admin_id INT NOT NULL,
    permission_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_admin_permission (admin_id, permission_id),
    FOREIGN KEY (admin_id) REFERENCES admins(admin_id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(permission_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Заполнение таблицы permissions базовыми разрешениями
INSERT INTO permissions (permission_name, description) VALUES
('menu.access', 'Доступ к главному меню CLI'),
('admins.read', 'Просмотр администраторов'),
('admins.create', 'Создание администраторов'),
('admins.update', 'Обновление данных администраторов'),
('admins.delete', 'Удаление администраторов'),
('roles.read', 'Просмотр ролей'),
('roles.assign', 'Назначение ролей администраторам'),
('categories.read', 'Просмотр категорий'),
('categories.create', 'Создание категорий'),
('categories.update', 'Обновление категорий'),
('categories.delete', 'Удаление категорий'),
('permissions.read', 'Просмотр разрешений'),
('permissions.assign', 'Назначение разрешений');