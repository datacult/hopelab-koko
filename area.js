'use strict'

let area = ((selector = '#area', data = [], mapping = { x: "x", y: "y" }) => {

    var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? true : false

    ////////////////////////////////////
    //////////// svg setup /////////////
    ////////////////////////////////////
console.log(data)
    var body = d3.select(selector)
    body.html("")

    // margins for SVG
    const margin = isMobile ? {
        left: 75,
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
    const svgWidth = isMobile ? screen.width*1.5 : 1000
    const svgHeight = isMobile ? screen.height*1.2 : 700 //900 

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
            threshold: [.5]
          };
    
            const scrollarea = document.querySelector('#area');
    
            const scrollareaObserver = new IntersectionObserver(handleScrollarea, options);
        
            function handleScrollarea(entry, observer) {
                if (entry[0].intersectionRatio > .5) {
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
        .domain([new Date("2022-01-10").getTime(), new Date("2023-01-02").getTime()])
        .range([0, width]);


    // Add Y axis
    const y = d3.scaleLinear()
        .domain([0, 100000])
        .range([height, 0]);

    ////////////////////////////////////
    //////////// Axis ////////////
    //////////////////////////////////// 

    var xAxisValues
    
    if (isMobile){ 
        xAxisValues = [
            new Date("2022-01-20").getTime(),
            new Date("2022-04-20").getTime(),
            new Date("2022-07-20").getTime(),
            new Date("2022-10-20").getTime()
        ]
    } else {
        xAxisValues = [
            new Date("2022-01-20").getTime(),
            new Date("2022-02-20").getTime(),
            new Date("2022-03-20").getTime(),
            new Date("2022-04-20").getTime(),
            new Date("2022-05-20").getTime(),
            new Date("2022-06-20").getTime(),
            new Date("2022-07-20").getTime(),
            new Date("2022-08-20").getTime(),
            new Date("2022-09-20").getTime(),
            new Date("2022-10-20").getTime(),
            new Date("2022-11-20").getTime(),
            new Date("2022-12-20").getTime()
        ]
    }
        

    

    console.log(xAxisValues)


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
        .attr("stroke-width", isMobile ? 1 : 0.5)
        .attr("stroke-opacity", 0.2);

    svg.selectAll('.domain').remove();

    if (isMobile){
        svg.selectAll('.tick').attr('font-size','14px')
    }

    ////////////////////////////////////
    //////////// add to DOM ////////////
    //////////////////////////////////// 
    const zeroArea = d3.area()
    .x(function(d) { return x(d[mapping.x]); })
    .y0(height)
    .y1(function() { return height; });

    const area = d3.area()
    .x(d => x(d[mapping.x]))
    .y0(y(0))
    .y1(d => y(d[mapping.y]))

    const areaChart = svg.append("path")
            .datum(data.filter(d => d[mapping.x] <= new Date("2023-01-02").getTime()))
            // .datum(data.filter(d => d[mapping.x] <= "2023-01-02"))
            .attr("d", function(d) {
                return zeroArea(d)
            })
            .attr("fill", "url(#mygrad)")
            .attr("fill-opacity", 0.8)
            .attr("stroke", "none")

    let last_point = data[data.length - 1]
    // console.log(last_point)

    //arrow head
    svg.append("line")
        .attr('class','arrow')
        .attr('id','arrow-left')
        .attr("fill", "none")
        .attr("stroke", "#7059E7")
        .attr("stroke-width", 4)
        .attr("stroke-linecap", "round")
        .attr('x1', x(last_point[mapping.x]) + 1)
        .attr("x2", x(last_point[mapping.x]) + 1)
        .attr("y1", y(last_point[mapping.y]) - 1)
        .attr("y2", y(last_point[mapping.y]) - 1)
        .attr('opacity',0)

    svg.append("line")
        .attr('class','arrow')
        .attr('id','arrow-right')
        .attr("fill", "none")
        .attr("stroke", "#7059E7")
        .attr("stroke-width", 4)
        .attr("stroke-linecap", "round")
        .attr("x1", x(last_point[mapping.x]) + 1)
        .attr("x2", x(last_point[mapping.x]) + 1)
        .attr("y1", y(last_point[mapping.y]) - 1)
        .attr("y2", y(last_point[mapping.y]) - 1)
        .attr('opacity',0)

    const line = svg.append("path")
        .datum(data)
        .attr('id','graph-line')
        .attr("fill", "none")
        .attr("stroke", "#7059E7")
        .attr("stroke-width", 4)
        .attr("stroke-linecap", "round")
        .attr("d",d3.line()
        .x(d => x(0))
        .y(d => y(0)))
        .attr("d", d3.line()
            .x(d => x(d[mapping.x]))
            .y(d => y(d[mapping.y]))
        )

    var line_length = document.getElementById('graph-line').getTotalLength();

    line.attr("stroke-dasharray", line_length + " " + line_length)
    .attr("stroke-dashoffset", line_length)

    svg.append("text")
        .attr("x", isMobile ? 25 : 100)
        .attr("y", 50)
        .text("In 2022, Koko helped")
        .attr("class", "h2");

    svg.append("text")
        .attr("x", isMobile ? 25 : 100)
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
        .attr("font-size", isMobile ? "1.2em" : "0.8em")
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
        .attr("y1", isMobile ? height-180: height - 120)
        .attr("y2", isMobile ? height-210:height - 150)


    svg.append("line")
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .attr("stroke-linecap", "round")
        .attr("x1", (-margin.left / 2) - 7)
        .attr("x2", (-margin.left / 2))
        .attr("y1", isMobile ? height-210+7:(height - 150) + 7)
        .attr("y2", isMobile ? height-210:(height - 150))

    svg.append("line")
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .attr("stroke-linecap", "round")
        .attr("x1", -(margin.left / 2) + 7)
        .attr("x2", -(margin.left / 2))
        .attr("y1", isMobile ? height-210+7:(height - 150) + 7)
        .attr("y2", isMobile ? height-210:(height - 150))

    //scroll update function
    function update() {
        areaChart.transition()
        .duration(1500)
        .attr("d", function(d) {
            return area(d)
        })

        line 
        .transition()
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0)
        .delay(1500)
        .duration(1500)

        d3.selectAll('.arrow')
        .transition()
        .attr('opacity',1)
        .delay(3000)
        .duration(0)
        
        d3.select('#arrow-left')
        .transition()
        .attr("x1", x(last_point[mapping.x]) - 20)
        .attr("y1", isMobile ? y(last_point[mapping.y]) + 9 : y(last_point[mapping.y]) - 1)
        .delay(3000)
        .duration(500)

        d3.select('#arrow-right')
        .transition()
        .attr("x2", isMobile ? x(last_point[mapping.x]) + 9 : x(last_point[mapping.x]) + 1)
        .attr("y2", y(last_point[mapping.y]) + 20)
        .delay(3000)
        .duration(500)

    }

})

