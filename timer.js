// © 2023 Data Culture
// Released under the ISC license.
// https://studio.datacult.com/ 

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
        left: 5,
        right: 10,
        top: 100,
        bottom: 50
    } : {
        left: 5,
        right: 10,
        top: 100,
        bottom: 50
    }

    // responsive width & height
    const svgWidth = isMobile ? screen.width*1 : 850
    const svgHeight = isMobile ? screen.height*.5 : 325 //900 

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

    ////////////////////////////////////
    //////////// Axis ////////////
    //////////////////////////////////// 
    var bar_size = isMobile ? height/5 : height/3

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
            .attr("font-size",isMobile ? '16px' : '14px')
            .attr('y',10);

        svg.append('text')
            .text('Minutes')
            .attr('x',x(0)-3)
            .attr('y',isMobile ? height+45 : height+45)
            .attr("fill","#ffffff")
            .attr("font-size",isMobile ? '16px' : '14px')

    svg.selectAll('.domain').remove();

    ////////////////////////////////////
    //////////// add to DOM ////////////
    //////////////////////////////////// 

    //background rectangle
    svg.append('rect')
        .attr('class','time-bg')
        .attr('height',bar_size)
        .attr('width',width)
        .attr('x',x(0))
        .attr('y',height-bar_size)
        .attr('fill','#ffffff')
        .attr('opacity',.3)

    //headline text
    svg.append("text")
        .attr('id','time-1')
        .attr("x", 0)
        .attr("y", 0)
        .text("It took you XX minutes")
        .attr("class", "h")
        .style('font-size','2.6em')
        .style('fill','#ffffff')
        .attr('display',isMobile ? 'none' : 1);

    svg.append("text")
        .attr("x", 0)
        .attr("y", 50)
        .text("to get to the bottom of this page.")
        .attr("class", "h")
        .style('font-size','2.6em')
        .style('fill','#ffffff')
        .attr('display',isMobile ? 'none' : 1);

    // mobile headline text
    svg.append("text")
        .attr("x", 0)
        .attr("y", 0)
        .text("It took you")
        .attr("class", "h")
        .style('fill','#ffffff')
        .style('font-size','2.2em')
        .attr('display',isMobile ? 1 : 'none');

    svg.append("text")
        .attr('id','time-1')
        .attr("x", 0)
        .attr("y", 45)
        .text("XX minutes")
        .attr("class", "h")
        .style('fill','#ffffff')
        .style('font-size','2.2em')
        .attr('display',isMobile ? 1 : 'none');

    svg.append("text")
        .attr("x", 0)
        .attr("y", 90)
        .text("to get to the bottom")
        .attr("class", "h")
        .style('fill','#ffffff')
        .style('font-size','2.2em')
        .attr('display',isMobile ? 1 : 'none');

        svg.append("text")
        .attr("x", 0)
        .attr("y", 135)
        .text("of this page.")
        .attr("class", "h")
        .style('fill','#ffffff')
        .style('font-size','2.2em')
        .attr('display',isMobile ? 1 : 'none');

    // draw end line
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

    //draw responsive bar
    var timeSpent = 0
    var time_size = height/6
    svg.append('rect')
        .attr('class','time-bar')
        .attr('height',time_size)
        .attr('width',6)
        .attr('x',x(0))
        .attr('y',(height-bar_size)+(bar_size-time_size)/2)
        .attr('fill','#ffffff')
        .attr('rx','6')
    
    //draw small rect to cover rounding on start of bar
    svg.append('rect')
        .attr('height',time_size)
        .attr('width',6)
        .attr('x',x(0))
        .attr('y',(height-bar_size)+(bar_size-time_size)/2)
        .attr('fill','#ffffff')

    //label text
    svg.append('text')
        .attr('class','time-text')
        .attr('x',x(0))
        .attr('y',isMobile ? height-bar_size/2+6: height-bar_size/2+4)
        .text(timeSpent)
        .attr('fill','#7059E7')
        .attr('font-size',isMobile ? '1em':'.8em')
        .attr('font-weight','700')
        .attr('text-anchor','end')


    //scroll update function
    function stopTime() {
        
        //call timeMe function
        let timeSpentOnPage = TimeMe.getTimeOnCurrentPageInSeconds();
        //round to minutes and set time variable
        timeSpent = Math.round(timeSpentOnPage/6)/10

        //update bar length (with max value for over 10 min)
        d3.select('.time-bar')
        .transition()
        .duration(1500)
        .attr('width',timeSpent > 10 ? x(10.11) : x(timeSpent))

        //update label text
        d3.select('.time-text')
        .text(timeSpent > 10 ? '10+' :timeSpent)
        .transition()
        .duration(1500)
        .attr('x',timeSpent > 10 ? (x(10.11)-10) : (x(timeSpent)-10))

        //update headline text
        d3.selectAll('#time-1')
        .text(isMobile ? `${timeSpent} minutes`:`It took you ${timeSpent} minutes`)

    }

})

