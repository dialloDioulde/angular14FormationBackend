const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();
const userSchema = require('../models/User');
const authorize = require('../middlewares/auth');
const { check, validationResult } = require('express-validator');

const multer = require('multer');

const Role = require('../models/role');

// Sign-up
router.post(
  '/register-user',
  [
    check('name')
      .not()
      .isEmpty()
      .isLength({ min: 3 })
      .withMessage('Name must be atleast 3 characters long'),
    check('email', 'Email is required').not().isEmpty(),
    check('password', 'Password should be between 5 to 8 characters long')
      .not()
      .isEmpty()
      .isLength({ min: 5, max: 20 }),
  ],
  (req, res, next) => {
    const errors = validationResult(req)
    console.log(req.body);

    if (!errors.isEmpty()) {
      return res.status(422).jsonp(errors.array())
    } else {
      bcrypt.hash(req.body.password, 10).then((hash) => {
        const user = new userSchema({
          name: req.body.name,
          email: req.body.email,
          password: hash,
          role: Role.User,
        })
        user
          .save()
          .then((response) => {
            res.status(201).json({
              message: 'User successfully created!',
              result: response,
            });
            console.log(response);
          })
          .catch((error) => {
            res.status(500).json({
              error: error,
            })
          })
      })
    }
  },
)

// Sign-in
router.post('/login-user', (req, res, next) => {
  let getUser
  userSchema
    .findOne({
      email: req.body.email,
    })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          message: 'Authentication failed',
        })
      }
      getUser = user
      return bcrypt.compare(req.body.password, user.password)
    })
    .then((response) => {
      if (!response) {
        return res.status(401).json({
          message: 'Authentication failed',
        })
      }
      let jwtToken = jwt.sign(
        {
          email: getUser.email,
          userId: getUser._id,
          role: getUser.role,
        },
        'longer-secret-is-better',
        {
          expiresIn: '1h',
        },
      )
      res.status(200).json({
        token: jwtToken,
        expiresIn: 3600,
        _id: getUser._id,
      })
    })
    .catch((err) => {
      return res.status(401).json({
        message: 'Authentication failed',
      })
    })
})

// Get Users
router.route('/').get((req, res, next) => {
  userSchema.find((error, response)=> {
    if (error) {
      return next(error)
    } else {
      return res.status(200).json(response)
    }
  })
})


// Get Single User
router.route('/user-profile/:id').get(authorize, (req, res, next) => {
  userSchema.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.status(200).json({
        msg: data,
      })
    }
  });
})

// Update User
router.route('/update-user/:id').put((req, res, next) => {
  userSchema.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    (error, data) => {
      if (error) {
        return next(error)
      } else {
        res.json(data)
        console.log('User successfully updated!')
      }
    },
  )
});

// Delete User
router.route('/delete-user/:id').delete((req, res, next) => {
  userSchema.findByIdAndRemove(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.status(200).json({
        msg: data,
      })
    }
  })
});


// POSTS //
const posts = require("../controllers/PostController");
// Create a new Post
router.post("/create-post", posts.create);
// Get all posts
router.get("/all-post", posts.allPosts);
// Update a new Post
router.put("/update-post/:id", posts.updatePost);
// Delete a post
router.delete("/delete-post/:id", posts.deletePost);


// POSTS IMAGES //
const postImages = require("../controllers/PostImageController");
// Upload image of post
router.post("/upload-post-image", postImages.upload.single('avatar'), postImages.uploadPostImage);
// Get all images of posts
router.get("/all-image-post", postImages.allImageOfPost);
// Delete all images of posts
//router.delete("/delete-all-image-post", postImages.deleteAllImageOfPosts);

module.exports = router
