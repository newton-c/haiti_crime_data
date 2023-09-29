
      // set the dimensions and margins of the graph
      const margin = {top: 60, right: 30, bottom: 60, left: 60},
          width = 640 - margin.left - margin.right,
          height = 450 - margin.top - margin.bottom;
      
      // append the svg object to the body of the page
      const svg = d3.select("#hom_line")
        .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform",`translate(${margin.left},${margin.top})`);
      
      //Read the data
      d3.csv("https://raw.githubusercontent.com/newton-c/haiti_crime_data/main/data/hom_plot_data.csv",
      
        // When reading the csv, I must format variables:
        d => {
            return {date : d.year, value : d.count}}).then(
      
        // Now I can use this dataset:
        function(data) {
      
          // Add X axis --> it is a date format
          const x = d3.scaleLinear()
            .domain(d3.extent(data, d => d.date))
            .range([ 0, width ]);
          svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x)
            .tickSizeInner(3)
            .tickSizeOuter(0)
            .tickValues([2019, 2020, 2021, 2022])
            .ticks(4, "")); // format the numbers so there's no decimal or comma
      
          // Add Y axis
          const y = d3.scaleLinear()
            .domain([ 2200, 1])
            //.domain(d3.extent(data, d => d.value))
            .range([ 0, height ]);
          svg.append("g")
            .attr("class", "y-axis")
            .call(d3.axisLeft(y)
            .tickSizeInner(-width)
            .tickSizeOuter(0));
      
          // Add the line
          svg.append("path")
            .datum(data)
            .attr('class', 'myPath')
            .attr("fill", "none")
            .attr("d", d3.line()
              .x(d => x(d.date))
              .y(d => y(d.value))
              )
            svg.append('text')
              .attr('class', 'plot-title')
              .attr('y', '-30')
              .attr('x', '-40')
              .text('Homicides in Haiti')
          
            svg.append('text')
              .attr('class', 'interactive-note')
              .attr('x', '550')
              .attr('y', '-30')
              .text('Hover over the circles')
  
          svg.append('rect')
              .attr('x', '445')
              .attr('y', '115')
              .attr('height', '60')
              .attr('width', '90')
              .attr('fill', 'white')
  
          svg.append('text')
              .attr('class', 'annotations')
              .attr('x', '450')
              .attr('y', '130')
              .text('91% increase')
  
          svg.append('text')
              .attr('class', 'annotations')
              .attr('x', '450')
              .attr('y', '150')
              .text('in homicides')
  
          svg.append('text')
              .attr('class', 'annotations')
              .attr('x', '450')
              .attr('y', '170')
              .text('2019-2022')
  // footer
  svg.append("text") // source
      .attr('class', 'sources')
      .attr("x", -40)
      .attr("y", 380)
      .html("Source: <a href='https://www.unodc.org/documents/data-and-analysis/toc/Haiti_assessment_UNODC.pdf' style='fill:#91273E; text-decoration: underline'>UNODC</a>")
  
  svg.append("text") // IC logo
      .attr('class', 'ic-logo')
      .attr("x", 550)
      .attr("y", 380)
      .text('insightcrime.org')
      
          // create a tooltip
          const Tooltip = d3.select("#hom_line")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px")
            .style("width", "200px")
      
            // Three function that change the tooltip when user hover / move / leave a cell
            const mouseover = function(event,d) {
              Tooltip
                .style("opacity", 1)
            }
            const mousemove = function(event,d) {
              Tooltip
                .style("left", `${event.layerX+10}px`)
                .style("top", `${event.layerY}px`)
                .html("Homicides: " + d3.format(',')(d.value) + "<br>" +
                      "Year: " + d.date)
            }
            const mouseleave = function(event,d) {
              Tooltip
                .style("opacity", 0)
            }
      
      
      
          // Add the points
          svg
            .append("g")
            .selectAll("dot")
            .data(data)
            .join("circle")
              .attr("class", "myCircle")
              .attr("cx", d => x(d.date))
              .attr("cy", d => y(d.value))
              .attr("r", 4)
              .attr("stroke", "#3B3B3B")
              .attr("stroke-width", 3)
              .attr("fill", "#FAFAFA")
              .on("mouseover", mouseover)
              .on("mousemove", mousemove)
              .on("mouseleave", mouseleave)

        
      })

