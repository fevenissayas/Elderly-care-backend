export const isNurse = (req, res, next) => {
    if (req.user.role !== "nurse") {
      return res.status(403).json({ message: "Access denied. Nurse role required." });
    }
    next();
};
