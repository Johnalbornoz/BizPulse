import express from 'express'
import * as proposalController from '../controllers/proposalController.js'
import { verifyToken } from '../middleware/auth.js'

const router = express.Router()

// Proteger todas las rutas
router.use(verifyToken)

// Proposal endpoints
router.post('/:diagnosticoId/generate', proposalController.generateProposalDraft)
router.get('/:propuestaId', proposalController.getProposal)
router.put('/:propuestaId', proposalController.updateProposal)
router.post('/:diagnosticoId/report', proposalController.downloadReportWord)

export default router
