
// set the dimensions and margins of the graph
const marginTLC = {top: 100, right: 30, bottom: 40, left: 60},
    widthTLC = 640 - marginTLC.left - marginTLC.right,
    heightTLC = 280 - marginTLC.top - marginTLC.bottom;

// append the svg object to the body of the page
const svgTLC = d3.select("#timelineCholera")
  .append("svg")
    .attr("width", widthTLC + marginTLC.left + marginTLC.right)
    .attr("height", heightTLC + marginTLC.top + marginTLC.bottom)
  .append("g")
    .attr("transform",`translate(${marginTLC.left},${marginTLC.top})`);

//Read the data
d3.csv("https://raw.githubusercontent.com/newton-c/haiti_crime_data/main/data/choleraTimeline.csv",

  // When reading the csv, I must format variables:
  d => {
      return {date : d3.timeParse("%Y-%m-%d")(d.date),
              value : d.value,
              dateText : d.dateText,
              description : d.description}}).then(

  // Now I can use this dataset:
  function(data) {

    // Add X axis --> it is a date format
    const x = d3.scaleTime()
      .domain(d3.extent(data, d => d.date))
      .range([ 0, widthTLC ]);
    svgTLC.append("g")
        .attr('class', 'x-axis-timeline')
      .attr("transform", `translate(0, ${heightTLC - 25})`)
      .call(d3.axisBottom(x)
      .tickSizeInner(0));

    // Add Y axis
    const y = d3.scaleLinear()
      .domain( [100, 100])
      .range([ heightTLC, 70 ]);
    svgTLC.append("g")
        .attr('class', 'y-axis-timeline')
      .call(d3.axisLeft(y)
      .tickSizeOuter(0));

    // Add the line
    svgTLC.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#3B3B3B")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(d => x(d.date))
        .y(d => y(d.value))
        )

    // create a tooltip
    const Tooltip = d3.select("#timelineCholera")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
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
          .html(d.dateText + ': ' + d.description)
          .style("left", `${event.layerX+10}px`)
          .style("top", `${event.layerY}px`)
          .attr('position', 'absolute')
      }
      const mouseleave = function(event,d) {
        Tooltip
          .style("opacity", 0)
      }

//add the highlights
svgTLC.append('rect')
    .attr('x', '0')
    .attr('y', '100')
    .attr('height', '10')
    .attr('width', '390')
    .attr('fill', '#B31536')
    .attr('opacity', '.5')

svgTLC.append('rect')
    .attr('x', '390')
    .attr('y', '100')
    .attr('height', '10')
    .attr('width', '130')
    .attr('fill', '#11269B')
    .attr('opacity', '.5')

// annotation lines
svgTLC.append('path')
    .attr("d", "M0,20L0,100")
    .attr('stroke', '#3B3B3B')
    .attr('stroke-width', '2.5')

svgTLC.append('path')
    .attr("d", "M510,20L510,100")
    .attr('stroke', '#3B3B3B')
    .attr('stroke-width', '2.5')

    // Add the points
    svgTLC
      .append("g")
      .selectAll("dot")
      .data(data)
      .join("circle")
        .attr("class", "myCircleCTL")
        .attr("cx", d => x(d.date))
        .attr("cy", d => y(d.value))
        .attr("r", 8)
        .attr("stroke", "#B31536")
        .attr("stroke-width", 3)
        .attr("fill", "#FAFAFA")
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)

  svgTLC.append('text')
      .attr('class', 'plot-title')
      .attr('x', '-40')
      .attr('y', '-80')
      .text('The History of Cholera in Haiti')

  svgTLC.append('text')
      .attr('class', 'interactive-note')
      .attr('x', '550')
      .attr('y', '-45')
      .attr('font-face', 'italic')
      .text('Hover over the circles')

  svgTLC.append('circle')
      .attr('cx', '395')
      .attr('cy', '-50')
      .attr('r', '8')
      .attr("stroke", "#B31536")
      .attr("stroke-width", 3)
      .attr("fill", "#FAFAFA")

      d3.line()([[-20, -60], [-20, 0]])
      

  svgTLC.append('rect')
      .attr('x', '-20')
      .attr('y', '-30')
      .attr('height', '60')
      .attr('width', '110')
      .attr('fill', '#C8D0DA')

  svgTLC.append('text')
      .attr('class', 'annotations')
      .attr('x', '-15')
      .attr('y', '-10')
      .text('Oct 20 2010:')

  svgTLC.append('text')
      .attr('class', 'annotations')
      .attr('x', '-15')
      .attr('y', '5')
      .text('Cholera outbreak')

  svgTLC.append('text')
      .attr('class', 'annotations')
      .attr('x', '-15')
      .attr('y', '20')
      .text('begins')


  svgTLC.append('rect')
      .attr('x', '440')
      .attr('y', '-30')
      .attr('height', '60')
      .attr('width', '135')
      .attr('fill', '#C8D0DA')

  svgTLC.append('text')
      .attr('class', 'annotations')
      .attr('x', '445')
      .attr('y', '-10')
      .text('Oct 2022:')

  svgTLC.append('text')
      .attr('class', 'annotations')
      .attr('x', '445')
      .attr('y', '5')
      .text('After 3 years another')

  svgTLC.append('text')
      .attr('class', 'annotations')
      .attr('x', '445')
      .attr('y', '20')
      .text('outbreak begins')
      
  svgTLC.append('text')
      .attr('class', 'annotations')
      .attr('x', '125')
      .attr('y', '90')
      .style('fill', '#B31536')
      .text("Haiti's first cholera outbreak")
     
   svgTLC.append('text')
      .attr('class', 'annotations')
      .attr('x', '400')
      .attr('y', '75')
      .style('fill', '#11269B')
      .text("No cases for")

   svgTLC.append('text')
      .attr('class', 'annotations')
      .attr('x', '400')
      .attr('y', '90')
      .style('fill', '#11269B')
      .text("three years")

    svgTLC.append("text") // source
      .attr('class', 'sources')
      .attr("x", -40)
      .attr("y", 155)
      .html("Source: Various Open Sources")
  
    svgTLC.append("text") // IC logo
        .attr('class', 'ic-logo')
        .attr("x", 540)
        .attr("y", 155)
        .text('insightcrime.org')
})