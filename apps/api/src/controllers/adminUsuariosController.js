import * as usuarioModel from '../models/usuario.js'
import { generateTemporaryPassword, hashPassword } from '../services/passwordService.js'
import { AppError } from '../middleware/errorHandler.js'

export async function listUsuarios(req, res, next) {
  try {
    const { page = 1, limit = 20, search, rol, estado, empresa_id } = req.query
    const tenantId = req.user.tenantId

    const filters = {}
    if (rol) filters.rol = rol
    if (estado) filters.estado = estado
    if (empresa_id) filters.empresa_id = parseInt(empresa_id)

    let usuarios = await usuarioModel.listUsuarios(tenantId, filters)

    if (search) {
      usuarios = usuarios.filter(u =>
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.nombre.toLowerCase().includes(search.toLowerCase())
      )
    }

    const total = usuarios.length
    const offset = (page - 1) * limit
    const paginated = usuarios.slice(offset, offset + parseInt(limit))

    res.json({
      data: paginated,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    next(error)
  }
}

export async function getUsuario(req, res, next) {
  try {
    const { id } = req.params
    const tenantId = req.user.tenantId

    const usuario = await usuarioModel.getUsuario(id, tenantId)
    if (!usuario) {
      throw new AppError('Usuario not found', 404)
    }

    res.json(usuario)
  } catch (error) {
    next(error)
  }
}

export async function createUsuario(req, res, next) {
  try {
    const { email, nombre, rol, empresa_id } = req.body
    const tenantId = req.user.tenantId

    if (!email || !nombre || !rol) {
      throw new AppError('Email, nombre, and rol are required', 400)
    }

    // Verify email is unique
    const existingUser = await usuarioModel.getUsuarioByEmail(email)
    if (existingUser) {
      throw new AppError('Email already exists', 409)
    }

    // Generate temporary password
    const tempPassword = await generateTemporaryPassword()
    const passwordHash = await hashPassword(tempPassword)

    const usuario = await usuarioModel.createUsuario(tenantId, {
      email,
      password_hash: passwordHash,
      nombre,
      rol,
      empresa_id: empresa_id ? parseInt(empresa_id) : null,
      estado: 'activo'
    })

    // Return user with temporary password (only once)
    res.status(201).json({
      ...usuario,
      tempPassword,
      message: 'User created with temporary password. User must change password on first login.'
    })
  } catch (error) {
    next(error)
  }
}

export async function updateUsuario(req, res, next) {
  try {
    const { id } = req.params
    const tenantId = req.user.tenantId
    const { nombre, empresa_id, estado } = req.body

    if (nombre === '') {
      throw new AppError('Nombre cannot be empty', 400)
    }

    const data = {
      nombre,
      empresa_id: empresa_id ? parseInt(empresa_id) : undefined,
      estado
    }

    Object.keys(data).forEach(key => data[key] === undefined && delete data[key])

    const usuario = await usuarioModel.updateUsuario(id, tenantId, data)
    if (!usuario) {
      throw new AppError('Usuario not found', 404)
    }

    res.json(usuario)
  } catch (error) {
    next(error)
  }
}

export async function changeRole(req, res, next) {
  try {
    const { id } = req.params
    const { rol } = req.body
    const tenantId = req.user.tenantId

    const validRoles = ['SuperAdmin', 'Admin', 'Consultor']
    if (!rol || !validRoles.includes(rol)) {
      throw new AppError('Invalid role', 400)
    }

    const usuario = await usuarioModel.changeUserRole(id, tenantId, rol)
    if (!usuario) {
      throw new AppError('Usuario not found', 404)
    }

    res.json(usuario)
  } catch (error) {
    next(error)
  }
}

export async function deleteUsuario(req, res, next) {
  try {
    const { id } = req.params
    const tenantId = req.user.tenantId

    // Prevent deletion of current user
    if (parseInt(id) === req.user.id) {
      throw new AppError('Cannot delete your own account', 400)
    }

    const usuario = await usuarioModel.deleteUsuario(id, tenantId)
    if (!usuario) {
      throw new AppError('Usuario not found', 404)
    }

    res.json({ message: 'Usuario deleted successfully', id: usuario.id })
  } catch (error) {
    next(error)
  }
}

export async function getStats(req, res, next) {
  try {
    const tenantId = req.user.tenantId
    const { default: pool } = await import('../config/database.js')

    const result = await pool.query(
      `SELECT
        COUNT(*) as total,
        SUM(CASE WHEN rol = 'SuperAdmin' THEN 1 ELSE 0 END)::INT as superadmins,
        SUM(CASE WHEN rol = 'Admin' THEN 1 ELSE 0 END)::INT as admins,
        SUM(CASE WHEN rol = 'Consultor' THEN 1 ELSE 0 END)::INT as consultores
       FROM usuarios WHERE tenant_id = $1`,
      [tenantId]
    )

    res.json(result.rows[0])
  } catch (error) {
    next(error)
  }
}
