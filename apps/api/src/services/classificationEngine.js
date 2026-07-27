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

const classificationSchema = {
  type: 'object',
  properties: {
    industria: {
      type: 'string',
      description: 'Industria principal (ej: BPO, Retail, SaaS)'
    },
    subindustria: {
      type: 'string',
      description: 'Subindustria más específica'
    },
    modelo_negocio: {
      type: 'string',
      description: 'Modelo de negocio (ej: B2B, B2C, Agency, Project-Based)'
    },
    modelo_operativo: {
      type: 'string',
      description: 'Modelo operativo (ej: Service Center, Distributed, Hybrid)'
    },
    confianza: {
      type: 'number',
      description: 'Confianza de la clasificación (0-1)'
    }
  },
  required: ['industria', 'subindustria', 'modelo_negocio', 'modelo_operativo', 'confianza']
}

export async function classifyBusiness(empresaData, discoveryContent) {
  try {
    const prompt = `
Basándote en la siguiente información de la empresa, clasifícala según industria, modelo de negocio y modelo operativo.

DATOS DE LA EMPRESA:
- Nombre: ${empresaData.nombre}
- País: ${empresaData.pais}
- Empleados: ${empresaData.empleados}
- Facturación: $${empresaData.facturacion_usd}
- Industria mencionada: ${empresaData.industria || 'No especificada'}

INFORMACIÓN DE DISCOVERY:
${discoveryContent}

Proporciona una clasificación profesional y estructurada.
    `.trim()

    const response = await getClient().beta.messages.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o',
      max_tokens: 1024,
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
          name: 'business_classification',
          schema: classificationSchema,
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
    console.error('Classification error:', error)
    // Return default classification on error
    return {
      industria: empresaData.industria || 'General',
      subindustria: 'No clasificada',
      modelo_negocio: 'B2B',
      modelo_operativo: 'Estándar',
      confianza: 0.5
    }
  }
}
