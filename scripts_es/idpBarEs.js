// set the dimensions and marginIDPBs of the graph
const marginIDPB = {top: 80, right: 30, bottom: 50, left: 80},
    widthIDPB = 640 - marginIDPB.left - marginIDPB.right,
    heightIDPB = 450 - marginIDPB.top - marginIDPB.bottom;

// append the svg object to the body of the page
const svgIDPB = d3.select("#idpBar")
  .append("svg")
    .attr("width", widthIDPB + marginIDPB.left + marginIDPB.right)
    .attr("height", heightIDPB + marginIDPB.top + marginIDPB.bottom)
  .append("g")
    .attr("transform", `translate(${marginIDPB.left}, ${marginIDPB.top})`);

// Parse the Data
d3.csv("https://raw.githubusercontent.com/Insight-Crime/ic_datos/main/violencias_haiti/idpJSEs.csv").then( function(data) {

  // Add X axis
  const x = d3.scaleLinear()
    .domain([-110, 460])
    .range([0, widthIDPB]);
  svgIDPB.append("g")
    .attr("transform", `translate(0, ${heightIDPB})`)
    .attr('class', d => d == 0 ? 'x-axis-special' : 'x-axis-horizontal')
    .call(d3.axisBottom(x)
    .tickSizeInner(-heightIDPB)
    .tickSizeOuter(0)
    .ticks(10)
    .tickFormat(function(d) {
        return d + '%'
    })
    .tickPadding(10))

 svgIDPB.append("g")
    .attr('class', 'x-axis-special')
    .call(d3.axisTop(x)
    .tickSizeInner(-heightIDPB)
    .tickSizeOuter(0)
    .ticks(1))

  // Y axis
  const y = d3.scaleBand()
    .domain(data.map(d => d.name))
    .rangeRound([0, heightIDPB])
    .padding(0.1);
  svgIDPB.append("g")
    .attr('class', 'y-axis')
    .call(d3.axisLeft(y)
    .tickSizeInner(0))
    .selectAll('text')
    .data(data)
    //.enter()
    .style('fill', d => `${d.name == 'Haití' ? '#B31536' : '#B3B3B3'}`)
    

  //Bars
  svgIDPB.selectAll("myRect")
    .data(data)
    .join("rect")
    .attr('class', d => `bar ${ d.value < 0 ? 'negative': 'positive' }`)
    .attr("x", d =>  x(Math.min(0, d.value)))
    .attr("y", d => y(d.name))
    .attr("width", d => Math.abs(x(d.value) - x(0)))
    .attr("height", y.bandwidth())
    .attr("fill", "#69b3a2")

svgIDPB.append('text')
    .attr('class', 'plot-title')
    .attr('x', -80)
    .attr('y', -60)
    .text('Desplazados internos en América Latina')

svgIDPB.append('text')
    .attr('class', 'plot-subtitle')
    .attr('x', -80)
    .attr('y', -30)
    .text('Cambio porcentual entre 2021 y 2022')

// footer
svgIDPB.append("text") // source
.attr('class', 'sources')
.attr("x", -80)
.attr("y", 365)
.html("Fuente: <a href='https://www.internal-displacement.org/database/displacement-data' style='fill:#91273E; text-decoration: underline'>IDMC</a>")

svgIDPB.append("text") // IC logo
.attr('class', 'ic-logo')
.attr("x", 520)
.attr("y", 365)
.text('insightcrime.org')
})