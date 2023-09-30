    
    // set the dimensions and margins of the graph
    const marginHC = {top: 80, right: 30, bottom: 60, left: 30},
          width2 = 640 - marginHC.left - marginHC.right,
          height2 = 800 - marginHC.top - marginHC.bottom;
    //const width2 = 640
   // const height2 = 450
    
    // append the svg2 object to the body of the page
    const svgHC = d3.select("#idp_circles")
      .append("svg")
        .attr("width", width2)
        .attr("height", height2)
    
    // Read data
    d3.csv("https://raw.githubusercontent.com/newton-c/haiti_crime_data/main/data/idpJS.csv").then( function(data) {
    
      // Filter a bit the data -> more than 1 million inhabitants
     // data = data.filter(function(d){ return d.value>10000000 })
    
      // Color palette for continents?
      const color = d3.scaleLinear()
        .domain([0, 26])
        .range(['white', '#AA0100']);
    
      // Size scale for countries
      const size = d3.scaleLinear()
        .domain([0, 40])
        .range([7,100])  // circle will be between 7 and 55 px wide
    
      // create a tooltip
      const TooltipHC = d3.select("#idp_circles")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width2", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")
    
      // Three function that change the tooltip when user hover / move / leave a cell
      const mouseover = function(event, d) {
        TooltipHC
          .style("opacity", 1)
      }
      const mousemove = function(event, d) {
        TooltipHC
            .style("left", `${event.layerX+10}px`)
            .style("top", `${event.layerY}px`)
            .html('<u>' + d.name + '</u>' + "<br>" + d3.format(".2r")(d.value) + "%")
      }
      var mouseleave = function(event, d) {
        TooltipHC
          .style("opacity", 0)
      }
    
      // Initialize the circle: all located at the center of the svg2 area
      var node = svgHC.append("g")
        .selectAll("circle")
        .data(data)
        .join("circle")
          .attr("class", "node")
          .attr("r", d => size(Math.abs(d.value)/7))
          .attr("cx", width2 / 2)
          .attr("cy", height2 / 2)
          .style("fill", function(d) {
             if(d.value > 0) {
            return "#B31536"
            } else {
                return "#11269B"
            }})
          .style("fill-opacity", 1)
          .attr("stroke", "black")
          .style("stroke-width2", 1)
          .on("mouseover", mouseover) // What to do when hovered
          .on("mousemove", mousemove)
          .on("mouseleave", mouseleave)
          .call(d3.drag() // call specific function when circle is dragged
               .on("start", dragstarted)
               .on("drag", dragged)
               .on("end", dragended));
    
      // Features of the forces applied to the nodes:
      const simulation = d3.forceSimulation()
          .force("center", d3.forceCenter()
            .x(width2 / 2).y(height2 / 2)) // Attraction to the center of the svg2 area
          .force("charge", d3.forceManyBody()
            .strength(.1)) // Nodes are attracted one each other of value is > 0
          .force("collide", d3.forceCollide()
            .strength(.2)
            .radius(function(d){ return (size(Math.abs(d.value)/7)+1) })
            .iterations(1)) // Force that avoids circle overlapping
    
      // Apply these forces to the nodes and update their positions.
      // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
      simulation
          .nodes(data)
          .on("tick", function(d){
            node
                .attr("cx", d => d.x)
                .attr("cy", d => d.y)
          });
    
      // What happens when a circle is dragged?
      function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(.03).restart();
        d.fx = d.x;
        d.fy = d.y;
      }
      function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
      }
      function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(.03);
        d.fx = null;
        d.fy = null;
      }
    
//tite
svgHC.append('text')
    .attr('class', 'plot-title')
    .attr('x', 0)
    .attr('y', 20)
    .text('Change in Internally Displaced')

svgHC.append('text')
    .attr('class', 'plot-title')
    .attr('x', 0)
    .attr('y', 50)
    .text('People in Latin America')

svgHC.append('text')
    .attr('class', 'plot-subtitle')
    .attr('x', 0)
    .attr('y', 80)
    .text('2021-2022')

  svgHC.append('text')
    .attr('class', 'interactive-note')
    .attr('x', '550')
    .attr('y', '20')
    .text('Hover over the circles')
// footer
  svgHC.append("text") // source
  .attr('class', 'sources')
  .attr("x", 0)
  .attr("y", 590)
  .html("Source: <a href='https://www.internal-displacement.org/database/displacement-data' style='fill:#91273E; text-decoration: underline'>IDMC</a>")

svgHC.append("text") // IC logo
  .attr('class', 'ic-logo')
  .attr("x", 550)
  .attr("y", 590)
  .text('insightcrime.org')
    })