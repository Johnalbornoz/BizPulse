import * as empresaModel from '../models/empresa.js'
import * as diagnosticoModel from '../models/diagnostico.js'
import * as pilarModel from '../models/pilar.js'
import { classifyBusiness } from '../services/classificationEngine.js'

export async function createDiagnostico(req, res, next) {
  try {
    const { nombre } = req.body
    const tenantId = req.user.tenantId

    // En MVP, usar la primera empresa del tenant (o crear una nueva)
    const empresas = await empresaModel.listEmpresas(tenantId)

    if (empresas.length === 0) {
      return res.status(400).json({ error: 'No empresas found. Create one first.' })
    }

    const empresa = empresas[0]
    const diagnostico = await diagnosticoModel.createDiagnostico(
      tenantId,
      empresa.id,
      nombre || `Diagnóstico ${new Date().toLocaleDateString()}`
    )

    res.status(201).json(diagnostico)
  } catch (error) {
    next(error)
  }
}

export async function getDiagnostico(req, res, next) {
  try {
    const { id } = req.params
    const tenantId = req.user.tenantId

    const diagnostico = await diagnosticoModel.getDiagnostico(id, tenantId)

    if (!diagnostico) {
      return res.status(404).json({ error: 'Diagnóstico not found' })
    }

    res.json(diagnostico)
  } catch (error) {
    next(error)
  }
}

export async function listDiagnosticos(req, res, next) {
  try {
    const tenantId = req.user.tenantId
    const diagnosticos = await diagnosticoModel.listDiagnosticos(tenantId)
    res.json(diagnosticos)
  } catch (error) {
    next(error)
  }
}

export async function addDocumento(req, res, next) {
  try {
    const { diagnosticoId } = req.params
    const { tipo, nombre, contenido } = req.body
    const tenantId = req.user.tenantId

    // Verify diagnostico exists
    const diagnostico = await diagnosticoModel.getDiagnostico(diagnosticoId, tenantId)
    if (!diagnostico) {
      return res.status(404).json({ error: 'Diagnóstico not found' })
    }

    const documento = await diagnosticoModel.addDiagnosticoDocumento(
      diagnosticoId,
      tipo,
      nombre,
      contenido
    )

    res.status(201).json(documento)
  } catch (error) {
    next(error)
  }
}

export async function addEntrevista(req, res, next) {
  try {
    const { diagnosticoId } = req.params
    const { tipo, transcript } = req.body
    const tenantId = req.user.tenantId

    // Verify diagnostico exists
    const diagnostico = await diagnosticoModel.getDiagnostico(diagnosticoId, tenantId)
    if (!diagnostico) {
      return res.status(404).json({ error: 'Diagnóstico not found' })
    }

    const entrevista = await diagnosticoModel.addDiagnosticoEntrevista(
      diagnosticoId,
      tipo,
      transcript
    )

    res.status(201).json(entrevista)
  } catch (error) {
    next(error)
  }
}

export async function classifyDiagnostico(req, res, next) {
  try {
    const { diagnosticoId } = req.params
    const tenantId = req.user.tenantId

    // Get diagnóstico and empresa data
    const diagnostico = await diagnosticoModel.getDiagnostico(diagnosticoId, tenantId)
    if (!diagnostico) {
      return res.status(404).json({ error: 'Diagnóstico not found' })
    }

    const empresa = await empresaModel.getEmpresa(diagnostico.empresa_id, tenantId)

    // Get discovery content (documentos + entrevistas)
    const documentos = await diagnosticoModel.getDiagnosticoDocumentos(diagnosticoId)
    const entrevistas = await diagnosticoModel.getDiagnosticoEntrevistas(diagnosticoId)

    const discoveryContent = [
      ...documentos.map(d => `Documento: ${d.nombre}\n${d.contenido_extractado}`),
      ...entrevistas.map(e => `Entrevista (${e.tipo}):\n${e.transcript}`)
    ].join('\n\n')

    // Run classification engine
    const clasificacion = await classifyBusiness(empresa, discoveryContent)

    // Update diagnóstico with classification
    const updated = await diagnosticoModel.updateDiagnostico(diagnosticoId, tenantId, {
      estado: 'clasificacion',
      clasificacion_industria: clasificacion.industria,
      clasificacion_modelo: clasificacion.modelo_negocio
    })

    res.json({
      diagnostico: updated,
      clasificacion
    })
  } catch (error) {
    next(error)
  }
}

export async function selectFramework(req, res, next) {
  try {
    const { diagnosticoId } = req.params
    const tenantId = req.user.tenantId

    // Get all active preguntas
    const preguntas = await pilarModel.getTodasPreguntas()

    // For MVP, use all preguntas (future: select based on clasificación)
    const snapshotPreguntas = preguntas.map(p => ({
      id: p.id,
      pilar_id: p.pilar_id,
      pilar_nombre: p.pilar_nombre,
      texto: p.texto,
      tipo: p.tipo
    }))

    // Update diagnóstico
    const updated = await diagnosticoModel.updateDiagnostico(diagnosticoId, tenantId, {
      estado: 'assessment',
      snapshot_preguntas: snapshotPreguntas
    })

    // Get pilares with their preguntas
    const pilares = await pilarModel.getPilares()
    const pilaresWithPreguntas = await Promise.all(
      pilares.map(async (pilar) => ({
        ...pilar,
        preguntas: snapshotPreguntas.filter(p => p.pilar_id === pilar.id)
      }))
    )

    res.json({
      diagnostico: updated,
      framework: pilaresWithPreguntas
    })
  } catch (error) {
    next(error)
  }
}
