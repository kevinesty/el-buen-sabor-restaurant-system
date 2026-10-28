-- ═══════════════════════════════════════════════════════
--  MIGRACIÓN DE BASE DE DATOS — El Buen Sabor
--  Ejecutar en Railway MySQL
-- ═══════════════════════════════════════════════════════

-- 1. Actualizar tabla platos (agregar columnas nuevas si no existen)
ALTER TABLE platos
  ADD COLUMN IF NOT EXISTS descripcion TEXT DEFAULT '' AFTER nombre,
  ADD COLUMN IF NOT EXISTS precio DECIMAL(8,2) DEFAULT 0.00 AFTER descripcion,
  ADD COLUMN IF NOT EXISTS imagen VARCHAR(255) DEFAULT '' AFTER precio;

-- 2. Actualizar tabla comentarios (agregar columna autor y fecha)
ALTER TABLE comentarios
  ADD COLUMN IF NOT EXISTS autor VARCHAR(100) DEFAULT 'Anónimo' AFTER comentario,
  ADD COLUMN IF NOT EXISTS fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER autor;

-- 3. Asegurarse que likes y dislikes existen
ALTER TABLE platos
  ADD COLUMN IF NOT EXISTS likes INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS dislikes INT DEFAULT 0;

-- 4. Datos de ejemplo (solo si la tabla está vacía)
INSERT INTO platos (nombre, descripcion, precio, imagen, likes, dislikes)
SELECT 'Arroz con Pollo', 'Clásico plato peruano con arroz verde y pollo guisado con cilantro.', 22.00, 'arroz_con_pollo.jpg', 12, 2
WHERE NOT EXISTS (SELECT 1 FROM platos LIMIT 1);

INSERT INTO platos (nombre, descripcion, precio, imagen, likes, dislikes)
SELECT 'Lomo Saltado', 'Salteado de lomo de res con papas fritas, tomate y cebolla al wok.', 28.00, 'lomo_saltado.jpeg', 25, 1
WHERE (SELECT COUNT(*) FROM platos) < 2;

INSERT INTO platos (nombre, descripcion, precio, imagen, likes, dislikes)
SELECT 'Ensalada Rusa', 'Clásica ensalada con papas, zanahorias, arvejas y mayonesa casera.', 14.00, 'ensalada_rusa.jpg', 8, 3
WHERE (SELECT COUNT(*) FROM platos) < 3;

INSERT INTO platos (nombre, descripcion, precio, imagen, likes, dislikes)
SELECT 'Ceviche Clásico', 'Fresco ceviche de pescado con limón, ají, cebolla morada y choclo.', 32.00, 'ceviche.jpg', 40, 2
WHERE (SELECT COUNT(*) FROM platos) < 4;

INSERT INTO platos (nombre, descripcion, precio, imagen, likes, dislikes)
SELECT 'Causa Limeña', 'Papa amarilla rellena de atún o pollo con mayonesa, aguacate y huevo.', 18.00, 'causa.jpg', 19, 0
WHERE (SELECT COUNT(*) FROM platos) < 5;

INSERT INTO platos (nombre, descripcion, precio, imagen, likes, dislikes)
SELECT 'Tallarines Verdes', 'Tallarines con salsa de albahaca, nueces y queso parmesano al estilo limeño.', 20.00, 'tallarines.jpeg', 15, 1
WHERE (SELECT COUNT(*) FROM platos) < 6;
