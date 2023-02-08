import express from 'express'

const router = express.Router()

router.route('/').get((req, res) => {
  res.status(200).json({
    message:
      'This is version 1.0 of the API, If you want to use version n.0, please use /api/vn (n = version number))',
  })
})

export default router
