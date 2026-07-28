import pool from '../config/database.js'
import { createTables } from './schema.js'
import { seedData } from './seeds.js'
import { seedPreguntas } from './seedPreguntas.js'
import { seedAdminData } from './seedAdmin.js'

export async function initializeDatabase() {
  try {
    // Test connection
    const client = await pool.connect()
    console.log('✓ Connected to database')
    client.release()

    // Create tables
    await createTables()
    console.log('✓ Tables created')

    // Seed initial data
    await seedData()

    // Seed preguntas
    await seedPreguntas()

    // Seed admin data
    await seedAdminData()

    console.log('✓ All data seeded')
  } catch (error) {
    console.error('Database initialization error:', error)
    throw error
  }
}

export { pool }
