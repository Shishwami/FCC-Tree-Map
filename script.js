const datasets = {
    video: "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json",
    kickstarter: "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json",
    movie: "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json"
};

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    console.log(param);
    
    return urlParams.get(param);
}

const datasetKey = getQueryParam("data") || "video";

