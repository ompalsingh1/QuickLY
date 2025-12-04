const isAdmin = (req, res, next) => {
  if (req.role !== "ADMIN") {
    return res.status(403).json({
      message: "Access denied: Admin only"
    });
  }
  
  next();
};

export default isAdmin;