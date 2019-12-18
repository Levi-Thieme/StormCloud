require("dotenv").config();
const path = require("path");
const fs = require("fs");
const formidable = require("formidable");
const Videos = require("../models/video.js");

const videosPath = process.env.videos_path;
const imagesPath = process.env.images_path;
const videoController = {};
const deletedVideos = new Array();

/*
Returns all video objects.
*/
videoController.getVideos = function (req, res) {
	Videos.find((error, videos) => {
		if (error) {
			res.status(500);
			res.send([]);
		}
		else {
			res.send(videos);
		}
	});
}

/*
Opens and pipes a stream to the requested video for
the specified start and end positions. 
*/
videoController.getVideo = function (req, res) {
	let videoName = "video.mp4";
	if (req.params.name) {
		videoName = req.params.name;
	}
	const filepath =  path.join(videosPath, videoName);
	fs.exists(filepath, (exists) => {
		if (exists) {
			const stat = fs.statSync(filepath)
			const fileSize = stat.size
			const range = req.headers.range
			if (range) {
				const parts = range.replace(/bytes=/, "").split("-");
				const start = parseInt(parts[0], 10);
				const end = parts[1] ? parseInt(parts[1], 10) : fileSize-1;
				const chunksize = (end-start)+1;
				const file = fs.createReadStream(filepath, {start, end});
				const head = {
					"Content-Range": `bytes ${start}-${end}/${fileSize}`,
					"Accept-Ranges": "bytes",
					"Content-Length": chunksize,
					"Content-Type": "video/mp4",
				}
				res.writeHead(206, head);
				file.pipe(res);
			} else {
				const head = {
					"Content-Length": fileSize,
					"Content-Type": "video/mp4",
				}
				res.writeHead(200, head)
				fs.createReadStream(filepath).pipe(res)
			}
		}
		else {
			res.status(404);
			res.end();
		}
	});
}

/*
Deletes the specified video file.
*/
videoController.delete = function (req, res) {
    const name = req.params.name;
    const videoPath = path.join(videosPath, name);
    fs.exists(videoPath, (exists) => {
		if (exists) {
            fs.unlink(path.join(videosPath, name), (error) => {
                if (error) {
                    res.send(error);
                }
                else {
                    deletedVideos.push(name);
                    res.send("Deleted: " + name);
                }
            });
        }
        else {
            res.send(name + " does not exist.");
        }
    });
}

/*
Stores and uploaded video to the videos directory.
*/
videoController.upload = function (req, res) {
	const form = new formidable.IncomingForm();
	form.maxFileSize = 4500 * 1024 * 1024;
	form.parse(req, (error, fields, files) => {
		if (error) {
			res.send(error);
		}
		else {
			const filename = files.uploadedVideo.name;
			const videoPath = files.uploadedVideo.path;
			const videoDestination = path.join(videosPath, filename)
			fs.rename(videoPath, videoDestination, function (error) {
				if (error) {
					res.send(error);
				}
				else {
					const thumbnailName = files.uploadedThumbnail.name;
					const thumbnailPath = files.uploadedThumbnail.path;
					const thumbnailDestination = path.join(imagesPath, thumbnailName);
					fs.rename(thumbnailPath, thumbnailDestination, function (error) {
						if (error) {
							res.send(error);
						}
						else {
							let video = new Videos({
								title: fields.title,
								filename: filename,
								thumbnail: thumbnailName
							});
							video.save((error, video) => {
								if (error) {
									res.send(error);
								}
								else {
									res.redirect("/");
								}
							});
						}
					});
				}
			});
		}
	});
}

module.exports = videoController;