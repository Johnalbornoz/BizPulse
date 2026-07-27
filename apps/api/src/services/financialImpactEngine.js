import { OpenAI } from 'openai'

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

const impactSchema = {
  type: 'object',
  properties: {
    eje: {
      type: 'string',
      enum: ['eje1', 'eje2'],
      description: 'Eje evaluado'
    },
    brecha_score: {
      type: 'number',
      description: 'Diferencia de score (ideal - actual)'
    },
    impacto_usd_estimado: {
      type: 'number',
      description: 'Impacto financiero en USD anuales'
    },
    supuestos: {
      type: 'array',
      items: {
        type: 'string'
      },
      description: 'Supuestos clave usados en el cálculo'
    },
    formula: {
      type: 'string',
      description: 'Fórmula o lógica usada para calcular impacto'
    },
    rango_bajo: {
      type: 'number',
      description: 'Rango bajo de estimación (USD)'
    },
    rango_alto: {
      type: 'number',
      description: 'Rango alto de estimación (USD)'
    },
    confianza: {
      type: 'string',
      enum: ['baja', 'media', 'alta'],
      description: 'Nivel de confianza del cálculo'
    }
  },
  required: ['eje', 'brecha_score', 'impacto_usd_estimado', 'supuestos', 'formula']
}

export async function calculateFinancialImpact(pilarNombre, brecha, empresaData, discoveryContent) {
  try {
    const prompt = `
CONTEXTO FINANCIERO DE LA EMPRESA:
- Facturación Anual: $${empresaData.facturacion_usd}
- Empleados: ${empresaData.empleados}
- Industria: ${empresaData.industria}
- País: ${empresaData.pais}

INFORMACIÓN DE DISCOVERY:
${discoveryContent}

TAREA: Estimar impacto financiero de mejorar el pilar "${pilarNombre}"

BRECHA DETECTADA:
- Score Actual: ${brecha.actual}/5
- Score Objetivo (Estado del Arte): ${brecha.objetivo}/5
- Diferencia: ${brecha.diferencia}

INSTRUCCIONES:
1. Basándote en la industria y contexto, identifica cómo esta brecha impacta el negocio
2. Selecciona métricas clave (ej: reducción de costos, aumento de ingresos, mejora de eficiencia)
3. Estima el impacto en USD usando fórmulas transparentes
4. Documenta supuestos claramente
5. Proporciona rango bajo-alto

Ejemplos de impacto por pilar:
- Process Excellence → reducción de costos operativos (% eficiencia × costos base)
- Revenue Generation → aumento de ingresos (% mejora × ingresos base)
- Operational Performance → productividad (horas ahorradas × costo/hora)

Sé específico, cuantificable y auditable.
    `.trim()

    const response = await client.beta.messages.create({
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
          name: 'financial_impact',
          schema: impactSchema,
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
    console.error('Financial impact calculation error:', error)

    // Return conservative default estimate on error
    const defaultImpact = Math.round((brecha.diferencia / 5) * (empresaData.facturacion_usd * 0.05))

    return {
      eje: 'desconocida',
      brecha_score: brecha.diferencia,
      impacto_usd_estimado: defaultImpact,
      supuestos: [
        'Estimación por defecto: 5% de ingresos por mejora de pilar',
        'Requiere validación con cliente'
      ],
      formula: `Facturación × 5% × (Brecha / 5) = $${defaultImpact}`,
      rango_bajo: Math.round(defaultImpact * 0.8),
      rango_alto: Math.round(defaultImpact * 1.2),
      confianza: 'baja'
    }
  }
}

export async function calculateTotalImpact(empresaData, allValidaciones) {
  // Aggregate impactos de todos los pilares validados
  const impactos = allValidaciones
    .filter(v => v.impacto_financiero_eje1 || v.impacto_financiero_eje2)
    .map(v => {
      const imp1 = v.impacto_financiero_eje1?.impacto_usd_estimado || 0
      const imp2 = v.impacto_financiero_eje2?.impacto_usd_estimado || 0
      return Math.max(imp1, imp2) // Tomar el mayor de los dos ejes
    })

  const totalImpacto = impactos.reduce((a, b) => a + b, 0)
  const roi = empresaData.facturacion_usd > 0 ? (totalImpacto / empresaData.facturacion_usd) * 100 : 0

  return {
    total_impacto_usd: totalImpacto,
    roi_porcentaje: Math.round(roi * 100) / 100,
    cantidad_brechas: impactos.length,
    impacto_promedio_brecha: impactos.length > 0 ? Math.round(totalImpacto / impactos.length) : 0
  }
}
