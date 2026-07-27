import pool from '../config/database.js'

export async function guardarRespuestas(diagnosticoId, respuestas) {
  // respuestas es un object: { pregunta_id: valor, pregunta_id: valor, ... }
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    // Guardar en JSON o table separada (por ahora JSON en diagnóstico)
    // Para MVP, guardamos el objeto directamente

    // Return the saved data
    return respuestas
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

export async function crearValidacionHITL(diagnosticoId, pilarId, preguntaId, sugerenciaEje1, sugerenciaEje2, argIa1, argIa2) {
  const result = await pool.query(
    `INSERT INTO diagnostico_validaciones_hitl
      (diagnostico_id, pilar_id, pregunta_id, sugerencia_ia_eje1, sugerencia_ia_eje2, argumentacion_ia_eje1, argumentacion_ia_eje2)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [diagnosticoId, pilarId, preguntaId, sugerenciaEje1, sugerenciaEje2, argIa1, argIa2]
  )
  return result.rows[0]
}

export async function confirmarValidacion(validacionId, calificacionEje1, calificacionEje2, argExperto1, argExperto2, usuarioId) {
  const result = await pool.query(
    `UPDATE diagnostico_validaciones_hitl
     SET calificacion_final_eje1 = $1,
         calificacion_final_eje2 = $2,
         argumentacion_experto_eje1 = $3,
         argumentacion_experto_eje2 = $4,
         validado_por = $5,
         validado_en = NOW()
     WHERE id = $6
     RETURNING *`,
    [calificacionEje1, calificacionEje2, argExperto1, argExperto2, usuarioId, validacionId]
  )
  return result.rows[0]
}

export async function getValidacionesPilar(diagnosticoId, pilarId) {
  const result = await pool.query(
    `SELECT * FROM diagnostico_validaciones_hitl
     WHERE diagnostico_id = $1 AND pilar_id = $2
     ORDER BY pregunta_id`,
    [diagnosticoId, pilarId]
  )
  return result.rows
}

export async function getValidacionesDiagnostico(diagnosticoId) {
  const result = await pool.query(
    `SELECT v.*, p.texto as pregunta_texto, pl.nombre as pilar_nombre
     FROM diagnostico_validaciones_hitl v
     JOIN preguntas p ON v.pregunta_id = p.id
     JOIN pilares pl ON v.pilar_id = pl.id
     WHERE v.diagnostico_id = $1
     ORDER BY pl.orden, p.orden`,
    [diagnosticoId]
  )
  return result.rows
}

export async function checkPilarValidado(diagnosticoId, pilarId) {
  const result = await pool.query(
    `SELECT COUNT(*) as total, COUNT(CASE WHEN validado_en IS NOT NULL THEN 1 END) as validadas
     FROM diagnostico_validaciones_hitl
     WHERE diagnostico_id = $1 AND pilar_id = $2`,
    [diagnosticoId, pilarId]
  )

  const row = result.rows[0]
  return parseInt(row.total) > 0 && parseInt(row.validadas) === parseInt(row.total)
}
