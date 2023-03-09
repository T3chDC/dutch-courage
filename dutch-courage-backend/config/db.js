/*This file contains the db connectivity configuration*/
import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    mongoose.set('strictQuery', false)
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
    })
    console.log(`DB connected successfully to: ${conn.connection.host}`)
  } catch (error) {
    console.error(`Error: ${error.message}`)
    process.exit(1)
  }
}

export default connectDB
