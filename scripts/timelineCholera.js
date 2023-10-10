
// set the dimensions and margins of the graph
const marginTLC = {top: 10, right: 30, bottom: 30, left: 60},
    widthTLC = 460 - marginTLC.left - marginTLC.right,
    heightTLC = 400 - marginTLC.top - marginTLC.bottom;

// append the svg object to the body of the page
const svgTLC = d3.select("#timelineCholera")
  .append("svg")
    .attr("width", widthTLC + marginTLC.left + marginTLC.right)
    .attr("height", heightTLC + marginTLC.top + marginTLC.bottom)
  .append("g")
    .attr("transform",`translate(${marginTLC.left},${marginTLC.top})`);

//Read the data
d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/connectedscatter.csv",

  // When reading the csv, I must format variables:
  d => {
      return {date : d3.timeParse("%Y-%m-%d")(d.date), value : d.value}}).then(

  // Now I can use this dataset:
  function(data) {

    // Add X axis --> it is a date format
    const x = d3.scaleTime()
      .domain(d3.extent(data, d => d.date))
      .range([ 0, widthTLC ]);
    svgTLC.append("g")
      .attr("transform", `translate(0, ${heightTLC})`)
      .call(d3.axisBottom(x));

    // Add Y axis
    const y = d3.scaleLinear()
      .domain( [8000, 9200])
      .range([ heightTLC, 0 ]);
    svgTLC.append("g")
      .call(d3.axisLeft(y));

    // Add the line
    svgTLC.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .curve(d3.curveBasis) // Just add that to have a curve instead of segments
        .x(d => x(d.date))
        .y(d => y(d.value))
        )

    // create a tooltip
    const Tooltip = d3.select("#timelineCholera")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltipTLC")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "2px")
      .style("border-radius", "5px")
      .style("padding", "5px")

      // Three function that change the tooltip when user hover / move / leave a cell
      const mouseover = function(event,d) {
        Tooltip
          .style("opacity", 1)
      }
      const mousemove = function(event,d) {
        Tooltip
          .html("Exact value: " + d.value)
          .style("left", `${event.layerX+10}px`)
          .style("top", `${event.layerY}px`)
      }
      const mouseleave = function(event,d) {
        Tooltip
          .style("opacity", 0)
      }



    // Add the points
    svgTLC
      .append("g")
      .selectAll("dot")
      .data(data)
      .join("circle")
        .attr("class", "myCircleTLC")
        .attr("cx", d => x(d.date))
        .attr("cy", d => y(d.value))
        .attr("r", 8)
        .attr("stroke", "#69b3a2")
        .attr("stroke-width", 3)
        .attr("fill", "white")
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
})