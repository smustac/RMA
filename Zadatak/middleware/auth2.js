import jwt from 'jsonwebtoken'

export default function auth(req, res, next) {
  const authHeader = req.headers.authorization

  // 🔐 Logged-in user (JWT)
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1]
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      req.user = {
        id: decoded.id,
        role: decoded.role,
        isGuest: false
      }

      return next()
    } catch (err) {
      return res.status(401).json({ message: 'Neispravan token' })
    }
  }

  // ❌ No token → not allowed for admin routes
  return res.status(401).json({ message: 'Nema autorizacije' })
}
