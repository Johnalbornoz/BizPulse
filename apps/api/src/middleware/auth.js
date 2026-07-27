import jwt from 'jsonwebtoken'
import { AppError } from './errorHandler.js'

export function verifyToken(req, res, next) {
  try {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
      throw new AppError('No token provided', 401)
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: 'Invalid token' })
    }
    next(error)
  }
}
