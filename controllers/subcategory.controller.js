import SubCategoryModel from "../models/subcategory.model.js";

const AddSubCategoryController = async (req, res) => {
    try {

        // const userId = req.userId //middleware
        const { name, image, category } = req.body;

        if (!name || !image || !category) {
            return res.status(400).json({ message: "provide name, image and category" });
        }

        const payload = ({
            name,
            image,
            category
        });

        const createSubCategory = new SubCategoryModel({payload});
        const saveSubCategory = await createSubCategory.save();

        if (!saveSubCategory) {
            return res.status(500).json({
                message: "Not Created"
            });
        }

        return res.status(200).json({
            message: " SubCategory added successfully",
            data: saveSubCategory
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });

    }
}

export default AddSubCategoryController
    