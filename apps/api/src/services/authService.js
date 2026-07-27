import pool from '../config/database.js'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { AppError } from '../middleware/errorHandler.js'

export async function login(email, password) {
  const result = await pool.query(
    'SELECT * FROM usuarios WHERE email = $1 AND estado = $2',
    [email, 'activo']
  )

  if (result.rows.length === 0) {
    throw new AppError('Usuario o contraseña incorrectos', 401)
  }

  const user = result.rows[0]
  const passwordMatch = await bcryptjs.compare(password, user.password_hash)

  if (!passwordMatch) {
    throw new AppError('Usuario o contraseña incorrectos', 401)
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      nombre: user.nombre,
      rol: user.rol,
      tenantId: user.tenant_id
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRY || '7d' }
  )

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      nombre: user.nombre,
      rol: user.rol
    }
  }
}

export async function register(email, password, nombre) {
  // Check if user exists
  const existing = await pool.query(
    'SELECT id FROM usuarios WHERE email = $1',
    [email]
  )

  if (existing.rows.length > 0) {
    throw new AppError('El usuario ya existe', 409)
  }

  // Get default tenant
  const tenantResult = await pool.query('SELECT id FROM tenants LIMIT 1')
  if (tenantResult.rows.length === 0) {
    throw new AppError('No tenant configured', 500)
  }

  const tenantId = tenantResult.rows[0].id
  const passwordHash = await bcryptjs.hash(password, 10)

  const result = await pool.query(
    'INSERT INTO usuarios (email, password_hash, nombre, rol, tenant_id, estado) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, email, nombre, rol',
    [email, passwordHash, nombre, 'Consultor', tenantId, 'activo']
  )

  const user = result.rows[0]
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      nombre: user.nombre,
      rol: user.rol,
      tenantId: tenantId
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRY || '7d' }
  )

  return { token, user }
}
