import pool from '../config/database.js'

export async function createEmpresa(tenantId, data) {
  const { nombre, pais, industria, subindustria, tamaño, empleados, facturacion_usd } = data

  const result = await pool.query(
    `INSERT INTO empresas
      (tenant_id, nombre, pais, industria, subindustria, tamaño, empleados, facturacion_usd)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [tenantId, nombre, pais, industria, subindustria, tamaño, empleados, facturacion_usd]
  )

  return result.rows[0]
}

export async function getEmpresa(id, tenantId) {
  const result = await pool.query(
    'SELECT * FROM empresas WHERE id = $1 AND tenant_id = $2',
    [id, tenantId]
  )
  return result.rows[0]
}

export async function listEmpresas(tenantId) {
  const result = await pool.query(
    'SELECT * FROM empresas WHERE tenant_id = $1 ORDER BY created_at DESC',
    [tenantId]
  )
  return result.rows
}

export async function updateEmpresa(id, tenantId, data) {
  const fields = []
  const values = []
  let paramIndex = 1

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined) {
      fields.push(`${key} = $${paramIndex}`)
      values.push(value)
      paramIndex++
    }
  })

  if (fields.length === 0) return getEmpresa(id, tenantId)

  values.push(id, tenantId)

  const result = await pool.query(
    `UPDATE empresas SET ${fields.join(', ')}, updated_at = NOW()
     WHERE id = $${paramIndex} AND tenant_id = $${paramIndex + 1}
     RETURNING *`,
    values
  )

  return result.rows[0]
}

export async function deleteEmpresa(id, tenantId) {
  const result = await pool.query(
    'DELETE FROM empresas WHERE id = $1 AND tenant_id = $2 RETURNING id',
    [id, tenantId]
  )
  return result.rows[0]
}

export async function getEmpresasStats(tenantId) {
  const result = await pool.query(
    `SELECT
      COUNT(*) as total,
      COUNT(DISTINCT pais) as paises,
      COUNT(DISTINCT industria) as industrias,
      AVG(empleados)::INT as empleados_promedio,
      SUM(facturacion_usd)::DECIMAL as facturacion_total_usd
     FROM empresas WHERE tenant_id = $1`,
    [tenantId]
  )
  return result.rows[0]
}
