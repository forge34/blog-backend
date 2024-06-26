const { default: mongoose } = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    membership: {
        type: String,
    },
    role: {
        type: String,
        enum: ["EDITOR", "ADMIN", "NORMAL"],
        default: "NOMRAL",
    },
});

UserSchema.virtual("fullname").get(function () {
    return `${this.firstname} ${this.lastname}`;
});

const userModel = mongoose.model("User", UserSchema);
module.exports = userModel;
