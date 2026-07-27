import { login, register } from '../services/authService.js'

export async function loginController(req, res, next) {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    const result = await login(email, password)
    res.json(result)
  } catch (error) {
    next(error)
  }
}

export async function registerController(req, res, next) {
  try {
    const { email, password, nombre } = req.body

    if (!email || !password || !nombre) {
      return res.status(400).json({ error: 'Email, password, and nombre are required' })
    }

    const result = await register(email, password, nombre)
    res.status(201).json(result)
  } catch (error) {
    next(error)
  }
}

export async function meController(req, res) {
  res.json({
    id: req.user.id,
    email: req.user.email,
    nombre: req.user.nombre,
    rol: req.user.rol
  })
}
