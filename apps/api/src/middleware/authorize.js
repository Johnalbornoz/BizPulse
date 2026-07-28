import { AppError } from './errorHandler.js'

export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      throw new AppError('No authenticated user', 401)
    }

    if (!allowedRoles.includes(req.user.rol)) {
      throw new AppError('Insufficient permissions', 403)
    }

    next()
  }
}

export function requireSuperAdmin(req, res, next) {
  if (!req.user) {
    throw new AppError('No authenticated user', 401)
  }

  if (req.user.rol !== 'SuperAdmin') {
    throw new AppError('Only SuperAdmin can access this resource', 403)
  }

  next()
}

export function requireAdmin(req, res, next) {
  if (!req.user) {
    throw new AppError('No authenticated user', 401)
  }

  const adminRoles = ['SuperAdmin', 'Admin']
  if (!adminRoles.includes(req.user.rol)) {
    throw new AppError('Admin access required', 403)
  }

  next()
}
