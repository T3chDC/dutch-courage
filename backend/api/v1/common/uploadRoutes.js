// This file contains the routes for uploading files to the server

import express from 'express'
import { upload, deleteFile } from './uploadController.js'

const router = express.Router()

router.post('/:filePath', upload.single('image'), (req, res) => {
  const filePath = `uploads/${req.params.filePath}`
  deleteFile(filePath)
  const port = process.env.PORT || 5000
  const imagePath = req.file.path.replace('\\', '/')
  res.send(`${req.protocol}://${req.hostname}:${port}/${imagePath}`)
})

router.post('/', upload.single('image'), (req, res) => {
  const port = process.env.PORT || 5000
  const imagePath = req.file.path.replace('\\', '/')
  res.send(`${req.protocol}://${req.hostname}:${port}/${imagePath}`)
})

export default router
