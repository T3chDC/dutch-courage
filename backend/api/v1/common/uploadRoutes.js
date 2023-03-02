// This file contains the routes for uploading files to the server

import express from 'express'
import { upload } from './uploadController.js'

const router = express.Router()

router.post('/', upload.single('image'), (req, res) => {
  const port = process.env.PORT || 5000
  const imagePath = req.file.path.replace('\\', '/')
  res.send(`${req.protocol}://${req.hostname}:${port}/${imagePath}`)
})

export default router
