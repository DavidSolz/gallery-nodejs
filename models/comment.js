const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    image: { type: Schema.Types.ObjectId, ref: "Image", required: true },
    gallery: {type: Schema.Types.ObjectId, ref: "Gallery", required: true},
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, maxLength: 250, required: true },
    createdAt: { type: Date, default: Date.now },
}, { collection: 'comments' });

module.exports = mongoose.model("Comment", CommentSchema);

