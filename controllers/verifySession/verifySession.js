
const verifySession = (req, res) => {
  res.status(200).send({
    success: true,
    user: {
      id: req.user.id,
      username: req.user.username,
      email: req.user.email,
    },
  });
};

module.exports = { verifySession };
