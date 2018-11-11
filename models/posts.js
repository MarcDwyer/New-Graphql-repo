const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  username: String,
  userid: String,
  title: String,
  body: String,
  comments: Array,
  date: String
});

module.exports = mongoose.model('Post', postSchema);
