'use strict'

let force = ((state = 'koko',selector = '#force-placeholder') => {

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
    const svgWidth = 1440 
    const svgHeight = 850//900 
    // const svgWidth = window.innerWidth
    // const svgHeight = window.innerHeight

    // helper calculated variables for inner width & height
    const height = svgHeight - margin.top - margin.bottom
    const width = svgWidth - margin.left - margin.right

    // add SVG
    // d3.select(`${selector} svg`).remove();

    const svg = d3.select(selector)
        .append('svg')
        .attr("viewBox", `0 0 ${svgWidth} ${svgHeight}`)
        .append('g')
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")


    ////////////////////////////////////
    //////////////wrangle///////////////
    ////////////////////////////////////
    var caught_value = 50, missed_value = 10, nokoko_low = 20, nokoko_high = 20, tree_count = 12
    // if (state == 'koko'){
    //     value = 90
    //     tree_count = 12
    // } else {
    //     value = 30
    //     tree_count = 8
    // }

    var node_data = [], num_boxes = 100;
    // var caught = Math.round(num_boxes*(value/100))

    for (let i = 0; i < caught_value; i++) {
        var force
        if(i % 2 == 0) {
            force = 'yes'
        } else {
            force = 'no'
        }
        node_data.push({ "id": i+1, "class": 'caught',"group": 1, "opacity": .45, "r": 20, "px":0, "py":0, "force": force})
      }

    for (let i = 0; i < missed_value; i++) {
        var force
        if(i % 2 == 0) {
            force = 'yes'
        } else {
            force = 'no'
        }
        node_data.push({ "id": caught_value+i+1, "class": 'missed',"group": 1, "opacity": .2, "r": 20, "px":0, "py":0, "force": force})
    }

    for (let i = 0; i < nokoko_low; i++) {
        var force
        if(i % 2 == 0) {
            force = 'yes'
        } else {
            force = 'no'
        }
        node_data.push({ "id": caught_value+missed_value+i+1, "class": 'no_low',"group": 1, "opacity": .45, "r": 20, "px":0, "py":0, "force": force})
    }

    for (let i = 0; i < nokoko_high; i++) {
        var force
        if(i % 2 == 0) {
            force = 'yes'
        } else {
            force = 'no'
        }
        node_data.push({ "id": caught_value+missed_value+nokoko_low+i+1, "class": 'no_high',"group": 1, "opacity": .45, "r": 20, "px":0, "py":0, "force": force})
    }


    for (let i = 0; i < (tree_count); i++) {
        i < tree_count*2/3 ? node_data[i].group = 2 : node_data[i].group = 3
        i >= tree_count*2/3 ? node_data[i].class = node_data[i].class+3 : null
        node_data[i].px = Math.floor(Math.random() * (width/8)) + width*2/5
        node_data[i].py = Math.floor(Math.random() * (height/2)) + height/4
    }


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
        .force("radial", d3.forceRadial(d => Math.floor(Math.random() * 320) + 300, width / 2, center_y))
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
        .tick(1)


    ////////////////////////////////////
    //////////// add to DOM ////////////
    ////////////////////////////////////  

    var rect_height = 25, rect_width = 75, rect_width_tree = 70, rect_height_tree = 50;

    const node = svg.append("g")
            .selectAll(".forceword")
            .data(nodes)
            .join('g')
            .attr("class", "forceword")
            .attr("class", d=>'group'+d.class)
            .attr('id',d=>'group'+'word'+d.id)
            .call(drag(simulation));

    const node_text = node
            .selectAll(".forceword_word")
            .data(d=>[d])
            .join('text')
            .attr("class", "forceword_word")
            .attr("class", d=>'text'+d.class)
            .attr('id',d=>'text'+'word'+d.id)
            .text('keywords')
            .style('text-anchor','middle')
            .style("fill","white")
            .style('font-size',16)
            .style('filter','blur(3px)')
            .style("opacity",d => d.force == "no" ? 0 : 1);

    const node_rect = node
            .selectAll(".forceword_rect")
            .data(d=>[d])
            .join('rect')
            .attr("class", "forceword_rect")
            .attr("class", d=>d.class)
            .attr('id',d=>'word'+d.id)
            .attr("height",rect_height)
            .attr("width", rect_width)
            .style("fill","white")
            .style("fill-opacity",d => d.opacity)
            .style("opacity",d => d.force == "no" ? 0 : 1)
            .style('stroke',d => d.opacity == .45 ? '#ffffff' : '#ffffff00')
            .style('stroke-width','1.5px');

    var text_x = rect_width/2, text_y = 18

    simulation.on("tick", () => {

        node
            .attr("x", d => d.x)
            .attr("y", d => d.y)

        node_text
            .attr("x", d => d.x+text_x)
            .attr("y", d => d.y+text_y)

        node_rect
            .attr("x", d => d.x)
            .attr("y", d => d.y)
        
    })
    .on('end', () => {
      node.each(function () {
        const thisD3 = d3.select(this)
        
        grid_layout[thisD3.attr('id').split('d')[1]-1].sim_x = thisD3.attr('x')
        grid_layout[thisD3.attr('id').split('d')[1]-1].sim_y = thisD3.attr('y')
      })
    }) 



// var grid_layout = []
function calcGrid(value) {
    var columns = 10, rows = num_boxes/columns;

    // var start_x = width/2-rect_width_tree*columns/2, start_y = height/2-rect_height_tree*rows/2;
    var start_x = width*135/1440, start_y = height*243/900//243

    grid_layout[value-1].x = start_x+rect_width_tree*(value-(Math.ceil(value/columns)-1)*columns)-rect_width_tree
    grid_layout[value-1].y = start_y+rect_height_tree*Math.ceil(value/columns)-rect_height_tree

    // grid_layout.push({'id':value,'x':grid_x,'y':grid_y})

}

    ////////////////////////////////////
    /////////// treemap setup //////////
    ////////////////////////////////////

    var img_x = width*135/1440+(10*rect_width_tree), img_y = height*243/900+(6*rect_height_tree)+12
    var img_x1 = width+50, img_x2 = img_x+20, img_x3 = img_x2-(width*1.1);

    const tr_bracket = svg
        .append('path')
        .attr('class','tree-bracket')
        .attr('d','M2.39518 1.5L25.3477 1.5C31.4228 1.5 36.3477 6.42487 36.3477 12.5L36.3476 167.5C36.3476 173.575 31.4228 178.5 25.3476 178.5L2.39517 178.5')
        .attr('stroke','#B5B5B5')
        .attr('stroke-width',3)
        .attr('stroke-linecap','round')
        .attr('fill','none')
        .attr('transform','translate('+img_x1+','+img_y+')')

    const tr_bracket_line = svg
        .append('path')
        .attr('class','tree-bracket')
        .attr('d','M77.3945 90H36.345')
        .attr('stroke','#B5B5B5')
        .attr('stroke-width',3)
        .attr('stroke-linecap','round')
        .attr('fill','none')
        .attr('transform','translate('+img_x1+','+img_y+')')
    
    
    var shift = 100, ba_x1 = img_x1+shift, ba_x2 = img_x2+shift, ba_x3 = img_x3+shift, ba_y = img_y+35, line_height = '3%', font_size = 20;

    var base_annotation = svg.append('text')
        .attr('class','annotation')
        .attr('x',ba_x1)
        .attr('y',ba_y)
        .attr('fill','white')
        .attr('font-size',font_size)
        .attr('opacity',1);

    base_annotation.append('tspan')
        .attr('class','annotation')
        .attr('id','anno_koko')
        .attr('x',ba_x1)
        .attr('dy',line_height)
        .text(`Koko's detection system catches`);

    base_annotation.append('tspan')
        .attr('class','annotation')
        .attr('id','anno_koko')
        .attr('x',ba_x1)
        .attr('dy',line_height)
        .text('20-40% ')
        .attr('font-weight', 700)
        .append('tspan')
        .text('more concerning')
        .attr('font-weight', 400);

    base_annotation.append('tspan')
        .attr('class','annotation')
        .attr('id','anno_koko')
        .attr('x',ba_x1)
        .attr('dy',line_height)
        .text('keywords than traditional filters,');

    base_annotation.append('tspan')
        .attr('class','annotation')
        .attr('id','anno_koko')
        .attr('x',ba_x1)
        .attr('dy',line_height)
        .text('reaching more users.');

    var nokoko_annotation = svg.append('text')
        .attr('class','annotation')
        .attr('x',ba_x1)
        .attr('y',ba_y)
        .attr('fill','white')
        .attr('font-size',font_size)
        .attr('opacity',0);

    nokoko_annotation.append('tspan')
        .attr('class','annotation')
        .attr('id','anno_nokoko')
        .attr('x',ba_x1)
        .attr('dy',line_height)
        .text(`Koko has audited many of the largest`);

    nokoko_annotation.append('tspan')
        .attr('class','annotation')
        .attr('id','anno_nokoko')
        .attr('x',ba_x1)
        .attr('dy',line_height)
        .text('Internet platforms in the world.'); 
        
    nokoko_annotation.append('tspan')
        .attr('class','annotation')
        .attr('id','anno_nokoko')
        .attr('x',ba_x1)
        .attr('dy','1%')
        .text(' '); 

    nokoko_annotation.append('tspan')
        .attr('class','annotation')
        .attr('id','anno_nokoko')
        .attr('x',ba_x1)
        .attr('dy',line_height)
        .text('20-40% ')
        .attr('font-weight', 700)
        .append('tspan')
        .text(`of Koko's keywords`)
        .attr('font-weight', 400);

    nokoko_annotation.append('tspan')
        .attr('class','annotation')
        .attr('id','anno_nokoko')
        .attr('x',ba_x1)
        .attr('dy',line_height)
        .text(`aren't detected by these platforms.`);

    svg.append('line')
        .attr('class','int_line')
        .attr('stroke','#B5B5B5')
        .attr('stroke-width',3)
        .attr('stroke-linecap','round')
        .attr('x1',width+50)
        .attr('x2',width+50)
        .attr('y1',height/2)
        .attr('y2',height/2)

var force_opacity = d3.scaleLinear()
    .domain([.15,1])
    .range([0,1])

var missed_opacity = d3.scaleLinear()
    .domain([0,1])
    .range([.2,.45])

var missed_stroke = d3.scaleLinear()
    .domain([0,1])
    .range(["#ffffff00","#ffffff"])

var low_opacity = d3.scaleLinear()
    .domain([0,1])
    .range([.45,.7])

var high_opacity = d3.scaleLinear()
    .domain([0,1])
    .range([.45,.85])

var size_width = d3.scaleLinear()
    .domain([0,1])
    .range([rect_width,rect_width_tree])

var size_height = d3.scaleLinear()
    .domain([0,1])
    .range([rect_height,rect_height_tree])

var text_position_x = d3.scaleLinear()
    .domain([0,.95])
    .range([rect_width/2,rect_width_tree/2])

var text_position_y = d3.scaleLinear()
    .domain([0,.95])
    .range([(rect_height/2+4),(rect_height_tree/2+4)])

var size_width2 = d3.scaleLinear()
    .domain([0,.5,1])
    .range([rect_width_tree,rect_width,rect_width])

var size_height2 = d3.scaleLinear()
    .domain([0,.5,1])
    .range([rect_height_tree,rect_height,rect_height])

var text_width2 = d3.scaleLinear()
        .domain([0,.5,1])
        .range([rect_width_tree/2,rect_width/2,rect_width/2])
    
var text_height2 = d3.scaleLinear()
        .domain([0,.5,1])
        .range([rect_height_tree/2+4,rect_height/2+4,rect_height/2+4])

var text_opacity = d3.scaleLinear()
    .domain([.05,.25])
    .range([1,1])

var bracket_pos = d3.scaleLinear()
.domain([0,1])
.range([img_x1,img_x2])

var bracket_pos2 = d3.scaleLinear()
.domain([0,.5])
.range([img_x2,img_x3])

var text_pos = d3.scaleLinear()
.domain([0,1])
.range([ba_x1,ba_x2])

var text_pos2 = d3.scaleLinear()
.domain([0,.5])
.range([ba_x2,ba_x3])

var line_pos = d3.scaleLinear()
.domain([0,.5,1])
.range([width+50,(width/5)+width*2/5,(width/5)+width*2/5-width*2/5])

console.log((width/5)+width*2/5-width*2/5)

function updatePosition(percent) {
//    d3.selectAll('.force-text')
//    .attr('x',position(percent)) 

    tr_bracket
    .attr('transform','translate('+bracket_pos(percent)+','+img_y+')')

    tr_bracket_line
    .attr('transform','translate('+bracket_pos(percent)+','+img_y+')')

    d3.selectAll('.annotation').attr('x',text_pos(percent))

   node_data.forEach(d => {
    calcGrid(d.id)

    var grid_position_x = d3.scaleLinear()
    .domain([0,.95])
    .range([grid_layout[d.id-1].sim_x,grid_layout[d.id-1].x])

    var grid_position_y = d3.scaleLinear()
    .domain([0,.95])
    .range([grid_layout[d.id-1].sim_y,grid_layout[d.id-1].y])

    d3.select('#textword'+d.id)
    .attr('x',grid_position_x(percent)+text_position_x(percent))
    .attr('y',grid_position_y(percent)+text_position_y(percent))
    .style('opacity',d.force == "no" ? force_opacity(percent) : 1)

    d3.select('#word'+d.id)
    .attr('x',grid_position_x(percent))
    .attr('y',grid_position_y(percent))
    .attr('width',size_width(percent))
    .attr('height',size_height(percent))
    .style('opacity',d.force == "no" ? force_opacity(percent) : 1)
    .style("stroke",d.class == "missed" ? missed_stroke(percent) : '#ffffff')
    .style("fill-opacity",d.class == "missed" ? missed_opacity(percent) : ('fill-opacity',d.class == "no_low" ? low_opacity(percent) : ('fill-opacity',d.class == "no_high" ? high_opacity(percent) : d.opacity)))
   })
}

function updatePosition2(percent){
    tr_bracket
    .attr('transform','translate('+bracket_pos2(percent)+','+img_y+')')

    tr_bracket_line
    .attr('transform','translate('+bracket_pos2(percent)+','+img_y+')')

    d3.selectAll('.annotation').attr('x',text_pos2(percent))
    d3.select('.int_line').attr('x1',line_pos(percent))
    // console.log(percent)

    node_data.forEach(d => {

        if (d.group == 1) {

            var leave_position_x = d3.scaleLinear()
            .domain([0,.5])
            .range([grid_layout[d.id-1].x,grid_layout[d.id-1].x-(width*1.1)])
    
            d3.select('#word'+d.id)
                .attr('x',leave_position_x(percent))

            d3.select('#textword'+d.id)
            .attr('x',leave_position_x(percent)+rect_width_tree/2)
        } else {
            var position_x = d3.scaleLinear()
            .domain([0,.5,1])
            .range([grid_layout[d.id-1].x,d.px,d.px-width*2/5])

            var position_y = d3.scaleLinear()
            .domain([0,.5,1])
            .range([grid_layout[d.id-1].y,d.py,d.py])

            d3.select('#textword'+d.id)
            .attr('x',position_x(percent)+text_width2(percent))
            .attr('y',position_y(percent)+text_height2(percent))
    
            d3.select('#word'+d.id)
                .attr('x',position_x(percent))
                .attr('y',position_y(percent))
                .attr('width',size_width2(percent))
                .attr('height',size_height2(percent))
                .style('opacity',d.class == 'caught3' ? text_opacity(percent) : 1)
        }
    })
}

// function updatePosition3(percent){
//     node_data.forEach(d => {

//         if (d.group != 1) {
//             var position_x = d3.scaleLinear()
//             .domain([.5,1])
//             .range([d.px,d.px-width*2/5])
    
//             d3.select('#word'+d.id)
//                 .attr('x',position_x(percent))
//         }
//     })
// }

// setup scroll functionality
var prog, ind
var scroll = scroller()
.container(d3.select('#h-scroll'));

// pass in .step selection as the steps
scroll(d3.selectAll('.step'));

scroll.on('progress', function (index, progress) {
// console.log(index)
// console.log(progress)
    prog = progress, ind = index
    if (index == 2 && progress > 0 && progress < .95){
        updatePosition(progress)
    } else if (index == 2 && progress >= .95){
        updatePosition(.95)
    } else if (index == 2 && progress <= 0){
        updatePosition(0)
    // } else if (index == 3 && progress >= 0 && progress <= .5) {
    } else if (index == 3 && progress >= 0) {
        updatePosition2(progress)
    }
    // } else if (index == 3 && progress > .5){
    //     updatePosition3(progress)
    // }
});

function block_update(val) {
    if (val == 'koko'){

        low_opacity = d3.scaleLinear()
        .domain([0,1])
        .range([.45,.7])
    
        high_opacity = d3.scaleLinear()
        .domain([0,1])
        .range([.45,.85])

        base_annotation
        .attr('opacity',1)

        nokoko_annotation
        .attr('opacity',0)


        d3.selectAll('.no_low').style('stroke-opacity',1).style('fill-opacity',ind == 2 ? low_opacity(prog) : (ind > 2 ? low_opacity(1) : low_opacity(0)))
        d3.selectAll('.no_high').style('stroke-opacity',1).style('fill-opacity',ind == 2 ? high_opacity(prog) : (ind > 2 ? high_opacity(1) : high_opacity(0)))
        d3.selectAll('.caught3').style('opacity',1)
          
        // console.log()
    } else {

        low_opacity = d3.scaleLinear()
        .domain([0,1])
        .range([.2,.3])
    
        high_opacity = d3.scaleLinear()
        .domain([0,1])
        .range([.2,.2])

        text_opacity = d3.scaleLinear()
        .domain([.25,.5])
        .range([1,0])

        base_annotation
        .attr('opacity',0)

        nokoko_annotation
        .attr('opacity',1)

        d3.selectAll('.no_low').style('stroke-opacity',0).style('fill-opacity',ind == 2 ? low_opacity(prog) : (ind > 2 ? low_opacity(1) : low_opacity(0)))
        d3.selectAll('.no_high').style('stroke-opacity',0).style('fill-opacity',ind == 2 ? high_opacity(prog) : (ind > 2 ? high_opacity(1) : high_opacity(0)))
        d3.selectAll('.caught3').style('opacity',ind == 3 ? text_opacity(prog) : 1)
    }
  }

return {
    block_update: block_update,
}

})

