import jwt from "jsonwebtoken"

const auth = async (req,res,next)=>{
    try {
        const token = req.cookies.accesstoken || req?.headers?.authorization?.split (" ") [1] /// ["Bearer","token"]
        
        if (!token){
            res.status(401).json({message:"provide token"})
        }

        const decode = await jwt.verify(token,process.env.SECRET_KEY_ACCESS_TOKEN)
        
        if (!decode){
            res.status(401).json({message:'unauthorized access'})
        }

        req.userId = decode.id
        req.role = decode.role

        next()
    
    } catch (error) {
        res.status(500).json({message : error.message})
    }
}
export default auth ;