-- Agregar usuario admin@admin.es con contraseña en texto plano
-- Primero eliminar si existe (por si la V28 lo creó)
DELETE FROM admin WHERE email = 'admin@admin.es';

-- Insertar con contraseña en texto plano
INSERT INTO admin (email, password) VALUES
('admin@admin.es', 'admin1234');
