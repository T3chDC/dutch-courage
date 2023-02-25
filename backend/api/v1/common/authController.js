/* This file contains the logic for handling requests for user authentication*/
import jwt from 'jsonwebtoken'
import User from '../user/userModel.js'
import catchAsync from '../utils/catchAsync.js'
import AppError from '../utils/appError.js'
import generateToken from '../utils/generateToken.js' //JWT Token Generator
import sendMail from '../utils/emailHandler.js' //Email Handler
import crypto from 'crypto' //imprt crypto library for token hashing

// @desc    Sign up a new user locally
// @route   POST /api/v1/users/signup/local
// @access  Public
export const signupLocal = catchAsync(async (req, res, next) => {
  const mailCheckedUser = await User.findOne({ email: req.body.email })

  if (mailCheckedUser) {
    return next(new AppError('User with this email already exists', 400))
  }

  const userNameCheckedUser = await User.findOne({
    userName: req.body.userName,
  })

  if (userNameCheckedUser) {
    return next(new AppError('User with this username already exists', 400))
  }

  if (req.body.userType === 'admin') {
    return next(
      new AppError('admin user can not be registered without admin access', 429)
    )
  }

  const newUser = await User.create(req.body)

  if (!newUser) {
    return next(new AppError('No new user could be created', 429))
  }

  res.status(201).json({
    status: 'success',
    data: {
      _id: newUser._id,
      userName: newUser.userName,
      email: newUser.email,
      loginType: newUser.loginType,
      userType: newUser.userType,
      //   newUser: newUser.newUser,
      token: generateToken(newUser._id),
    },
  })
})

// @desc    Sign in a user locally
// @route   POST /api/v1/users/signin/local
// @access  Public
export const signinLocal = catchAsync(async (req, res, next) => {
  const { email, password } = req.body

  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400))
  }

  const authedUser = await User.findOne({
    email,
  })

  if (!authedUser) {
    return next(new AppError('Invalid Email', 401))
  }

  if (authedUser && (await authedUser.matchPassword(password))) {
    res.status(200).json({
      status: 'success',
      data: {
        _id: authedUser._id,
        userName: authedUser.userName,
        email: authedUser.email,
        loginType: authedUser.loginType,
        userType: authedUser.userType,
        //   newUser: authedUser.newUser,
        token: generateToken(authedUser._id),
      },
    })
  } else {
    return next(new AppError('Invalid Password', 401))
  }
})

// @desc    Endpoint for sending password reset email
// @route   POST /api/v1/users/forgotPassword
// @access  Public
export const forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email })
  if (!user) {
    return next(new AppError('There is no user with this email address.', 404))
  }

  if (user.loginType !== 'local') {
    return next(
      new AppError(
        'You cannot reset password for this account. Please use the appropriate login method',
        404
      )
    )
  }

  // 2) Generate the 6 digit reset OTP
  const resetOTP = user.createPasswordResetOTP()
  await user.save({ validateBeforeSave: false })

  // 3) Send OTP to user's email
  const message = `Your password reset OTP is ${resetOTP}. Please use this OTP to reset your password. If you did not request this OTP, please ignore this email.`

  try {
    await sendMail({
      email: user.email,
      subject: 'Your password reset OTP (valid for 10 minutes)',
      message,
    })

    res.status(200).json({
      status: 'success',
      message: 'Password Reset OTP is sent to email!',
    })
  } catch (err) {
    user.passwordResetOTP = undefined
    user.passwordResetExpires = undefined
    await user.save({ validateBeforeSave: false })

    return next(
      new AppError(
        'There was an error sending the OTP in email. Please try again later!',
        500
      )
    )
  }
})

// @desc    Endpoint for checking password reset OTP
// @route   POST /api/v1/users/checkPasswordResetOTP
// @access  Public
export const checkPasswordResetOTP = catchAsync(async (req, res, next) => {
  const user = await User.findOne({
    passwordResetOTP: req.body.passwordResetOTP,
    passwordResetExpires: { $gt: Date.now() },
    email: req.body.email,
  })

  if (!user) {
    return next(new AppError('Invalid OTP or OTP has expired', 401))
  }

  const resetToken = user.createPasswordResetToken()
  await user.save({ validateBeforeSave: false })

  res.status(200).json({
    status: 'success',
    data: {
      resetToken,
    },
  })
})

// @desc    Endpoint for resetting password
// @route   POST /api/v1/users/resetPassword
// @access  Public
export const resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.body.resetToken)
    .digest('hex')


  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetTokenExpires: { $gt: Date.now() },
  })

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400))
  }

  user.password = req.body.password
  user.passwordResetToken = undefined
  user.passwordResetTokenExpires = undefined
  user.passwordResetOTP = undefined
  user.passwordResetExpires = undefined
  await user.save()

  // 3) Update changedPasswordAt property for the user
  // 4) Log the user in, send JWT
  res.status(200).json({
    status: 'success',
    data: {
      _id: user._id,
      userName: user.userName,
      email: user.email,
      loginType: user.loginType,
      userType: user.userType,
      //   newUser: user.newUser,
      token: generateToken(user._id),
    },
  })
})

//Middleware that checks if the user is authenticated
export const protect = catchAsync(async (req, res, next) => {
  let token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    )
  }

  // 2) Verification token
  const decoded = jwt.verify(token, process.env.JWT_SECRET)

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id)
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    )
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    )
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser
  next()
})

//Middleware that checks if the user is an allowed to perform the action
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (req.user && roles.includes(req.user.userType)) {
      next()
    } else {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      )
    }
  }
}
