import bcryptjs from 'bcryptjs'

export async function generateTemporaryPassword() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
  let password = ''
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}

export async function hashPassword(password) {
  return bcryptjs.hash(password, 10)
}

export async function verifyPassword(password, hash) {
  return bcryptjs.compare(password, hash)
}
