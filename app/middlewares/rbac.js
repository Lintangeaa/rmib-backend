module.exports = {
  isAdmin: (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ message: 'Permission denied!' });
    }
  },
  isMahasiswa: (req, res, next) => {
    if (req.user && req.user.role === 'mahasiswa') {
      next();
    } else {
      res.status(403).json({ message: 'Permission denied!' });
    }
  },
};
