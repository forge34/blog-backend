const { default: mongoose } = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstname: { type: String },
  lastname: { type: String },
  username: { type: String, required: true },
  password: { type: String, required: true },
  membership: {
    type: String,
    required: true,
  },
});

UserSchema.virtual("fullname").get(function () {
  return `${this.firstname} ${this.lastname}`;
});

const userModel = mongoose.model("User", UserSchema);
module.exports = userModel;
