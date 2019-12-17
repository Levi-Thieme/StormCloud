const mongoose = require("mongoose");

let VideoSchema = new mongoose.Schema({
	title: String,
	filename: String,
	thumbnail: String
}, { collection: 'Videos'});

module.exports = mongoose.model("Videos", VideoSchema);