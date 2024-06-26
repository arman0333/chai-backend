// import { Router } from "express";
// import { registerUser } from "../controllers/user.controller.js";
// // import { asyncHandler } from "../utils/asyncHandler.js"; // Ensure asyncHandler is imported correctly

// const router = Router();

// router.route("/register").post(asyncHandler(registerUser)); 
// router.route("/hello").get((req, res) => {
//     // Respond with a message
//     res.status(200).json({ message: 'GET request received for /api/v1/users' });
// });
// export default router;

// import { Router } from "express";
// import { registerUser } from "../controllers/user.controller.js";

// const router = Router()

// router.route("/register").post(registerUser)


// export default router
import express from "express";
import { loginUser, registerUser,logOutUser, refreshAccessToken, changeCurrentPassword, getcurrentUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage, getUserChannelProfile, getWatchHistory } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import multer from "multer";

const router = express.Router();

// router.post("/register", registerUser);
router.route("/register").post(
    upload.fields(
        [
            {
                name:"avatar",
                maxCount:1
            },
            {
                name:"coverImage",
                maxCount:1
            },
        ]
        ),
    registerUser
    )

   router.route("/login").post(
    loginUser    
   ) 

//    Secured Routes
router.route("/logout").post(
    verifyJWT,
    logOutUser
    )
router.route("/refresh-token").post(
        refreshAccessToken )
router.route("/change-password").post(verifyJWT,changeCurrentPassword)
router.route("/current-user").get(verifyJWT,getcurrentUser)
router.route("update-account").patch(updateAccountDetails)
router.route("/avatar").patch(verifyJWT,upload.single("avatar"),updateUserAvatar)
router.route("/coverImage").patch(verifyJWT,upload.single("coverImage"),updateUserCoverImage)

router.route("/c/:username").get(verifyJWT,getUserChannelProfile)

router.route("/watch-History").get(verifyJWT,getWatchHistory)

export default router;