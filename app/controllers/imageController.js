const path = require("path");
const fs = require("fs");
require("dotenv").config();
const imagesPath = process.env.images_path;

const imageController = {};

/*
Sends the requested file.
*/
imageController.getImage = function (req, res) {
	const imagePath = path.join(imagesPath, req.params.name);
	if (fs.exists(imagePath, (exists) => {
		if (exists) {
			res.sendFile(imagePath);
		}
		else {
			res.status(404);
			res.end();
		}
	}));
}

module.exports = imageController;