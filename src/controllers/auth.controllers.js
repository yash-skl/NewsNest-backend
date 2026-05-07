import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";


const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while registering Access and RefreshToken"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;
  // console.log(req.file);

  // Check if any fields are missing or empty
  if (
    [fullName, email, password].some(
      (field) => !field || field.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ApiError(400, "Invalid email format");
  }

  // Check if user already exists by email or phone number
  const existedUser = await User.findOne({
    $or: [{ email }],
  });

  if (existedUser) {
    throw new ApiError(
      409,
      "User with this email or phone number already exists."
    );
  }


  // Create new user
  const user = await User.create({
    fullName,
    email,
    password,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  // console.log("created user", createdUser);

  // Send response
  res
    .status(201)
    .json({ success: true, message: "User registered successfully." });
});


const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid Refresh Token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh Token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, refreshToken } =
  await generateAccessAndRefreshToken(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: refreshToken },
          "Access Token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh Token");
  }
});


// Login User
const loginUser = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      throw new ApiError(400, "Email is required.");
    }

    const user = await User.findOne({ email }).select("+password +refreshToken");

    if (!user) {
      throw new ApiError(404, "User does not exist.");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid User Credentials.");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );

    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    // Define cookie options explicitly
    const cookieOptions = {
      httpOnly: true,  
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
    };

    // Set cookies only once
    res.cookie("accessToken", accessToken, cookieOptions);
    res.cookie("refreshToken", refreshToken, cookieOptions);

    console.log("Token Set in Cookie:", accessToken);

    return res.status(200).json({
      success: true,
      user: loggedInUser,
      accessToken,
      refreshToken,
      message: `User logged in successfully, welcome ${user.fullName}`,
    });

  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiError(error.statusCode || 500, error.message));
  }
});



const logoutUser = async (req, res) => {
  try {
      return res.status(200).cookie("token", "", { maxAge: 0 }).json({
          message: "Logged out successfully.",
          success: true
      })
  } catch (error) {
      console.log(error);
  }
}



export { registerUser, loginUser, logoutUser, refreshAccessToken };