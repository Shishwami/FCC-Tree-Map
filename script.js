const datasets = {
    video: "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json",
    kickstarter: "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json",
    movie: "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json"
};

const datasetKey = getQueryParam("data") || "video";
loadDataset(datasetKey);

const width = 1000;
const height = 600;
const padding = 60;

const svg = d3.select("#treemap")
    .attr("width", width)
    .attr("height", height);

const tooltip = d3.select("#tooltip");


function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    console.log(param);
    return urlParams.get(param);
}

function loadDataset(datasetKey) {
    const dataUrl = datasets[datasetKey];
    fetch(dataUrl)
        .then(response => response.json())
        .then(data => {
            console.log(data);

        });
}