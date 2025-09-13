import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import {User} from '../models/user.model.js';
import { uploadonCloudinary, uploadToCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';
const registerUser = asyncHandler(async(req,res)=>{
    //get user details from frontend
    // validation
    //check if user already exit
    //check for images/avatar
    //Upload in cloudinary
    //
    //store user in database
    //sen resposse as user create successfully
    //remove password and refresh token feild from response
    //


    const{fullname,email,username,password}=req.body
    console.log("email",email);
    if(
        [fullname,email,username,password].some((feild)=>feild?.trim()==="")
    ){
        throw new ApiError(400,"All feilds are required")
    }

    const existeduser=User.findOne({
        $or:[{username},{email}]
    })
    if(existeduser){
        throw new ApiError(409,"User Already Existed")
    }

    const avatarLocalPath=req.files?.avatar[0]?.path;
    const coverImageLocalPath=req.files?.coverImage[0]?.path;
    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar is required")
    }


    const avatar=await uploadonCloudinary(avatarLocalPath)
    const coverImage=await uploadToCloudinary(coverImageLocalPath)
    if(!avatar){
        throw new ApiError(500,"Error in uploading avatar")
    }


    const User=await User.create({
        fullname,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        email,
        username:username.tolowercase(),
        password

    })

    const createdUser=await User.findById(username._id).select(
        "-password -refreshToken -__v -createdAt -updatedAt"
    )

    if(!createdUser){
        throw new ApiError(500,"Soomethign went wrong")
    }

    return res.status(201).json(
        new ApiResponse(201,"user Created Successfully",createdUser))



    












    
})

export {registerUser};