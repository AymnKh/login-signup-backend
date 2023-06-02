import express from "express";
import mongoose from "mongoose";
import cors from "cors";
const app = express();

//static files
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  "/public/uploads",
  express.static(path.join(__dirname, "public/uploads"))
); //static files

//enable cors
app.use(cors());
app.options("*", cors());
//body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//env config
import dotenv from "dotenv";
dotenv.config();

//auth jwt
import authJwt from "./helpers/auth-jwt.js";
app.use(authJwt());
//auth middleware
import authRoute from "./routes/auth.js";
app.use("/api/v1", authRoute);
//error handler
import errorHanlder from "./helpers/errorHandler.js";
app.use(errorHanlder);

app.get("/", (req, res) => {
  res.send("Hello From Simple Server !");
});
//connect to mongodb
mongoose
  .connect(process.env.DATA_BASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

//listen to server
app.listen(3000, () => {
  console.log("Server running");
});
