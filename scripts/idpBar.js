// set the dimensions and margins of the graph
const margin = {top: 80, right: 30, bottom: 50, left: 90},
    width = 640 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#idpBar")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Parse the Data
d3.csv("https://raw.githubusercontent.com/newton-c/haiti_crime_data/main/data/idpJS.csv").then( function(data) {

  // Add X axis
  const x = d3.scaleLinear()
    .domain([-110, 460])
    .range([0, width]);
  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .attr('class', 'x-axis')
    .call(d3.axisBottom(x)
    .tickSizeOuter(0)
    .ticks(10)
    .tickFormat(function(d) {
        return d + '%'
    }))


  // Y axis
  const y = d3.scaleBand()
    .domain(data.map(d => d.name))
    .rangeRound([0, height])
    .padding(0.1);
  svg.append("g")
    .attr('class', 'y-axis')
    .call(d3.axisLeft(y)
    .tickSizeInner(0))
    .selectAll('text')
    .data(data)
    //.enter()
    .style('fill', d => `${d.name == 'Haiti' ? '#B31536' : '#B3B3B3'}`)
    

  //Bars
  svg.selectAll("myRect")
    .data(data)
    .join("rect")
    .attr('class', d => `bar ${ d.value < 0 ? 'negative': 'positive' }`)
    .attr("x", d =>  x(Math.min(0, d.value)))
    .attr("y", d => y(d.name))
    .attr("width", d => Math.abs(x(d.value) - x(0)))
    .attr("height", y.bandwidth())
    .attr("fill", "#69b3a2")
  
svg.append('line')
    .attr('x1', d => x(0))
    .attr('y1', '0')
    .attr('x2', d => x(0))
    .attr('y2', 325)
    .attr("stroke", '#3b3b3b')
    .attr('stroke-width', 2)

svg.append('text')
    .attr('class', 'plot-title')
    .attr('x', -40)
    .attr('y', -60)
    .text('Internally Displaced People in Latin America')

svg.append('text')
    .attr('class', 'plot-subtitle')
    .attr('x', -40)
    .attr('y', -30)
    .text('Percent change from 2021 to 2022')

// footer
svg.append("text") // source
.attr('class', 'sources')
.attr("x", -40)
.attr("y", 365)
.html("Source: <a href='https://www.internal-displacement.org/database/displacement-data' style='fill:#91273E; text-decoration: underline'>IDMC</a>")

svg.append("text") // IC logo
.attr('class', 'ic-logo')
.attr("x", 520)
.attr("y", 365)
.text('insightcrime.org')
})