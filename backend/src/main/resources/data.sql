-- ==========================================================
-- DATA SEED SCRIPT FOR USER: layalika@gmail.com
-- ==========================================================

-- Clean up existing data to ensure a fresh start
DELETE FROM role_permissions;
DELETE FROM user_roles;
DELETE FROM permissions;
DELETE FROM roles;
DELETE FROM users;
DELETE FROM tasks;

-- 1. Insert Permissions
INSERT INTO permissions (name, description, created_by) VALUES
('MAIN_VIEW', 'View dashboard', 'layalika@gmail.com'),
('TASKS_VIEW', 'View tasks list', 'layalika@gmail.com'),
('TASKS_CREATE', 'Create new tasks', 'layalika@gmail.com'),
('TASKS_UPDATE', 'Update existing tasks', 'layalika@gmail.com'),
('TASKS_DELETE', 'Delete tasks', 'layalika@gmail.com'),
('USERS_VIEW', 'View users list', 'layalika@gmail.com'),
('USERS_CREATE', 'Create new users', 'layalika@gmail.com'),
('USERS_UPDATE', 'Update existing users', 'layalika@gmail.com'),
('USERS_DELETE', 'Delete users', 'layalika@gmail.com'),
('PERMISSIONS_VIEW', 'View permissions matrix', 'layalika@gmail.com'),
('PERMISSIONS_CREATE', 'Manage roles', 'layalika@gmail.com'),
('PERMISSIONS_UPDATE', 'Edit role permissions', 'layalika@gmail.com'),
('PERMISSIONS_DELETE', 'Delete roles', 'layalika@gmail.com');

-- 2. Insert Roles
INSERT INTO roles (name, description, created_by) VALUES
('ADMIN', 'Full system access with all administrative rights.', 'layalika@gmail.com'),
('MANAGER', 'Can manage users and tasks but has limited permission settings.', 'layalika@gmail.com'),
('USER', 'Standard user who can view their own dashboard and tasks.', 'layalika@gmail.com'),
('VIEWER', 'Read-only access to the system for monitoring.', 'layalika@gmail.com');

-- 3. Link Permissions to ADMIN Role (Grant all)
INSERT INTO role_permissions (role_id, permission_id, created_by)
SELECT r.id, p.id, 'layalika@gmail.com'
FROM roles r, permissions p
WHERE r.name = 'ADMIN';

-- 4. Link Permissions to MANAGER Role (All except deleting roles)
INSERT INTO role_permissions (role_id, permission_id, created_by)
SELECT r.id, p.id, 'layalika@gmail.com'
FROM roles r, permissions p
WHERE r.name = 'MANAGER' 
AND p.name NOT IN ('PERMISSIONS_DELETE', 'PERMISSIONS_CREATE');

-- 5. Link Permissions to USER Role (Basic viewing)
INSERT INTO role_permissions (role_id, permission_id, created_by)
SELECT r.id, p.id, 'layalika@gmail.com'
FROM roles r, permissions p
WHERE r.name = 'USER' 
AND p.name IN ('MAIN_VIEW', 'TASKS_VIEW', 'USERS_VIEW');

-- 6. Insert Main User: layalika@gmail.com
-- Password is 'password' (BCrypt hashed)
INSERT INTO users (username, email, password, enabled, created_by, password_reset_required) VALUES
('layalika', 'layalika@gmail.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.TVuHOn2', true, 'layalika@gmail.com', false);

-- 7. Assign ADMIN role to layalika
INSERT INTO user_roles (user_id, role_id, created_by)
SELECT u.id, r.id, 'layalika@gmail.com'
FROM users u, roles r
WHERE u.email = 'layalika@gmail.com' AND r.name = 'ADMIN';

-- 8. Add some initial tasks
INSERT INTO tasks (title, description, completed) VALUES
('Implement Security Audit', 'Add audit columns to all core tables.', true),
('Setup I18n', 'Implement English and Khmer language support.', true),
('UI Modernization', 'Refactor UI to use Tailwind CSS v3.4.', false);
