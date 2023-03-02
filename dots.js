'use strict'

let dots = ((selector = '#dot-placeholder') => {

    var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? true : false

    ////////////////////////////////////
    //////////// svg setup /////////////
    ////////////////////////////////////

    var body = d3.select(selector)
    body.html("")

    // margins for SVG
    const margin = isMobile ? {
        left: 25,
        right: 25,
        top: 25,
        bottom: 25
    } : {
        left: 10,
        right: 10,
        top: 10,
        bottom: 10
    }

    // responsive width & height
    const svgWidth = isMobile ? screen.width*1.5 : 1440 
    const svgHeight = isMobile ? screen.height*1.5 : 850//900 

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
    //////////scroll observers//////////
    ////////////////////////////////////
    let options = {
        root: null,
        rootMargin: "0px",
        threshold: [.5]
      };
        
        const distress = document.querySelector('#distress');

        const distressObserver = new IntersectionObserver(handleDistress, options);
    
        function handleDistress(entry, observer) {
            if (entry[0].intersectionRatio > .5) {
                update(1)
            }
        };
    
        distressObserver.observe(distress);

        const suicide = document.querySelector('#suicide');

        const suicideObserver = new IntersectionObserver(handleSuicide, options);
    
        function handleSuicide(entry, observer) {
            if (entry[0].intersectionRatio > .5) {
                update(2)
            }
        };

        suicideObserver.observe(suicide);

        const social = document.querySelector('#social');

        const socialObserver = new IntersectionObserver(handleSocial, options);
    
        function handleSocial(entry, observer) {
            if (entry[0].intersectionRatio > .5) {
                update(3)
            }
        };

        socialObserver.observe(social);

    var r = 5;

    //calc num based on width/2/r and height/2/r
    var num_row = Math.round((height/2)/(r*2)), num_col = Math.round((width/2)/(r))
    var num_dots = num_col*num_row;
    var grid_layout = []
    for (let i = 0; i < num_dots; i++) {
        grid_layout.push({ "id": i+1, "x": 0, "y": 0, "fill": 'white', "opacity": .1, "social": 'no'})
      }




    ////////////////////////////////////
    //////////// add to DOM ////////////
    //////////////////////////////////// 
    var cols, extra 
function socialPerc(val){
    cols = Math.ceil(num_col*val/100)-1
    var tot_dots = Math.round(num_dots*val/100)
    extra = tot_dots-(num_row)*cols
}

socialPerc(62)

function calcGrid(value) {

    var start_x = width/2-r*num_col, start_y = height/2-r*2*num_row;

    var grid_id = 1
    for (var column = 0; column < num_col; column++) {
		
		// iterate for cells/columns inside rows
		for (var row = 0; row < num_row; row++) {
			grid_layout[grid_id-1].x = start_x+r/2
            grid_layout[grid_id-1].y = start_y+r/2

            if (row < extra && column <= cols) {
                grid_layout[grid_id-1].social = 'yes'
            } else if (row >= extra && column < cols) {
                grid_layout[grid_id-1].social = 'yes'
            }
            
			// increment the x position. I.e. move it over by 50 (width variable)
            start_y += r*4;
            grid_id++
		}

        if(column % 2 == 0) {
            start_y = height/2-r*2*num_row+r*2;
        } else {
            start_y = height/2-r*2*num_row;
        }
		
		// increment the y position for the next row. Move it down 50 (height variable)
        start_x += r*2;	
	}

}

grid_layout.forEach(val => {
    calcGrid(val.id)
})


var data_grid, ids = [];
randomSelect(grid_layout,42,18,'white',.5,'#F1C54A',1)

const dot = svg
        .selectAll(".dots")
        .data(data_grid)
        .join('circle')
        .attr("class", "dots")
        .attr('id',d=>'dot'+d.id)
        .attr("r",r)
        .attr('cx',d => d.x)
        .attr('cy',d => d.y)
        .style("fill",d => ids.includes(d.id) ? d.fill : 'white')
        .style("opacity",d => ids.includes(d.id) ? d.opacity : 1)


function randomSelect(arr,val,val2,fill,opac,fill2,opac2) {
    var perc = Math.round(num_dots*val/100)
    var perc2 = Math.round(num_dots*val2/100)
    let random = arr.sort(() => .5 - Math.random()).splice(0,perc)
    let random_subset = random.sort(() => .5 - Math.random()).splice(0,perc2)
    random.forEach(d => {
        d.fill = fill
        d.opacity = opac
    })
    random_subset.forEach(d => {
        d.fill = fill2
        d.opacity = opac2
    })
    grid_layout.forEach(d => {
        ids.push(d.id)
    })
    
    data_grid = grid_layout.concat(random.concat(random_subset))
}


//scroll update function
function update(val){

    if (val == 1) {

        dot
        .style("fill",d => ids.includes(d.id) ? d.fill : 'white')
        .style("opacity",d => ids.includes(d.id) ? d.opacity : 1)

    } else if (val == 2){

        dot
        .style("fill",d => d.fill)
        .style("opacity",d => d.opacity)

    } else if (val == 3){

        dot
        .style("fill",'white')
        .style("opacity",d => d.social == 'no' ? .1 : 1)

    }   

}
    
})

