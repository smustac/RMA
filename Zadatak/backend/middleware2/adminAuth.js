import jwt from 'jsonwebtoken'

export function adminAuth(req, res, next) {
  const authHeader = req.headers['authorization'] //ocekuje tipa bearer casjdc2bnbf2
  if (!authHeader) return res.status(401).json({ message: 'No token provided' })

  const token = authHeader.split(' ')[1] // Bearer token, djeli na dva grabi index jedan
  if (!token) return res.status(401).json({ message: 'No token provided' })

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET) // provjera tokena
    if (payload.role !== 'admin') return res.status(403).json({ message: 'Forbidden' })

    req.user = payload  //popis korisinika koju su potvrdeni
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' })
  }
}
