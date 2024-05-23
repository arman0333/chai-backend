import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/apiError.js"
import {User} from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
    
    // get user details from frontend
    // validation-not empty
    // check if user already exists : username,email
    //check for images and avatar
    //upload them to cloudinary, avatar
    // create user object - create entry in db
    //remove password and refresh tokens from response
    // check for user creation
    // return response



    const {fullName,email,username,password}=req.body
    console.log(email);
    
    if(
        [fullName,email,username,password].some((field) => field?.trim() === "" )
    ){
        throw new ApiError(400,"All fields is required")
    }

    const existedUser = User.findOne({
        $or:[{email} , {username}]
    })

    if(existedUser){
        throw new ApiError(409,"user with username or email already exists")
    }

       const avatarLocalPath =  req.files?.avatar[0]?.path;
    // console.log(req.files);
        const coverImageLocalPath = req.files?.coverImage[0]?.path;

        if(!avatarLocalPath){
            throw new ApiError(400,"avatar is required")
        }
       const avatar =  await uploadOnCloudinary(avatarLocalPath)
       const coverImage =  await uploadOnCloudinary(coverImageLocalPath)
       if(!avatar){
        throw new ApiError(400,"avatar is required")
       }

        const user = await username.create({
        fullName,
        avatar:avatar.url,
        coverImage:coverImage?.url||"",
        email,
        password,
        username:username.toLowerCase()

       })

        const createdUser =   await User.findById(user._id).select("-password -refreshToken")

        if(!createdUser){
            throw new ApiError(500,"Something went wrong while registring user")
        }

            return res.status(201).json(
                new apiResponse(200,createdUser,"user registered successfully")
            )

    });

export { registerUser };