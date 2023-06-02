import express from "express";
import upload from "../helpers/imageUpload.js";
import { getUser, login, register } from "../controllers/auth.js";

const router = express.Router();

router.post("/register", upload.single("image"), register); //register
router.post("/login", login); //login
router.get("/:id", getUser); //get user

export default router;
