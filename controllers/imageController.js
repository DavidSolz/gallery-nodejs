const Image = require("../models/image");
const User = require("../models/user");
const Gallery = require("../models/gallery");
const Comment = require("../models/comment");

const formidable = require('formidable');
const path = require("path");

const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

exports.imageList = asyncHandler(async (req, res, next) => {

  const username = res.locals.loggedUser;

  if (!username) {
    return res.render("index", {
      title: 'Gallery App',
      messages: ["Unauthorized: You must be logged in."]
    });
  }

  const currentUser = await User.findOne({username}).exec();

  if (!currentUser) {
    return res.render("index", {
      title: 'Gallery App',
      messages: [`User "${username}" not found.`]
    });
  }

  let images = []

  if(username === "admin")
  {
    images = await Image.find({}).populate("gallery").exec();
  }
  else
  {
    const galleries = await Gallery.find({ user: currentUser._id }).exec();
    const galleryIds = galleries.map(g => g._id);

    images = await Image.find({ gallery: { $in: galleryIds } }).populate("gallery").exec();
  }

  res.render("image_list", {
    title: "List of all images",
    image_list: images
  });
});

exports.imageAddGet = asyncHandler(async (req, res, next) => {
  let galleryQuery = {}

  if (res.locals.loggedUser != "admin") {
    const owner = await User.findOne({ username: res.locals.loggedUser }).exec();
    galleryQuery = { user: owner._id }
  }

  const allGalleries = await Gallery.find(galleryQuery).exec();

  res.render("image_form", {
    title: "Add Image",
    galleries: allGalleries,
    image: {},
    messages: []
  });
});


exports.imageAddPost = [

  body("name")
    .trim()
    .isLength({ min: 2 })
    .escape()
    .withMessage("Name too short."),

  body("description")
    .trim()
    .isLength({ min: 2 })
    .escape()
    .withMessage("Description too short."),

  body("path")
    .trim()
    .notEmpty()
    .escape()
    .withMessage("Path is required."),

  asyncHandler(async (req, res, next) => {

    const errors = validationResult(req);

    const currentUser = await User.findOne({ username: res.locals.loggedUser }).exec();

    if (!currentUser) {
      return res.render("image_upload_form", {
        title: "Upload image",
        messages: ["Unauthorized: You must be logged in."],
      });
    }

    const allGalleries = await Gallery.find({ user: currentUser._id }).exec();

    const newImage = new Image({
      name: req.body.name,
      description: req.body.description,
      path: req.body.path,
      gallery: req.body.gallery,
    });

    if (!errors.isEmpty()) {
      const messages = errors.array().map(err => err.msg);
      return res.render("image_form", {
        title: "Add Image",
        image: newImage,
        galleries: allGalleries,
        messages
      });
    }

    const imageExists = await Image.findOne({
      name: req.body.name,
      gallery: req.body.gallery,
    }).collation({ locale: "pl", strength: 2 }).exec();

    if (imageExists) {
      return res.render("image_form", {
        title: "Add Image",
        image: newImage,
        galleries: allGalleries,
        messages: [`Image "${newImage.name}" already exists!`]
      });
    }

    await newImage.save()

    res.render("image_form", {
      title: "Add Image",
      image: {},
      galleries: allGalleries,
      messages: [`Image "${newImage.name}" added`]
    })
  })

];

exports.imageUploadGet = asyncHandler(async (req, res, next) => {
  res.render("image_upload_form", {
    title: "Upload image"
  });
});

exports.imageUploadPost = asyncHandler(async (req, res, next) => {
  const form = new formidable.IncomingForm({
    uploadDir: path.join(__dirname, "../public/images"),
    multiples: false,
    keepExtensions: true
  });

  let messages = [];

  form.parse(req, (err, fields, files) => {
    if (err) {
      messages.push("Image upload error!");
      return res.render("image_upload_form", {
        title: "Upload image",
        messages
      });
    }

    res.render("image_upload_form", {
      title: "Upload image",
      messages: ["Image uploaded!"]
    });
  });
});

exports.imageUpdateGet = asyncHandler(async (req, res, next) => {

  const imageObj = await Image.findOne({ _id: req.query.image_id }).populate('gallery').exec();
  const galleryObj = imageObj.gallery;

  let all_galleries = [];
  if (res.locals.loggedUser === "admin") {
    all_galleries = await Gallery.find({}).sort({ name: 1 }).exec();
  } else {
    const currentUser = await User.findOne({ username: res.locals.loggedUser }).exec();

    if (!galleryObj.user.equals(currentUser._id)) {
      return res.status(403).send("Unauthorized: You don't have permission to edit this image.");
    }

    all_galleries = await Gallery.find({ user: currentUser._id }).exec();
  }

  res.render("image_update", {
    title: "Image update",
    image: imageObj,
    galleries: all_galleries,
    messages: []
  });
});

exports.imageShow = asyncHandler(async (req, res, next) => {

  try {
    const image = await Image.findById(req.query.image_id).populate('gallery');

    if (!image) {
      return res.status(404).send('Image not found');
    }

    const comments = await Comment.find({ image: image._id }).populate('author').sort({ date: -1 }).exec();

    res.render('image_show', {
      title: 'Image Details',
      image,
      comments
    });

  } catch (err) {
    next(err);
  }
});

exports.imageUpdatePost = asyncHandler(async (req, res, next) => {
  const filter = { _id: req.query.image_id };

  const update = {
    name: req.body.name,
    description: req.body.description,
    gallery: req.body.gallery,
  };

  let doc = await Image.findOneAndUpdate(filter, update);

  if (doc) {
    res.redirect("../galleries/gallery_browse")
  } else {
    res.send('Image update error');
  }
});

exports.imageDelete = asyncHandler(async (req, res, next) => {
  const imageId = req.params.image_id;

  const image = await Image.findById(imageId).populate('gallery');

  if (!image) {
    return res.status(404).send("Image not found.");
  }

  const user = await User.findOne({ username: res.locals.loggedUser });

  const isAdmin = res.locals.loggedUser === "admin";
  const isOwner = image.gallery.user.equals(user._id);

  if (!isAdmin && !isOwner) {
    return res.status(403).send("Unauthorized: You don't have permission to delete this image.");
  }

  await Image.findByIdAndDelete(imageId);

  res.redirect("../../galleries/gallery_browse");
});

