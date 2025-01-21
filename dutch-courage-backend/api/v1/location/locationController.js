// This file contains the logic for manipulating the location of the live users.
// Importing the liveUsers array from locationStorage.js
// import { liveUsers } from './locationStorage.js'
import AppError from '../utils/appError.js'
import User from '../user/userModel.js'
import axios from 'axios'

let liveUsers = []
// Save the last active time of the users in the liveUsers array
setInterval(() => {
  liveUsers.forEach((user) => {
    if (Date.now() - user.lastActive > 60000) {
      liveUsers = liveUsers.filter((u) => u.userId !== user.userId)
    }
  })
}, 60000)

// @ desc This function is responsible for adding the user id and location to the liveUsers array.
// @ route POST /api/v1/location/addUser
// @ access Private/regularUser
export const addUser = async (req, res, next) => {
  const userId = req.body.userId
  const location = req.body.location
  // get location description from google maps geocoding api
  const locationDescription = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.latitude},${location.longitude}&key=${process.env.GOOGLE_API_KEY}`
  )

  try {
    if (liveUsers.some((user) => user.userId === userId)) {
      const index = liveUsers.findIndex((user) => user.userId === userId)
      liveUsers[index].location = location
      // liveUsers[index].locationDescription =
      //   locationDescription.data.results[0].formatted_address
    } else {
      liveUsers.push({
        userId,
        location,
        locationDescription:
          locationDescription.data.results[0].formatted_address,
        lastActive: Date.now(),
      })
    }

    console.log(liveUsers)
    console.log('from add')

    const nearbyUsers = await getNearbyUsers(userId, location)

    res.status(200).json({
      status: 'success',
      data: nearbyUsers.length > 0 ? nearbyUsers : [],
    })
  } catch (err) {
    console.log(err)
    return next(new AppError('Something went wrong', 500))
  }
}

// @ desc This function is responsible for updating the user locationDescription in the liveUsers array.
// @ route POST /api/v1/location/updateUserLocationDescription
// @ access Private/regularUser
export const updateUserLocationDescription = async (req, res, next) => {
  const userId = req.body.userId
  const locationDescription = req.body.locationDescription

  console.log(userId)

  try {
    if (liveUsers.some((user) => user.userId === userId)) {
      const index = liveUsers.findIndex((user) => user.userId === userId)
      liveUsers[index].locationDescription = locationDescription
    } else {
      return next(new AppError('User not found', 404))
    }
    console.log(liveUsers)
    console.log('from update')

    const index = liveUsers.findIndex((user) => user.userId === userId)

    res.status(200).json({
      status: 'success',
      data: {
        locationDescription: liveUsers[index].locationDescription,
      },
    })
  } catch (err) {
    console.log(err)
    return next(new AppError('Something went wrong', 500))
  }
}

// @ desc This function is responsible for removing the user id and location from the liveUsers array.
// @ route POST /api/v1/location/removeUser
// @ access Private/regularUser
export const removeUser = (req, res, next) => {
  const userId = req.body.userId

  try {
    liveUsers = liveUsers.filter((user) => user.userId !== userId)

    console.log(liveUsers)
    console.log('from remove')

    res.status(200).json({
      status: 'success',
      data: {
        _id: req.body.userId,
      },
    })
  } catch (err) {
    console.log(err)
    return next(new AppError('Something went wrong', 500))
  }
}

// Function to get nearby users
const getNearbyUsers = async (userId, location) => {
  const nearbyUsers = liveUsers.filter((user) => {
    return user.userId !== userId && distance(location, user.location) <= 1
  })
  // Get the user details for the nearby users from DB
  try {
    return await getUserDetails(nearbyUsers)
  } catch (err) {
    return next(new AppError('Something went wrong', 500))
  }
  // nearbyUsers.forEach((user) => {
  //   const userDetail = await User.findById(user.userId)
  //   user.userName = userDetail.userName
  //   user.imageUrl = userDetail.imageUrl
  //   user.rating = userDetail.rating
  //   user.topInterests = userDetail.topInterests.slice(0, 3)
  // })
  // return nearbyUsers
}

// Function to get user details
const getUserDetails = async (nearbyUsers) => {
  const nearbyUsersDetails = []
  for (const user of nearbyUsers) {
    const userDetail = await User.findById(user.userId)
    nearbyUsersDetails.push({
      _id: userDetail._id,
      userName: userDetail.userName,
      imageUrl: userDetail.imageUrl,
      rating: userDetail.rating,
      topInterests: userDetail.topInterests.slice(0, 3),
      location: user.location,
      locationDescription: user.locationDescription,
    })
  }
  return nearbyUsersDetails
}

// This function is responsible for calculating the distance between two locations.
const distance = (location1, location2) => {
  const lat1 = location1.latitude
  const lon1 = location1.longitude
  const lat2 = location2.latitude
  const lon2 = location2.longitude
  const p = 0.017453292519943295 // Math.PI / 180
  const c = Math.cos
  const a =
    0.5 -
    c((lat2 - lat1) * p) / 2 +
    (c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p))) / 2
  return 12742 * Math.asin(Math.sqrt(a)) // 2 * R; R = 6371 km
}
