const Gallery = require("../models/gallery");
const User = require("../models/user");
const Image = require("../models/image");

const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

exports.galleryList = asyncHandler(async (req, res, next) => {

  const currentUser = await User.findOne({ username: res.locals.loggedUser }).exec();

  if (!currentUser) {
    return res.render("gallery_list", {
      title: "List of Galleries",
      gallery_list: [],
      messages: ["Unauthorized: You must be logged in."],
    });
  }

  let galleries;

  if (currentUser.username === "admin") {
    galleries = await Gallery.find({}).populate("user").exec();
  } else {
    galleries = await Gallery.find({ user: currentUser._id }).populate("user").exec();
  }

  res.render("gallery_list", {
    title: "List of Galleries",
    gallery_list: galleries,
  });
});

exports.galleryAddGet = asyncHandler(async (req, res, next) => {
  const allUsers = await User.find().sort({ lastname: 1 }).exec();

  const currentUser = await User.findOne({ username: res.locals.loggedUser }).exec();

  if (!currentUser) {
    return res.render("gallery_list", {
      title: "List of Galleries",
      gallery_list: [],
      messages: ["Unauthorized: You must be logged in."],
    });
  }

  if (res.locals.loggedUser === "admin") {
    res.render("gallery_admin_form", {
      title: "Add Gallery",
      users: allUsers,
      owner: currentUser
    });
  }
  else {
    res.render("gallery_form", {
      title: "Add Gallery",
      users: allUsers,
      owner: currentUser
    });
  }

});

exports.galleryBrowseGet = asyncHandler(async (req, res, next) => {
  const allGalleries = await Gallery.find({}).exec();

  res.render("gallery_browse", {
    title: "Select gallery",
    galleries: allGalleries,
  });
});

exports.galleryBrowsePost = asyncHandler(async (req, res, next) => {

  const allGalleries = await Gallery.find({}).exec();

  if (!req.body.s_gallery) {
    return res.render("gallery_browse", {
      title: "View gallery",
      galleries: allGalleries,
      messages: ["Unknown gallery!"]
    });
  }

  let galleryImages = await Image.find({ gallery: req.body.s_gallery }).exec();
  let selectedGallery = await Gallery.findOne({ _id: req.body.s_gallery}).exec();

  if(!selectedGallery)
  {
    return res.render("gallery_browse", {
      title: "View gallery",
      galleries: allGalleries,
      messages: ["Unknown gallery!"]
    });
  }

  res.render("gallery_browse", {
    title: "View gallery",
    galleries: allGalleries,
    images: galleryImages,
    sel_gallery: selectedGallery,
  });
});

exports.galleryAddPost = [
  body("name")
    .trim()
    .isLength({ min: 2 })
    .escape()
    .withMessage("Name too short."),

  body("description").trim().escape(),

  body("date").isISO8601().toDate(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const allUsers = await User.find().sort({ lastname: 1 }).exec();
    const owner = await User.findOne({ _id: req.body.user }).exec();

    let template = req.user?.username === "admin"
      ? "gallery_admin_form"
      : "gallery_form";

    const newGallery = new Gallery({
      name: req.body.name,
      description: req.body.description,
      date: req.body.date,
      user: req.body.user,
    });

    if (!errors.isEmpty()) {
      const messages = errors.array().map((err) => err.msg);
      return res.render(template, {
        title: "Add Gallery:",
        gallery: newGallery,
        users: allUsers,
        messages,
        owner,
      });
    }

    const galleryExists = await Gallery.findOne({
      name: req.body.name,
      user: req.body.user,
    }).collation({ locale: "pl", strength: 2 }).exec();

    if (galleryExists) {
      return res.render(template, {
        title: "Add Gallery",
        gallery: newGallery,
        users: allUsers,
        messages: [`Gallery "${newGallery.name}" already exists!`],
        owner,
      });
    }

    await newGallery.save();

    res.render(template, {
      title: "Add Gallery",
      gallery: {},
      users: allUsers,
      messages: [`Gallery "${newGallery.name}" added`],
      owner,
    });

  }),
];

exports.galleryDeletePost = asyncHandler(async (req, res, next) => {
  const galleryId = req.params.gallery_id;

  const currentUser = await User.findOne({ username: res.locals.loggedUser }).exec();

  if (!currentUser) {
    return res.render("gallery_list", {
      title: "List of Galleries",
      gallery_list: [],
      messages: ["Unauthorized: You must be logged in."],
    });
  }

  const gallery = await Gallery.findById(galleryId);

  if (!gallery) {
    return res.render("gallery_list", {
      title: "List of Galleries",
      gallery_list: galleries,
      messages: ["Gallery not found."],
    });
  }

  const imagesCount = await Image.countDocuments({ gallery: gallery._id });

  if (imagesCount > 0) {
    return res.render("gallery_list", {
      title: "List of Galleries",
      gallery_list: galleries,
      messages: ["Cannot delete gallery: gallery is not empty."],
    });
  }

  const isAdmin = currentUser.username === "admin";
  const isOwner = gallery.user && gallery.user.toString() === currentUser._id.toString();

  if (!isAdmin && !isOwner) {
    return res.render("gallery_list", {
      title: "List of Galleries",
      gallery_list: galleries,
      messages: ["Forbidden: you can only delete your own galleries."],
    });
  }

  await Gallery.findByIdAndDelete(galleryId);

  const galleries = isAdmin
    ? await Gallery.find({}).populate("user").exec()
    : await Gallery.find({ user: currentUser._id }).populate("user").exec();

  res.render("gallery_list", {
    title: "List of Galleries",
    gallery_list: galleries,
    messages: [`Gallery deleted successfully.`],
  });
});

exports.galleryUpdateGet = asyncHandler(async (req, res, next) => {
  const galleryId = req.params.gallery_id;
  const currentUser = await User.findOne({ username: res.locals.loggedUser }).exec();

  if (!currentUser) {
    return res.render("gallery_list", {
      title: "List of Galleries",
      gallery_list: [],
      messages: ["Unauthorized: You must be logged in."],
    });
  }

  const gallery = await Gallery.findById(galleryId).populate("user").exec();

  if (!gallery) {
    return res.render("gallery_list", {
      title: "List of Galleries",
      gallery_list: galleries,
      messages: ["Gallery not found."],
    });
  }

  const isAdmin = currentUser.username === "admin";
  const isOwner = gallery.user && (gallery.user._id.toString() === currentUser._id.toString());

  if (!isAdmin && !isOwner) {
    return res.render("gallery_list", {
      title: "List of Galleries",
      gallery_list: [],
      messages: ["Forbidden: you can only edit your own galleries."],
    });
  }

  if (isAdmin) {
    const allUsers = await User.find().sort({ username: 1 }).exec();
    return res.render("gallery_admin_update", {
      title: "Edit Gallery",
      gallery,
      users: allUsers
    });
  }

  res.render("gallery_update", {
    title: "Edit Gallery",
    gallery
  });
});

exports.galleryUpdatePost = [

  body("name")
    .trim()
    .isLength({ min: 2 })
    .escape()
    .withMessage("Name too short."),

  body("description")
    .trim()
    .escape(),

  body("date")
    .isISO8601()
    .toDate()
    .withMessage("Date cannot be empty."),

  body("user")
    .optional()
    .trim()
    .escape()
    .notEmpty()
    .withMessage("User cannot be empty."),


  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const galleryId = req.params.gallery_id;
    const currentUser = await User.findOne({ username: res.locals.loggedUser }).exec();

    if (!currentUser) {
      return res.render("gallery_list", {
        title: "List of Galleries",
        gallery_list: [],
        messages: ["Unauthorized: You must be logged in."],
      });
    }

    const originalGallery = await Gallery.findById(galleryId).populate("user").exec();
    const galleries = await Gallery.find({ user: currentUser._id }).populate("user").exec();

    if (!originalGallery) {
      return res.render("gallery_list", {
        title: "List of Galleries",
        gallery_list: galleries,
        messages: ["Gallery not found."],
      });
    }

    const isAdmin = currentUser.username === "admin";
    const isOwner = originalGallery.user && (originalGallery.user._id.toString() === currentUser._id.toString());

    if (!isAdmin && !isOwner) {
      return res.render("gallery_list", {
        title: "List of Galleries",
        gallery_list: [],
        messages: ["Forbidden: you can only edit your own galleries."],
      });
    }

    const updatedUserId = isAdmin ? req.body.user : originalGallery.user._id;

    const updatedGallery = new Gallery({
      _id: galleryId,
      name: req.body.name,
      description: req.body.description,
      date: req.body.date,
      user: updatedUserId,
    });

    if (!errors.isEmpty()) {
      const messages = errors.array().map((err) => err.msg);

      if (isAdmin) {
        const allUsers = await User.find().sort({ lastname: 1 }).exec();
        return res.render("gallery_admin_update", {
          title: "Edit Gallery",
          gallery: updatedGallery,
          users: allUsers,
          messages
        });
      }

      return res.render("gallery_update", {
        title: "Edit Gallery",
        gallery: updatedGallery,
        messages
      });
    }

    const duplicate = await Gallery.findOne({
      _id: { $ne: galleryId },
      name: req.body.name,
      user: updatedUserId,
    }).collation({ locale: "pl", strength: 2 }).exec();

    if (duplicate) {
      const messages = [`Gallery "${req.body.name}" already exists for this user.`];

      if (isAdmin) {
        const allUsers = await User.find().sort({ lastname: 1 }).exec();
        return res.render("gallery_admin_update", {
          title: "Edit Gallery",
          gallery: updatedGallery,
          users: allUsers,
          messages
        });
      }

      return res.render("gallery_update", {
        title: "Edit Gallery",
        gallery: updatedGallery,
        messages
      });
    }

    await Gallery.findByIdAndUpdate(galleryId, updatedGallery);
    res.redirect("/galleries/");
  }),
];
