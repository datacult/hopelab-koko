'use strict'

let force_text = ((state = 'koko',selector = '#keywords',selector2 = '#intervention') => {

    var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? true : false

    ////////////////////////////////////
    //////////// force setup ///////////
    ////////////////////////////////////

    var header_text = `When a platform uses Koko’s detection library, they are able to identify significantly more high-risk content.`
    var desc_text = 'The detection library is constantly evolving to mirror trends and new types of concerning content.'

    var nokoko_text = 'Without Koko, some of these high-risk terms will be detected, but ways to evade filters evolve quickly and many are missed. '
    const text = d3.select(selector)
        .append('div')
        .attr('class','force-text')
        .style('display','flex')
        .style('flex-direction','column')
        .style('align-items','center')
        .style('justify-content','center')
        .style('height','100%')
            // .style('margin','auto')


    var header = text.append('p')
        .attr('class','force-headline')
        .text(header_text)
        .style('width','450px')
        .style('margin','0')
        .style('text-align','center')
        .style('color','#ffffff')
        .style('font-size','1.33rem')
        .style('line-height','135%')
        .style('font-family','Avenir')
        .style('font-weight','500')

        text.append('br')

    var desc = text.append('p')
        .attr('class','force-desc')
        .text(desc_text)
        .style('width','450px')
        .style('margin','0')
        .style('text-align','center')
        .style('color','#ffffff')
        .style('font-size','1rem')
        .style('line-height','135%')
        .style('font-family','Avenir')


        var koko_int_text = `When redirected to Koko, the user is greeted with a variety of support options in an accessible way. `
        
        var nokoko_int_text = 'In the case where keywords are detected, most platforms redirect to a major crisis line.'

        const txt = d3.select(selector2)
            .append('div')
            .attr('class','int-text')
            // .style('margin','auto')
            .style('display','flex')
            .style('flex-direction','column')
            .style('padding-top','20vw')
    
    
        var int_text = txt.append('p')
            .attr('class','force-headline')
            .text(koko_int_text)
            .style('width','450px')
            .style('margin','auto')
            .style('text-align','center')
            .style('color','#ffffff')
            .style('font-size','1.15rem')
            .style('line-height','135%')
            .style('font-family','Avenir')
            .style('font-weight','500')

        var img_div = txt.append('div')
            .attr('class','bakcground')
            .style('padding','0 3vw')
            .style('background','#22194D')
            .style('margin','5vw auto')
            .style('z-index',100)

        var int_image = img_div.append('img')
            .attr('class','int-img')
            .attr('src','koko.gif')
            .style('width','30vw')
    


function ftext_update(val) {
    if (val == 'koko'){
        header.text(header_text)
        desc.text(desc_text)
        int_text.text(koko_int_text)
        int_image.attr('src','koko.gif')
        img_div.style('background','#22194D')
        
    } else {
        header.text(nokoko_text)
        desc.text('')
        int_text.text(nokoko_int_text)
        int_image.attr('src','Message.png')
        img_div.style('background','#000000')

    }
  }

return {
    ftext_update: ftext_update,
}

})

