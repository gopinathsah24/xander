var mongoose = require("mongoose");

var movieSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    auth_id: Number,
    address: String
});

module.exports = mongoose.model("Movie", movieSchema);
