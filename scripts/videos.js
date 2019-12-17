/*
Gets a list of the video files stored on the server.
*/
function getVideos(callback) {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            callback(xhttp.responseText);
        }
    };
    xhttp.open("GET", "videos", true);
    xhttp.send();
}

/*
Sends a request to delete a given video.
*/
function deleteVideo(videoName, callback) {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            callback(xhttp.responseText);
        }
    };
    xhttp.open("DELETE", "/videos/" + videoName, true);
    xhttp.send();
}