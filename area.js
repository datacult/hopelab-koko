'use strict'

let area = ((selector = '#area', data = [], mapping = { x: "x", y: "y" }) => {

    var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? true : false

    ////////////////////////////////////
    //////////// svg setup /////////////
    ////////////////////////////////////

    var body = d3.select(selector)
    body.html("")

    // margins for SVG
    const margin = isMobile ? {
        left: 50,
        right: 50,
        top: 50,
        bottom: 50
    } : {
        left: 100,
        right: 100,
        top: 100,
        bottom: 100
    }

    // responsive width & height
    const svgWidth = 1000
    const svgHeight = 700 //900 

    // helper calculated variables for inner width & height
    const height = svgHeight - margin.top - margin.bottom
    const width = svgWidth - margin.left - margin.right

    // add SVG
    d3.select(`${selector} svg`).remove();

    const svg = d3.select(selector)
        .append('svg')
        .attr("viewBox", `0 0 ${svgWidth} ${svgHeight}`)
        .append('g')
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    /// scroll observer for initial load
        let options = {
            root: null,
            rootMargin: "0px",
            threshold: [.75]
          };
    
            const scrollarea = document.querySelector('#area');
    
            const scrollareaObserver = new IntersectionObserver(handleScrollarea, options);
        
            function handleScrollarea(entry, observer) {
                if (entry[0].intersectionRatio > .75) {
                    update()
                }
            };
        
            scrollareaObserver.observe(scrollarea);

    ////////////////////////////////////
    //////////// Gradients ////////////
    //////////////////////////////////// 

    //make defs and add the linear gradient
    var lg = svg.append("defs").append("linearGradient")
        .attr("id", "mygrad")//id of the gradient
        .attr("x1", "0%")
        .attr("x2", "100%")
        .attr("y1", "0%")
        .attr("y2", "0%")//since its a vertical linear gradient 
        ;
    lg.append("stop")
        .attr("offset", "0%")
        .style("stop-color", "#75B0FF")
        .style("stop-opacity", 1)

    lg.append("stop")
        .attr("offset", "100%")
        .style("stop-color", "#7059E7")
        .style("stop-opacity", 1)

    ////////////////////////////////////
    //////////// Scales ////////////
    //////////////////////////////////// 


    const x = d3.scaleTime()
        .domain([Date.parse("2022-1-10"), Date.parse("2023-01-02")])
        .range([0, width]);

    // Add Y axis
    const y = d3.scaleLinear()
        .domain([0, 100000])
        .range([height, 0]);

    ////////////////////////////////////
    //////////// Axis ////////////
    //////////////////////////////////// 

    let xAxisValues = [
        Date.parse("2022-01-20"),
        Date.parse("2022-02-20"),
        Date.parse("2022-03-20"),
        Date.parse("2022-04-20"),
        Date.parse("2022-05-20"),
        Date.parse("2022-06-20"),
        Date.parse("2022-07-20"),
        Date.parse("2022-08-20"),
        Date.parse("2022-09-20"),
        Date.parse("2022-10-20"),
        Date.parse("2022-11-20"),
        Date.parse("2022-12-20")
    ]

    const xAxis = d3.axisBottom(x)
        .tickFormat(d3.timeFormat("%b"))
        .tickSize(20)
        .tickValues(xAxisValues)

    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(xAxis)
        .selectAll('line').remove();


    const yAxis = d3.axisLeft(y)
        .tickValues([0, 25000, 50000, 75000, 100000])
        .tickFormat(d3.format(".0s"))

    svg.append("g").call(yAxis)
        .selectAll('line').remove();

    const yAxisGrid = d3.axisLeft(y)
        .tickSize(-width).tickFormat('')
        .tickValues([0, 25000, 50000, 75000, 100000]);

    svg.append("g")
        .call(yAxisGrid)
        .selectAll('line')
        .attr("stroke-width", 0.5)
        .attr("stroke-opacity", 0.2);

    svg.selectAll('.domain').remove();

    ////////////////////////////////////
    //////////// add to DOM ////////////
    //////////////////////////////////// 

    const area =
        svg.append("path")
            .datum(data.filter(d => d[mapping.x] <= Date.parse("2023-01-02")))
            .attr("fill", "url(#mygrad)")
            .attr("fill-opacity", 0.8)
            .attr("stroke", "none")
            .attr("d", d3.area()
                .x(d => x(d[mapping.x]))
                .y0(y(0))
                .y1(d => y(d[mapping.y]))
            )

    let last_point = data[data.length - 1]

    //arrow head
    svg.append("line")
        .attr("fill", "none")
        .attr("stroke", "#7059E7")
        .attr("stroke-width", 4)
        .attr("stroke-linecap", "round")
        .attr("x1", x(last_point[mapping.x]) - 20)
        .attr("x2", x(last_point[mapping.x]) + 1)
        .attr("y1", y(last_point[mapping.y]) - 1)
        .attr("y2", y(last_point[mapping.y]) - 1)

    svg.append("line")
        .attr("fill", "none")
        .attr("stroke", "#7059E7")
        .attr("stroke-width", 4)
        .attr("stroke-linecap", "round")
        .attr("x1", x(last_point[mapping.x]) + 1)
        .attr("x2", x(last_point[mapping.x]) + 1)
        .attr("y1", y(last_point[mapping.y]) - 1)
        .attr("y2", y(last_point[mapping.y]) + 20)

    const line = svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#7059E7")
        .attr("stroke-width", 4)
        .attr("stroke-linecap", "round")
        // .attr("d",d3.line()
        // .x(d => x(0))
        // .y(d => y(0)))
        // .attr("d", d3.line()
        //     .x(d => x(d[mapping.x]))
        //     .y(d => y(d[mapping.y]))
        // )

    svg.append("text")
        .attr("x", 100)
        .attr("y", 50)
        .text("In 2022, Koko helped")
        .attr("class", "h2");

    svg.append("text")
        .attr("x", 100)
        .attr("y", 80)
        .text("close to 100,000 users")
        .attr("class", "h2")
        .append("tspan")
        .text(" 7")
        .attr("font-size", "0.5em")
        .attr("baseline-shift", "super");

    // axis label
    svg.append("text")
        .attr("x", 0)
        .attr("y", 0)
        .text("Total Users Helped")
        .attr("font-size", "0.8em")
        .attr("alignment-baseline", "middle")
        .attr("transform", `translate(${-margin.left / 2},${height}) rotate(270)`);


    // axis arrow

    svg.append("line")
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .attr("stroke-linecap", "round")
        .attr("x1", -margin.left / 2)
        .attr("x2", -margin.left / 2)
        .attr("y1", height - 120)
        .attr("y2", height - 150)


    svg.append("line")
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .attr("stroke-linecap", "round")
        .attr("x1", (-margin.left / 2) - 7)
        .attr("x2", (-margin.left / 2))
        .attr("y1", (height - 150) + 7)
        .attr("y2", (height - 150))

    svg.append("line")
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .attr("stroke-linecap", "round")
        .attr("x1", -(margin.left / 2) + 7)
        .attr("x2", -(margin.left / 2))
        .attr("y1", (height - 150) + 7)
        .attr("y2", (height - 150))

    //scroll update function
    function update() {
        line
        .transition()
        .duration(5000)
        .attr("d", d3.line()
        .x(d => x(d[mapping.x]))
        .y(d => y(d[mapping.y]))
    )
    }

})

