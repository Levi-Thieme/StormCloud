/*
onload event handler
*/
window.onload = function (event) {
    getVideos((data) => {
        let videos = Array.from(JSON.parse(data)).sort();
        const container = document.getElementById("videoContainer");
        let currentRow = null;
        videos.forEach((video, index, array) => {
            if (index % 3 == 0) {
                currentRow = createVideoRow();
                container.appendChild(currentRow);
            }
            currentRow.appendChild(createVideoElement(video));
        })
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
Creates a row with content center justified.
*/
function createVideoRow() {
    let row = document.createElement("DIV");
    row.classList.add("row");
    row.classList.add("justify-content-center");
    return row;
}

/*
Creates a video card and returns it.
*/
function createVideoElement(video) {
    let card = document.createElement("DIV");
    card.classList.add("card");
    card.classList.add("col-sm-3");
    let header = document.createElement("DIV");
    header.classList.add("card-header");
    header.innerText = video.title;
    card.appendChild(header);
    let link = document.createElement("A");
    link.href = video.url;
    let thumbnail = document.createElement("IMG");
    thumbnail.classList.add("img-thumbnail");
    thumbnail.src = video.thumbnail;
    thumbnail.alt = "Thumbnail of the video.";
    link.appendChild(thumbnail);
    card.appendChild(link);
    let footer = document.createElement("DIV");
    footer.classList.add("card-footer");
    footer.innerText = video.uploader + " at " + video.uploadedAt;
    card.appendChild(footer);
    return card;
}
