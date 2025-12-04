import jwt from "jsonwebtoken"


const generatedAccessToken = async (user) =>{
    const token = await jwt.sign({id: user._id, role : user.role },
         process.env.SECRET_KEY_ACCESS_TOKEN,
         {expiresIn:"15m",}
        )
        return token
}
 
export default generatedAccessToken;