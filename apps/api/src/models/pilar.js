import pool from '../config/database.js'

export async function getPilares() {
  const result = await pool.query(
    'SELECT * FROM pilares ORDER BY orden'
  )
  return result.rows
}

export async function getPilar(id) {
  const result = await pool.query(
    'SELECT * FROM pilares WHERE id = $1',
    [id]
  )
  return result.rows[0]
}

export async function getPreguntasByPilar(pilarId) {
  const result = await pool.query(
    'SELECT * FROM preguntas WHERE pilar_id = $1 AND activa = true ORDER BY orden',
    [pilarId]
  )
  return result.rows
}

export async function getTodasPreguntas() {
  const result = await pool.query(
    `SELECT p.*, pl.nombre as pilar_nombre
     FROM preguntas p
     JOIN pilares pl ON p.pilar_id = pl.id
     WHERE p.activa = true
     ORDER BY pl.orden, p.orden`
  )
  return result.rows
}

export async function seedPreguntas() {
  // Check if preguntas already exist
  const existing = await pool.query('SELECT COUNT(*) FROM preguntas')
  if (parseInt(existing.rows[0].count) > 0) {
    console.log('✓ Preguntas already seeded')
    return
  }

  const preguntas = [
    // Business DNA
    { pilarId: 1, orden: 1, texto: '¿Cuál es la identidad de marca clara de tu empresa?', tipo: 'open' },
    { pilarId: 1, orden: 2, texto: '¿Cómo se diferencia tu marca de la competencia?', tipo: 'open' },
    { pilarId: 1, orden: 3, texto: '¿Cuál es tu propuesta de valor principal?', tipo: 'open' },

    // Strategy Alignment
    { pilarId: 2, orden: 1, texto: '¿Tienen definidos objetivos estratégicos claros?', tipo: 'single_choice' },
    { pilarId: 2, orden: 2, texto: '¿Qué nivel de alineación existe entre departamentos?', tipo: 'scale_1_5' },
    { pilarId: 2, orden: 3, texto: '¿Se revisan y ajustan los objetivos regularmente?', tipo: 'single_choice' },

    // Process Excellence
    { pilarId: 3, orden: 1, texto: '¿Están documentados los procesos principales?', tipo: 'single_choice' },
    { pilarId: 3, orden: 2, texto: '¿Tienen métricas de eficiencia de procesos?', tipo: 'single_choice' },
    { pilarId: 3, orden: 3, texto: '¿Se realizan mejoras continuas de procesos?', tipo: 'single_choice' },

    // Operational Performance
    { pilarId: 4, orden: 1, texto: '¿Cuál es tu capacidad operativa actual?', tipo: 'scale_1_5' },
    { pilarId: 4, orden: 2, texto: '¿Monitoreás productividad por puesto/equipo?', tipo: 'single_choice' },
    { pilarId: 4, orden: 3, texto: '¿Cuáles son tus KPIs operacionales principales?', tipo: 'open' },

    // Technology & Digital
    { pilarId: 5, orden: 1, texto: '¿Qué sistemas principales utilizas (CRM, ERP)?', tipo: 'open' },
    { pilarId: 5, orden: 2, texto: '¿Nivel de integración entre sistemas?', tipo: 'scale_1_5' },
    { pilarId: 5, orden: 3, texto: '¿Están adoptando automatización?', tipo: 'single_choice' },

    // Data & Intelligence
    { pilarId: 6, orden: 1, texto: '¿Cuentas con un área de analytics/BI?', tipo: 'single_choice' },
    { pilarId: 6, orden: 2, texto: '¿Cuál es tu madurez en data-driven decision making?', tipo: 'scale_1_5' },
    { pilarId: 6, orden: 3, texto: '¿Tienes gobernanza de datos establecida?', tipo: 'single_choice' },

    // AI Augmentation
    { pilarId: 7, orden: 1, texto: '¿Están usando IA en procesos operativos?', tipo: 'single_choice' },
    { pilarId: 7, orden: 2, texto: '¿Nivel de adopción de herramientas de IA?', tipo: 'scale_1_5' },
    { pilarId: 7, orden: 3, texto: '¿Tienen roadmap de IA definido?', tipo: 'single_choice' },

    // Revenue Generation & Market Excellence
    { pilarId: 8, orden: 1, texto: '¿Cuál es tu CAC (Costo de Adquisición de Cliente)?', tipo: 'open' },
    { pilarId: 8, orden: 2, texto: '¿Cómo es tu funnel de ventas?', tipo: 'open' },
    { pilarId: 8, orden: 3, texto: '¿Cuál es tu retención de clientes?', tipo: 'scale_1_5' },

    // Customer & Quality Excellence
    { pilarId: 9, orden: 1, texto: '¿Cuál es tu NPS?', tipo: 'open' },
    { pilarId: 9, orden: 2, texto: '¿Tienes SLAs definidos?', tipo: 'single_choice' },
    { pilarId: 9, orden: 3, texto: '¿Cómo resuelves quejas de clientes?', tipo: 'scale_1_5' },

    // Culture & Change Readiness
    { pilarId: 10, orden: 1, texto: '¿Cuál es tu employee engagement score?', tipo: 'scale_1_5' },
    { pilarId: 10, orden: 2, texto: '¿Tienen liderazgo fuerte en cambio?', tipo: 'single_choice' },
    { pilarId: 10, orden: 3, texto: '¿Cómo es la velocidad de adopción de cambios?', tipo: 'scale_1_5' },

    // Continuous Improvement
    { pilarId: 11, orden: 1, texto: '¿Tienen un proceso Kaizen establecido?', tipo: 'single_choice' },
    { pilarId: 11, orden: 2, texto: '¿Cuál es tu ritmo de innovación?', tipo: 'scale_1_5' },
    { pilarId: 11, orden: 3, texto: '¿Cuántas mejoras implementas al año?', tipo: 'open' }
  ]

  for (const pregunta of preguntas) {
    await pool.query(
      `INSERT INTO preguntas
        (pilar_id, texto, descripcion_eje1, descripcion_eje2, tipo, orden, activa)
       VALUES ($1, $2, $3, $4, $5, $6, true)`,
      [
        pregunta.pilarId,
        pregunta.texto,
        `Referencia Eje 1: ${pregunta.texto}`,
        `Referencia Eje 2: ${pregunta.texto}`,
        pregunta.tipo,
        pregunta.orden
      ]
    )
  }

  console.log(`✓ ${preguntas.length} preguntas seeded`)
}
