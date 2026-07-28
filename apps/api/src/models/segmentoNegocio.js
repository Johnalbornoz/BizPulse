import pool from '../config/database.js'

export async function createSegmento(tenantId, data) {
  const { nombre, descripcion, industria_principal, estado = 'activo' } = data

  const result = await pool.query(
    `INSERT INTO segmentos_negocio
      (tenant_id, nombre, descripcion, industria_principal, estado)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, nombre, descripcion, industria_principal, estado, created_at`,
    [tenantId, nombre, descripcion, industria_principal, estado]
  )

  return result.rows[0]
}

export async function getSegmento(id, tenantId) {
  const result = await pool.query(
    'SELECT id, nombre, descripcion, industria_principal, estado, created_at, updated_at FROM segmentos_negocio WHERE id = $1 AND tenant_id = $2',
    [id, tenantId]
  )
  return result.rows[0]
}

export async function listSegmentos(tenantId, filters = {}) {
  let query = 'SELECT id, nombre, descripcion, industria_principal, estado, created_at, updated_at FROM segmentos_negocio WHERE tenant_id = $1'
  const values = [tenantId]
  let paramIndex = 2

  if (filters.estado) {
    query += ` AND estado = $${paramIndex}`
    values.push(filters.estado)
    paramIndex++
  }

  if (filters.industria_principal) {
    query += ` AND industria_principal = $${paramIndex}`
    values.push(filters.industria_principal)
    paramIndex++
  }

  query += ' ORDER BY nombre ASC'

  const result = await pool.query(query, values)
  return result.rows
}

export async function updateSegmento(id, tenantId, data) {
  const fields = []
  const values = []
  let paramIndex = 1

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && key !== 'id' && key !== 'tenant_id') {
      fields.push(`${key} = $${paramIndex}`)
      values.push(value)
      paramIndex++
    }
  })

  if (fields.length === 0) return getSegmento(id, tenantId)

  values.push(id, tenantId)

  const result = await pool.query(
    `UPDATE segmentos_negocio SET ${fields.join(', ')}, updated_at = NOW()
     WHERE id = $${paramIndex} AND tenant_id = $${paramIndex + 1}
     RETURNING id, nombre, descripcion, industria_principal, estado, created_at, updated_at`,
    values
  )

  return result.rows[0]
}

export async function deleteSegmento(id, tenantId) {
  const result = await pool.query(
    'DELETE FROM segmentos_negocio WHERE id = $1 AND tenant_id = $2 RETURNING id',
    [id, tenantId]
  )
  return result.rows[0]
}

export async function getSegmentosStats(tenantId) {
  const result = await pool.query(
    `SELECT
      COUNT(*) as total,
      COUNT(DISTINCT industria_principal) as industrias
     FROM segmentos_negocio WHERE tenant_id = $1 AND estado = 'activo'`,
    [tenantId]
  )
  return result.rows[0]
}
