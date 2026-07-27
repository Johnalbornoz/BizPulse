import * as empresaModel from '../models/empresa.js'

export async function createEmpresa(req, res, next) {
  try {
    const { nombre, pais, industria, tamaño, empleados, facturacion_usd } = req.body
    const tenantId = req.user.tenantId

    if (!nombre) {
      return res.status(400).json({ error: 'Nombre is required' })
    }

    const empresa = await empresaModel.createEmpresa(tenantId, {
      nombre,
      pais,
      industria,
      tamaño,
      empleados: empleados ? parseInt(empleados) : null,
      facturacion_usd: facturacion_usd ? parseFloat(facturacion_usd) : null
    })

    res.status(201).json(empresa)
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
      return res.status(404).json({ error: 'Empresa not found' })
    }

    res.json(empresa)
  } catch (error) {
    next(error)
  }
}

export async function listEmpresas(req, res, next) {
  try {
    const tenantId = req.user.tenantId
    const empresas = await empresaModel.listEmpresas(tenantId)
    res.json(empresas)
  } catch (error) {
    next(error)
  }
}

export async function updateEmpresa(req, res, next) {
  try {
    const { id } = req.params
    const tenantId = req.user.tenantId

    const empresa = await empresaModel.updateEmpresa(id, tenantId, req.body)

    if (!empresa) {
      return res.status(404).json({ error: 'Empresa not found' })
    }

    res.json(empresa)
  } catch (error) {
    next(error)
  }
}
