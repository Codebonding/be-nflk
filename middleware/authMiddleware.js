const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

const authMiddleware = (roles = []) => {
    return (req, res, next) => {
        const token = req.headers['authorization']?.split(' ')[1];
        if(!token) return res.status(401).json({ success:false, message:'Access denied. No token provided' });

        try{
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = decoded;

            if(roles.length && !roles.includes(decoded.role))
                return res.status(403).json({ success:false, message:'Forbidden. You do not have access' });

            next();
        } catch(err){
            res.status(400).json({ success:false, message:'Invalid token' });
        }
    }
}

module.exports = authMiddleware;