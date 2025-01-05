const datasets = {
    video: {
        url: "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json",
        title: "Video Game Sales",
        description: "Top 100 Most Sold Video Games Grouped by Platform"
    },
    kickstarter: {
        url: "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json",
        title: "Kickstarter Pledges",
        description: "Top 100 Most Pledged Kickstarter Campaigns Grouped By Category"
    },
    movie: {
        url: "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json",
        title: "Movie Sales",
        description: "Top 100 Highest Grossing Movies Grouped By Genre"
    }
};

const datasetKey = getQueryParam("data") || "video";
loadDataset(datasetKey);

const width = 1200;
const height = 500;
const padding = 60;

const svg = d3.select("#main-svg")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

const tooltip = d3.select("#tooltip");

const legend = document.getElementById("legend");

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    console.log(param);
    return urlParams.get(param);
}

function loadDataset(datasetKey) {
    const dataUrl = datasets[datasetKey]["url"];
    fetch(dataUrl)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            createTreemap(data, datasetKey)
        });
}

function toPastel(color) {
    return d3.color(color).brighter(1).formatHex();
}

function createTreemap(data, datasetName) {
    svg.selectAll("*").remove();
    legend.innerHTML = "";

    const title = document.getElementById("title");
    title.innerHTML = datasets[datasetName]["title"]

    const description = document.getElementById("description");
    description.innerHTML = datasets[datasetName]["description"]

    const hierarchy = d3.hierarchy(data)
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value);

    const treemapLayout = d3.treemap()
        .size([width, height])

    treemapLayout(hierarchy);

    const categories = [...new Set(hierarchy.leaves().map(d => d.data.category))];
    const baseColors = d3.schemeCategory10;
    const pastelColors = baseColors.map(toPastel);
    const colorScale = d3.scaleOrdinal(pastelColors).domain(categories);

    const tiles = svg.selectAll("g")
        .data(hierarchy.leaves())
        .enter()
        .append("g")
        .attr("transform", d => `translate(${d.x0},${d.y0})`);

    tiles.append("rect")
        .attr("class", "tile")
        .attr("width", d => d.x1 - d.x0)
        .attr("height", d => d.y1 - d.y0)
        .attr("fill", d => colorScale(d.data.category))
        .attr("stroke", "darkgray")
        .attr("data-name", d => d.data.name)
        .attr("data-category", d => d.data.category)
        .attr("data-value", d => d.data.value)
        .on("mouseover", (event, d) => {
            tooltip.style("visibility", "visible")
                .attr("data-value", d.data.value)
                .html(`Name: ${d.data.name}<br>Category: ${d.data.category}<br>Value: ${d.data.value}`)
                .style("left", `${event.pageX + 10}px`)
                .style("top", `${event.pageY - 20}px`);
        })
        .on("mouseout", () => {
            tooltip.style("visibility", "hidden");
        });

    const fontSize = 12;

    tiles.append("text")
        .attr("class", "tile-text")
        .selectAll("tspan")
        .data(d => {
            const name = d.data.name.split(' ');
            const maxWidth = d.x1 - d.x0;
            const limit = Math.floor(maxWidth / (fontSize / 1.6));

            const lines = [];
            let line = [];
            name.forEach(word => {
                if ((line.join(' ').length + word.length) <= limit) {
                    line.push(word);
                } else {
                    lines.push(line.join(' '));
                    line = [word];
                }
            });
            lines.push(line.join(' '));
            return lines;
        })
        .enter()
        .append("tspan")
        .attr("x", 3)
        .attr("y", (d, i) => 12 + i * 12)
        .text(d => d)
        .style("font-size", "10px")

    const legendSvg = d3.select("#legend")
        .append("svg")
        .attr("width", 420)
        .attr("height", Math.ceil(categories.length / 3) * 30);

    const legendGroup = legendSvg.selectAll("g")
        .data(categories)
        .enter()
        .append("g")
        .attr("transform", (d, i) => `translate(${i % 3 * 150}, ${Math.floor(i / 3) * 30})`);

    legendGroup.append("rect")
        .attr("class", "legend-item")
        .attr("width", 20)
        .attr("height", 20)
        .attr("fill", d => colorScale(d));

    legendGroup.append("text")
        .attr("x", 25)
        .attr("y", 15)
        .text(d => d)
        .style("font-size", "14px");

}