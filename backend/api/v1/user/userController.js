/* This file contains the logic for handling requests and communicating with the user data model*/

import catchAsync from '../utils/catchAsync.js'
import User from './userModel.js'
import AppError from '../utils/appError.js'

import {
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne,
} from '../common/handlerFactory.js' //import generic handler

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Private/Admin
export const getAllUsers = getAll(User)

// @desc    Get single user
// @route   GET /api/v1/users/:id
// @access  Private/Admin
export const getUser = getOne(User)

// @desc    Create user
// @route   POST /api/v1/users
// @access  Private/Admin
export const createUser = createOne(User)

// @desc    Update user
// @route   PATCH /api/v1/users/:id
// @access  Private/Admin
export const updateUser = updateOne(User)

// @desc    Delete user
// @route   DELETE /api/v1/users/:id
// @access  Private/Admin
export const deleteUser = deleteOne(User)

// @desc    Get current logged in user
// @route   GET /api/v1/users/me
// @access  Private
export const getMe = (req, res, next) => {
  req.params.id = req.user.id
  next()
}

// @desc    Update current logged in user
// @route   PATCH /api/v1/users/me
// @access  Private
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

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  })
})

// @desc    Delete current logged in user
// @route   DELETE /api/v1/users/me
// @access  Private

export const deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { isActive: false })

  res.status(204).json({
    status: 'success',
    data: null,
  })
})
