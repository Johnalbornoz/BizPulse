import OpenAI from 'openai'

let client = null

function getClient() {
  if (!client) {
    client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  }
  return client
}

export async function analyzeWebsite(websiteUrl) {
  try {
    // Mock mode for demo when OPENAI_API_KEY is not configured
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes('test-key')) {
      console.log('Running in DEMO mode with mock data for:', websiteUrl)

      // Mock data based on domain
      const mockData = {
        'diestra.mx': {
          nombre: 'Diestra',
          pais: 'México',
          mision: 'Proveer soluciones integrales de recursos humanos y consultoría empresarial de clase mundial',
          vision: 'Ser el socio estratégico preferido para la transformación organizacional en Latinoamérica',
          propuesta_valor: 'Soluciones personalizadas de RH, nómina y consultoría que impulsan el crecimiento empresarial',
          oferta: 'Servicios de outsourcing de nómina, consultoría organizacional, gestión de talento y capacitación corporativa',
          clientes: 'Empresas medianas y grandes de diversos sectores industriales y comerciales',
          industria: 'Servicios Profesionales',
          subindustria: 'Recursos Humanos y Consultoría'
        },
        default: {
          nombre: 'Empresa Ejemplo',
          pais: 'México',
          mision: 'Transformar la industria mediante innovación y excelencia',
          vision: 'Ser líderes globales en nuestro sector',
          propuesta_valor: 'Soluciones innovadoras que generan valor sostenible',
          oferta: 'Productos y servicios de alta calidad',
          clientes: 'Empresas de diversos sectores',
          industria: 'Tecnología',
          subindustria: 'Software y Servicios'
        }
      }

      // Extract domain from URL for matching
      const domain = new URL(websiteUrl).hostname.replace('www.', '')
      const data = mockData[domain] || mockData.default

      return {
        success: true,
        ...data
      }
    }

    // Fetch the website content
    const response = await fetch(websiteUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })

    if (!response.ok) {
      throw new Error(`Website returned status ${response.status}`)
    }

    const html = await response.text()

    // Extract text content from HTML (simple approach)
    const textContent = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .substring(0, 3000) // Limit to first 3000 chars

    // Use OpenAI to extract company information
    const openai = getClient()
    const message = await openai.chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `Analiza el siguiente contenido de website y extrae información de la empresa en formato JSON.

Responde SOLO con un objeto JSON válido (sin markdown) con estos campos:
- nombre: nombre de la empresa (string)
- pais: país donde opera (string, extraer si es posible)
- mision: misión de la empresa (string, máx 200 caracteres)
- vision: visión de la empresa (string, máx 200 caracteres)
- propuesta_valor: propuesta de valor (string, máx 200 caracteres)
- oferta: qué ofrecen/venden (string, máx 200 caracteres)
- clientes: tipo de clientes (string, máx 200 caracteres)
- industria: industria/sector (string)
- subindustria: sub-industria específica (string)

Si no encuentras información para algún campo, deja vacío ("").

Contenido del website:
${textContent}`
        }
      ]
    })

    // Parse the response
    const content = message.choices[0].message.content

    // Clean up markdown if present
    let jsonStr = content
    if (jsonStr.includes('```json')) {
      jsonStr = jsonStr.split('```json')[1].split('```')[0]
    } else if (jsonStr.includes('```')) {
      jsonStr = jsonStr.split('```')[1].split('```')[0]
    }

    const extractedData = JSON.parse(jsonStr.trim())

    return {
      success: true,
      nombre: extractedData.nombre || '',
      pais: extractedData.pais || '',
      mision: extractedData.mision || '',
      vision: extractedData.vision || '',
      propuesta_valor: extractedData.propuesta_valor || '',
      oferta: extractedData.oferta || '',
      clientes: extractedData.clientes || '',
      industria: extractedData.industria || '',
      subindustria: extractedData.subindustria || ''
    }
  } catch (error) {
    console.error('Website analysis error:', error.message)
    return {
      success: false,
      error: error.message
    }
  }
}
