import  uploadImageCloudinary  from "../utils/uploadImageCloudinary.js"
const uploadImageController = async (req,res)=>{
    try {
        const file = req.file

        const uploadImage = await uploadImageCloudinary(file)

        return res.status(200).json({message:"image uploaded successfully",data : uploadImage})
        
        // console.log("uploadImage",uploadImage)
        
    } catch (error) {
        return res.status(500).json({message:error.message})
        
    }

}

export default uploadImageController