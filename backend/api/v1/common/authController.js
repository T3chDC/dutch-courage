/* This file contains the logic for handling requests for user authentication*/
import jwt from 'jsonwebtoken'
import User from '../user/userModel.js'
import catchAsync from '../utils/catchAsync.js'
import AppError from '../utils/appError.js'
import generateToken from '../utils/generateToken.js' //JWT Token Generator
import crypto from 'crypto' //crypto for token hashing

// @desc    Sign up a new user locally
// @route   POST /api/v1/users/signup/local
// @access  Public
export const signupLocal = catchAsync(async (req, res, next) => {
  const mailCheckedUser = await User.findOne({ email: req.body.email })

  if (mailCheckedUser) {
    return next(new AppError('User with this email already exists', 400))
  }

  const userNameCheckedUser = await User.findOne({
    username: req.body.userName,
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

  const authedUser = await User.findOne({
    email,
  })

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
    return next(new AppError('Invalid email or password', 401))
  }
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
