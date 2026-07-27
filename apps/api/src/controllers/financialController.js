import * as diagnosticoModel from '../models/diagnostico.js'
import * as respuestasModel from '../models/respuestas.js'
import * as empresaModel from '../models/empresa.js'
import * as pilarModel from '../models/pilar.js'
import { calculateFinancialImpact, calculateTotalImpact } from '../services/financialImpactEngine.js'
import pool from '../config/database.js'

export async function calculatePilarImpact(req, res, next) {
  try {
    const { diagnosticoId, pilarId } = req.params
    const tenantId = req.user.tenantId

    // Verify diagnóstico
    const diagnostico = await diagnosticoModel.getDiagnostico(diagnosticoId, tenantId)
    if (!diagnostico) {
      return res.status(404).json({ error: 'Diagnóstico not found' })
    }

    // Check if pilar is fully validated
    const isValidated = await respuestasModel.checkPilarValidado(diagnosticoId, pilarId)
    if (!isValidated) {
      return res.status(400).json({ error: 'Pilar not fully validated yet' })
    }

    // Get empresa data for context
    const empresa = await empresaModel.getEmpresa(diagnostico.empresa_id, tenantId)

    // Get pilar info
    const pilar = await pilarModel.getPilar(pilarId)

    // Get discovery content
    const documentos = await diagnosticoModel.getDiagnosticoDocumentos(diagnosticoId)
    const entrevistas = await diagnosticoModel.getDiagnosticoEntrevistas(diagnosticoId)
    const discoveryContent = [
      ...documentos.map(d => `Documento: ${d.nombre}\n${d.contenido_extractado}`),
      ...entrevistas.map(e => `Entrevista (${e.tipo}):\n${e.transcript}`)
    ].join('\n\n') || 'Sin información de discovery'

    // Get validaciones for this pilar to calculate average brecha
    const validaciones = await respuestasModel.getValidacionesPilar(diagnosticoId, pilarId)

    const brechaEje1 = validaciones.length > 0
      ? Math.round(
          (validaciones.reduce((sum, v) => sum + (v.calificacion_final_eje1 || 0), 0) / validaciones.length) * 10
        ) / 10
      : 3

    const brechaEje2 = validaciones.length > 0
      ? Math.round(
          (validaciones.reduce((sum, v) => sum + (v.calificacion_final_eje2 || 0), 0) / validaciones.length) * 10
        ) / 10
      : 3

    // Calculate impact for both axes
    const impactEje1 = await calculateFinancialImpact(
      pilar.nombre,
      { actual: brechaEje1, objetivo: 5, diferencia: 5 - brechaEje1 },
      empresa,
      discoveryContent
    )

    const impactEje2 = await calculateFinancialImpact(
      pilar.nombre,
      { actual: brechaEje2, objetivo: 5, diferencia: 5 - brechaEje2 },
      empresa,
      discoveryContent
    )

    // Update validaciones with impact data
    for (const validacion of validaciones) {
      await pool.query(
        `UPDATE diagnostico_validaciones_hitl
         SET impacto_financiero_eje1 = $1, impacto_financiero_eje2 = $2
         WHERE id = $3`,
        [JSON.stringify(impactEje1), JSON.stringify(impactEje2), validacion.id]
      )
    }

    res.json({
      pilar: pilar.nombre,
      impactos: {
        eje1: impactEje1,
        eje2: impactEje2
      },
      validaciones_actualizadas: validaciones.length
    })
  } catch (error) {
    next(error)
  }
}

export async function getDiagnosticoFinancialSummary(req, res, next) {
  try {
    const { diagnosticoId } = req.params
    const tenantId = req.user.tenantId

    // Verify diagnóstico
    const diagnostico = await diagnosticoModel.getDiagnostico(diagnosticoId, tenantId)
    if (!diagnostico) {
      return res.status(404).json({ error: 'Diagnóstico not found' })
    }

    // Get empresa data
    const empresa = await empresaModel.getEmpresa(diagnostico.empresa_id, tenantId)

    // Get all validaciones
    const validaciones = await respuestasModel.getValidacionesDiagnostico(diagnosticoId)

    // Calculate total impact
    const summary = await calculateTotalImpact(empresa, validaciones)

    // Get pilar-level summary
    const pilares = await pilarModel.getPilares()
    const pilarSummary = []

    for (const pilar of pilares) {
      const pilarValidaciones = validaciones.filter(v => v.pilar_id === pilar.id)
      const impactosEje1 = pilarValidaciones
        .map(v => v.impacto_financiero_eje1?.impacto_usd_estimado || 0)
        .filter(x => x > 0)

      const impactosEje2 = pilarValidaciones
        .map(v => v.impacto_financiero_eje2?.impacto_usd_estimado || 0)
        .filter(x => x > 0)

      if (impactosEje1.length > 0 || impactosEje2.length > 0) {
        pilarSummary.push({
          pilar_id: pilar.id,
          pilar_nombre: pilar.nombre,
          impacto_total_usd: Math.max(
            impactosEje1.reduce((a, b) => a + b, 0),
            impactosEje2.reduce((a, b) => a + b, 0)
          )
        })
      }
    }

    res.json({
      ...summary,
      pilares: pilarSummary.sort((a, b) => b.impacto_total_usd - a.impacto_total_usd)
    })
  } catch (error) {
    next(error)
  }
}

export async function getPilarFinancialDetail(req, res, next) {
  try {
    const { diagnosticoId, pilarId } = req.params
    const tenantId = req.user.tenantId

    // Verify diagnóstico
    const diagnostico = await diagnosticoModel.getDiagnostico(diagnosticoId, tenantId)
    if (!diagnostico) {
      return res.status(404).json({ error: 'Diagnóstico not found' })
    }

    // Get pilar info
    const pilar = await pilarModel.getPilar(pilarId)

    // Get validaciones
    const validaciones = await respuestasModel.getValidacionesPilar(diagnosticoId, pilarId)

    // Extract impactos
    const detalles = validaciones
      .filter(v => v.impacto_financiero_eje1 || v.impacto_financiero_eje2)
      .map(v => ({
        pregunta_id: v.pregunta_id,
        pregunta_texto: v.pregunta_texto,
        impacto_eje1: v.impacto_financiero_eje1,
        impacto_eje2: v.impacto_financiero_eje2
      }))

    res.json({
      pilar: pilar.nombre,
      detalles,
      total_validaciones: validaciones.length
    })
  } catch (error) {
    next(error)
  }
}
