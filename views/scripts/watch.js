window.onload = function (event) {
    let pathname = document.location.pathname;
    let paths = pathname.split("/").filter(path => path != "");
    if (paths.length > 1) {
        let videoName = paths[paths.length - 1];
        document.getElementById("player").src = "/video/" + videoName;
    }
}
    