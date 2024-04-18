const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PostSchema = new Schema({
    title: { type: String, required: true },
    body: { type: String, required: true },
    author: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    isPublished: {
        type: Boolean,
        requird: true,
    },
});

const PostModel = mongoose.model("Post", PostSchema);

module.exports = PostModel;
