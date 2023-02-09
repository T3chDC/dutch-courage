/* This file contains the data modelling and data tier fuinctionalities for users */

import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import validator from 'validator'
import crypto from 'crypto'

//create a user schema
const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      trim: true,
      maxlength: [50, 'user name cannot be more than 50 characters'],
      required: [true, 'Please provide your user name'],
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      trim: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    loginType: {
      type: String,
      required: [true, 'there must be a login type for users'],
      enum: {
        values: ['local', 'google', 'facebook'],
        message: 'User type needs to be local or google',
      },
    },
    googleID: {
      type: String,
      required: [
        function () {
          return this.loginType === 'google'
        },
        'google ID is required',
      ],
    },

    facebookID: {
      type: String,
      required: [
        function () {
          return this.loginType === 'facebook'
        },
        'facebook ID is required',
      ],
    },

    password: {
      type: String,
      required: [
        function () {
          return this.loginType === 'local'
        },
        'There needs to be a password for the user',
      ],
      minLength: 6,
    },
    passwordChangedAt: Date,
    passwordResetOTP: String,
    passwordResetExpires: Date,
    newUser: {
      type: Boolean,
      default: true,
    },
    image: {
      type: String,
      default: '',
    },
    mantra: {
      type: String,
      default: '',
    },

    birthYear: {
      type: Number,
      default: null,
    },

    gender: {
      type: String,
      default: '',
      enum: {
        values: ['male', 'female', 'others'],
        messages: ['Gender should be male female or others'],
      },
    },

    //These are the fields that needs clarificaiton

    // location: {
    //   type: String,
    //   default: '',
    // },

    // topInterests: {
    //   type: [String],
    //   default: [],
    // },

    userType: {
      type: String,
      default: 'tourist',
      enum: {
        values: ['adminUser', 'regularUser'],
        message: 'User type needs to be adminUser or regularUser',
      },
    },

    isActive: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    timestamps: true,
  }
)

const User = mongoose.model('User', userSchema) //create a model

export default User //export the model
