import pool from '../config/database.js'
import { createTables } from './schema.js'
import { seedData } from './seeds.js'

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
    console.log('✓ Data seeded')
  } catch (error) {
    console.error('Database initialization error:', error)
    throw error
  }
}

export { pool }
