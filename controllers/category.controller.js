import CategoryModel from "../models/category.model.js";

export const AddCategoryController = async (req,res)=>{
    try {
        const { name , image} = req.body || {};
 
        if (!name || !image){
            return res.status(400).json({message:"provide name and image"}) 
        }

        const addCategory = new CategoryModel({
            name,
            image
        })

        const saveCategory = await addCategory.save()

        if(!saveCategory){
            return res.status(500).json({
                message:"Not Created"
            })
        }

        return res.status(200).json({message:"Category added successfully",
            data : saveCategory
        })
        
    } catch (error) {
        return res.status(500).json({message:error.message})
        
    }
}