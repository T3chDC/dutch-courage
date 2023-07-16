// This file contains the logic for manipulating the location of the live users.
// Importing the liveUsers array from locationStorage.js
import { liveUsers } from './locationStorage.js'

// @ desc This function is responsible for adding the user id and location to the liveUsers array.
// @ route POST /api/v1/location/addUser
// @ access Private/regularUser
export const addUser = (req, res, next) => {
  const userId = req.body.userId
  const location = req.body.location

  if (liveUsers.some((user) => user.userId === userId)) {
    const index = liveUsers.findIndex((user) => user.userId === userId)
    liveUsers[index].location = location
  } else {
    liveUsers.push({ userId, location })
  }

  const nearbyUsers = getNearbyUsers(userId, location)

  res.status(200).json({
    status: 'success',
    data: {
      nearbyUsers,
    },
  })
}

// @ desc This function is responsible for removing the user id and location from the liveUsers array.
// @ route POST /api/v1/location/removeUser
// @ access Private/regularUser
export const removeUser = (req, res, next) => {
  const userId = req.body.userId
  liveUsers.filter((user) => user.userId !== userId)

  res.status(200).json({
    status: 'success',
    data: {
      _id: req.body.userId,
    },
  })
}

// Function to get nearby users
const getNearbyUsers = (userId, location) => {
  const nearbyUsers = liveUsers.filter((user) => {
    return user.userId !== userId && distance(location, user.location) <= 1
  })
  return nearbyUsers
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
