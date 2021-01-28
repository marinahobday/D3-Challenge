// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 500;

// Define the chart's margins as an object
var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

// Define dimensions of the chart areaF
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Select body, append SVG area to it, and set its dimensions
var svg = d3.select("body")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append a group area, then set its margins
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.select(".chart").append("div").attr("class","tooltip").style("opacity",0);

// Load data from data.csv
d3.csv("assets/data/data.csv").then(function(newsData) {

    // Parse Data/Cast as numbers
    // ==============================
    newsData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
    });

 // Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([8.5, d3.max(newsData, d => d.poverty)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(newsData, d => d.healthcare)])
      .range([height, 0]);

    // Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append Axes to the chart
    // ==============================
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    //  Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle").data(newsData).enter()
    circlesGroup
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "15")
    .attr("fill", "blue")
    .attr("opacity", ".5");

    circlesGroup.append("text").text(function(d){
      return d.abbr;
    })
    .attr("dx", d => xLinearScale(d.poverty))
    .attr("dy", d => yLinearScale(d.healthcare)+10/2.5)
    .attr("font-size", "9")
    .attr("class", "stateText")

    .on("mouseover", function(data) {
      toolTip.show(data, this);
    })
  .on("mouseout", function(data) {
      toolTip.hide(data, this);
    })

    // Initialize tool tip
    var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br>Poverty: ${d.poverty}<br>Healthcare: ${d.healthcare}`);
    });

    chartGroup.call(toolTip);

    // Create axes labels
    chartGroup.append("text")
     .attr("transform", "rotate(-90)")
     .attr("y", 0 - margin.left + 20)
     .attr("x", 0 - (height / 1.5))
     .attr("dy", "1em")
     .attr("class", "axisText")
     .text("Lacks Healthcare (%)");

   chartGroup.append("text")
     .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
     .attr("class", "axisText")
     .text("In Poverty (%)");
 }).catch(function(error) {
   console.log(error);
 });
