import express from 'express'
import { loginController, registerController, meController } from '../controllers/authController.js'
import { verifyToken } from '../middleware/auth.js'

const router = express.Router()

router.post('/login', loginController)
router.post('/register', registerController)
router.get('/me', verifyToken, meController)

export default router
