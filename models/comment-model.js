const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    body: { type: String, required: true },
    author: { type: Schema.ObjectId,ref:"User" },
    comment_data: { type: Date, default: Date.now },
});

const CommentModel = mongoose.model("Comment", CommentSchema);

module.exports = CommentModel;
