/* This file contains the data modelling and data tier fuinctionalities for users */

import mongoose from 'mongoose' //import mongoose
import bcrypt from 'bcryptjs' //import bcrypt for password hashing
import validator from 'validator' //imprt validator functionalities
import crypto from 'crypto' //imprt crypto library for token hashing

//create a user schema
const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      trim: true,
      maxlength: [50, 'user name cannot be more than 50 characters'],
      required: [true, 'Please provide your user name'],
    },
    loginType: {
      type: String,
      required: [true, 'there must be a login type for users'],
      enum: {
        values: ['local', 'google', 'facebook'],
        message: 'User type needs to be local or google',
      },
    },
    email: {
      type: String,
      required: [
        function () {
          return this.loginType !== 'facebook'
        },
        'Please provide your email',
      ],
      unique: true,
      trim: true,
      validate: [
        function (email) {
          if (email === 'no email') return true
          return validator.isEmail(email)
        },
        'Please provide a valid email',
      ],
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
    },
    passwordChangedAt: {
      type: Date,
    },
    passwordResetOTP: {
      type: Number,
    },

    passwordResetToken: {
      type: String,
    },

    passwordResetExpires: {
      type: Date,
    },

    passwordResetTokenExpires: {
      type: Date,
    },

    newUser: {
      type: Boolean,
      default: true,
    },

    imageUrl: {
      type: String,
      default: '',
    },

    galleryImage1Url: {
      type: String,
      default: '',
    },

    galleryImage2Url: {
      type: String,
      default: '',
    },

    galleryImage3Url: {
      type: String,
      default: '',
    },

    mantra: {
      type: String,
      default: '',
    },

    ageRange: {
      type: String,
      default: '18-25',
      enum: {
        values: ['18-25', '26-33', '34-41', '42-49', '50+'],
        message: 'Age range should be 18-25, 26-33, 34-41, 42-49 or 50+',
      },
    },

    gender: {
      type: String,
      enum: {
        values: [
          'Man',
          'Woman',
          'Agender',
          'Bigender',
          'Gender Fluid',
          'Gender Nonconforming',
          'Gender Queer',
          'Intersex',
          'Non Binary',
          'Pangender',
          'Trans',
          'Other',
        ],
        messages: [
          'Gender must be one of the following options: Man, Woman, Agender, Bigender, Gender Fluid, Gender nonconforming, Gender Queer, Intersex, Non binary, Pangender, Trans, Other',
        ],
      },
    },

    rating: {
      type: Number,
      default: 5,
      min: 1,
      max: 5,
    },

    ratingCount: {
      type: Number,
      default: 1,
      min: 1,
    },

    ratedByUsers: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
    },

    //These are the fields that needs clarificaiton

    location: {
      type: String,
      default: '',
    },

    topInterests: {
      type: [String],
      default: [],
    },

    customCode: {
      type: String,
      default: '',
    },

    userType: {
      type: String,
      default: 'regularUser',
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

    blockedUsers: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
    },

    blockedByUsers: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
    },

    blockedByReasons: {
      type: [String],
      default: [],
    },

    otherBlockReasons: {
      type: [String],
      default: [],
    },

    lowerRatingReasons: {
      type: [String],
      default: [],
    },

    otherLowerRatingReasons: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
)

//method to check if password matches
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

//method to check if password was changed after token was issued
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    )

    return JWTTimestamp < changedTimestamp
  }

  // False means NOT changed
  return false
}

//Generate Password Reset Token
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex')

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')

  this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000

  return resetToken
}

//method to create password reset OTP
userSchema.methods.createPasswordResetOTP = function () {
  const resetOTP = Math.floor(100000 + Math.random() * 900000)
  this.passwordResetOTP = resetOTP
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000
  return resetOTP
}

//hashing password before document is created
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }
  const salt = await bcrypt.genSalt(process.env.SALT_ROUNDS * 1)
  this.password = await bcrypt.hash(this.password, salt)
  this.passwordChangedAt = Date.now() - 1000
  next()
})

//hashing password before document is updated
userSchema.pre('findOneAndUpdate', async function (next) {
  if (!this._update.password) {
    next()
  }
  const salt = await bcrypt.genSalt(process.env.SALT_ROUNDS * 1)
  this._update.password = await bcrypt.hash(this._update.password, salt)
  this._update.passwordChangedAt = Date.now() - 1000
  next()
})

const User = mongoose.model('User', userSchema) //create a model

export default User //export the model
