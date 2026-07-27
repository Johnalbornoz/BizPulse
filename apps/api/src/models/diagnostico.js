import pool from '../config/database.js'

export async function createDiagnostico(tenantId, empresa_id, nombre) {
  const result = await pool.query(
    `INSERT INTO diagnosticos
      (empresa_id, nombre, estado, fecha_inicio)
     VALUES ($1, $2, $3, NOW())
     RETURNING *`,
    [empresa_id, nombre, 'discovery']
  )
  return result.rows[0]
}

export async function getDiagnostico(id, tenantId) {
  const result = await pool.query(
    `SELECT d.* FROM diagnosticos d
     JOIN empresas e ON d.empresa_id = e.id
     WHERE d.id = $1 AND e.tenant_id = $2`,
    [id, tenantId]
  )
  return result.rows[0]
}

export async function listDiagnosticos(tenantId) {
  const result = await pool.query(
    `SELECT d.* FROM diagnosticos d
     JOIN empresas e ON d.empresa_id = e.id
     WHERE e.tenant_id = $1
     ORDER BY d.created_at DESC`,
    [tenantId]
  )
  return result.rows
}

export async function updateDiagnostico(id, tenantId, data) {
  const fields = []
  const values = []
  let paramIndex = 1

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined) {
      fields.push(`${key} = $${paramIndex}`)
      values.push(key === 'snapshot_preguntas' || key === 'resultado_final' ? JSON.stringify(value) : value)
      paramIndex++
    }
  })

  if (fields.length === 0) return getDiagnostico(id, tenantId)

  values.push(id, tenantId)

  const result = await pool.query(
    `UPDATE diagnosticos SET ${fields.join(', ')}, updated_at = NOW()
     WHERE id = $1 AND EXISTS (
       SELECT 1 FROM empresas WHERE diagnosticos.empresa_id = empresas.id AND empresas.tenant_id = $2
     )
     RETURNING *`,
    values
  )

  return result.rows[0]
}

export async function addDiagnosticoDocumento(diagnosticoId, tipo, nombre, contenido) {
  const result = await pool.query(
    `INSERT INTO diagnostico_documentos
      (diagnostico_id, tipo, nombre, contenido_extractado)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [diagnosticoId, tipo, nombre, contenido]
  )
  return result.rows[0]
}

export async function addDiagnosticoEntrevista(diagnosticoId, tipo, transcript) {
  const result = await pool.query(
    `INSERT INTO diagnostico_entrevistas
      (diagnostico_id, tipo, transcript)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [diagnosticoId, tipo, transcript]
  )
  return result.rows[0]
}

export async function getDiagnosticoDocumentos(diagnosticoId) {
  const result = await pool.query(
    'SELECT * FROM diagnostico_documentos WHERE diagnostico_id = $1 ORDER BY created_at',
    [diagnosticoId]
  )
  return result.rows
}

export async function getDiagnosticoEntrevistas(diagnosticoId) {
  const result = await pool.query(
    'SELECT * FROM diagnostico_entrevistas WHERE diagnostico_id = $1 ORDER BY created_at',
    [diagnosticoId]
  )
  return result.rows
}
