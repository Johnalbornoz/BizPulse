export function errorHandler(err, req, res, next) {
  console.error('Error:', err)

  const statusCode = err.statusCode || 500
  const message = err.message || 'Internal Server Error'

  res.status(statusCode).json({
    error: {
      status: statusCode,
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  })
}

export class AppError extends Error {
  constructor(message, statusCode) {
    super(message)
    this.statusCode = statusCode
    Error.captureStackTrace(this, this.constructor)
  }
}
