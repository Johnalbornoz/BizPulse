import * as segmentoModel from '../models/segmentoNegocio.js'
import { AppError } from '../middleware/errorHandler.js'

export async function listSegmentos(req, res, next) {
  try {
    const { page = 1, limit = 20, search, estado, industria_principal } = req.query
    const tenantId = req.user.tenantId

    const filters = {}
    if (estado) filters.estado = estado
    if (industria_principal) filters.industria_principal = industria_principal

    let segmentos = await segmentoModel.listSegmentos(tenantId, filters)

    if (search) {
      segmentos = segmentos.filter(s =>
        s.nombre.toLowerCase().includes(search.toLowerCase()) ||
        s.descripcion?.toLowerCase().includes(search.toLowerCase())
      )
    }

    const total = segmentos.length
    const offset = (page - 1) * limit
    const paginated = segmentos.slice(offset, offset + parseInt(limit))

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

export async function getSegmento(req, res, next) {
  try {
    const { id } = req.params
    const tenantId = req.user.tenantId

    const segmento = await segmentoModel.getSegmento(id, tenantId)
    if (!segmento) {
      throw new AppError('Segmento not found', 404)
    }

    res.json(segmento)
  } catch (error) {
    next(error)
  }
}

export async function createSegmento(req, res, next) {
  try {
    const { nombre, descripcion, industria_principal } = req.body
    const tenantId = req.user.tenantId

    if (!nombre) {
      throw new AppError('Nombre is required', 400)
    }

    const segmento = await segmentoModel.createSegmento(tenantId, {
      nombre,
      descripcion,
      industria_principal,
      estado: 'activo'
    })

    res.status(201).json(segmento)
  } catch (error) {
    next(error)
  }
}

export async function updateSegmento(req, res, next) {
  try {
    const { id } = req.params
    const tenantId = req.user.tenantId
    const { nombre, descripcion, industria_principal, estado } = req.body

    if (nombre === '') {
      throw new AppError('Nombre cannot be empty', 400)
    }

    const data = {
      nombre,
      descripcion,
      industria_principal,
      estado
    }

    Object.keys(data).forEach(key => data[key] === undefined && delete data[key])

    const segmento = await segmentoModel.updateSegmento(id, tenantId, data)
    if (!segmento) {
      throw new AppError('Segmento not found', 404)
    }

    res.json(segmento)
  } catch (error) {
    next(error)
  }
}

export async function deleteSegmento(req, res, next) {
  try {
    const { id } = req.params
    const tenantId = req.user.tenantId

    const segmento = await segmentoModel.deleteSegmento(id, tenantId)
    if (!segmento) {
      throw new AppError('Segmento not found', 404)
    }

    res.json({ message: 'Segmento deleted successfully', id: segmento.id })
  } catch (error) {
    next(error)
  }
}

export async function getStats(req, res, next) {
  try {
    const tenantId = req.user.tenantId

    const stats = await segmentoModel.getSegmentosStats(tenantId)
    res.json(stats)
  } catch (error) {
    next(error)
  }
}
