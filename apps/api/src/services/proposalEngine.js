import { OpenAI } from 'openai'

let client = null

function getClient() {
  if (!client) {
    client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    })
  }
  return client
}

const proposalSchema = {
  type: 'object',
  properties: {
    titulo_ejecutivo: {
      type: 'string',
      description: 'Título ejecutivo de la propuesta'
    },
    resumen_diagnostico: {
      type: 'string',
      description: 'Resumen de 2-3 párrafos del diagnóstico y oportunidad'
    },
    fases: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          nombre: { type: 'string' },
          duracion: { type: 'string' },
          descripcion: { type: 'string' },
          entregables: {
            type: 'array',
            items: { type: 'string' }
          },
          esfuerzo_fte: { type: 'number' }
        }
      }
    },
    inversion_estimada: {
      type: 'number',
      description: 'Inversión total estimada en USD'
    },
    roi_estimado: {
      type: 'number',
      description: 'ROI estimado en porcentaje'
    },
    proximos_pasos: {
      type: 'array',
      items: { type: 'string' }
    }
  }
}

export async function generateProposal(empresaData, diagnosticResult, roadmapItems, financialSummary) {
  try {
    const prompt = `
INFORMACIÓN DE LA EMPRESA:
- Nombre: ${empresaData.nombre}
- Industria: ${empresaData.industria}
- Facturación: $${empresaData.facturacion_usd}

RESULTADO DEL DIAGNÓSTICO:
- Business Excellence Index: ${diagnosticResult.index}/5
- Brechas identificadas: ${diagnosticResult.gap_count}
- Impacto potencial: $${financialSummary.total_impacto_usd}

ROADMAP PRIORIZADO:
${roadmapItems.map(r => `- ${r.titulo} (${r.fase_propuesta}): $${r.impacto_estimado_usd}, ${Math.round(r.esfuerzo_horas/8)} días`).join('\n')}

TAREA: Generar propuesta de consultoría preliminary (SOW draft)

Estructura:
1. Título ejecutivo atractivo (máx 10 palabras)
2. Resumen del diagnóstico y la oportunidad (2-3 párrafos)
3. Fases de transformación (mapear roadmap items a fases)
4. Inversión estimada y ROI
5. Próximos pasos

Tono: profesional, comercialmente convincente, basado en datos del diagnóstico.
    `.trim()

    const response = await getClient().beta.messages.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      betas: ['interop-2024-12-06'],
      temperature: 0.5, // Más creativo que scoring, pero aún controlado
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'proposal_document',
          schema: proposalSchema,
          strict: true
        }
      }
    })

    const content = response.content[0]
    if (content.type === 'text') {
      return JSON.parse(content.text)
    }

    throw new Error('Unexpected response format')
  } catch (error) {
    console.error('Proposal generation error:', error)

    // Return template on error
    return {
      titulo_ejecutivo: `Transformación de Excelencia Empresarial - ${empresaData.nombre}`,
      resumen_diagnostico: 'El diagnóstico ha identificado oportunidades de mejora en los 11 pilares de excelencia empresarial.',
      fases: [
        {
          nombre: 'Fase 1: Quick Wins (30 días)',
          duracion: '30 días',
          descripcion: 'Implementación de iniciativas de rápido impacto',
          entregables: ['Plan de acción detallado', 'Capacitación de equipo'],
          esfuerzo_fte: 1
        }
      ],
      inversion_estimada: financialSummary.total_impacto_usd * 0.15,
      roi_estimado: (financialSummary.total_impacto_usd / (financialSummary.total_impacto_usd * 0.15)) * 100,
      proximos_pasos: ['Revisión de propuesta', 'Firma de contrato', 'Kick-off de proyecto']
    }
  }
}
