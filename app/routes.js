const express = require("express");
const router = express.Router();
const viewController = require("./controllers/viewController.js");
const videoController = require("./controllers/videoController.js");
const imageController = require("./controllers/imageController.js");

//viewController routes
router.get("/", viewController.showIndex);
router.get("/index", viewController.showIndex);
router.get("/watch", viewController.showWatch);
router.get("/watch/*", viewController.showWatch);
router.get("/upload", viewController.showUpload);

//videoController routes
router.get("/videos", videoController.getVideos);
router.get("/video/:name", videoController.getVideo);
router.delete("/videos/:name", videoController.delete);
router.post("/videos/upload", videoController.upload);

//imageController routes
router.get("/images/:name", imageController.getImage);

module.exports = router;