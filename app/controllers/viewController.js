const path = require("path");
const viewController = {};

/*
Sends the index.html file.
*/
viewController.showIndex = function (req, res) {
    res.sendFile(path.join(__dirname, "../../views/html/index.html"));
}

/*
Sends the watch.html file.
*/
viewController.showWatch = function (req, res) {
    res.sendFile(path.join(__dirname, "../../views/html/watch.html"));
}

module.exports = viewController;