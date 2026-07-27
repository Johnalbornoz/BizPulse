import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { initializeDatabase } from './src/db/init.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: join(__dirname, '.env') })
import authRoutes from './src/routes/auth.js'
import empresasRoutes from './src/routes/empresas.js'
import diagnosticoRoutes from './src/routes/diagnosticos.js'
import scoringRoutes from './src/routes/scoring.js'
import financialRoutes from './src/routes/financial.js'
import proposalRoutes from './src/routes/proposals.js'
import { errorHandler } from './src/middleware/errorHandler.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Routes
app.use('/auth', authRoutes)
app.use('/empresas', empresasRoutes)
app.use('/diagnosticos', diagnosticoRoutes)
app.use('/scoring', scoringRoutes)
app.use('/financial', financialRoutes)
app.use('/proposals', proposalRoutes)

// Error handling
app.use(errorHandler)

// Start server
async function start() {
  try {
    // Initialize database
    await initializeDatabase()
    console.log('✓ Database initialized')

    app.listen(PORT, () => {
      console.log(`✓ Server running on http://localhost:${PORT}`)
      console.log(`✓ Frontend URL: ${process.env.FRONTEND_URL}`)
    })
  } catch (error) {
    console.error('✗ Startup error:', error)
    process.exit(1)
  }
}

start()
