'use strict'

let force = ((state = 'koko',selector = '#force-placeholder') => {

    var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? true : false

    ////////////////////////////////////
    //////////// svg setup /////////////
    ////////////////////////////////////

    var body = d3.select(selector)
    body.html("")

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
    const svgWidth = 1440 
    const svgHeight = 900 

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


    ////////////////////////////////////
    //////////////wrangle///////////////
    ////////////////////////////////////
    var value
    if (state == 'koko'){
        value = 90
    } else {
        value = 30
    }

    var node_data = [], num_boxes = 100;
    var caught = Math.round(num_boxes*(value/100))

    for (let i = 0; i < caught; i++) {
        node_data.push({ "id": i+1, "group": 1, "fill": '#ffffff', "r": 30})
      }

    for (let i = 0; i < (num_boxes-caught); i++) {
        node_data.push({ "id": caught+1+i, "group": 1, "fill": '#c5c5c5', "r": 30})
      }

    var placeholder = 2
    node_data.splice(placeholder, 0, { "id": num_boxes+1, "group": 1, "fill": '#ffffff', "r": 225});


    const data = {
        "nodes": node_data
    }

    const nodes = data.nodes.map(d => Object.create(d))

    var grid_layout = []
    for (let i = 0; i < num_boxes; i++) {
        grid_layout.push({ "id": i+1, "x": 0, "y": 0, "sim_x": 0, "sim_y": 0})
      }


    ////////////////////////////////////
    //////// simulation setup //////////
    ////////////////////////////////////   

    let drag = simulation => {

        function dragstarted(event) {
            if (!event.active) simulation.alphaTarget(0.3).restart()
            event.subject.fx = event.subject.x
            event.subject.fy = event.subject.y
        }

        function dragged(event) {
            event.subject.fx = event.x
            event.subject.fy = event.y
        }

        function dragended(event) {
            if (!event.active) simulation.alphaTarget(0)
            event.subject.fx = null;
            event.subject.fy = null;
        }

        return d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended)
    }


    var simulation = d3.forceSimulation(nodes)
        .force("charge", d3.forceManyBody().strength(1))
        .force("collide", d3.forceCollide().radius(d => d.r))
        .force("center", d3.forceCenter(width / 2, height / 2))



    ////////////////////////////////////
    //////////// add to DOM ////////////
    ////////////////////////////////////  

        var rect_height = 20, rect_width = 50;
    const node = svg.append("g")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
        .selectAll(".forceword")
        .data(nodes)
        .join('rect')
        .attr("class", "forceword")
        .attr('id',d=>'word'+d.id)
        .attr("height",rect_height)
        .attr("width", rect_width)
        .style("fill",d => d.fill)
        .style('stroke','black')
        .call(drag(simulation));

    var rect_select = num_boxes+1
    d3.select('#word'+rect_select)  
    .style("fill",'none')
    .style('stroke','none')

    var text_height = 300, text_width = 400, text_x = width/2-text_width/2, text_y = height/2-text_height/2-100
    svg.append('rect')
        .attr('class','force-text')
        .attr('id','force-text-koko')
        .attr('height',text_height)
        .attr('width',text_width)
        .attr('x',text_x)
        .attr('y',text_y)
        .style('fill','lightgrey')


    simulation.on("tick", () => {

        node
            .attr("x", d => d.x)
            .attr("y", d => d.y)
        
    })
    // .on('end', () => {
    //   d3.selectAll('circle').each(function () {
    //     const thisD3 = d3.select(this)
    //     console.log(thisD3.attr('cx'), thisD3.attr('cy'))
    //   })
    // }) 



// var grid_layout = []
function calcGrid(value) {
    var columns = 10, rows = num_boxes/columns;

    var start_x = width/2-rect_width*columns/2, start_y = height/2-rect_height*rows/2;

    grid_layout[value-1].x = start_x+rect_width*(value-(Math.ceil(value/columns)-1)*columns)-rect_width
    grid_layout[value-1].y = start_y+rect_height*Math.ceil(value/columns)-rect_height

    // grid_layout.push({'id':value,'x':grid_x,'y':grid_y})

}


node_data.splice(placeholder,1)

var position = d3.scaleLinear()
    .domain([0,1])
    .range([text_x,-1.1*text_width])

function updatePosition(percent) {
   d3.selectAll('.force-text')
   .attr('x',position(percent)) 

   node_data.forEach(d => {
    calcGrid(d.id)


    var grid_position_x = d3.scaleLinear()
    .domain([0,1])
    .range([grid_layout[d.id-1].sim_x,grid_layout[d.id-1].x])

    var grid_position_y = d3.scaleLinear()
    .domain([0,1])
    .range([grid_layout[d.id-1].sim_y,grid_layout[d.id-1].y])

    d3.select('#word'+d.id)
    .attr('x',grid_position_x(percent))
    .attr('y',grid_position_y(percent))
   })
}

// setup scroll functionality
var scroll = scroller()
.container(d3.select('#h-scroll'));

// pass in .step selection as the steps
scroll(d3.selectAll('.step'));

scroll.on('progress', function (index, progress) {
// console.log(progress)
if (progress > 0 & progress < 1){
    updatePosition(progress)
} else if (progress <= 0){
    updatePosition(0)
} else {
    updatePosition(1)
}
});

})

