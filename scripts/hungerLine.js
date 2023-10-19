      // set the dimensions and margins of the graph
      const marginHL = {top: 60, right: 30, bottom: 60, left: 65},
          widthHL = 640 - marginHL.left - marginHL.right,
          heightHL = 650 - marginHL.top - marginHL.bottom;
      
      // append the svg object to the body of the page
      const svgHL = d3.select("#hLine")
        .append("svg")
          .attr("width", widthHL + marginHL.left + marginHL.right)
          .attr("height", heightHL + marginHL.top + marginHL.bottom)
        .append("g")
          .attr("transform",`translate(${marginHL.left},${marginHL.top})`);
      
      //Read the data
      d3.csv("https://raw.githubusercontent.com/Insight-Crime/ic_datos/main/violencias_haiti/hunger.csv",
      
        // When reading the csv, I must format variables:
        d => {
            return {date : d.year, value : d.phase_4}}).then(

        // Now I can use this dataset:
        function(data) {
      
          // Add X axis --> it is a date format
          const x = d3.scaleLinear()
            .domain(d3.extent(data, d => d.date))
            .range([ 0, widthHL ]);
          svgHL.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0, ${heightHL})`)
            .call(d3.axisBottom(x)
            .tickSizeInner(3)
            .tickSizeOuter(0)
            .tickValues([2019, 2020, 2021, 2022, 2023])
            .ticks(5, "")); // format the numbers so there's no decimal or comma
      
          // Add Y axis
          const y = d3.scaleLinear()
            .domain([ 2000000, 1])
            //.domain(d3.extent(data, d => d.value))
            .range([0, heightHL ]);
          svgHL.append("g")
            .attr("class", "y-axis")
            .call(d3.axisLeft(y)
            .tickSizeInner(-widthHL)
            .tickValues([250000, 500000, 750000, 1000000, 1250000, 1500000, 1750000])
            .tickSizeOuter(0));
      
          // Add the line
          svgHL.append("path")
            .datum(data)
            .attr('class', 'myPath')
            .attr("fill", "none")
            .attr("d", d3.line()
              .x(d => x(d.date))
              .y(d => y(d.value))
              )
              
            svgHL.append('text')
              .attr('class', 'plot-title')
              .attr('y', '-30')
              .attr('x', '-60')
              .text('Haitians Suffering from Emergency Food Insecurity')
  
          svgHL.append('rect')
              .attr('class', 'annotation-rect')
              .attr('x', '185')
              .attr('y', '20')
              .attr('height', '70')
              .attr('width', '255')
  
          svgHL.append('text')
              .attr('class', 'annotations')
              .attr('x', '430')
              .attr('y', '40')
              .attr('text-anchor', 'end')
              .text('Haitians suffering from emergency levels')
  
          svgHL.append('text')
              .attr('class', 'annotations')
              .attr('x', '430')
              .attr('y', '60')
              .attr('text-anchor', 'end')
              .text('of food insecurity has increased 250%')

            svgHL.append('text')
                .attr('class', 'annotations')
                .attr('x', '430')
                .attr('y', '80')
                .attr('text-anchor', 'end')
                .text('from 2019 to 2023')


        svgHL.append('text')
            .attr('class', 'interactive-note')
            .attr('x', '550')
            .attr('y', '10')
            .text('Hover over the circles')

        svgHL.append('circle')
            .attr('cx', '405')
            .attr('cy', '5')
            .attr('r', '4')
            .attr("stroke", "#11269B")
            .attr("stroke-width", 3)
            .attr("fill", "#FAFAFA")

  // footer
  svgHL.append("text") // source
    .attr('class', 'sources')
    .attr("x", -40)
    .attr("y", 580)
    .html("Source: <a href='https://www.ipcinfo.org/ipc-country-analysis/details-map/en/c/1156571/?iso3=HTI' style='fill:#91273E; text-decoration: underline'>Integrated Food Security Phase Classification</a>")

  svgHL.append("text") // IC logo
      .attr('class', 'ic-logo')
      .attr("x", 550)
      .attr("y", 580)
      .text('insightcrime.org')
      
          // create a tooltip
          const Tooltip = d3.select("#hLine")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("padding", "5px")
      
            // Three function that change the tooltip when user hover / move / leave a cell
            const mouseover = function(event,d) {
              Tooltip
                .style("opacity", 1)
            }
            const mousemove = function(event,d) {
              Tooltip
                .style("left", `${event.layerX+10}px`)
                .style("top", `${event.layerY}px`)
                .html("Haitians facing" + "<br>" +
                      "emergency hunger: " + d3.format(',')(d.value) + "<br>" +
                      "Year: " + d.date)
            }
            const mouseleave = function(event,d) {
              Tooltip
                .style("opacity", 0)
            }
      
      
      
          // Add the points
          svgHL
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

