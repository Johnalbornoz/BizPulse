import * as empresaModel from '../models/empresa.js'
import { AppError } from '../middleware/errorHandler.js'

export async function listEmpresas(req, res, next) {
  try {
    const { page = 1, limit = 20, search, pais, industria } = req.query
    const tenantId = req.user.tenantId

    let query = 'SELECT * FROM empresas WHERE tenant_id = $1'
    const values = [tenantId]
    let paramIndex = 2

    if (search) {
      query += ` AND (nombre ILIKE $${paramIndex} OR pais ILIKE $${paramIndex + 1})`
      values.push(`%${search}%`, `%${search}%`)
      paramIndex += 2
    }

    if (pais) {
      query += ` AND pais = $${paramIndex}`
      values.push(pais)
      paramIndex++
    }

    if (industria) {
      query += ` AND industria = $${paramIndex}`
      values.push(industria)
      paramIndex++
    }

    // Get total count
    const countResult = await require('../config/database.js').default.query(
      query.replace('SELECT *', 'SELECT COUNT(*) as count'),
      values
    )
    const total = parseInt(countResult.rows[0].count)

    // Get paginated results
    const offset = (page - 1) * limit
    query += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`
    values.push(limit, offset)

    const { default: pool } = await import('../config/database.js')
    const result = await pool.query(query, values)

    res.json({
      data: result.rows,
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

export async function getEmpresa(req, res, next) {
  try {
    const { id } = req.params
    const tenantId = req.user.tenantId

    const empresa = await empresaModel.getEmpresa(id, tenantId)
    if (!empresa) {
      throw new AppError('Empresa not found', 404)
    }

    res.json(empresa)
  } catch (error) {
    next(error)
  }
}

export async function createEmpresa(req, res, next) {
  try {
    const { nombre, pais, industria, subindustria, tamaño, empleados, facturacion_usd, sitio_web } = req.body
    const tenantId = req.user.tenantId

    if (!nombre) {
      throw new AppError('Nombre is required', 400)
    }

    const empresa = await empresaModel.createEmpresa(tenantId, {
      nombre,
      pais,
      industria,
      subindustria,
      tamaño,
      empleados: empleados ? parseInt(empleados) : null,
      facturacion_usd: facturacion_usd ? parseFloat(facturacion_usd) : null,
      sitio_web
    })

    res.status(201).json(empresa)
  } catch (error) {
    next(error)
  }
}

export async function updateEmpresa(req, res, next) {
  try {
    const { id } = req.params
    const tenantId = req.user.tenantId
    const { nombre, pais, industria, subindustria, tamaño, empleados, facturacion_usd, sitio_web } = req.body

    if (nombre === '') {
      throw new AppError('Nombre cannot be empty', 400)
    }

    const data = {
      nombre,
      pais,
      industria,
      subindustria,
      tamaño,
      empleados: empleados ? parseInt(empleados) : undefined,
      facturacion_usd: facturacion_usd ? parseFloat(facturacion_usd) : undefined,
      sitio_web
    }

    Object.keys(data).forEach(key => data[key] === undefined && delete data[key])

    const empresa = await empresaModel.updateEmpresa(id, tenantId, data)
    if (!empresa) {
      throw new AppError('Empresa not found', 404)
    }

    res.json(empresa)
  } catch (error) {
    next(error)
  }
}

export async function deleteEmpresa(req, res, next) {
  try {
    const { id } = req.params
    const tenantId = req.user.tenantId

    const empresa = await empresaModel.deleteEmpresa(id, tenantId)
    if (!empresa) {
      throw new AppError('Empresa not found', 404)
    }

    res.json({ message: 'Empresa deleted successfully', id: empresa.id })
  } catch (error) {
    next(error)
  }
}

export async function getStats(req, res, next) {
  try {
    const tenantId = req.user.tenantId

    const stats = await empresaModel.getEmpresasStats(tenantId)
    res.json(stats)
  } catch (error) {
    next(error)
  }
}
