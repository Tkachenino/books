const notFoundMiddleware = (req, res) => {
  res.redirect('/not-found');
}

module.exports = notFoundMiddleware;