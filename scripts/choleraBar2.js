// set the dimensions and margins of the graph
const marginCB = {top: 80, right: 30, bottom: 70, left: 60},
    widthCB = 640 - marginCB.left - marginCB.right,
    heightCB = 450 - marginCB.top - marginCB.bottom;

// append the svgCB object to the body of the page
const svgCB = d3.select("#choleraBar")
  .append("svg")
    .attr("width", widthCB + marginCB.left + marginCB.right)
    .attr("height", heightCB + marginCB.top + marginCB.bottom)
  .append("g")
    .attr("transform", `translate(${marginCB.left},${marginCB.top})`);

// Initialize the Y axis
const y = d3.scaleLinear()
  .range([ heightCB, 0]);
const yAxis = svgCB.append("g")
  .attr("class", "y-axis")

// Initialize the X axis
const x = d3.scaleBand()
  .range([ 0, widthCB ])
  .padding(0.2);
const xAxis = svgCB.append("g")
  .attr('class', 'x-axis')
  .attr("transform", `translate(0,${heightCB})`);

// A function that create / update the plot for a given variable:
d3.csv("https://raw.githubusercontent.com/newton-c/haiti_crime_data/main/data/cholera_suspected.csv").then( function(data) {

    // X axis
    x.domain(data.map(d => d.Age));
    xAxis.transition()
        .duration(1000)
        .call(d3.axisBottom(x)
        .tickSizeOuter(0));

    // Add Y axis
    y.domain([0, d3.max(data, d => +d.Total) ]);
    yAxis.transition()
        .duration(1000)
        .call(d3.axisLeft(y)
        .tickSizeInner(-widthCB)
        .tickSizeOuter(0));
        
    // create a tooltip
    const TooltipCB = d3.select("#choleraBar")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "0px")
        .style("padding", "5px");

    // Three function that change the tooltip when user hover / move / leave a cell
    const mouseover = function(event,d) {
      TooltipCB
        .style("opacity", 1)
    }
    const mousemove = function(event,d) {
      TooltipCB
        .style("left", `${event.layerX+10}px`)
        .style("top", `${event.layerY}px`)
        .html("IDPs: ")
    }
    const mouseleave = function(event,d) {
      TooltipCB
        .style("opacity", 0)
    }


//    svgCB.append('text')
//        .attr('class', 'interactive-note')
//        .attr('x', '546')
//        .attr('y', '-10')
//        .attr('font-face', 'italic')
//        .text('Click the buttons to change demographics')

    svgCB.append('text')
        .attr('class', 'x-axis-title')
        .attr('x', widthCB / 2)
        .attr('y', heightCB + 40)
        .text('Age Group')

    svgCB.append('text')
        .attr('class', 'plot-title')
        .attr('x', '-40')
        .attr('y', '-60')
        .text('Suspected Cholera Cases in Haiti')

    svgCB.append('text')
        .attr('class', 'plot-subtitle')
        .attr('x', '-40')
        .attr('y', '-35')
        .text('Total cases from the 2022 outbreak until September 30, 2023')
    
    svgCB.append("text") // source
        .attr('class', 'sources')
        .attr("x", -40)
        .attr("y", heightCB + 60)
        .html("Sources: <a href='https://shiny.pahobra.org/cholera/' style='fill: #90273E; text-decoration: underline;'>PAHO/WHO</a>")
    
    svgCB.append("text") // IC logo
        .attr('class', 'ic-logo')
        .attr("x", 550)
        .attr("y", heightCB + 60)
        .text('insightcrime.org')

    
    svgCB.append('g')
        .selectAll("rect")
        .data(data)
        .join("rect")
        .transition()
        .duration(1000)
          .attr("x", d => x(d.Age))
          .attr("y", d => y(d.Total))
          .attr("width", x.bandwidth())
          .attr("height", d => heightCB - y(d.Total))
          .attr("fill", "#B31536")
          .on("mouseover", mouseover)
          .on("mousemove", mousemove)
          .on("mouseleave", mouseleave)
  });