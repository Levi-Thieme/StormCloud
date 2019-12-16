const path = require("path");
const fs = require("fs");
const express = require("express");
const app = express();
const env = require("dotenv").config();
const formidable = require("formidable");

/*
Stores the names of deleted videos because when a user deletes a video,
it will not actually be deleted from the file system if a process has a handle
to it. The file is deleted after all processes have released their handles to it.
*/
const deletedVideos = new Array();

app.use(express.static("./views"));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views/index.html"));
});

app.get("/video/:name", (req, res) => {
  let videoName = "video.mp4";
  if (req.params.name) {
    videoName = req.params.name;
  }
  const filepath =  path.join(__dirname, process.env.videos_path, videoName);
  fs.exists(filepath, (exists) => {
    if (exists) {
      const stat = fs.statSync(filepath)
      const fileSize = stat.size
      const range = req.headers.range
      if (range) {
        const parts = range.replace(/bytes=/, "").split("-")
        const start = parseInt(parts[0], 10)
        const end = parts[1] 
          ? parseInt(parts[1], 10)
          : fileSize-1
        const chunksize = (end-start)+1
        const file = fs.createReadStream(filepath, {start, end})
        const head = {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize,
          'Content-Type': 'video/mp4',
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
  })
});

app.get("/videos", (req, res) => {
  let videoDirectory = path.join(__dirname, process.env.videos_path);
  fs.readdir(videoDirectory, (error, files) => {
    if (error) {
      res.send(error);
    }
    else {
      files = files.filter(file => !deletedVideos.includes(file));
      res.send(files);
    }
  });
});

app.post("/videos/upload", (req, res) => {
  const form = new formidable.IncomingForm();
  form.parse(req, (error, fields, files) => {
    if (error) {
      res.send(error);
    }
    else {
      const t = "";
      const oldpath = files.uploadedVideo.path;
      const newpath = path.join(__dirname, process.env.videos_path, files.uploadedVideo.name)
      fs.rename(oldpath, newpath, function (error) {
        if (error) {
          res.send(error);
        }
        else {
          res.redirect("/");
        }
      });
    }
  })
});

app.delete("/videos/:name", (req, res) => {
  const name = req.params.name;
  const videoPath = path.join(__dirname, process.env.videos_path, name);
  fs.exists(videoPath, (exists) => {
    if (exists) {
      fs.unlink(path.join(__dirname, process.env.videos_path, name), (error) => {
        if (error) {
          res.send(error);
        }
        else {
          deletedVideos.push(name);
          res.send("Deleted: " + name);
        }
      })
    }
    else {
      res.send(name + " does not exist.");
    }
  })
});

app.listen(8080);