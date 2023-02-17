// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/tree
function Tree(data, { // data is either tabular (array of objects) or hierarchy (nested objects)
    path, // as an alternative to id and parentId, returns an array identifier, imputing internal nodes
    id = Array.isArray(data) ? d => d.id : null, // if tabular data, given a d in data, returns a unique identifier (string)
    parentId = Array.isArray(data) ? d => d.parentId : null, // if tabular data, given a node d, returns its parent’s identifier
    children, // if hierarchical data, given a d in data, returns its children
    tree = d3.tree, // layout algorithm (typically d3.tree or d3.cluster)
    sort, // how to sort nodes prior to layout (e.g., (a, b) => d3.descending(a.height, b.height))
    label, // given a node d, returns the display name
    title, // given a node d, returns its hover text
    link, // given a node d, its link (if any)
    linkTarget = "_blank", // the target attribute for links (if any)
    width = 640, // outer width, in pixels
    height, // outer height, in pixels
    r = 40, // radius of nodes
    padding = 1, // horizontal padding for first and last column
    fill = "#999", // fill for nodes
    fillOpacity, // fill opacity for nodes
    stroke = "#B5B5B5", // stroke for links
    strokeWidth = 2, // stroke width for links
    strokeOpacity = 1, // stroke opacity for links
    strokeLinejoin, // stroke line join for links
    strokeLinecap, // stroke line cap for links
    halo = "#fff", // color of label halo 
    haloWidth = 3, // padding around the labels
    curve = d3.curveBumpX, // curve for the link
    intervention_type
  } = {}) {

//   console.log(intervention_type)

    // If id and parentId options are specified, or the path option, use d3.stratify
    // to convert tabular data to a hierarchy; otherwise we assume that the data is
    // specified as an object {children} with nested objects (a.k.a. the “flare.json”
    // format), and use d3.hierarchy.
    const root = path != null ? d3.stratify().path(path)(data)
        : id != null || parentId != null ? d3.stratify().id(id).parentId(parentId)(data)
        : d3.hierarchy(data, children);
  
    // Sort the nodes.
    if (sort != null) root.sort(sort);
  
    // Compute labels and titles.
    const descendants = root.descendants();
    const L = label == null ? null : descendants.map(d => label(d.data, d));
  
    // Compute the layout.
    console.log(root)
    const dx = 60;
    const dy = 175//width / (root.height + padding);
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
    if (height === undefined) height = x1 - x0 + dx * 2;
  
    // Use the required curve
    if (typeof curve !== "function") throw new Error(`Unsupported curve`);
    // console.log(curve)
  
    const svg = d3.select('#tree-placeholder').append("svg")
        .attr("viewBox", [-dy * padding / 2, x0 - dx, width, height])
        .attr("width", width)
        .attr("height", height)
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10);

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
          .attr("d", d3.linkHorizontal(curve)
            //   .x(d => {
            //     return d.depth == 2 ? d.y/2 : d.y
            //    })
              .x(d => d.y)
              .y(d => d.x));

    // console.log(lnk)
  
    // const node = svg.append("g")
    //   .selectAll("a")
    //   .data(root.descendants())
    //   .join("a")
    //     .attr("xlink:href", link == null ? null : d => link(d.data, d))
    //     .attr("target", link == null ? null : linkTarget)
    //     .attr("transform", d => `translate(${d.y},${d.x})`);
  
    // node.append("rect")
    //     .attr("fill", d => d.children ? stroke : fill)
    //         .attr("height", r)
    //         .attr('width',r);

    const node = svg.append("g")
      .selectAll(".node-group")
      .data(root.descendants())
      .join("g")
      .attr('class','node-group')
      .attr('id',d => d.data.name)
        .attr("transform", d => `translate(${d.y-r*0.5},${d.x})`);

    node.append('rect')
    .attr("opacity", d => d.depth == 2 ? 0 : 1)
    .attr('fill','#22194D')
    // .attr('opacity',.3)
    .attr("height", r*1.25)
    .attr('width',r*5.25)
    .attr('transform','translate('+r/-7.5+','+r*-.625+')')

    node.append('rect')
    // .attr("fill", d => d.children ? stroke : fill)
    .attr('fill','white')
    .attr("opacity", d => d.depth == 2 ? 0 : .3)
    .attr("height", r)
    .attr('width',r*5)
    .attr('rx',10)
    .attr('transform','translate(0,'+r/-2+')')

    d3.select('#detection').attr('opacity',0)
  
    if (title != null) node.append("title")
        .text(d => title(d.data, d));
  
    if (L) node.append("text")
        .attr("dy", "0.32em")
        // .attr("x", d => d.children ? -6 : 6)
        .attr('x',r*5/2)
        // .attr("text-anchor", d => d.children ? "end" : "start")
        .attr("text-anchor",'middle')
        .attr('fill','white')
        .attr('font-size',16)
        // .attr("paint-order", "stroke")
        // .attr("stroke", halo)
        // .attr("stroke-width", haloWidth)
        .text((d, i) => L[i]);
  
    return svg.node();

     
  }

  function update(val) {
    if (val == 'koko'){
        // d3.select('#contact').attr('transform','translate(100,20)')
        // console.log()
    } else {
        // d3.select('#contact').attr('transform','translate(300,-100)')
        // document.getElementById('contact').getAttribute('transform')
        console.log(document.getElementById('contact').getAttribute('transform'))
    }
    }