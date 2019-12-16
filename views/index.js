/*
onload event handler
*/
window.onload = function (event) {
    getVideos((data) => {
        let videos = Array.from(JSON.parse(data)).sort();
        this.addVideos(videos);
        let selector = document.getElementById("videoSelector");
        if (selector.value) {
            this.loadVideo(selector.value);
        }
    });

    let selector = document.getElementById("videoSelector");
    selector.addEventListener("change", (event) => loadVideo(event.target.value));

    let refreshBtn = document.getElementById("refreshBtn");
    refreshBtn.addEventListener("click", refreshVideos);

    let deleteBtn = document.getElementById("deleteBtn");
    deleteBtn.addEventListener("click", (event) => {
        if (selector.value) {
            deleteVideo(selector.value, (data) => alert(data));
            refreshVideos();
        }
        else {
            alert("You must select a video to delete.");
        }
    })
}

/*
Refreshes the videos list.
*/
function refreshVideos() {
    getVideos((data) => {
        const selector = document.getElementById("videoSelector");
        while (selector.firstChild) {
            selector.removeChild(selector.firstChild);
        }
        addVideos(Array.from(JSON.parse(data)));
    });
}

/*
Appends each video to the options
*/
function addVideos(videos) {
    videos.forEach(video => {
        let option = document.createElement("OPTION");
        option.innerText = video;
        videoSelector.appendChild(option);
    });
}

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
Loads the specified video into the player.
*/
function loadVideo(videoName) {
    let player = document.getElementById("player");
    player.src = "/video/" + videoName;
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
