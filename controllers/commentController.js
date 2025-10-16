const Comment = require('../models/comment');
const User = require('../models/user');

const asyncHandler = require("express-async-handler");

exports.commentAddPost = asyncHandler(async (req, res, next) => {

    try {
        const { imageId, galleryId, content } = req.body;

        if (!content || !imageId || !galleryId) {
            return res.status(400).render('error', { message: 'Missing required fields.' });
        }

        const currentUser = await User.findOne({ username: res.locals.loggedUser }).exec();

        if (!currentUser) {
            return res.render("index", {
                title: 'Gallery App',
                messages: ["Unauthorized: You must be logged in."]
            });
        }

        const newComment = new Comment({
            image: imageId,
            gallery: galleryId,
            author: currentUser._id,
            content
        });

        await newComment.save();
        res.redirect(`/images/image_show?image_id=${imageId}`);
    } catch (err) {
        res.status(500).send('Server error.');
    }
});

exports.commentDeletePost = async (req, res) => {
    try {
        const commentId = req.params.comment_id;
        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).send("Comment not found");
        }

        await Comment.findByIdAndDelete(commentId);

        res.redirect(`/images/image_show?image_id=${comment.image}`);
    } catch (err) {
        res.status(500).send("Error deleting comment");
    }
};

exports.commentEditGet = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.comment_id).populate("author").exec();

        if (!comment) {
            return res.status(404).send("Comment not found");
        }

        res.render('comment_edit', {
            title: 'Edit comment',
            comment
        });
    } catch (err) {
        res.status(500).send("Error loading comment");
    }
};

exports.commentEditPost = async (req, res) => {
    try {
        const { content } = req.body;
        const comment = await Comment.findById(req.params.comment_id).populate("author").exec();

        if (!comment) {
            return res.status(404).send("Comment not found");
        }

        comment.content = content;
        await comment.save();
        res.redirect(`/images/image_show?image_id=${comment.image}`);
    } catch (err) {
        res.status(500).send("Error updating comment");
    }
};
