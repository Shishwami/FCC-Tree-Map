const datasets = {
    video: "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json",
    kickstarter: "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json",
    movie: "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json"
};

const datasetKey = getQueryParam("data") || "video";
loadDataset(datasetKey);

const width = 1200;
const height = 600;
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
    const dataUrl = datasets[datasetKey];
    fetch(dataUrl)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            createTreemap(data, datasetKey)
        });
}

function createTreemap(data, datasetName) {
    svg.selectAll("*").remove();
    legend.innerHTML = "";


    const hierarchy = d3.hierarchy(data)
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value);

    const treemapLayout = d3.treemap()
        .size([width, height])
        .padding(1);

    treemapLayout(hierarchy);

    const categories = [...new Set(hierarchy.leaves().map(d => d.data.category))];
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10).domain(categories);

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
            const limit = Math.floor(maxWidth/(fontSize/1.6));

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
        .attr("x", 0)
        .attr("y", (d, i) => 12 + i * 12)
        .text(d => d)
        .style("font-size", "12px")
        .style("fill", "white");

    categories.forEach(category => {
        const legendItem = document.createElement("div");
        legendItem.className = "legend-item";

        const colorBox = document.createElement("div");
        colorBox.className = "color-box";
        colorBox.style.backgroundColor = colorScale(category);
        colorBox.style.width = "20px";
        colorBox.style.height = "20px";
        colorBox.style.display = "inline-block";

        const labelText = document.createElement("span");
        labelText.textContent = category;
        labelText.style.marginLeft = "5px";

        legendItem.appendChild(colorBox);
        legendItem.appendChild(labelText);
        legend.appendChild(legendItem);
    });

}