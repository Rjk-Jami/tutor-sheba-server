const jwt = require("jsonwebtoken");

const isAuthenticated = (req, res, next) => {
  if (!req.session || !req.session.token) {
    req.session.destroy();
    return res
      .status(200)
      .send({ success: false, message: "Unauthorized: Please log in" });
  }

  try {
    const decoded = jwt.verify(
      req.session.token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    // Refresh token if it's about to expire
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp - currentTime < 60 * 60) {
      const newToken = jwt.sign(
        { id: decoded.id },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
      req.session.token = newToken;
    }

    next();
  } catch (error) {
    req.session.destroy();
    return res
      .status(401)
      .send({
        success: false,
        message: "Session expired: Please log in again",
      });
  }
};

module.exports = { isAuthenticated };

