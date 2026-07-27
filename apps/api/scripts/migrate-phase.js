import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import fs from 'fs'
import pool from '../src/config/database.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: join(__dirname, '../.env') })

async function migrate() {
  const client = await pool.connect()
  try {
    console.log('🔄 Running phase tracking migration...')

    const sql = fs.readFileSync(
      join(__dirname, '../src/db/migrations/001_add_phase_tracking.sql'),
      'utf8'
    )

    await client.query(sql)
    console.log('✓ Phase tracking migration completed')
  } catch (error) {
    console.error('✗ Migration error:', error.message)
  } finally {
    client.release()
    process.exit(0)
  }
}

migrate()
