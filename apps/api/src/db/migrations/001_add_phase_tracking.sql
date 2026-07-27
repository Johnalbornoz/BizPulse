-- Agregar columna de fase actual (1-8) a diagnosticos
ALTER TABLE diagnosticos
ADD COLUMN IF NOT EXISTS fase_actual INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS iniciado_por INTEGER REFERENCES usuarios(id),
ADD COLUMN IF NOT EXISTS rol_iniciador VARCHAR(50) DEFAULT 'SuperAdmin';

-- Crear índices para búsquedas rápidas por fase
CREATE INDEX IF NOT EXISTS idx_diagnosticos_fase ON diagnosticos(fase_actual);
CREATE INDEX IF NOT EXISTS idx_diagnosticos_iniciador ON diagnosticos(iniciado_por);
