'use strict'

let time = ((selector = '#timer') => {

    var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? true : false

    ////////////////////////////////////
    //////////// svg setup /////////////
    ////////////////////////////////////

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
    const svgWidth = isMobile ? screen.width*1.5 : 850
    const svgHeight = isMobile ? screen.height*1.2 : 325 //900 

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
            threshold: [.1]
          };
    
            const scrolltime = document.querySelector('#timer');
    
            const scrolltimeObserver = new IntersectionObserver(handleScrolltime, options);
        
            function handleScrolltime(entry, observer) {
                if (entry[0].intersectionRatio > .1) {
                    stopTime()
                }
            };
        
            scrolltimeObserver.observe(scrolltime);

    ////////////////////////////////////
    //////////// Scales ////////////
    //////////////////////////////////// 

    const x = d3.scaleTime()
        .domain([0, 10])
        .range([0, width]);


    // // Add Y axis
    // const y = d3.scaleLinear()
    //     .domain([0, 10])
    //     .range([height, 0]);

    ////////////////////////////////////
    //////////// Axis ////////////
    //////////////////////////////////// 
    var bar_size = height/3

    var xAxisValues = [
            0,
            2.5,
            5,
            7.5,10
        ]
        


    const xAxis = d3.axisBottom(x)
        .tickFormat((d, i) => ['0', '2.5', '5', '7.5', '10'][i])
        .tickSize(-bar_size)
        .tickValues(xAxisValues);

    svg.append("g")
        .attr("class",'x-axis')
        .attr("transform", `translate(0,${height})`)
        .call(xAxis)

        .selectAll('line')
        .attr("stroke-width", isMobile ? 1 : 0.5)
        .attr("stroke", '#ffffff')
        .attr("stroke-opacity", 0.4);

        svg.select(".x-axis")
            .selectAll('text')
            .attr("fill","#ffffff")
            .attr("font-size",'10px')
            .attr('y',10);

        svg.append('text')
            .text('Minutes')
            .attr('x',x(0)-3)
            .attr('y',height+35)
            .attr("fill","#ffffff")
            .attr("font-size",'10px')

    svg.selectAll('.domain').remove();

    ////////////////////////////////////
    //////////// add to DOM ////////////
    //////////////////////////////////// 
    svg.append('rect')
        .attr('class','time-bg')
        .attr('height',bar_size)
        .attr('width',width)
        .attr('x',x(0))
        .attr('y',height-bar_size)
        .attr('fill','#ffffff')
        .attr('opacity',.3)

    svg.append("text")
        .attr('id','time-1')
        .attr("x", 0)
        .attr("y", 0)
        .text("It took you XX minutes")
        .attr("class", "h")
        .style('fill','#ffffff');

    svg.append("text")
        .attr("x", 0)
        .attr("y", 45)
        .text("to get to the bottom of this page.")
        .attr("class", "h")
        .style('fill','#ffffff');

    svg.append("line")
        .attr('class','time-end')
        .attr("fill", "none")
        .attr("stroke", "#ffffff")
        .attr("stroke-width", 3)
        .attr("stroke-linecap", "round")
        .attr('x1', x(10))
        .attr("x2", x(10))
        .attr("y1", height-bar_size)
        .attr("y2", height)

    var timeSpent = 0
    var time_size = height/4
    svg.append('rect')
        .attr('class','time-bar')
        .attr('height',time_size)
        .attr('width',6)
        .attr('x',x(0))
        .attr('y',(height-bar_size)+(bar_size-time_size)/2)
        .attr('fill','#ffffff')
        .attr('rx','6')

    svg.append('rect')
        .attr('height',time_size)
        .attr('width',6)
        .attr('x',x(0))
        .attr('y',(height-bar_size)+(bar_size-time_size)/2)
        .attr('fill','#ffffff')

    svg.append('text')
        .attr('class','time-text')
        .attr('x',x(0))
        .attr('y',height-bar_size/2+4)
        .text(timeSpent)
        .attr('fill','#7059E7')
        .attr('font-size','.8em')
        .attr('font-weight','700')
        .attr('text-anchor','end')


    //scroll update function
    function stopTime() {
        
        //call timeMe function
        let timeSpentOnPage = TimeMe.getTimeOnCurrentPageInSeconds();
console.log(timeSpentOnPage)
        //round to minutes and set time variable
        timeSpent = Math.round(timeSpentOnPage/6)/10
        console.log(timeSpent)
        console.log(x(timeSpent))


        d3.select('.time-bar')
        .transition()
        .duration(1500)
        .attr('width',x(timeSpent))

        d3.select('.time-text')
        .text(timeSpent)
        .transition()
        .duration(1500)
        .attr('x',x(timeSpent)-10)

        d3.select('#time-1')
        .text(`It took you ${timeSpent} minutes`)

    }

})

