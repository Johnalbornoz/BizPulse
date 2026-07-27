import * as diagnosticoModel from '../models/diagnostico.js'
import * as empresaModel from '../models/empresa.js'
import * as respuestasModel from '../models/respuestas.js'
import * as pilarModel from '../models/pilar.js'
import { generateProposal } from '../services/proposalEngine.js'
import { generateReportWord } from '../services/reportGenerator.js'
import pool from '../config/database.js'
import { createReadStream } from 'fs'

export async function generateProposalDraft(req, res, next) {
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

    // Get all validaciones para calcular índice
    const validaciones = await respuestasModel.getValidacionesDiagnostico(diagnosticoId)
    const promedioEje1 = validaciones.length > 0
      ? validaciones.reduce((sum, v) => sum + (v.calificacion_final_eje1 || 0), 0) / validaciones.length
      : 3

    // Get roadmap items
    const roadmapResult = await pool.query(
      `SELECT * FROM roadmap_items WHERE diagnostico_id = $1 ORDER BY prioridad`,
      [diagnosticoId]
    )
    const roadmapItems = roadmapResult.rows

    // Get financial summary
    const impactosEje1 = validaciones
      .filter(v => v.impacto_financiero_eje1)
      .map(v => v.impacto_financiero_eje1?.impacto_usd_estimado || 0)

    const totalImpacto = impactosEje1.reduce((a, b) => a + b, 0)

    // Generate proposal
    const proposal = await generateProposal(
      empresa,
      {
        index: promedioEje1,
        gap_count: validaciones.length
      },
      roadmapItems,
      {
        total_impacto_usd: totalImpacto
      }
    )

    // Save proposal draft
    const saveResult = await pool.query(
      `INSERT INTO propuestas_preliminares
        (diagnostico_id, titulo, contenido_propuesta, fases, roi_estimado, generada_en, estado)
       VALUES ($1, $2, $3, $4, $5, NOW(), $6)
       RETURNING *`,
      [
        diagnosticoId,
        proposal.titulo_ejecutivo,
        proposal.resumen_diagnostico,
        JSON.stringify(proposal.fases),
        proposal.roi_estimado,
        'borrador'
      ]
    )

    res.json({
      propuesta_id: saveResult.rows[0].id,
      propuesta: proposal
    })
  } catch (error) {
    next(error)
  }
}

export async function getProposal(req, res, next) {
  try {
    const { propuestaId } = req.params
    const tenantId = req.user.tenantId

    const result = await pool.query(
      'SELECT * FROM propuestas_preliminares WHERE id = $1',
      [propuestaId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Propuesta not found' })
    }

    const propuesta = result.rows[0]

    res.json({
      id: propuesta.id,
      titulo: propuesta.titulo,
      contenido: propuesta.contenido_propuesta,
      fases: propuesta.fases,
      roi_estimado: propuesta.roi_estimado,
      estado: propuesta.estado,
      generada_en: propuesta.generada_en
    })
  } catch (error) {
    next(error)
  }
}

export async function updateProposal(req, res, next) {
  try {
    const { propuestaId } = req.params
    const { contenido } = req.body
    const usuarioId = req.user.id

    const result = await pool.query(
      `UPDATE propuestas_preliminares
       SET contenido_propuesta = $1, editada_por = $2, editada_en = NOW(), estado = $3
       WHERE id = $4
       RETURNING *`,
      [contenido, usuarioId, 'editada', propuestaId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Propuesta not found' })
    }

    res.json(result.rows[0])
  } catch (error) {
    next(error)
  }
}

export async function downloadReportWord(req, res, next) {
  try {
    const { diagnosticoId } = req.params
    const tenantId = req.user.tenantId

    // Verify diagnóstico
    const diagnostico = await diagnosticoModel.getDiagnostico(diagnosticoId, tenantId)
    if (!diagnostico) {
      return res.status(404).json({ error: 'Diagnóstico not found' })
    }

    // Get empresa
    const empresa = await empresaModel.getEmpresa(diagnostico.empresa_id, tenantId)

    // Get all data needed for report
    const validaciones = await respuestasModel.getValidacionesDiagnostico(diagnosticoId)
    const roadmapResult = await pool.query(
      'SELECT * FROM roadmap_items WHERE diagnostico_id = $1 ORDER BY prioridad',
      [diagnosticoId]
    )
    const roadmapItems = roadmapResult.rows

    // Calculate aggregated data
    const pilares = await pilarModel.getPilares()
    const pilaresWithData = await Promise.all(
      pilares.map(async (pilar) => {
        const pilarValidaciones = validaciones.filter(v => v.pilar_id === pilar.id)
        const eje1 = pilarValidaciones.length > 0
          ? Math.round((pilarValidaciones.reduce((sum, v) => sum + (v.calificacion_final_eje1 || 0), 0) / pilarValidaciones.length) * 10) / 10
          : 0

        const eje2 = pilarValidaciones.length > 0
          ? Math.round((pilarValidaciones.reduce((sum, v) => sum + (v.calificacion_final_eje2 || 0), 0) / pilarValidaciones.length) * 10) / 10
          : 0

        const impacto = pilarValidaciones
          .filter(v => v.impacto_financiero_eje1)
          .reduce((sum, v) => sum + (v.impacto_financiero_eje1?.impacto_usd_estimado || 0), 0)

        return { nombre: pilar.nombre, eje1, eje2, impacto }
      })
    )

    // Calculate financial summary
    const totalImpacto = pilaresWithData.reduce((sum, p) => sum + p.impacto, 0)
    const excellenceIndex = pilaresWithData.reduce((sum, p) => sum + p.eje1, 0) / pilaresWithData.length

    // Generate Word document
    const { filepath, filename } = await generateReportWord(
      empresa,
      { excellence_index: excellenceIndex },
      pilaresWithData,
      {
        total_impacto_usd: totalImpacto,
        roi_porcentaje: empresa.facturacion_usd > 0 ? Math.round((totalImpacto / empresa.facturacion_usd) * 100) : 0,
        cantidad_brechas: validaciones.filter(v => v.calificacion_final_eje1).length
      },
      roadmapItems
    )

    // Save report reference in BD
    await pool.query(
      `INSERT INTO reportes_finales (diagnostico_id, tipo, url_generada, contenido_json, generada_en)
       VALUES ($1, $2, $3, $4, NOW())`,
      [diagnosticoId, 'docx', filepath, JSON.stringify({ filename })]
    )

    // Send file
    res.download(filepath, filename)
  } catch (error) {
    next(error)
  }
}
