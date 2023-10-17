
// set the dimensions and margins of the graph
const marginTLC = {top: 100, right: 30, bottom: 70, left: 60},
    widthTLC = 640 - marginTLC.left - marginTLC.right,
    heightTLC = 450 - marginTLC.top - marginTLC.bottom;

// append the svg object to the body of the page
const svgTLC = d3.select("#timelineCholera")
  .append("svg")
    .attr("width", widthTLC + marginTLC.left + marginTLC.right)
    .attr("height", heightTLC + marginTLC.top + marginTLC.bottom)
  .append("g")
    .attr("transform",`translate(${marginTLC.left},${marginTLC.top})`);

const filterValues = ["October 20, 2010", "2011", "2012",
  "2013", "2014", "2015", "2016", "2017", "2018", "2019",
  "October 2022", "November 5, 2022", "April 2023",
  "June 13, 2023", "September 30, 2023"]

//Read the data
d3.csv("https://raw.githubusercontent.com/Insight-Crime/ic_datos/main/violencias_haiti/choleraTimelineRawEs.csv",

  // When reading the csv, I must format variables:
  d => {
      return {date : d3.timeParse("%Y-%m-%d")(d.date),
              value : d.value,
              dateText : d.dateText,
              description : d.description,
              yearlyCases : d.yearlyCases}}).then(

  // Now I can use this dataset:
  function(data) {

    // Add X axis --> it is a date format
    const x = d3.scaleTime()
      .domain(d3.extent(data, d => d.date))
      .range([ 0, widthTLC ]);
    svgTLC.append("g")
        .attr('class', 'x-axis-timeline')
      .attr("transform", `translate(0, ${heightTLC + 15})`)
      .call(d3.axisBottom(x)
      .tickSizeInner(0));
    
    // Add Y axis
    const y = d3.scaleLinear()
      .domain( [0, 280000])
      .range([ heightTLC, 0 ]);
    svgTLC.append("g")
        .attr('class', 'y-axis-timeline')
      .call(d3.axisLeft(y)
      .tickSizeOuter(0)
      .tickSizeInner(0));

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
      
    // add bars


    // create a tooltip
    const Tooltip = d3.select("#timelineCholera")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "2px")
      .style("padding", "5px")
      .style('width', '200px')
      

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
// Add bars
svgTLC.selectAll("mybar")
.data(data)
.join("rect")
  .attr("x", d => x(d.date) - 10)
  .attr("y", d => y(d.yearlyCases))
  .attr("width", 20)
  .attr("height", d => heightTLC - y(d.yearlyCases))
  .attr("fill", "#B31536")
    .attr('opacity', '.5')

//add the highlights
svgTLC.append('rect')
    .attr('x', '0')
    .attr('y', heightTLC - 5)
    .attr('height', '10')
    .attr('width', '390')
    .attr('fill', '#B31536')
    .attr('opacity', '.5')

svgTLC.append('rect')
    .attr('x', '390')
    .attr('y', heightTLC - 5)
    .attr('height', '10')
    .attr('width', '130')
    .attr('fill', '#11269B')
    .attr('opacity', '.5')

// annotation lines
svgTLC.append('path')
    .attr("d", "M0,150L0,280")
    .attr('stroke', '#3B3B3B')
    .attr('stroke-width', '2.5')

svgTLC.append('path')
    .attr("d", "M510,200L510,280")
    .attr('stroke', '#3B3B3B')
    .attr('stroke-width', '2.5')

    // Add the points
    svgTLC
      .append("g")
      .selectAll("dot")
      //.data(data)
      .data(data.filter(function(d,i){ return filterValues.indexOf(d.dateText) >= 0 }))
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
      .text('La historia del cólera en Haití')

  svgTLC.append('text')
      .attr('class', 'interactive-note')
      .attr('x', '550')
      .attr('y', '-45')
      .attr('font-face', 'italic')
      .text('Pase el cursor sobre los círculos')

  svgTLC.append('circle')
      .attr('cx', '325')
      .attr('cy', '-50')
      .attr('r', '8')
      .attr("stroke", "#B31536")
      .attr("stroke-width", 3)
      .attr("fill", "#FAFAFA")

  svgTLC.append('rect')
      .attr('x', '-20')
      .attr('y', '110')
      .attr('height', '60')
      .attr('width', '115')
      .attr('fill', '#C8D0DA')

  svgTLC.append('text')
      .attr('class', 'annotations')
      .attr('x', '-15')
      .attr('y', '130')
      .text('Octubre de 2010:')

  svgTLC.append('text')
      .attr('class', 'annotations')
      .attr('x', '-15')
      .attr('y', '145')
      .text('Comienza el brote')

  svgTLC.append('text')
      .attr('class', 'annotations')
      .attr('x', '-15')
      .attr('y', '160')
      .text('de cólera')


  svgTLC.append('rect')
      .attr('x', '440')
      .attr('y', '170')
      .attr('height', '60')
      .attr('width', '135')
      .attr('fill', '#C8D0DA')

  svgTLC.append('text')
      .attr('class', 'annotations')
      .attr('x', '445')
      .attr('y', '190')
      .text('Octubre de 2022:')

  svgTLC.append('text')
      .attr('class', 'annotations')
      .attr('x', '445')
      .attr('y', '205')
      .text('Después de 3 años')

  svgTLC.append('text')
      .attr('class', 'annotations')
      .attr('x', '445')
      .attr('y', '220')
      .text('comienza otro brote')
      
  svgTLC.append('text')
      .attr('class', 'annotations')
      .attr('x', '125')
      .attr('y', '230')
      .style('fill', '#B31536')
      .text("Primer brote de cólera en Haití")
     
   svgTLC.append('text')
      .attr('class', 'annotations')
      .attr('x', '400')
      .attr('y', '255')
      .style('fill', '#11269B')
      .text("Ningún caso")

   svgTLC.append('text')
      .attr('class', 'annotations')
      .attr('x', '400')
      .attr('y', '270')
      .style('fill', '#11269B')
      .text("durante tres años")

    svgTLC.append("text") // source
      .attr('class', 'sources')
      .attr("x", -40)
      .attr("y", heightTLC + 50)
      .html("Fuente: Diversas fuentes abiertas")
  
    svgTLC.append("text") // IC logo
        .attr('class', 'ic-logo')
        .attr("x", 540)
        .attr("y", heightTLC + 50)
        .text('insightcrime.org')
})