const APIError = require("../util/APIError");
const User = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const util = require("util");

//const promisifiedFunction = util.promisfy(async function that accept only callbacks)
const jwtSign = util.promisify(jwt.sign);

const signup = async (req, res, next) => {
  const data = req.body;
  // check if password and passwordConfirm are provided
  if (!data.password || !data.passwordConfirm) {
    throw new APIError(400, "password and passwordConfirm are required");
  }
  // check if password and passwordConfirm are the same
  if (data.password !== data.passwordConfirm) {
    throw new APIError(400, "password and passwordConfirm must be the same");
  }
  // hash password
  const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS);
  const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

  // create user
  const newUser = await User.create({
    ...data,
    role: "user",
    password: hashedPassword,
  });

  res.status(201).json({ status: "success", data: { user: newUser } });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  // check if email and password are provided
  if (!email || !password) {
    throw new APIError(400, "email and password are required");
  }

  // check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    throw new APIError(400, "Invalid Email or Password");
  }

  // password are matched
  const isMatched = await bcrypt.compare(password, user.password);
  if (!isMatched) {
    throw new APIError(400, "Invalid Email or Password");
  }
  const JWT_SECRET = process.env.JWT_SECRET;
  const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
  const token = await jwtSign({ userId: user._id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  res.status(200).json({ status: "success", data: { token } });
};

const getUsers = async (req, res) => {
  const users = await User.find({ role: "user" });
  if (!users) {
    throw new APIError(404, "No users found");
  }
  res
    .status(200)
    .json({ status: "success", data: { length: users.length, users } });
};

const getUserById = async (req, res) => {
  const userId = req.params.id;
  const user = await User.findById(userId);
  if (!user) {
    throw new APIError(404, `user with id: ${userId} is not found`);
  }
  res.status(200).json({ status: "success", data: { user } });
};

const updateUserById = async (req, res) => {
  const userId = req.params.id;
  const userData = req.body;

  const updatedUser = await User.findOneAndUpdate(
    { _id: userId },
    { name: userData.name, email: userData.email },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedUser) {
    throw new APIError(404, `user with id: ${userId} is not found`);
  }

  res.status(200).json({ status: "success", data: { user: updatedUser } });
};

const deleteUserById = async (req, res) => {
  const userId = req.params.id;
  const deletedUser = await User.findByIdAndDelete(userId);

  if (!deletedUser) {
    throw new APIError(404, `user with id: ${userId} is not found`);
  }
  res.status(204).json();
};

module.exports = {
  signup,
  login,
  getUsers,
  getUserById,
  updateUserById,
  deleteUserById,
};
