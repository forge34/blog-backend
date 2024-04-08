const mongoose = require("mongoose")


const Schema = mongoose.Schema

const PostSchema = new Schema({
  title:{type:String , required: true}, 
  body:{type:String , required:true},
  author:{
    type:mongoose.Schema.ObjectId,
    ref:"User"
  },
  isPublished:{
    type:Boolean,
    required:true
  }
})
PostModel = mongoose.model("Post" , PostSchema)
module.exports = PostModel
