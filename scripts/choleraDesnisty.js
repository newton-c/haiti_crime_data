// set the dimensions and margins of the graph
const marginCD = {top: 30, right: 30, bottom: 30, left: 50},
    widthCD = 460 - marginCD.left - marginCD.right,
    heightCD = 400 - marginCD.top - marginCD.bottom;

// append the svgCD object to the body of the page
const svgCD = d3.select("#choleraDensity")
  .append("svg")
    .attr("width", widthCD + marginCD.left + marginCD.right)
    .attr("height", heightCD + marginCD.top + marginCD.bottom)
  .append("g")
    .attr("transform", `translate(${marginCD.left},${marginCD.top})`);

// get the data
d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/iris.csv").then( function(data) {

  // List of groups (here I have one group per column)
  let allGroup = Array.from(new Set(data.map(d => d.Species)))//data.map(d=>d.Species)// new Map(data.map(function(d){return(d.Species)}))//.keys()

  // add the options to the button
  d3.select("#selectButton")
    .selectAll('myOptions')
    .data(allGroup)
    .enter()
    .append('option')
    .text(function (d) { return d; }) // text showed in the menu
    .attr("value", function (d) { return d; }) // corresponding value returned by the button

  // add the x Axis
  const x = d3.scaleLinear()
    .domain([0, 12])
    .range([0, widthCD]);
  svgCD.append("g")
      .attr('class', 'x-axis')
      .attr("transform", "translate(0," + heightCD + ")")
      .call(d3.axisBottom(x)
      .tickSizeInner(3)
      .tickSizeOuter(0)
      );

  // add the y Axis
  const y = d3.scaleLinear()
            .range([heightCD, 0])
            .domain([0, 0.4]);
  svgCD.append("g")
      .attr('class', 'y-axis')
      .call(d3.axisLeft(y)
      .tickSizeInner(-widthHL)
      .tickSizeOuter(0)
      );

  // Compute kernel density estimation for the first group called Setosa
  let kde = kernelDensityEstimator(kernelEpanechnikov(3), x.ticks(140))
  let density =  kde( data
    .filter(function(d){ return d.Species == "setosa"})
    .map(function(d){  return +d.Sepal_Length; })
  )

  // Plot the area
  const curve = svgCD
    .append('g')
    .append("path")
      .attr("class", "mypath")
      .datum(density)
      .attr("fill", "#69b3a2")
      .attr("opacity", ".8")
      .attr("stroke", "#000")
      .attr("stroke-width", 1)
      .attr("stroke-linejoin", "round")
      .attr("d",  d3.line()
        .curve(d3.curveBasis)
          .x(function(d) { return x(d[0]); })
          .y(function(d) { return y(d[1]); })
      );

  // A function that update the chart when slider is moved?
  function updateChart(selectedGroup) {
    // recompute density estimation
    kde = kernelDensityEstimator(kernelEpanechnikov(3), x.ticks(40))
    let density =  kde( data
      .filter(function(d){ return d.Species == selectedGroup})
      .map(function(d){  return +d.Sepal_Length; })
    )

    // update the chart
    curve
      .datum(density)
      .transition()
      .duration(1000)
      .attr("d",  d3.line()
        .curve(d3.curveBasis)
          .x(function(d) { return x(d[0]); })
          .y(function(d) { return y(d[1]); })
      );
  }

  // Listen to the slider?
  d3.select("#selectButton").on("change", function(d){
    selectedGroup = this.value
    updateChart(selectedGroup)
  })

});


// Function to compute density
function kernelDensityEstimator(kernel, X) {
  return function(V) {
    return X.map(function(x) {
      return [x, d3.mean(V, function(v) { return kernel(x - v); })];
    });
  };
}
function kernelEpanechnikov(k) {
  return function(v) {
    return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
  };
}