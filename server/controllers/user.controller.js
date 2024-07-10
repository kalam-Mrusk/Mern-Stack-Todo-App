import User from "../models/user.model.js";
import { ApiError } from "../utilities/ApiError.utility.js";
import { ApiResponse } from "../utilities/ApiResponse.utility.js";
import { asyncHandler } from "../utilities/asyncHandler.utility.js";

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = req.user;

  if (!user) {
    throw new ApiError(400, "Unauthorized access");
  }

  const accessToken = user.generateAccessToken();

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 5 * 24 * 60 * 60 * 1000,
    //         1day   1hour  1min    1sec
  };

  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json(new ApiResponse(200, "Current user verified", { user }));
});
const userRegistration = asyncHandler(async (req, res) => {
  const { username, fullname, email, password } = req.body;

  const incompleteDetails = [username, fullname, email, password].some(
    (item) => {
      return item === null || item.trim() === "";
    }
  );
  if (incompleteDetails) {
    throw new ApiError(409, "incomplete details.");
  }
  const existedUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existedUser) {
    throw new ApiError(402, "User already existed.");
  }
  const registerUser = await User.create({
    username,
    fullname,
    email,
    password,
  });
  const { ...data } = registerUser._doc;
  delete data.password;
  res
    .status(200)
    .json(new ApiResponse(200, "user register successfully.", data));
});

const userLogin = asyncHandler(async (req, res) => {
  const { usernameORemail, password } = req.body;
  const incompleteDetails = [usernameORemail, password].some((item) => {
    return item.trim() === "";
  });
  if (incompleteDetails) {
    throw new ApiError(409, "incomplete details");
  }
  const user = await User.findOne({
    $or: [{ email: usernameORemail }, { username: usernameORemail }],
  });
  if (!user) {
    throw new ApiError(401, "user not found");
  }
  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    throw new ApiError(409, "Wrong password.");
  }
  const accessToken = user.generateAccessToken();
  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 5 * 24 * 60 * 60 * 1000,
    //         1day   1hour  1min    1sec
  };
  const { ...userData } = user._doc;
  delete userData.password;
  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(200, "user Login successfully.", {
        accessToken,
        user: userData,
      })
    );
});
const userLoggedOut = asyncHandler(async (req, res) => {
  const user = req.user;
  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  };
  res
    .status(200)
    .clearCookie("accessToken", options)
    .json(new ApiResponse(200, "user logged out successfully.", user));
});

export { userRegistration, userLogin, userLoggedOut, getCurrentUser };
