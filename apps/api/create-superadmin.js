import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import pkg from 'pg'
import bcryptjs from 'bcryptjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: './.env' })

const { Pool } = pkg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

async function createSuperAdmin() {
  const client = await pool.connect()

  try {
    // Get tenant ID (assuming there's only one)
    const tenantResult = await client.query('SELECT id FROM tenants LIMIT 1')

    if (tenantResult.rows.length === 0) {
      console.error('❌ No tenant found. Please run seeds first.')
      return
    }

    const tenantId = tenantResult.rows[0].id

    // Hash the password
    const passwordHash = await bcryptjs.hash('John1305', 10)

    // Check if user already exists
    const existingUser = await client.query(
      'SELECT id FROM usuarios WHERE email = $1',
      ['jalbornoz@live.com']
    )

    if (existingUser.rows.length > 0) {
      console.log('⚠️ User already exists. Updating password...')
      await client.query(
        'UPDATE usuarios SET password_hash = $1 WHERE email = $2',
        [passwordHash, 'jalbornoz@live.com']
      )
      console.log('✅ Password updated successfully')
      return
    }

    // Insert new SuperAdmin user
    await client.query(
      'INSERT INTO usuarios (email, password_hash, nombre, rol, tenant_id, estado) VALUES ($1, $2, $3, $4, $5, $6)',
      ['jalbornoz@live.com', passwordHash, 'John Albornoz', 'SuperAdmin', tenantId, 'activo']
    )

    console.log('✅ SuperAdmin user created successfully!')
    console.log('Email: jalbornoz@live.com')
    console.log('Password: John1305')
    console.log('Role: SuperAdmin')
  } catch (error) {
    console.error('❌ Error creating user:', error.message)
  } finally {
    client.release()
    await pool.end()
  }
}

createSuperAdmin()
