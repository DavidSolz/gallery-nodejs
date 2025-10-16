const gallery = require("../models/gallery");
const user = require("../models/user");
const image = require("../models/image");

const asyncHandler = require("express-async-handler");

exports.statsList = asyncHandler(async (req, res, next) => {
  const numUsers = await user.countDocuments({}).exec();
  const numGalleries = await gallery.countDocuments({}).exec();
  const numImages = await image.countDocuments({}).exec();
  res.render("stat_browse", {
    title: "Statistics",
    users: numUsers,
    galleries: numGalleries,
    images: numImages
  });
});
