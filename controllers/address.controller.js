import AddressModel from "../models/address.model.js";
import UserModel from "../models/user.model.js";

export const AddAddressController = async (req,res)=>{
    try {

        const userId = req.userId //middleware
        const { address_line, city , state , pincode, phone } = req.body || {};
 
        if (!address_line || !city || !state || !pincode || !phone){
            return res.status(400).json({message:"provide address , city , state , pincode , phone"})
        }

        const AddAddress = new AddressModel({
            address_line,
            city,
            state,
            pincode,
            phone
        })

        const saveAddress = await AddAddress.save()

        const addUserAddress = await UserModel.findByIdAndUpdate(userId,{
            $push : {address_details : saveAddress._id

            }})

        if(!saveAddress){
            return res.status(500).json({
                message:"Not Created"
            })
        }

        return res.status(200).json({message:"Address saved successfully",
            data : saveAddress
        })
        
    } catch (error) {
        return res.status(500).json({message:error.message})
        
    }
}