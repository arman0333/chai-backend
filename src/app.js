

// import  express  from "express";
// import cookieParser from "cookie-parser";
// import cors from "cors"
// const app = express();

// app.use(cors({
//     origin: process.env.CORS_ORIGIN,
//     credentials:true
// }))

// app.use(express.json({
//     limit: '10kb'
// }))

// app.use(express.urlencoded({
//     extended:true,
//     limit:"10kb"
// }))

// app.use(express.static("public"))
// app.use(cookieParser())

// // routes import

// import userRouter from "./routes/user.routes.js"

// // routes declaration

// app.use("/",userRouter);

// // https://localhost:8000/api/v1/users/register


// export {app} ;
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({
    limit: '10kb'
}));

app.use(express.urlencoded({
    extended: true,
    limit: "10kb"
}));

app.use(express.static("public"));
app.use(cookieParser());

// Import routes
import userRouter from "./routes/user.routes.js";

// Use routes
app.use("/api/v1/users", userRouter);

// Export the app
export { app };
