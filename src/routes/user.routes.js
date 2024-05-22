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
import { registerUser } from "../controllers/user.controller.js";

const router = express.Router();

// router.post("/register", registerUser);
router.route("/register").post(registerUser)
export default router;