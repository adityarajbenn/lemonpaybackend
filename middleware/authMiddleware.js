const authMiddleware = (req, res, next) => {
    const { userId } = req.body;
  
    if (!userId) {
      return res.status(401).json({ msg: "Missing userId in request" });
    }
  
    req.userId = userId;
    next();
  };
  
  module.exports = authMiddleware;
  