import express from 'express'
import * as diagnosticoController from '../controllers/diagnosticoController.js'
import { verifyToken } from '../middleware/auth.js'

const router = express.Router()

// Proteger todas las rutas
router.use(verifyToken)

// Diagnosticos CRUD
router.post('/', diagnosticoController.createDiagnostico)
router.get('/', diagnosticoController.listDiagnosticos)
router.get('/:id', diagnosticoController.getDiagnostico)

// Fases
router.post('/:diagnosticoId/documentos', diagnosticoController.addDocumento)
router.post('/:diagnosticoId/entrevistas', diagnosticoController.addEntrevista)
router.post('/:diagnosticoId/classify', diagnosticoController.classifyDiagnostico)
router.post('/:diagnosticoId/framework', diagnosticoController.selectFramework)

export default router
