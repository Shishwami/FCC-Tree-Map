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

const svg = d3.select("#main-svg")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

const tooltip = d3.select("#tooltip");

const legend = d3.select("legend");

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
            createTreemap(data,datasetKey)
        });
}

function createTreemap(data, datasetName) {
    svg.selectAll("*").remove();
    legend.html("");


    const hierarchy = d3.hierarchy(data)
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value);

    const treemapLayout = d3.treemap()
        .size([width, height])
        .padding(1);

    treemapLayout(hierarchy);

    const categories = [...new Set(hierarchy.leaves().map(d => d.data.category))];
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10).domain(categories);

    svg.selectAll("rect")
        .data(hierarchy.leaves())
        .enter()
        .append("rect")
        .attr("class", "tile")
        .attr("x", d => d.x0)
        .attr("y", d => d.y0)
        .attr("width", d => d.x1 - d.x0)
        .attr("height", d => d.y1 - d.y0)
        .attr("fill", d => colorScale(d.data.category))
        .attr("data-name", d => d.data.name)
        .attr("data-category", d => d.data.category)
        .attr("data-value", d => d.data.value)

        
}