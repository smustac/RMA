export default (req, res, next) => {

  if (req.headers['x-user-id']) {
    req.user = {
      id: req.headers['x-user-id'],
      role: req.headers['x-user-role'] || 'student',
      // ako je role=guest, tretiramo ga kao gosta, ali i dalje ima pravi users.id
      isGuest: (req.headers['x-user-role'] || '').toString() === 'guest'
    }
    return next()
  }


  let guestId = req.headers['x-guest-id']
  if (!guestId) {
    return res.status(401).json({ message: 'Nema identiteta korisnika' })
  }

  // Legacy fallback: ako netko dođe bez user_id ali s x-guest-id.
  // Ovo nije kompatibilno s FK user_id u parking tablici, ali ostavljamo poruku jasnom.
  req.user = {
    id: guestId,
    role: 'guest',
    isGuest: true
  }

  next()
}
