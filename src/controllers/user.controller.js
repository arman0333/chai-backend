    // get user details from frontend
    // validation-not empty
    // check if user already exists : username,email
    // check for images and avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh tokens from response
    // check for user creation
    // return response
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken"
const generateAccessandRefreshToken = async(userId)=>{

    try{
        const  user = await  User.findById(userId);
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave:false});

        return {accessToken,refreshToken}
    }
    catch(error){
        throw new ApiError(500,"Something went wrong while generating tokens")
    }
}


const registerUser = asyncHandler(async (req, res) => {
    const { fullName, email, username, password } = req.body;
    console.log(req.body);
    // Check if any required fields are empty
    if (!fullName || !email || !username || !password) {
        throw new ApiError(400, "All fields are required");
    }

    // Check if the user already exists
    const existedUser = await User.findOne({
        $or: [{ email }, { username }]
    });

    if (existedUser) {
        throw new ApiError(409, "User with username or email already exists");
    }

    // Check for avatar and cover image files
    // console.log(req.files)
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required");
    }

    // Upload images to Cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = coverImageLocalPath ? await uploadOnCloudinary(coverImageLocalPath) : null;

    if (!avatar) {
        throw new ApiError(400, "Failed to upload avatar");
    }

    // Create user object in the database
    const newUser = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    });

    // Retrieve the created user without password and refreshToken
    const createdUser = await User.findById(newUser._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering user");
    }

    // Return the response
    return res.status(201).json(
        new apiResponse(200, createdUser, "User registered successfully")
    );
});


const loginUser = asyncHandler(async(req,res)=>{
    // check all required fields are provided
    // get user details from frontend
    // check if userdetails are matching from any details of user present in db
    // if yes then passwordcheck return incorrect password 
    // generate refresh and access token
    // send cookies
    //  return the user details
    // else return error
 
    const {username,email,password} = req.body;
    if(!username  && !email) {
        throw new ApiError(400,"email or username is required")
    }

     const user = await User.findOne({
       $or : [{username},{email}]
     })

     if(!user) {
        throw new ApiError(400,"Invalid credentials")
     }
     const isMatch = await user.isPasswordCorrect(password)
     
     if(!isMatch) {
        throw new ApiError(401,"Password is not correct")
     }


const {refreshToken,accessToken}=await generateAccessandRefreshToken(user._id)

const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

const options = {
    httpOnly: true,
    secure:true
}
return res
.status(200)
.cookie("accessToken",accessToken,options)
.cookie("refreshToken",refreshToken,options)
.json(
    new apiResponse(200,{
        user:loggedInUser,accessToken,refreshToken
    },"User logged in successfully")
)
})
const logOutUser = asyncHandler(async(req,res)=>{
   await  User.findByIdAndUpdate(req.user._id,{
         $set:{

            refreshToken:undefined

            }
    })
    
    const options = {
        httpOnly: true,
        secure:true
    }
    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new apiResponse(200,{},"User logged out"))
});




 const refreshAccessToken = asyncHandler(async(req,res)=>{
    const incomingrefreshToken = req.cookies.refreshToken || req.body.refreshToken
    if(!incomingrefreshToken) {
        throw new ApiError(401,"Refresh token is not provided")
    }
   try {
    const decodedToken =  jwt.verify(incomingrefreshToken,process.env.REFRESH_TOKEN_SECRET)
 
   const user =  await User.findById(decodedToken?._id)
 
   if(!user){
     throw new ApiError(401,"Invalid Refresh Token")
   }
 
   if(incomingrefreshToken != user?.refreshToken){
     throw new ApiError(401,"Refresh token is expired")
   }
 
   const options ={
     httpOnly:true,
     secure:true
   }
 
  const {accessToken,newrefreshToken} = generateAccessandRefreshToken(user._id)
 
   return res
   .status(200)
   .cookie("accessToken",accessToken,options)
   .cookie("refreshToken",newrefreshToken,options)
   .json(
     new apiResponse(200,{accessToken,refreshToken:newrefreshToken},"Access token refreshed")
   )
 
 
   } catch (error) {

    throw new ApiError(401,error?.message||"invalid refresh token")
   }










 })
export {
     registerUser,
     loginUser,
     logOutUser,
     refreshAccessToken
    };

