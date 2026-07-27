import { Document, Packer, Paragraph, Table, TableCell, TableRow, WidthType, AlignmentType, BorderStyle, TextRun, HeadingLevel, PageBreak } from 'docx'
import { writeFileSync } from 'fs'
import { join } from 'path'

export async function generateReportWord(empresaData, diagnosticResult, pilares, financialSummary, roadmapItems) {
  try {
    const sections = []

    // Portada
    sections.push(
      new Paragraph({
        text: 'BizPulse',
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        spacing: { after: 600 },
        bold: true,
        size: 48
      }),
      new Paragraph({
        text: 'Diagnóstico de Excelencia Empresarial',
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
        size: 24
      }),
      new Paragraph({
        text: empresaData.nombre,
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        size: 20
      }),
      new Paragraph({
        text: new Date().toLocaleDateString('es-MX'),
        alignment: AlignmentType.CENTER,
        spacing: { after: 1200 }
      }),
      new PageBreak()
    )

    // Resumen Ejecutivo
    sections.push(
      new Paragraph({
        text: 'Resumen Ejecutivo',
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 400 }
      }),
      new Paragraph({
        text: `Business Excellence Index: ${diagnosticResult.excellence_index}/5`,
        spacing: { after: 200 },
        bold: true,
        size: 20
      }),
      new Paragraph({
        text: `Impacto Potencial: $${financialSummary.total_impacto_usd.toLocaleString()}`,
        spacing: { after: 200 },
        size: 18
      }),
      new Paragraph({
        text: `ROI Estimado: ${financialSummary.roi_porcentaje}%`,
        spacing: { after: 400 },
        size: 18
      }),
      new Paragraph({
        text: 'El diagnóstico ha identificado ' + financialSummary.cantidad_brechas + ' oportunidades de mejora con impacto significativo en la rentabilidad. Este reporte detalla el estado actual frente al estado del arte y la competencia, proporciona un análisis financiero auditable, y propone un roadmap de transformación priorizado.',
        spacing: { after: 600 }
      }),
      new PageBreak()
    )

    // Diagnóstico por Pilar
    sections.push(
      new Paragraph({
        text: 'Diagnóstico por Pilar',
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 400 }
      })
    )

    for (const pilar of pilares) {
      sections.push(
        new Paragraph({
          text: pilar.nombre,
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 200 }
        }),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph('Eje 1: Estado del Arte')],
                  shading: { fill: '286CBE', color: 'FFFFFF' },
                  width: { size: 50, type: WidthType.PERCENTAGE }
                }),
                new TableCell({
                  children: [new Paragraph('Eje 2: Segmento/Competencia')],
                  shading: { fill: '12B8A6', color: 'FFFFFF' },
                  width: { size: 50, type: WidthType.PERCENTAGE }
                })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph({ text: `${pilar.eje1}/5`, bold: true, size: 24 })],
                  shading: { fill: 'F6F9FC' }
                }),
                new TableCell({
                  children: [new Paragraph({ text: `${pilar.eje2}/5`, bold: true, size: 24 })],
                  shading: { fill: 'F6F9FC' }
                })
              ]
            })
          ]
        }),
        new Paragraph({
          text: pilar.impacto > 0 ? `Impacto Estimado: $${pilar.impacto.toLocaleString()}` : 'Sin impacto cuantificado',
          spacing: { after: 400 },
          italics: true
        })
      )
    }

    sections.push(new PageBreak())

    // Análisis Financiero
    sections.push(
      new Paragraph({
        text: 'Análisis de Impacto Financiero',
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 400 }
      }),
      new Paragraph({
        text: `Impacto Total Identificado: $${financialSummary.total_impacto_usd.toLocaleString()}`,
        spacing: { after: 200 },
        bold: true,
        size: 18
      }),
      new Paragraph({
        text: `Porcentaje de Ingresos: ${financialSummary.roi_porcentaje}%`,
        spacing: { after: 200 },
        size: 16
      }),
      new Paragraph({
        text: `Cantidad de Brechas Cuantificadas: ${financialSummary.cantidad_brechas}`,
        spacing: { after: 400 },
        size: 16
      }),
      new Paragraph({
        text: 'Nota: Todos los cálculos de impacto incluyen supuestos documentados y están sujetos a validación con el cliente durante la fase de consultoría.',
        spacing: { after: 600 },
        italics: true
      }),
      new PageBreak()
    )

    // Roadmap de Transformación
    sections.push(
      new Paragraph({
        text: 'Roadmap de Transformación Priorizado',
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 400 }
      })
    )

    const faseLabels = {
      quick_wins_30d: 'Quick Wins (30 días)',
      medium_90d: 'Medium Term (90 días)',
      medium_180d: 'Medium Term (180 días)',
      strategic_12m: 'Strategic (12 meses)',
      strategic_24m: 'Strategic (24 meses)'
    }

    const faseGroups = roadmapItems.reduce((acc, item) => {
      if (!acc[item.fase_propuesta]) {
        acc[item.fase_propuesta] = []
      }
      acc[item.fase_propuesta].push(item)
      return acc
    }, {})

    for (const [fase, items] of Object.entries(faseGroups)) {
      sections.push(
        new Paragraph({
          text: faseLabels[fase] || fase,
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 200 }
        })
      )

      items.sort((a, b) => a.prioridad - b.prioridad).forEach((item) => {
        sections.push(
          new Paragraph({
            text: item.titulo,
            spacing: { after: 100 },
            bold: true
          }),
          new Paragraph({
            text: `Impacto: $${item.impacto_estimado_usd.toLocaleString()} | Esfuerzo: ${Math.round(item.esfuerzo_horas / 8)} días`,
            spacing: { after: 300 },
            size: 11
          })
        )
      })
    }

    sections.push(new PageBreak())

    // Próximos Pasos
    sections.push(
      new Paragraph({
        text: 'Próximos Pasos',
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 400 }
      }),
      new Paragraph({
        text: '1. Revisión conjunta de este diagnóstico',
        spacing: { after: 200 }
      }),
      new Paragraph({
        text: '2. Validación de supuestos y cálculos financieros',
        spacing: { after: 200 }
      }),
      new Paragraph({
        text: '3. Definición de alcance de fase inicial (Quick Wins)',
        spacing: { after: 200 }
      }),
      new Paragraph({
        text: '4. Firma de contrato de acompañamiento',
        spacing: { after: 400 }
      }),
      new Paragraph({
        text: 'Contacto: john@jalbornoz.com',
        spacing: { after: 100 },
        italics: true
      })
    )

    // Create document
    const doc = new Document({
      sections: [
        {
          children: sections
        }
      ]
    })

    // Generate filename
    const filename = `BizPulse_Diagnostico_${empresaData.nombre.replace(/\s+/g, '_')}_${new Date().getTime()}.docx`
    const filepath = join('/tmp', filename)

    // Save document
    const buffer = await Packer.toBuffer(doc)
    writeFileSync(filepath, buffer)

    return { filepath, filename }
  } catch (error) {
    console.error('Report generation error:', error)
    throw error
  }
}
