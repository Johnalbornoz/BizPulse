import dotenv from 'dotenv'
import { initializeDatabase } from '../src/db/init.js'

dotenv.config()

async function migrate() {
  try {
    console.log('🔄 Running migrations...')
    await initializeDatabase()
    console.log('✓ Migrations completed')
    process.exit(0)
  } catch (error) {
    console.error('✗ Migration error:', error)
    process.exit(1)
  }
}

migrate()
