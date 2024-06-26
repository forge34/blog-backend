const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    body: { type: String, required: true },
    author: { type: Schema.ObjectId, ref: "User" },
    postId: { type: Schema.ObjectId, ref: "Post" },
    comment_date: { type: Date, default: Date.now },
});

const CommentModel = mongoose.model("Comment", CommentSchema);

module.exports = CommentModel;
