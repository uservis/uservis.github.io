glyphs.pointview = function() {

    var pointview = {},
        container = null,
        nodes = [],
        q = 0;
        glyph = null,
        size = [960, 800],
        margin = { left: 10, top: 10, right: 10, bottom: 10 },
        dispatch = d3.dispatch("select", "mouseover", "mouseout", "click");

    pointview.container = function(_) {
        if (!arguments.length) return container;
        container = _;
        return pointview;
    };

    pointview.nodes = function(_) {
        if (!arguments.length) return nodes;
        nodes = _.dots;
        q = _.q;
        return pointview;
    };

    pointview.size = function(_) {
        if (!arguments.length) return size;
        size = _;
        return pointview;
    };

    pointview.margin = function(_) {
        if (!arguments.length) return margin;
        margin = _;
        return pointview;
    };

    pointview.glyph = function(_) {
        if (!arguments.length) return glyph;
        glyph = _;
        return pointview;
    };

    pointview.dispatch = dispatch;

    ///////////////////////////////////////////////////
    // Private Parameters

    var trans = [0, 0],
        scale = 1,
        zoom = d3.behavior.zoom().on("zoom", function() {
            scale = d3.event.scale;
            trans = d3.event.translate;
            // container
            //     .select(".canvas")
            //     .attr("transform", "translate(" + (margin.left + trans[0]) + "," + (margin.top + trans[1]) + ") scale(" + scale + ")")
        });
    var gridsize = 65;

    var colorScale = (isAnomaly) => { return isAnomaly ? '#3182bd' : '#9ecae1' };
    ///////////////////////////////////////////////////
    // Public Function
    pointview.clear = function() {

        if (!container) {
            return;
        }

        container.selectAll(".node").remove();

        return pointview;
    };

    pointview.layout = function() {

        if (!nodes) {
            return pointview;
        }

        for (var i = 0; i < nodes.length; ++i) {
            nodes[i].px = nodes[i].x * (size[0]);
            nodes[i].py = nodes[i].y * (size[1]);
            // nodes[i].col = nodes[i].color;
            nodes[i].w = gridsize;
            nodes[i].h = gridsize;
            nodes[i].r = 15;
        }
        
        return pointview;
    };

    pointview.render = function() {

        if (!container) {
            return;
        }

        container
            .attr("width", size[0])
            .attr("height", size[1])
            .attr("transform", "translate(0, " + (-4) + ")");

        container.selectAll(".canvas, .backrect, defs").remove();

        var color = d3.interpolate('#fff', '#9ecae1');
        // initiate a zooming pannel
        // var rectangle = container.append("rect")
        //     .attr("class", "backrect")
        //     .attr("x", 0)
        //     .attr("y", 0)
        //     .attr("id", "pointview")
        //     .attr("width", size[0])
        //     .attr("height", size[1])
        //     .attr("fill", 'white')
        //     .style("stroke", "lightgrey")
        //     .style("stroke-width", "4px")

            // Method 3: add the background color
            // .attr("fill", function() {
            //     console.log(q);
            //     // Method 3: add the background color
            //     return color(q);
            // });

        // container.append("rect")
        //     .attr("class", "backrect")
        //     .attr("x", 0)
        //     .attr("y", 0)
        //     .attr("width", (1 - 2/3 * q) * size[0])
        //     .attr("height", (1 - 2/3 * q) * size[1])
        //     .attr("transform", "translate(" + ( 1/3 * q * size[0]) + "," + ( 1/3 * q * size[1]) + ")")
        //     .attr("fill", 'white')
        //     .style("stroke", "lightgrey")
        //     .style("stroke-width", "4px");

        container.append("svg:defs")
            .append("filter")
            .attr("id", "blur")
            .append("feGaussianBlur")
            .attr("stdDeviation", q * 10);

        //     .on('dblclick', function(d) {
        //         trans = [0, 0];
        //         scale = 1;
        //         zoom.scale(scale).translate(trans);
        //         container.select(".canvas")
        //             .attr("transform", "translate(" + (margin.left + trans[0]) + "," + (margin.top + trans[1]) + ") scale(" + scale + ")")
        //     })
        //     .call(zoom).on("dblclick.zoom", null);

        // create the rendering pannel  
        // container.append("g")
        //     .attr("class", "canvas")
        //     .attr("transform", "translate(" + (margin.left + trans[0]) + "," + (margin.top + trans[1]) + ") scale(" + scale + ")");

        return pointview.update();
    };

    pointview.update = function() {

        // var canvas = container.select(".canvas");

        var vnodes = container.selectAll(".node")
            .data(nodes, function(d) { return d.x });


        // remove old nodes
        vnodes.exit().remove();

        // update of all existing nodes
        container.selectAll(".node circle")
            .attr("cx", function(d) { return d.px; })
            .attr("cy", function(d) { return d.py; })
            .attr("r", function(d) { return d.r; })

        // append new nodes
        vnodes.enter().append("g")
            .attr("class", "node")
            .append("circle")
            .attr("cx", function(d) { return d.px; })
            .attr("cy", function(d) { return d.py; })
            .attr("transform", "translate(0, " + (-5) + ")")
            .attr("r", function(d) { return d.r; })
            .style("fill", function(d) {
                return "#3182bd"; 
                // return colorScale(d.isAnomaly); 
            })
            .style('opacity', function(d) {
                return d.isAnomaly ? 1 : 0.5;
            })
            .on("mouseover", dispatch.mouseover)
            .on("mouseout", dispatch.mouseout)
            .on("click", function(d) {})

            // Method 1: add the filter effect
            // .attr("filter", "url(#blur)")

            // Method 2: change the density of the dots
            .attr("cx", function(d) { 
                var ratio = 1 - 2/3 * q;
                d.px = ratio * size[0] * d.x;
                return d.px + size[0] * (1 - ratio)/2; 
            })
            .attr("cy", function(d) { 
                var ratio = 1 - 2/3 * q;
                d.py = ratio * size[0] * d.y;
                return d.py + size[1] * (1 - ratio)/2; 
            })

        // var nnodes = vnodes.enter()
        //     .append("g")
        //     .attr("class", "node")
        //     .attr("transform", function(d) {
        //         return "translate(" + d.px + "," + d.py + ")";
        //     });

        // if(glyph) {
        //     vnodes.call(glyph);
        // }

        vnodes.on("click", function(d) {
                dispatch.select(d);
            })
            .on("mouseover", function(d) {
                dispatch.mouseover(d);
            })
            .on("mouseout", function(d) {
                dispatch.mouseout(d);
            });

        return pointview;
    };

    ///////////////////////////////////////////////////
    // Private Functions

    function private_function1() {

    };

    function private_function2() {

    };

    function private_function3() {

    };

    return pointview;
};