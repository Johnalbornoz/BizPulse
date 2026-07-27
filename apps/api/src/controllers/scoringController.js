import * as diagnosticoModel from '../models/diagnostico.js'
import * as respuestasModel from '../models/respuestas.js'
import * as pilarModel from '../models/pilar.js'
import { scorepilar } from '../services/diagnosticEngine.js'
import pool from '../config/database.js'

export async function scorePilar(req, res, next) {
  try {
    const { diagnosticoId, pilarId } = req.params
    const { respuestas } = req.body
    const tenantId = req.user.tenantId

    // Verify diagnóstico exists
    const diagnostico = await diagnosticoModel.getDiagnostico(diagnosticoId, tenantId)
    if (!diagnostico) {
      return res.status(404).json({ error: 'Diagnóstico not found' })
    }

    // Get pilar
    const pilar = await pilarModel.getPilar(pilarId)
    if (!pilar) {
      return res.status(404).json({ error: 'Pilar not found' })
    }

    // Get preguntas del pilar
    const preguntas = await pilarModel.getPreguntasByPilar(pilarId)

    // Get discovery content
    const documentos = await diagnosticoModel.getDiagnosticoDocumentos(diagnosticoId)
    const entrevistas = await diagnosticoModel.getDiagnosticoEntrevistas(diagnosticoId)
    const discoveryContent = [
      ...documentos.map(d => `Documento: ${d.nombre}\n${d.contenido_extractado}`),
      ...entrevistas.map(e => `Entrevista (${e.tipo}):\n${e.transcript}`)
    ].join('\n\n') || 'Sin información de discovery'

    // Get benchmark for this pilar/segment (mock for MVP)
    const benchmark = 'Promedio segmento: 3.2/5'

    // Run diagnostic engine
    const sugerencias = await scorepilar(
      pilar.nombre,
      preguntas,
      respuestas,
      benchmark,
      discoveryContent
    )

    // Save validaciones with sugerencias
    const validaciones = []
    for (const item of sugerencias.preguntas) {
      const validacion = await respuestasModel.crearValidacionHITL(
        diagnosticoId,
        pilarId,
        item.pregunta_id,
        item.sugerencia_eje1,
        item.sugerencia_eje2,
        item.argumentacion_eje1,
        item.argumentacion_eje2
      )
      validaciones.push(validacion)
    }

    res.json({
      pilar: pilar.nombre,
      validaciones: validaciones.map(v => ({
        id: v.id,
        pregunta_id: v.pregunta_id,
        sugerencia_eje1: v.sugerencia_ia_eje1,
        sugerencia_eje2: v.sugerencia_ia_eje2,
        argumentacion_eje1: v.argumentacion_ia_eje1,
        argumentacion_eje2: v.argumentacion_ia_eje2
      }))
    })
  } catch (error) {
    next(error)
  }
}

export async function confirmarValidacion(req, res, next) {
  try {
    const { validacionId } = req.params
    const { calificacion_eje1, calificacion_eje2, argumentacion_eje1, argumentacion_eje2 } = req.body
    const tenantId = req.user.tenantId
    const usuarioId = req.user.id

    // Verify input
    if (
      typeof calificacion_eje1 !== 'number' ||
      typeof calificacion_eje2 !== 'number' ||
      calificacion_eje1 < 0 || calificacion_eje1 > 5 ||
      calificacion_eje2 < 0 || calificacion_eje2 > 5
    ) {
      return res.status(400).json({ error: 'Invalid calificaciones' })
    }

    // Confirm validación
    const validacion = await respuestasModel.confirmarValidacion(
      validacionId,
      calificacion_eje1,
      calificacion_eje2,
      argumentacion_eje1 || '',
      argumentacion_eje2 || '',
      usuarioId
    )

    res.json({
      id: validacion.id,
      calificacion_final_eje1: validacion.calificacion_final_eje1,
      calificacion_final_eje2: validacion.calificacion_final_eje2,
      validado_en: validacion.validado_en
    })
  } catch (error) {
    next(error)
  }
}

export async function getPilarProgress(req, res, next) {
  try {
    const { diagnosticoId, pilarId } = req.params
    const tenantId = req.user.tenantId

    // Verify diagnóstico exists
    const diagnostico = await diagnosticoModel.getDiagnostico(diagnosticoId, tenantId)
    if (!diagnostico) {
      return res.status(404).json({ error: 'Diagnóstico not found' })
    }

    // Get validaciones
    const validaciones = await respuestasModel.getValidacionesPilar(diagnosticoId, pilarId)

    const totalValidaciones = validaciones.length
    const validadas = validaciones.filter(v => v.validado_en !== null).length

    res.json({
      pilarId,
      total: totalValidaciones,
      validadas: validadas,
      pendientes: totalValidaciones - validadas,
      porcentaje: totalValidaciones > 0 ? Math.round((validadas / totalValidaciones) * 100) : 0,
      validaciones: validaciones.map(v => ({
        id: v.id,
        pregunta_id: v.pregunta_id,
        sugerencia_eje1: v.sugerencia_ia_eje1,
        sugerencia_eje2: v.sugerencia_ia_eje2,
        argumentacion_eje1: v.argumentacion_ia_eje1,
        argumentacion_eje2: v.argumentacion_ia_eje2,
        calificacion_eje1: v.calificacion_final_eje1,
        calificacion_eje2: v.calificacion_final_eje2,
        argumentacion_experto_eje1: v.argumentacion_experto_eje1,
        argumentacion_experto_eje2: v.argumentacion_experto_eje2,
        validado_en: v.validado_en
      }))
    })
  } catch (error) {
    next(error)
  }
}

export async function getDiagnosticoProgress(req, res, next) {
  try {
    const { diagnosticoId } = req.params
    const tenantId = req.user.tenantId

    // Verify diagnóstico exists
    const diagnostico = await diagnosticoModel.getDiagnostico(diagnosticoId, tenantId)
    if (!diagnostico) {
      return res.status(404).json({ error: 'Diagnóstico not found' })
    }

    // Get all validaciones
    const validaciones = await respuestasModel.getValidacionesDiagnostico(diagnosticoId)

    const pilares = await pilarModel.getPilares()
    const pilarProgress = {}

    for (const pilar of pilares) {
      const pilarValidaciones = validaciones.filter(v => v.pilar_id === pilar.id)
      const total = pilarValidaciones.length
      const validadas = pilarValidaciones.filter(v => v.validado_en !== null).length

      pilarProgress[pilar.nombre] = {
        pilarId: pilar.id,
        total,
        validadas,
        pendientes: total - validadas,
        porcentaje: total > 0 ? Math.round((validadas / total) * 100) : 0,
        completado: total > 0 && validadas === total
      }
    }

    res.json({
      diagnosticoId,
      totalValidaciones: validaciones.length,
      validadas: validaciones.filter(v => v.validado_en !== null).length,
      pilares: pilarProgress
    })
  } catch (error) {
    next(error)
  }
}
