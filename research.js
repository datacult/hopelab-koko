'use strict'

let research = ((selector) => {

    var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? true : false

    ////////////////////////////////////
    //////////// svg setup /////////////
    ////////////////////////////////////

    // var body = d3.select(selector)
    // body.html("")

    // margins for SVG
    const margin = isMobile ? {
        left: 10,
        right: 10,
        top: 10,
        bottom: 10
    } : {
        left: 10,
        right: 10,
        top: 10,
        bottom: 10
    }

    // responsive width & height
    const svgWidth = isMobile ? 720 : window.innerWidth*.5 
    const svgHeight = isMobile ? screen.height*1.6 : window.innerHeight*.78 //700//900 
    // const svgWidth = window.innerWidth
    // const svgHeight = window.innerHeight

    // helper calculated variables for inner width & height
    const height = svgHeight - margin.top - margin.bottom
    const width = svgWidth - margin.left - margin.right

    ////////////////////////////////////
    //////////scroll observers//////////
    ////////////////////////////////////
    let options = {
        root: null,
        rootMargin: "0px",
        threshold: [.75]
      };

        const structure = document.querySelector('#structure');

        const structureObserver = new IntersectionObserver(handleStructure, options);
    
        function handleStructure(entry, observer) {
            if (entry[0].intersectionRatio > .75) {
                update(1)
            }
        };
    
        structureObserver.observe(structure);
        
        const traditional = document.querySelector('#traditional');

        const traditionalObserver = new IntersectionObserver(handleTraditional, options);
    
        function handleTraditional(entry, observer) {
            if (entry[0].intersectionRatio > .75) {
                update(2)
            }
        };
    
        traditionalObserver.observe(traditional);

        const enhanced = document.querySelector('#enhanced');

        const enhancedObserver = new IntersectionObserver(handleEnhanced, options);
    
        function handleEnhanced(entry, observer) {
            if (entry[0].intersectionRatio > .75) {
                update(3)
            }
        };

        enhancedObserver.observe(enhanced);

    // add SVG

    const svg = d3.select(selector)
        .append('svg')
        .attr("viewBox", `0 0 ${svgWidth} ${svgHeight}`)
        .append('g')
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    var axis_padding = 40, top_padding = 40, bottom_padding = height*.9
    svg.append('line')
        .attr('stroke','black')
        .attr('x1',axis_padding)
        .attr('x2',axis_padding)
        .attr('y1',top_padding)
        .attr('y2',bottom_padding)

    svg.append('line')
        .attr('stroke','black')
        .attr('x1',width-axis_padding)
        .attr('x2',width-axis_padding)
        .attr('y1',top_padding)
        .attr('y2',bottom_padding) 

    var label_size = isMobile ? 25 : 16, y_shift = isMobile ? 100 : 70

        svg.append('text')
            .text('Before')
            .attr('class','before')
            .attr('x',axis_padding)
            .attr('y',top_padding/2)
            .attr('text-anchor','middle')
            .attr('font-family','Avenir')
            .attr('font-size',label_size)
            .attr('font-weight',600)
            .style('opacity',0)

        svg.append('text')
            .text('After')
            .attr('class','after')
            .attr('x',width-axis_padding)
            .attr('y',top_padding/2)
            .attr('text-anchor','middle')
            .attr('font-family','Avenir')
            .attr('font-size',label_size)
            .attr('font-weight',600)
            .style('opacity',0)

        svg.append('text')
            .text('Less Hopeless')
            .attr('class','less')
            .attr('x',y_shift-bottom_padding)
            .attr('y',axis_padding-10)
            .attr('text-anchor','middle')
            .attr('transform','rotate(-90)')
            .attr('font-family','Avenir')
            .attr('font-size',label_size)
            .attr('font-weight',600)
            .style('opacity',0)

        svg.append('text')
            .text('More Hopeless')
            .attr('class','more')
            .attr('x',-y_shift-top_padding)
            .attr('y',axis_padding-10)
            .attr('text-anchor','middle')
            .attr('transform','rotate(-90)')
            .attr('font-family','Avenir')
            .attr('font-size',label_size)
            .attr('font-weight',600)
            .style('opacity',0)
        
    // scales
    var y_axis = d3.scaleLinear()
    .domain([4,16])
    .range([bottom_padding,top_padding])

    var defs = svg.append('defs')

    var grad = defs.append('linearGradient')
        .attr('id','poly-grad')
        .attr('x1',0)
        .attr('x2',0)
        .attr('y1',0)
        .attr('y2',1)
        
        grad.append('stop')
        .attr('offset','0%')
        .attr('stop-color','#00000033')

        grad.append('stop')
        .attr('offset','100%')
        .attr('stop-color','#00000000')

        svg.append('path')
        .attr('d',`M${axis_padding},${y_axis(12.48)},V${top_padding},H${(width-axis_padding)},V${y_axis(12.8)},Z`)
        .attr('fill','url(#poly-grad)')


    function drawLine(start_val,end_val,color,state){
        //add arrow to y-axis
        defs
            .append("marker")
            .attr("id", "arrow"+state)
            .attr("markerWidth", 15)
            .attr("markerHeight", 15)
            .attr("refX", 4.45)
            .attr("refY", 2)
            .attr("orient", state == 'nokoko' ? 86 : 95)
            .attr("markerUnits", "strokeWidth")
            .append("path")
            .style('fill',color)
            .attr("d", "M4.76566 1.12179C4.5704 0.926526 4.25382 0.926526 4.05856 1.12179L0.876576 4.30377C0.681313 4.49903 0.681313 4.81561 0.876576 5.01088C1.07184 5.20614 1.38842 5.20614 1.58368 5.01088L4.41211 2.18245L7.24054 5.01088C7.4358 5.20614 7.75238 5.20614 7.94764 5.01088C8.14291 4.81561 8.14291 4.49903 7.94764 4.30377L4.76566 1.12179ZM4.91211 1.97534L4.91211 1.47534L3.91211 1.47534L3.91211 1.97534L4.91211 1.97534Z")

        svg.append('line')
            .attr('class','outcome')
            .attr('id',state)
            .attr('x1',axis_padding)
            .attr('x2',axis_padding)
            .attr('y1',y_axis(start_val))
            .attr('y2',y_axis(start_val))
            .style('stroke',color)
            .style('stroke-width','3px')
    }

    drawLine(12.31,11.54,'#7059E7','koko')
    drawLine(12.48,12.8,'#1B172F','nokoko')

    var ta_x = width-axis_padding-40, ta_y = y_axis(15.5), ea_y = y_axis(11), line_height = isMobile ? '3%' :'4.5%', font_size = isMobile ? 32 : 18;

    var trad_annotation = svg.append('text')
        .attr('class','research_annotation')
        .attr('x',ta_x)
        .attr('y',ta_y)
        .attr('fill','#000000')
        .attr('font-size',font_size)
        .attr('font-weight', 500)
        .attr('text-anchor','end')
        .attr('font-family','Avenir')
        .attr('opacity',0);

    trad_annotation.append('tspan')
        .attr('class','research_annotation')
        .attr('id','trad_anno')
        .attr('x',ta_x)
        .attr('dy',line_height)
        .text(`After the `)
        .append('tspan')
        .text('traditional crisis response')
        .attr('font-weight', 700)
        .attr('fill','#1B172F')
        .append('tspan')
        .text(',')
        .attr('font-size',font_size)
        .attr('font-weight', 500)
        .attr('fill','#000000');

    trad_annotation.append('tspan')
        .attr('class','research_annotation')
        .attr('id','trad_anno')
        .attr('x',ta_x)
        .attr('dy',line_height)
        .text('users had no significant change in');

    trad_annotation.append('tspan')
        .attr('class','research_annotation')
        .attr('id','trad_anno')
        .attr('x',ta_x)
        .attr('dy',line_height)
        .text('their feelings of hopelessness.');

    var enhance_annotation = svg.append('text')
        .attr('class','research_annotation')
        .attr('x',ta_x)
        .attr('y',ea_y)
        .attr('fill','#000000')
        .attr('font-size',font_size)
        .attr('font-weight', 500)
        .attr('text-anchor','end')
        .attr('font-family','Avenir')
        .attr('opacity',0);

    enhance_annotation.append('tspan')
        .attr('class','research_annotation')
        .attr('id','enhance_anno')
        .attr('x',ta_x)
        .attr('dy',line_height)
        .text(`After the `)
        .append('tspan')
        .text('enhanced crisis response')
        .attr('font-weight', 700)
        .attr('fill','#7059E7')
        .append('tspan')
        .text(',')
        .attr('font-size',font_size)
        .attr('font-weight', 500)
        .attr('fill','#000000');

    enhance_annotation.append('tspan')
        .attr('class','research_annotation')
        .attr('id','enhance_anno')
        .attr('x',ta_x)
        .attr('dy',line_height)
        .text('users had a significant decrease in hopelessness.')
        .attr('display',isMobile ? 'none' : 1);

    enhance_annotation.append('tspan')
        .attr('class','research_annotation')
        .attr('id','enhance_anno')
        .attr('x',ta_x)
        .attr('dy',line_height)
        .text('users had a significant decrease')
        .attr('display', !(isMobile) ? 'none' : 1);

    enhance_annotation.append('tspan')
        .attr('class','research_annotation')
        .attr('id','enhance_anno')
        .attr('x',ta_x)
        .attr('dy',line_height)
        .text('in hopelessness.')
        .attr('display',!(isMobile) ? 'none' : 1);

   var link_text =  enhance_annotation.append('tspan')
        .attr('class','research_annotation')
        .attr('id','enhance_anno')
        .attr('x',ta_x)
        .attr('dy','4.5%')
        .text(`Explore all of Koko's research publications `)
        .attr('font-size',isMobile ? font_size-6 : font_size-2)
        .attr('font-weight', 400)

    link_text
        .append('tspan')
        .append('a')
        .attr('href','https://www.kokocares.org/research')
        .attr('target','_blank')
        .attr('text-decoration','underline')
        .text('here')

    link_text
        .append('tspan')
        .text('.');

//scroll update function
function update(val){

    if (val == 1) {

        d3.select('.before')
        .transition()
        .duration(1000)
        .style('opacity',1)

        d3.select('.after')
        .transition()
        .duration(2000)
        .style('opacity',1)

        d3.select('.less')
        .transition()
        .duration(3000)
        .style('opacity',1)

        d3.select('.more')
        .transition()
        .duration(4000)
        .style('opacity',1)

        d3.select('#nokoko')
        .transition()
        .duration(1500)
        .attr('x2',axis_padding)
        .attr('y2',y_axis(12.48))
        .attr('marker-end',"none")

        trad_annotation
        .transition()
        .duration(1500)
        .attr('opacity',0)

        d3.select('#koko')
        .transition()
        .duration(1500)
        .attr('x2',axis_padding)
        .attr('y2',y_axis(12.31))
        .attr('marker-end',"none")

        enhance_annotation
        .transition()
        .duration(1500)
        .attr('opacity',0)

    } else if (val == 2){
        d3.select('.before')
        .transition()
        .duration(1000)
        .style('opacity',1)

        d3.select('.after')
        .transition()
        .duration(2000)
        .style('opacity',1)

        d3.select('.less')
        .transition()
        .duration(3000)
        .style('opacity',1)

        d3.select('.more')
        .transition()
        .duration(4000)
        .style('opacity',1)

        d3.select('#nokoko')
        .attr('marker-end',"url(#arrownokoko)")
        .transition()
        .duration(1500)
        .attr('x2',width-axis_padding-3)
        .attr('y2',y_axis(12.8))

        trad_annotation
        .transition()
        .duration(1500)
        .attr('opacity',1)

        d3.select('#koko')
        .transition()
        .duration(1500)
        .attr('x2',axis_padding)
        .attr('y2',y_axis(12.31))
        .attr('marker-end',"none")

        enhance_annotation
        .transition()
        .duration(1500)
        .attr('opacity',0)

    } else if (val == 3){
        d3.select('.before')
        .transition()
        .duration(1000)
        .style('opacity',1)

        d3.select('.after')
        .transition()
        .duration(2000)
        .style('opacity',1)

        d3.select('.less')
        .transition()
        .duration(3000)
        .style('opacity',1)

        d3.select('.more')
        .transition()
        .duration(4000)
        .style('opacity',1)

        d3.select('#nokoko')
        .attr('marker-end',"url(#arrownokoko)")
        .transition()
        .duration(1500)
        .attr('x2',width-axis_padding-3)
        .attr('y2',y_axis(12.8))

        trad_annotation
        .transition()
        .duration(1500)
        .attr('opacity',1)

        d3.select('#koko')
        .attr('marker-end',"url(#arrowkoko)")
        .transition()
        .duration(1500)
        .attr('x2',width-axis_padding-3)
        .attr('y2',y_axis(11.54))

        enhance_annotation
        .transition()
        .duration(1500)
        .attr('opacity',1)

    }  

}

})
