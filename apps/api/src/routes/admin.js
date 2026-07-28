import express from 'express'
import { verifyToken } from '../middleware/auth.js'
import { requireSuperAdmin } from '../middleware/authorize.js'
import * as adminEmpresasController from '../controllers/adminEmpresasController.js'
import * as adminUsuariosController from '../controllers/adminUsuariosController.js'
import * as adminSegmentosController from '../controllers/adminSegmentosController.js'

const router = express.Router()

// Require authentication and SuperAdmin role for all routes
router.use(verifyToken)
router.use(requireSuperAdmin)

// EMPRESAS
router.get('/empresas', adminEmpresasController.listEmpresas)
router.post('/empresas', adminEmpresasController.createEmpresa)
router.get('/empresas/:id', adminEmpresasController.getEmpresa)
router.put('/empresas/:id', adminEmpresasController.updateEmpresa)
router.delete('/empresas/:id', adminEmpresasController.deleteEmpresa)
router.get('/empresas/stats', adminEmpresasController.getStats)

// USUARIOS
router.get('/usuarios', adminUsuariosController.listUsuarios)
router.post('/usuarios', adminUsuariosController.createUsuario)
router.get('/usuarios/:id', adminUsuariosController.getUsuario)
router.put('/usuarios/:id', adminUsuariosController.updateUsuario)
router.post('/usuarios/:id/cambiar-rol', adminUsuariosController.changeRole)
router.delete('/usuarios/:id', adminUsuariosController.deleteUsuario)
router.get('/usuarios/stats', adminUsuariosController.getStats)

// SEGMENTOS
router.get('/segmentos', adminSegmentosController.listSegmentos)
router.post('/segmentos', adminSegmentosController.createSegmento)
router.get('/segmentos/:id', adminSegmentosController.getSegmento)
router.put('/segmentos/:id', adminSegmentosController.updateSegmento)
router.delete('/segmentos/:id', adminSegmentosController.deleteSegmento)
router.get('/segmentos/stats', adminSegmentosController.getStats)

export default router
