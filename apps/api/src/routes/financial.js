import express from 'express'
import * as financialController from '../controllers/financialController.js'
import { verifyToken } from '../middleware/auth.js'

const router = express.Router()

// Proteger todas las rutas
router.use(verifyToken)

// Financial Impact
router.post('/:diagnosticoId/pilar/:pilarId', financialController.calculatePilarImpact)
router.get('/:diagnosticoId/summary', financialController.getDiagnosticoFinancialSummary)
router.get('/:diagnosticoId/pilar/:pilarId', financialController.getPilarFinancialDetail)

export default router
