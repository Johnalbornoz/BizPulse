import pool from '../config/database.js'
import bcryptjs from 'bcryptjs'

export async function seedAdminData() {
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    // Create default tenant if not exists
    const tenantResult = await client.query(
      'INSERT INTO tenants (nombre, estado) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING id',
      ['Default', 'activo']
    )

    let tenantId = tenantResult.rows[0]?.id

    // If not inserted, get existing tenant
    if (!tenantId) {
      const existing = await client.query('SELECT id FROM tenants LIMIT 1')
      tenantId = existing.rows[0]?.id

      if (!tenantId) {
        throw new Error('No tenant found')
      }
    }

    // Create SuperAdmin user if not exists
    const adminPassword = await bcryptjs.hash('admin123', 10)
    await client.query(
      `INSERT INTO usuarios (email, password_hash, nombre, rol, tenant_id, estado)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (email) DO NOTHING`,
      ['admin@bizpulse.com', adminPassword, 'Administrador', 'SuperAdmin', tenantId, 'activo']
    )

    // Create sample enterprises
    const empresas = [
      { nombre: 'TechCorp Solutions', pais: 'México', industria: 'Software', subindustria: 'Fintech' },
      { nombre: 'Manufacturing Plus', pais: 'México', industria: 'Manufactura', subindustria: 'Autopartes' },
      { nombre: 'Retail Global', pais: 'México', industria: 'Retail', subindustria: 'E-commerce' }
    ]

    for (const empresa of empresas) {
      await client.query(
        `INSERT INTO empresas (tenant_id, nombre, pais, industria, subindustria)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT DO NOTHING`,
        [tenantId, empresa.nombre, empresa.pais, empresa.industria, empresa.subindustria]
      )
    }

    // Create sample business segments
    const segmentos = [
      { nombre: 'PyME Manufacturera', descripcion: 'Pequeñas y medianas empresas de manufactura', industria_principal: 'Manufactura' },
      { nombre: 'Startups Fintech', descripcion: 'Empresas de tecnología financiera emergentes', industria_principal: 'Software' },
      { nombre: 'Retail Tradicional', descripcion: 'Retailers con presencia física', industria_principal: 'Retail' },
      { nombre: 'Empresa Grandes', descripcion: 'Corporativos de más de 500 empleados', industria_principal: 'Mixto' }
    ]

    for (const segmento of segmentos) {
      await client.query(
        `INSERT INTO segmentos_negocio (tenant_id, nombre, descripcion, industria_principal, estado)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT DO NOTHING`,
        [tenantId, segmento.nombre, segmento.descripcion, segmento.industria_principal, 'activo']
      )
    }

    await client.query('COMMIT')
    console.log('✓ Admin data seeded successfully')
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('Error seeding admin data:', error)
    throw error
  } finally {
    client.release()
  }
}
