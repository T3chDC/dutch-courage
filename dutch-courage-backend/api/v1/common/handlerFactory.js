/* This file contains the generic factory method templates for CRUD operations */

import catchAsync from '../utils/catchAsync.js'
import AppError from '../utils/appError.js'
import APIFeatures from '../utils/apiFeatures.js'

//Get All
export const getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    //Execute Query
    const features = new APIFeatures(Model.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate()
    const doc = await features.query

    if (doc.length < 1) {
      return next(
        new AppError(`No ${Model.collection.collectionName} Found`, 404)
      )
    }

    //Send Response
    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: doc,
    })
  })

//Get One
export const getOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findById(req.params.id).select(
      '-__v -password -passwordChangedAt'
    )

    if (!doc) {
      return next(
        new AppError(
          `No ${Model.collection.collectionName} Found with that ID`,
          404
        )
      )
    }

    res.status(200).json({
      status: 'success',
      data: doc,
    })
  })

//Create One
export const createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body)

    if (!doc) {
      return next(
        new AppError(`${Model.collection.collectionName} Can't be Created`, 429)
      )
    }

    res.status(201).json({
      status: 'success',
      data: doc,
    })
  })

//Update One
export const updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!doc) {
      return next(
        new AppError(
          `${Model.collection.collectionName} is Not Found with that ID`,
          404
        )
      )
    }

    res.status(200).json({
      status: 'success',
      data: doc,
    })
  })

//Delete One
export const deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id)

    if (!doc) {
      return next(
        new AppError(
          `No ${Model.collection.collectionName} Found with that ID`,
          404
        )
      )
    }

    res.status(200).json({
      status: 'success',
      data: { _id: req.params.id },
    })
  })
