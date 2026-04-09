const verifyVolunteer = (req, res, next) => {
  if (req.user.role !== "volunteer" && req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Volunteer or Admin only." });
  }
  next();
};

export default verifyVolunteer;