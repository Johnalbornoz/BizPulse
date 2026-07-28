import pool from '../config/database.js'

export async function createUsuario(tenantId, data) {
  const { email, password_hash, nombre, rol, empresa_id, estado = 'activo' } = data

  const result = await pool.query(
    `INSERT INTO usuarios
      (email, password_hash, nombre, rol, tenant_id, empresa_id, estado)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, email, nombre, rol, empresa_id, estado, created_at`,
    [email, password_hash, nombre, rol, tenantId, empresa_id, estado]
  )

  return result.rows[0]
}

export async function getUsuario(id, tenantId) {
  const result = await pool.query(
    'SELECT id, email, nombre, rol, empresa_id, estado, created_at, updated_at FROM usuarios WHERE id = $1 AND tenant_id = $2',
    [id, tenantId]
  )
  return result.rows[0]
}

export async function getUsuarioByEmail(email) {
  const result = await pool.query(
    'SELECT * FROM usuarios WHERE email = $1',
    [email]
  )
  return result.rows[0]
}

export async function listUsuarios(tenantId, filters = {}) {
  let query = 'SELECT id, email, nombre, rol, empresa_id, estado, created_at, updated_at FROM usuarios WHERE tenant_id = $1'
  const values = [tenantId]
  let paramIndex = 2

  if (filters.rol) {
    query += ` AND rol = $${paramIndex}`
    values.push(filters.rol)
    paramIndex++
  }

  if (filters.estado) {
    query += ` AND estado = $${paramIndex}`
    values.push(filters.estado)
    paramIndex++
  }

  if (filters.empresa_id) {
    query += ` AND empresa_id = $${paramIndex}`
    values.push(filters.empresa_id)
    paramIndex++
  }

  query += ' ORDER BY created_at DESC'

  const result = await pool.query(query, values)
  return result.rows
}

export async function updateUsuario(id, tenantId, data) {
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

  if (fields.length === 0) return getUsuario(id, tenantId)

  values.push(id, tenantId)

  const result = await pool.query(
    `UPDATE usuarios SET ${fields.join(', ')}, updated_at = NOW()
     WHERE id = $${paramIndex} AND tenant_id = $${paramIndex + 1}
     RETURNING id, email, nombre, rol, empresa_id, estado, created_at, updated_at`,
    values
  )

  return result.rows[0]
}

export async function deleteUsuario(id, tenantId) {
  const result = await pool.query(
    'DELETE FROM usuarios WHERE id = $1 AND tenant_id = $2 RETURNING id',
    [id, tenantId]
  )
  return result.rows[0]
}

export async function changeUserRole(id, tenantId, newRole) {
  const result = await pool.query(
    'UPDATE usuarios SET rol = $1, updated_at = NOW() WHERE id = $2 AND tenant_id = $3 RETURNING id, email, nombre, rol',
    [newRole, id, tenantId]
  )
  return result.rows[0]
}
