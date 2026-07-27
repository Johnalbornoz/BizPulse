import express from 'express'
import * as scoringController from '../controllers/scoringController.js'
import { verifyToken } from '../middleware/auth.js'

const router = express.Router()

// Proteger todas las rutas
router.use(verifyToken)

// Scoring y HITL
router.post('/:diagnosticoId/pilar/:pilarId/score', scoringController.scorePilar)
router.post('/:validacionId/confirmar', scoringController.confirmarValidacion)
router.get('/:diagnosticoId/pilar/:pilarId/progress', scoringController.getPilarProgress)
router.get('/:diagnosticoId/progress', scoringController.getDiagnosticoProgress)

export default router
