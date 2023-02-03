'use strict'

let force = ((state = 'not koko',selector = '#force-placeholder') => {

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
    const svgHeight = 850//900 

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
    var value, tree_count
    if (state == 'koko'){
        value = 90
        tree_count = 12
    } else {
        value = 30
        tree_count = 8
    }

    var node_data = [], num_boxes = 100;
    var caught = Math.round(num_boxes*(value/100))

    for (let i = 0; i < caught; i++) {
        node_data.push({ "id": i+1, "group": 1, "fill": '#ffffff', "r": 20, "px":0, "py":0})
      }

    for (let i = 0; i < (num_boxes-caught); i++) {
        node_data.push({ "id": caught+1+i, "group": 1, "fill": '#c5c5c5', "r": 20, "px":0, "py":0})
      }

    for (let i = 0; i < (tree_count); i++) {
        node_data[i].group = 2
        node_data[i].px = Math.floor(Math.random() * (width/8)) + width*3/5
        node_data[i].py = Math.floor(Math.random() * (height/2)) + height/4
    }

    // var placeholder = 2
    // node_data.splice(placeholder, 0, { "id": num_boxes+1, "group": 1, "fill": '#ffffff', "r": 225});


    const data = {
        "nodes": node_data
    }

    const nodes = data.nodes.map(d => Object.create(d))

    var grid_layout = []
    for (let i = 0; i < num_boxes; i++) {
    // for (let i = 0; i < num_boxes+1; i++) {
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

    var center_y =  height / 2
    var simulation = d3.forceSimulation(nodes)
        .force("charge", d3.forceManyBody().strength(1))
        .force("radial", d3.forceRadial(d => Math.floor(Math.random() * 270) + 240, width / 2, center_y))
        .force("collide", d3.forceCollide().radius(d => d.r))
        .force("center", d3.forceCenter(width / 2, center_y))
        .force("bouding-circle", () => {
            nodes.forEach(node => {
              if (node.y < center_y - 350 || node.y > center_y + 340) {
                // node.x = Math.floor(Math.random() * 270) + 240//... // new x position
                node.y = Math.floor(Math.random() * (center_y+340)) + (center_y-350)//... // new y position
              }
            })
          })
        .tick(0)


    ////////////////////////////////////
    //////////// add to DOM ////////////
    ////////////////////////////////////  
    var text_height = 300, text_width = 400, text_x = width/2-text_width/2, text_y = height/2-text_height/2
    
    svg.append('rect')
    .attr('class','force-text')
    .attr('id','force-text-koko')
    .attr('height',text_height)
    .attr('width',text_width)
    .attr('x',text_x)
    .attr('y',text_y)
    .style('fill','lightgrey')
    .style('opacity',.2)

    var rect_height = 25, rect_width = 75, rect_width_tree = 70, rect_height_tree = 50;
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

    // var rect_select = num_boxes+1
    // d3.select('#word'+rect_select)  
    // .style("fill",'none')
    // .style('stroke','none')
    

    // node_data.splice(placeholder,1)

    simulation.on("tick", () => {

        node
            .attr("x", d => d.x)
            .attr("y", d => d.y)
        
    })
    .on('end', () => {
      d3.selectAll('.forceword').each(function () {
        const thisD3 = d3.select(this)
        
        grid_layout[thisD3.attr('id').split('d')[1]-1].sim_x = thisD3.attr('x')
        grid_layout[thisD3.attr('id').split('d')[1]-1].sim_y = thisD3.attr('y')
      })
    }) 



// var grid_layout = []
function calcGrid(value) {
    var columns = 10, rows = num_boxes/columns;

    var start_x = width/2-rect_width_tree*columns/2, start_y = height/2-rect_height_tree*rows/2;

    grid_layout[value-1].x = start_x+rect_width_tree*(value-(Math.ceil(value/columns)-1)*columns)-rect_width_tree
    grid_layout[value-1].y = start_y+rect_height_tree*Math.ceil(value/columns)-rect_height_tree

    // grid_layout.push({'id':value,'x':grid_x,'y':grid_y})

}



var position = d3.scaleLinear()
    .domain([0,1])
    .range([text_x,-1.1*text_width])

var size_width = d3.scaleLinear()
    .domain([0,1])
    .range([rect_width,rect_width_tree])

var size_height = d3.scaleLinear()
    .domain([0,1])
    .range([rect_height,rect_height_tree])

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
    .attr('width',size_width(percent))
    .attr('height',size_height(percent))
   })
}

function updatePosition2(percent){
    node_data.forEach(d => {

        if (d.group == 1) {

            var leave_position_x = d3.scaleLinear()
            .domain([0.1,1])
            .range([grid_layout[d.id-1].x,grid_layout[d.id-1].x-(width*1.1)])
    
            d3.select('#word'+d.id)
                .attr('x',leave_position_x(percent))
        } else {
            var position_x = d3.scaleLinear()
            .domain([0.1,1])
            .range([grid_layout[d.id-1].x,d.px])

            var position_y = d3.scaleLinear()
            .domain([0.1,1])
            .range([grid_layout[d.id-1].y,d.py])
    
            d3.select('#word'+d.id)
                .attr('x',position_x(percent))
                .attr('y',position_y(percent))
        }
    })
}

function updatePosition3(percent){
    node_data.forEach(d => {

        if (d.group != 1) {
            var position_x = d3.scaleLinear()
            .domain([1,2])
            .range([d.px,d.px-width*2.9/5])
    
            d3.select('#word'+d.id)
                .attr('x',position_x(percent))
        }
    })
}

// setup scroll functionality
var scroll = scroller()
.container(d3.select('#h-scroll'));

// pass in .step selection as the steps
scroll(d3.selectAll('.step'));

scroll.on('progress', function (index, progress) {
// console.log(index)
// console.log(progress)
    if (index == 1 && progress > 0 && progress < 1){
        updatePosition(progress)
    } else if (index == 1 && progress <= 0){
        updatePosition(0)
    } else if (index == 2 && progress > 0.1 && progress < 1) {
        updatePosition2(progress)
    } else if (index == 2 && progress >= 1){
        updatePosition3(progress)
    }
});

})

