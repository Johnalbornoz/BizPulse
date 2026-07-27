import express from 'express'
import * as empresaController from '../controllers/empresaController.js'
import { verifyToken } from '../middleware/auth.js'

const router = express.Router()

// Proteger todas las rutas
router.use(verifyToken)

// Empresas CRUD
router.post('/', empresaController.createEmpresa)
router.get('/', empresaController.listEmpresas)
router.get('/:id', empresaController.getEmpresa)
router.put('/:id', empresaController.updateEmpresa)

export default router
