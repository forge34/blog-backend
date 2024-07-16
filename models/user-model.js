const { default: mongoose } = require("mongoose");

const Schema = mongoose.Schema;

const roles = ["EDITOR", "ADMIN", "NORMAL"];
const UserSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    membership: {
        type: String,
    },
    role: {
        type: String,
        enum: roles,
        default: roles[2],
    },
});

UserSchema.virtual("fullname").get(function () {
    return `${this.firstname} ${this.lastname}`;
});

const userModel = mongoose.model("User", UserSchema);
module.exports = userModel;
