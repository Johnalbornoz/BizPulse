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

const scoringSchema = {
  type: 'object',
  properties: {
    preguntas: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          pregunta_id: {
            type: 'number',
            description: 'ID de la pregunta'
          },
          sugerencia_eje1: {
            type: 'number',
            minimum: 0,
            maximum: 5,
            description: 'Calificación sugerida para Eje 1 (estado del arte): 0-5'
          },
          sugerencia_eje2: {
            type: 'number',
            minimum: 0,
            maximum: 5,
            description: 'Calificación sugerida para Eje 2 (segmento/competencia): 0-5'
          },
          argumentacion_eje1: {
            type: 'string',
            description: 'Justificación de la calificación Eje 1'
          },
          argumentacion_eje2: {
            type: 'string',
            description: 'Justificación de la calificación Eje 2'
          }
        },
        required: ['pregunta_id', 'sugerencia_eje1', 'sugerencia_eje2', 'argumentacion_eje1', 'argumentacion_eje2']
      }
    }
  },
  required: ['preguntas']
}

export async function scorepilar(pilarNombre, preguntas, respuestas, benchmarkSegmento, discoveryContent) {
  try {
    const eje1Desc = 'Estado del arte: ideal universal de excelencia operacional'
    const eje2Desc = `Segmento/Competencia: desempeño relativo en su mercado. Benchmark promedio: ${benchmarkSegmento}`

    const prompt = `
CONTEXTO DEL DIAGNÓSTICO:
${discoveryContent}

TAREA: Calificar el pilar "${pilarNombre}" en DOS ejes independientes

Eje 1 - ${eje1Desc}
Eje 2 - ${eje2Desc}

PREGUNTAS DEL PILAR:
${preguntas.map((p, i) => `${i + 1}. Pregunta #${p.id}: ${p.texto}\n   Respuesta: ${respuestas[p.id] || 'No respondida'}`).join('\n')}

INSTRUCCIONES:
- Califica cada pregunta en AMBOS ejes de forma independiente
- Rango: 0-5 (0=no existe/muy deficiente, 5=excelencia)
- Proporciona argumentación detallada para cada eje
- Basa la argumentación en la respuesta dada y el contexto de discovery

Devuelve JSON con calificaciones y argumentación.
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
      temperature: parseFloat(process.env.OPENAI_TEMPERATURE || '0.2'),
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'pilar_scoring',
          schema: scoringSchema,
          strict: true
        }
      }
    })

    const content = response.content[0]
    if (content.type === 'text') {
      return JSON.parse(content.text)
    }

    throw new Error('Unexpected response format from OpenAI')
  } catch (error) {
    console.error('Diagnostic engine error:', error)
    // Return default scores on error
    return {
      preguntas: preguntas.map(p => ({
        pregunta_id: p.id,
        sugerencia_eje1: 3,
        sugerencia_eje2: 3,
        argumentacion_eje1: 'Error en análisis automático',
        argumentacion_eje2: 'Error en análisis automático'
      }))
    }
  }
}
