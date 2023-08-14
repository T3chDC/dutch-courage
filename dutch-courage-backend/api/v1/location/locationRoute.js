// This file will handle the routes for location related functionalities.
import express from 'express' //import express

import {
  addUser,
  updateUserLocationDescription,
  removeUser,
} from './locationController.js' //import location controller

import { protect, restrictTo } from '../common/authController.js' //import Auth controller

const router = express.Router() //create router instance

// router.use(protect, restrictTo('regularUser')) //protect all routes after this middleware
router.route('/addUser').post(addUser) //route to add user to live users
router
  .route('/updateUserLocationDescription')
  .post(updateUserLocationDescription) //route to update user location description
router.route('/removeUser').post(removeUser) //route to remove user from live users

export default router
