export default (req, res, next) => {

  if (req.headers['x-user-id']) {
    req.user = {
      id: req.headers['x-user-id'], 
      role: req.headers['x-user-role'] || 'student',
      isGuest: false
    }
    return next()
  }


  let guestId = req.headers['x-guest-id']
  if (!guestId) {
    return res.status(401).json({ message: 'Nema identiteta korisnika' })
  }

  req.user = {
    id: guestId,
    role: 'student', 
    isGuest: true
  }

  next()
}
