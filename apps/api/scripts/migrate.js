import dotenv from 'dotenv'
import { initializeDatabase } from '../src/db/init.js'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: join(__dirname, '../.env') })

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
