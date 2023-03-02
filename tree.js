'use strict'

let tree = ((data, data_map = {width: 640, intervention_type: 'koko'}) => {

    var tree = d3.tree, 
        id = Array.isArray(data) ? d => d.id : null, 
        parentId = Array.isArray(data) ? d => d.parentId : null,
        r = 40,
        padding = 1,
        stroke = "#B5B5B5", // stroke for links
        strokeWidth = 2, // stroke width for links
        strokeOpacity = 1, // stroke opacity for links
        strokeLinejoin, // stroke line join for links
        strokeLinecap, // stroke line cap for links
        curve = d3.curveBumpX,
        path, children, sort, //height,
        // width = data_map.width,
        intervention_type = data_map.intervention_type

        var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? true : false



    // If id and parentId options are specified, or the path option, use d3.stratify
    // to convert tabular data to a hierarchy; otherwise we assume that the data is
    // specified as an object {children} with nested objects (a.k.a. the “flare.json”
    // format), and use d3.hierarchy.
    const root = path != null ? d3.stratify().path(path)(data)
        : id != null || parentId != null ? d3.stratify().id(id).parentId(parentId)(data)
        : d3.hierarchy(data, children);
  
    // Sort the nodes.
    if (sort != null) root.sort(sort);
  
  
    // Compute the layout.
    // console.log(root)
    const dx = isMobile ? 100 : 60;
    const dy = isMobile ? 159 : 175//width / (root.height + padding);
    tree().nodeSize([dx, dy])(root);

    // console.log(dy)
    
  
    // Center the tree.
    let x0 = Infinity;
    let x1 = -x0;
    root.each(d => {
      if (d.x > x1) x1 = d.x;
      if (d.x < x0) x0 = d.x;
    });
  
    // Compute the default height.
    // if (height === undefined) height = x1 - x0 + dx * 2;
  
    // Use the required curve
    if (typeof curve !== "function") throw new Error(`Unsupported curve`);
    // console.log(curve)
  
    // const svg = d3.select('#tree-placeholder').append("svg")
    //     .attr("viewBox", [-dy * padding / 2, x0 - dx, width, height])
    //     .attr("width", width)
    //     .attr("height", height)
    //     .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
    //     .attr("font-family", "sans-serif")
    //     .attr("font-size", 10);

    var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? true : false

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
    const svgWidth = isMobile ? screen.width*1.8 : 864 
    const svgHeight = isMobile ? screen.height*1.6 : 630//850//900 
    // const svgWidth = window.innerWidth
    // const svgHeight = window.innerHeight

    // helper calculated variables for inner width & height
    const height = svgHeight - margin.top - margin.bottom
    const width = svgWidth - margin.left - margin.right

    // add SVG
    // d3.select(`${selector} svg`).remove();
    var view = isMobile ? 10 : -dy * padding / 2

    const svg = d3.select('#tree-placeholder')
        .append('svg')
        // .attr('width','60vw')
        .attr("viewBox", `${view} ${x0 - dx} ${svgWidth} ${svgHeight}`)
        .append('g')
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    var lnk = root.links()
  
    svg.append("g")
        .attr("fill", "none")
        .attr("stroke", stroke)
        .attr("stroke-opacity", strokeOpacity)
        .attr("stroke-linecap", strokeLinecap)
        .attr("stroke-linejoin", strokeLinejoin)
        .attr("stroke-width", strokeWidth)
      .selectAll("path")
        .data(lnk)
        .join("path")
        .attr('class',d => 'link_group'+d.target.data.value)
        .attr('id',d => d.target.data.name == '. . .' || d.target.data.name == '' ? "empty"+d.source.data.name.replace(/\s/g, '')+'_path' : d.target.data.name.replace(/\s/g, '')+'_path')
          .attr("d", d3.linkHorizontal(curve)
            //   .x(d => {
            //     return d.depth == 2 ? d.y/2 : d.y
            //    })
              .x(d => d.y)
              .y(d => d.x));

// console.log(root.descendants())
    const node = svg.append("g")
      .selectAll(".node-group")
      .data(root.descendants())
      .join("g")
      .attr('class',d => 'node-group'+d.data.value)
      .attr('id',d => d.data.name == '. . .' || d.data.name == '' ? "empty"+d.parent.data.name.replace(/\s/g, '') : d.data.name.replace(/\s/g, ''))
      .attr('opacity',1)
      .attr("transform", d => `translate(${d.y-r*0.5},${d.x})`);

    node.append('rect')
    .attr("opacity", d => d.depth == 2 ? 0 : 1)
    .attr('fill','#22194D')
    .attr("height", r*1.25)
    .attr('width',r*5.25)
    .attr('transform','translate('+r/-7.5+','+r*-.625+')')

    node.append('rect')
    .attr('fill','white')
    .attr("opacity", d => d.depth == 2 ? 0 : .3)
    .attr("height", r)
    .attr('width',r*5)
    .attr('rx',10)
    .attr('transform','translate(0,'+r/-2+')')

    d3.select('#detection').attr('opacity',0)

    node.append("text")
        .attr("dy", "0.32em")
        .attr('x',r*5/2)
        .attr("text-anchor",'middle')
        .attr('font-family','Avenir')
        .attr('fill','white')
        .attr('font-size',isMobile ? 18 : 16)
        .text(d => d.data.name);

    svg.append('line')
        .attr('class','int_line')
        .attr('stroke','#B5B5B5')
        .attr('stroke-width',3)
        .attr('stroke-linecap','round')
        .attr('x1',-100)
        .attr('x2',0)
        .attr('y1',0)
        .attr('y2',0)
  
    // return svg.node();
// console.log(root.descendants())

var view = 0, og_position_call, og_position_text, koko_positions = [];
if (view == 0){
    og_position_call = document.getElementById('call').getAttribute('transform')
    og_position_text = document.getElementById('text').getAttribute('transform')

    root.descendants().forEach(el => {
        // console.log(el.data.name)
        if (el.data.name == "" || el.data.name == ". . ."){
            koko_positions.push({"name":"empty"+el.parent.data.name.replace(/\s/g, ''),
                                "node":document.getElementById("empty"+el.parent.data.name.replace(/\s/g, '')).getAttribute('transform'),
                                "path":document.getElementById("empty"+el.parent.data.name.replace(/\s/g, '')+"_path").getAttribute('d')
                            })
        } else if (el.data.name !== 'call' & el.data.name !== 'text'& el.data.name !== 'detection'){
            // console.log(el.data.name)
            koko_positions.push({"name":el.data.name.replace(/\s/g, ''),
                                "node":document.getElementById(el.data.name.replace(/\s/g, '')).getAttribute('transform'),
                                "path":document.getElementById(el.data.name.replace(/\s/g, '')+"_path").getAttribute('d')
                            })
        }
    });

}
// console.log(koko_positions)
  function tree_update(val) {
    if (val == 'koko'){
        d3.select('#call').attr('transform',og_position_call)
        d3.select('#call_path').attr('d','M350,-255C437.5,-255,437.5,-315,525,-315')
        d3.select('#text').attr('transform',og_position_text)
        d3.select('#text_path').attr('d','M350,-255C437.5,-255,437.5,-255,525,-255')
        d3.selectAll('.node-group0').attr('opacity',1)
        d3.selectAll('.link_group0').attr('opacity',1)
        koko_positions.forEach(el => {
            console.log('move: '+el.name+el.node+el.path),
            d3.select('#'+el.name).attr('transform',el.node)
            d3.select('#'+el.name+'_path').attr('d',el.path)
             
        })
        // console.log()
    } else {
        d3.select('#call').attr('transform','translate(250,-75)')
        d3.select('#call_path').attr('d','M0,0C125,0,125,-75,250,-75')
        d3.select('#text').attr('transform','translate(250,75)')
        d3.select('#text_path').attr('d','M0,0C125,0,125,75,250,75')
        d3.selectAll('.node-group0').attr('opacity',0).attr('transform','translate(0,0)')
        d3.selectAll('.link_group0').attr('opacity',0).attr('d','M0,0C0,0,0,0,0,0')
        // document.getElementById('contact').getAttribute('transform')
    }
  }

return {
    tree_update: tree_update,
}

})
