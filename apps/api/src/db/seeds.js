import pool from '../config/database.js'
import bcryptjs from 'bcryptjs'
import { seedPreguntas } from './schema.js'

export async function seedData() {
  const client = await pool.connect()

  try {
    // Check if tenant already exists
    const tenantResult = await client.query('SELECT COUNT(*) FROM tenants')
    if (parseInt(tenantResult.rows[0].count) > 0) {
      console.log('✓ Tenant already seeded')
      return
    }

    // Create default tenant
    const tenantInsert = await client.query(
      'INSERT INTO tenants (nombre, sistema_prompt, estado) VALUES ($1, $2, $3) RETURNING id',
      [
        'BizPulse - Práctica Propia',
        'Eres un consultor experto en diagnóstico de excelencia empresarial basado en los 11 pilares...',
        'activo'
      ]
    )
    const tenantId = tenantInsert.rows[0].id

    // Create default user (admin)
    const passwordHash = await bcryptjs.hash('admin123', 10)
    await client.query(
      'INSERT INTO usuarios (email, password_hash, nombre, rol, tenant_id, estado) VALUES ($1, $2, $3, $4, $5, $6)',
      ['admin@bizpulse.local', passwordHash, 'Administrador', 'SuperAdmin', tenantId, 'activo']
    )

    // Create 11 pilares
    const pilares = [
      'Business DNA',
      'Strategy Alignment',
      'Process Excellence',
      'Operational Performance',
      'Technology & Digital',
      'Data & Intelligence',
      'AI Augmentation',
      'Revenue Generation & Market Excellence',
      'Customer & Quality Excellence',
      'Culture & Change Readiness',
      'Continuous Improvement'
    ]

    for (let i = 0; i < pilares.length; i++) {
      await client.query(
        'INSERT INTO pilares (nombre, descripcion, orden) VALUES ($1, $2, $3)',
        [pilares[i], `Descripción del pilar ${pilares[i]}`, i + 1]
      )
    }

    client.release()

    // Seed preguntas (without transaction)
    await seedPreguntas()

    console.log('✓ Seed data created successfully')
  } catch (error) {
    console.error('Seed error:', error)
    throw error
  }
}
