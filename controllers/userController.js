const User = require("../models/user");
const { body, validationResult } = require('express-validator');
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.userList = asyncHandler(async (req, res, next) => {
  const allUsers = await User.find({}).exec();
  res.render("user_list", {
    title: "Lisf of users",
    user_list: allUsers
  });
});

exports.userAddGet = (req, res) => {
  res.render("user_form", {
    title: "Add New User"
  });
};

exports.userLoginGet = (req, res, next) => {
  res.render("user_login_form", {
    title: "Login",
    loggedUser: res.locals.loggedUser
  });
};

exports.userLoginPost = (req, res, next) => {

  const { username, password } = req.body;

  User.findOne({ username }).then((user) => {

    if (!user) {
      return res.render("user_login_form", {
        title: "Login",
        messages: ["No user found!"]
      });
    }

    bcrypt.compare(password, user.password, function (err, result) {
      if (err || !result) {
        return res.render("user_login_form", {
          title: "Login",
          messages: ["Bad pass!"]
        });
      }

      let token = jwt.sign({ username: user.username }, 'tutajJakisKlucz', { expiresIn: '1h' });

      res.cookie('mytoken', token, { maxAge: 600000 });

      res.redirect('/');

    });
  });

};

exports.userLogoutGet = (req, res) => {
  res.clearCookie('mytoken');
  res.locals.loggedUser = null;

  res.render('index', {
    title: 'Gallery App'
  });
};

exports.userAddPost = [

  body("name")
    .trim()
    .isLength({ min: 2 })
    .escape()
    .withMessage("First name too short."),

  body("surname")
    .trim()
    .isLength({ min: 2 })
    .escape()
    .withMessage("Lastname too short."),

  body("username")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long.")
    .isAlphanumeric()
    .withMessage("Username must contain only letters and numbers.")
    .escape(),

  body("password", "Password to short!")
    .isLength({ min: 8 }),

  asyncHandler(async (req, res, next) => {

    const errors = validationResult(req);

    const passwordHash = await bcrypt.hash(req.body.password, 10)

    const newUser = new User({
      username: req.body.username,
      name: req.body.name,
      surname: req.body.surname,
      password: passwordHash,
    });

    if (!errors.isEmpty()) {
      const messages = errors.array().map(err => err.msg);
      res.render("user_form", {
        title: "Add New User",
        user: newUser,
        messages
      });
    }

    const userExists = await User.findOne({ username: req.body.username })
      .collation({ locale: "pl", strength: 2 })
      .exec();

    if (userExists) {
      res.render("user_form", {
        title: "Add New User",
        user: newUser,
        messages: [`Username "${newUser.username}" already exists!`]
      });
    }

    await newUser.save()

    res.render("user_form", {
      title: "Add New User",
      user: {},
      messages: [`Username "${newUser.username}" added`]
    })

  }),
];

exports.userDeletePost = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.params.user_id;

    const currentUser = await User.findOne({ username: res.locals.loggedUser }).exec();

    if (!currentUser) {
      return res.status(401).send("Unauthorized");
    }

    if (currentUser._id.toString() === userId) {
      return res.status(400).send("You cannot delete your own account.");
    }

    await User.findByIdAndDelete(userId);

    res.redirect('/users/');
  } catch (err) {
    res.status(500).send("Error deleting user");
  }
});
