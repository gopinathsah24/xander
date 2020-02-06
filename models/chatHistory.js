const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var chatHistorySchema = new Schema({
  room: String,
  handler: String,
  text: String,
  index: Number
});

module.exports = mongoose.model('chatHistory',chatHistorySchema);
