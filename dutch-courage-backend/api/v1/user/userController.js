/* This file contains the logic for handling requests and communicating with the user data model*/

import catchAsync from '../utils/catchAsync.js'
import User from './userModel.js'
import AppError from '../utils/appError.js'
import generateToken from '../utils/generateToken.js' //JWT Token Generator

import {
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne,
} from '../common/handlerFactory.js' //import generic handler

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Private/adminUser
export const getAllUsers = getAll(User)

// @desc    Get single user
// @route   GET /api/v1/users/:id
// @access  Private/adminUser
export const getUser = getOne(User)

// @desc    Create user
// @route   POST /api/v1/users
// @access  Private/adminUser
export const createUser = createOne(User)

// @desc    Update user
// @route   PATCH /api/v1/users/:id
// @access  Private/adminUser
export const updateUser = updateOne(User)

// @desc    Delete user
// @route   DELETE /api/v1/users/:id
// @access  Private/adminUser
export const deleteUser = deleteOne(User)

// @desc    Get current logged in user
// @route   GET /api/v1/users/getMe
// @access  Private/regularUser
export const getMe = (req, res, next) => {
  req.params.id = req.user.id
  next()
}

// @desc    Update current logged in user
// @route   PATCH /api/v1/users/updateMe
// @access  Private/regularUser
export const updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    )
  }

  // 2) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
    runValidators: true,
  })

  if (!updatedUser) {
    return next(new AppError('No user found with that ID', 404))
  }

  res.status(200).json({
    status: 'success',
    data: updatedUser,
  })
})
// @desc    Delete current logged in user
// @route   DELETE /api/v1/users/deleteMe
// @access  Private/regularUser

export const deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { isActive: false })

  res.status(204).json({
    status: 'success',
    data: null,
  })
})

// @desc    Block another user
// @route   PATCH /api/v1/users/blockUser
// @access  Private/regularUser
export const blockUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id)
  const userToBeBlocked = await User.findById(req.body.userId)

  if (!user) {
    return next(new AppError('No user found with that ID', 404))
  }

  if (!userToBeBlocked) {
    return next(
      new AppError(
        'The user to be blocked could not be found with that ID',
        404
      )
    )
  }

  if (user.blockedUsers.includes(req.body.userId)) {
    return next(new AppError('User already blocked', 400))
  }

  user.blockedUsers.push(req.body.userId)

  if (!req.body.reason) {
    return next(new AppError('Please provide a reason for blocking', 400))
  }

  userToBeBlocked.blockedByUsers.push(req.user._id)

  if (req.body.reason === 'other') {
    if (!req.body.otherReason) {
      return next(
        new AppError('Please provide description of reason for blocking', 400)
      )
    }
  }

  if (req.body.otherReason) {
    userToBeBlocked.otherBlockReasons.push(req.body.otherReason)
  }

  userToBeBlocked.blockedByReasons.includes(req.body.reason)
    ? null
    : userToBeBlocked.blockedByReasons.push(req.body.reason)

  await user.save()
  await userToBeBlocked.save()

  res.status(200).json({
    status: 'success',
    data: user,
  })
})
