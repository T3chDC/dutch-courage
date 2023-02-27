/* This file contains routing for user models and functionalities */
import express from 'express'

import {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getMe,
  updateMe,
  deleteMe,
} from './userController.js' //import User controller

import {
  signupLocal,
  signinLocal,
  forgotPassword,
  checkPasswordResetOTP,
  resetPassword,
  googleSignUp,
  protect,
  restrictTo,
} from '../common/authController.js' //import Auth controller

const router = express.Router() //create router instance

router.route('/signup/local').post(signupLocal) //signup user locally
router.route('/signup/google').post(googleSignUp) //signup user with google
router.route('/signin/local').post(signinLocal) //signin users locally
router.route('/signin/google').post(googleSignUp) //signin users with google

router.route('/forgotPassword').post(forgotPassword) //route to handle forgot password
router.route('/checkPasswordResetOTP').post(checkPasswordResetOTP) //route to handle forgot password
router.route('/resetPassword').post(resetPassword) //route to handle forgot password

router.route('/getMe').get(protect, getMe, getUser) //route to get profile information
router.route('/updateMe').patch(protect, updateMe) //route to handle profile information update by user
router.route('/deleteMe').delete(protect, deleteMe) //route to handle profile deletion by user

//base CRUD functionality for admin only
// router.use(protect, restrictTo('admin'))
router.route('/').get(getAllUsers).post(createUser)
router
  .route('/:id')
  .get(getUser)
  .patch(updateUser)
  .put(updateUser)
  .delete(deleteUser)

export default router
