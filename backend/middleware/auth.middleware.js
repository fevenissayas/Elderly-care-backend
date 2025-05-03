import jwt from "jsonwebtoken"

export const verifyToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer')){
        return res.status(403).json({
            error: "Access denied"
        })
    }
    
    const token = authHeader.split(' ')[1]
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("decoded token:", decoded);
        req.user = decoded
        next()
    }catch(error){
        res.status(401).json({
            error : "Invalid Token"
        })
    }
}

