
      // set the dimensions and margins of the graph
      const marginKL = {top: 80, right: 30, bottom: 60, left: 60},
          widthKL = 640 - marginKL.left - marginKL.right,
          heightKL = 470 - marginKL.top - marginKL.bottom;
      
      // append the svg object to the body of the page
      const svgKL = d3.select("#kidnapLine")
        .append("svg")
          .attr("width", widthKL + marginKL.left + marginKL.right)
          .attr("height", heightKL + marginKL.top + marginKL.bottom)
        .append("g")
          .attr("transform",`translate(${marginKL.left},${marginKL.top})`);
      
      //Read the data
      d3.csv("https://raw.githubusercontent.com/newton-c/haiti_crime_data/main/data/kd_plot_data.csv",
      
        // When reading the csv, I must format variables:
        d => {
            return {date : d.year, value : d.count}}).then(
      
        // Now I can use this dataset:
        function(data) {
      
          // Add X axis --> it is a date format
          const x = d3.scaleLinear()
            .domain(d3.extent(data, d => d.date))
            .range([ 0, widthKL ]);
          svgKL.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0, ${heightKL})`)
            .call(d3.axisBottom(x)
            .tickSizeInner(3)
            .tickSizeOuter(0)
            .tickValues([2019, 2020, 2021, 2022])
            .ticks(4, "")); // format the numbers so there's no decimal or comma
      
          // Add Y axis
          const y = d3.scaleLinear()
            .domain([ 1400, 1])
            //.domain(d3.extent(data, d => d.value))
            .range([ 0, heightKL]);
          svgKL.append("g")
            .attr("class", "y-axis")
            .call(d3.axisLeft(y)
            .tickSizeInner(-widthKL)
            .tickSizeOuter(0));
      
          // Add the line
          svgKL.append("path")
            .datum(data)
            .attr('class', 'myPath')
            .attr("fill", "none")
            .attr("d", d3.line()
              .x(d => x(d.date))
              .y(d => y(d.value))
              )
              svgKL.append('text')
              .attr('class', 'plot-title')
              .attr('y', '-60')
              .attr('x', '-40')
              .text('Kidnappings in Haiti')
  
          svgKL.append('rect')
              .attr('x', '445')
              .attr('y', '115')
              .attr('height', '60')
              .attr('width', '101')
              .attr('fill', '#C8D0DA')
  
          svgKL.append('text')
              .attr('class', 'annotations')
              .attr('x', '450')
              .attr('y', '130')
              .text('1642% increase')
  
          svgKL.append('text')
              .attr('class', 'annotations')
              .attr('x', '450')
              .attr('y', '150')
              .text('in kidnappings')
  
          svgKL.append('text')
              .attr('class', 'annotations')
              .attr('x', '450')
              .attr('y', '170')
              .text('2019-2022')

        svgKL.append('text')
            .attr('class', 'interactive-note')
            .attr('x', '550')
            .attr('y', '-20')
            .text('Hover over the circles')

          svgKL.append('circle')
            .attr('cx', '405')
            .attr('cy', '-25')
            .attr('r', '4')
            .attr("stroke", "#11269B")
            .attr("stroke-width", 3)
            .attr("fill", "#FAFAFA")

  // footer
  svgKL.append("text") // source
      .attr('class', 'sources')
      .attr("x", -40)
      .attr("y", 380)
      .html("Source: <a href='https://www.unodc.org/documents/data-and-analysis/toc/Haiti_assessment_UNODC.pdf' style='fill:#91273E; text-decoration: underline'>UNODC</a>")
  
  svgKL.append("text") // IC logo
      .attr('class', 'ic-logo')
      .attr("x", 550)
      .attr("y", 380)
      .text('insightcrime.org')
      
          // create a tooltip
          const Tooltip = d3.select("#kidnapLine")
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
                d3.select(this)
                  .style("stroke-width", 4)
                  .style("r", 6)
            }
            const mousemove = function(event,d) {
              Tooltip
                .style("left", `${event.layerX+10}px`)
                .style("top", `${event.layerY}px`)
                .html("Kidnappings: " + d3.format(',')(d.value) + "<br>" +
                      "Year: " + d.date)
            }
            const mouseleave = function(event,d) {
              Tooltip
                .style("opacity", 0)
              d3.select(this)
                .style("stroke-width", 3)
                .style("r", 4)
            }
      
      
      
          // Add the points
          svgKL
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

