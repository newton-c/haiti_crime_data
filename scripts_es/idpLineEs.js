
      // set the dimensions and margins of the graph
      const marginIL = {top: 80, right: 30, bottom: 60, left: 60},
          widthIL = 640 - marginIL.left - marginIL.right,
          heightIL = 450 - marginIL.top - marginIL.bottom;
      
      // append the svg object to the body of the page
      const svgIL = d3.select("#idpLine")
        .append("svg")
          .attr("width", widthIL + marginIL.left + marginIL.right)
          .attr("height", heightIL + marginIL.top + marginIL.bottom)
        .append("g")
          .attr("transform",`translate(${marginIL.left},${marginIL.top})`);
      
      //Read the data
      d3.csv("https://raw.githubusercontent.com/Insight-Crime/ic_datos/main/violencias_haiti/idp_data.csv",
      
        // When reading the csv, I must format variables:
        d => {
            return {date : d.year, value : d.conflict_internal_displacements}}).then(

        // Now I can use this dataset:
        function(data) {
      
          // Add X axis --> it is a date format
          const x = d3.scaleLinear()
            .domain(d3.extent(data, d => d.date))
            .range([ 0, widthIL ]);
          svgIL.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0, ${heightIL})`)
            .call(d3.axisBottom(x)
            .tickSizeInner(3)
            .tickSizeOuter(0)
            .tickValues([2019, 2020, 2021, 2022])
            .ticks(4, "")); // format the numbers so there's no decimal or comma
      
          // Add Y axis
          const y = d3.scaleLinear()
            .domain([110000, 1])
            //.domain(d3.extent(data, d => d.value))
            .range([0, heightIL ]);
          svgIL.append("g")
            .attr("class", "y-axis")
            .call(d3.axisLeft(y)
            .tickSizeInner(-widthIL)
            .tickSizeOuter(0));
      
          // Add the line
          svgIL.append("path")
            .datum(data)
            .attr('class', 'myPath')
            .attr("fill", "none")
            .attr("d", d3.line()
              .x(d => x(d.date))
              .y(d => y(d.value))
              )
              
            svgIL.append('text')
              .attr('class', 'plot-title')
              .attr('y', '-60')
              .attr('x', '-60')
              .text('Desplazados internos en Haití')
  
          svgIL.append('rect')
              .attr('class', 'annotation-rect')
              .attr('x', '215')
              .attr('y', '-5')
              .attr('height', '40')
              .attr('width', '285')
  
          svgIL.append('text')
              .attr('class', 'annotations')
              .attr('x', '493')
              .attr('y', '10')
              .attr('text-anchor', 'end')
              .text('Aumento del 430% de los desplazados internos')
  
          svgIL.append('text')
              .attr('class', 'annotations')
              .attr('x', '493')
              .attr('y', '30')
              .attr('text-anchor', 'end')
              .text('entre 2019 y 2022')
  

        svgIL.append('text')
            .attr('class', 'interactive-note')
            .attr('x', '550')
            .attr('y', '-20')
            .attr('font-face', 'italic')
            .text('Pase el cursor sobre los círculos')

        svgIL.append('circle')
          .attr('cx', '335')
          .attr('cy', '-25')
          .attr('r', '4')
          .attr("stroke", "#11269B")
          .attr("stroke-width", 3)
          .attr("fill", "#FAFAFA")

  // footer
  svgIL.append("text") // source
      .attr('class', 'sources')
      .attr("x", -40)
      .attr("y", 360)
      .html("Fuente: <a href='https://www.internal-displacement.org/database/displacement-data' style='fill:#91273E; text-decoration: underline'>IDMC</a>")
  
  svgIL.append("text") // IC logo
      .attr('class', 'ic-logo')
      .attr("x", 550)
      .attr("y", 360)
      .text('insightcrime.org')
      
          // create a tooltip
          const Tooltip = d3.select("#idpLine")
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
              Tooltip
                .style("opacity", 1)
            }
            const mousemove = function(event,d) {
              Tooltip
                .style("left", `${event.layerX+10}px`)
                .style("top", `${event.layerY}px`)
                .html("Desplazados internos: " + d3.format(',')(d.value) + "<br>" +
                      "Año: " + d.date)
            }
            const mouseleave = function(event,d) {
              Tooltip
                .style("opacity", 0)
            }
      
      
      
          // Add the points
          svgIL
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