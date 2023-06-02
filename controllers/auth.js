import Http from "http-status-codes";
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import { validateEgyptPhoneNumber } from "../helpers/helper.js";
import Joi from "joi";
import jwt from "jsonwebtoken";
export const register = async (req, res) => {
  const file = req.file; // get image from request
  if (!file)
    // if no image in the request
    return res
      .status(Http.NOT_FOUND)
      .json({ message: "No image in the request" }); // return error

  const fileName = file.filename; // get image name
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`; // get image path

  const schema = Joi.object({
    // define validation schema
    firstname: Joi.string().min(3).required().messages({
      // define validation rules
      "string.min": `First name should have a minimum length of {#limit}`,
      "any.required": `First name is a required field`,
    }),
    lastname: Joi.string().min(3).required().messages({
      "string.min": `Last name should have a minimum length of {#limit}`,
      "any.required": `Last name is a required field`,
    }),
    email: Joi.string().email().required().messages({
      "string.email": `Email should be a valid email`,
      "any.required": `Email is a required field`,
    }),
    username: Joi.string().min(3).required().messages({
      "string.min": `Username should have a minimum length of {#limit}`,
      "any.required": `Username is a required field`,
    }),
    password: Joi.string().min(6).required().messages({
      "string.min": `Password should have a minimum length of {#limit}`,
      "any.required": `Password is a required field`,
    }),
    repassword: Joi.string().valid(Joi.ref("password")).required().messages({
      "any.only": `Password does not match`,
    }),
    phone: Joi.string().required().messages({
      "any.required": `Phone is a required field`,
    }),
  });

  const { error } = schema.validate(req.body); // validate request body
  if (error) {
    // if validation error
    return res.status(Http.BAD_REQUEST).json({
      // return error
      message: error.details[0].message,
    });
  }

  const phoneTest = validateEgyptPhoneNumber(req.body.phone); // test phone number
  if (!phoneTest) {
    // if phone number is not valid
    return res.status(Http.BAD_REQUEST).json({
      // return error
      message: "Invalid phone number",
    });
  }

  const invalid = await User.findOne({
    // check if email or username or phone is already exist
    $or: [
      { email: req.body.email },
      { username: req.body.username },
      { phone: req.body.phone },
    ],
  });
  if (invalid) {
    // if email or username or phone is already exist
    return res.status(Http.BAD_REQUEST).json({
      message: "email or username or phone already exist !! GO LOGIN", // return error
    });
  }

  const newUser = new User({
    // create new user
    image: `${basePath}${fileName}`, // set image path
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    username: req.body.username,
    phone: req.body.phone,
    password: bcrypt.hashSync(req.body.password, 15),
  });

  User.create(newUser) // save user
    .then((user) => {
      const token = jwt.sign(
        // generate token
        {
          userId: user._id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );
      return res.status(Http.CREATED).json({
        // return success
        message: "User created successfully",
        token: token, // return token
      });
    })
    .catch((err) => {
      res.status(Http.BAD_REQUEST).json({
        // return error
        message: "Error occured",
        error: err,
      });
    });
};
export const login = async (req, res) => {
  if ( !req.body.data||!req.body.password
  ) {
    // check if username or email or phone and password is not exist
    return res.status(Http.BAD_REQUEST).json({
      message: "Please enter username or email or phone and password", // return error
    });
  }
  const user = await User.findOne({
    // find user by username or email or phone
    $or: [
      { email: req.body.data },
      { username: req.body.data },
      { phone: req.body.data },
    ],
  });
  if (!user) {
    // if user not found
    return res.status(Http.NOT_FOUND).json({
      message: "User not found", // return error
    });
  }
  const validPassword = bcrypt.compareSync(req.body.password, user.password); // compare password
  if (!validPassword) {
    // if password is not valid
    return res.status(Http.BAD_REQUEST).json({
      message: "Invalid password", // return error
    });
  }
  const token = jwt.sign(
    // generate token
    {
      userId: user._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
  return res.status(Http.OK).json({
    // return success
    message: "Login successfully",
    token: token,
  });
};
export const getUser = async (req, res) => {
  const id = req.params.id; // get user id from request
  User.findById(id)
    .select("-password") // find user by id
    .then((user) => {
      if (!user) {
        // if user not found
        return res.status(Http.NOT_FOUND).json({
          message: "User not found", // return error
        });
      }
      return res.status(Http.OK).json({
        // return success
        message: "User found",
        user: user,
      });
    })
    .catch((err) => {
      res.status(Http.BAD_REQUEST).json({
        // return error
        message: "Error occured",
        error: err,
      });
    });
};
