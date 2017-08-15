/*
	Star Glyph

	Traditional Star Glyph

	Author : Nan Cao (nancao.org)
*/

glyphs.gzline = function() {

	//private variables///////////////////////////////////////////////////////////
	var maxZ = null,
		minZ = null;

	var func = d3.svg.line()
			.x(function(d){return d[0];})
			.y(function(d){return d[1];})
			.interpolate("linear");

	//public methods///////////////////////////////////////////////////////////
	gzline = function(selection) {
		selection.each(function(node, i) {

			var container = d3.select(this);
			container.selectAll(".glyph")
				.transition()
				.duration(500)
				.style("opacity", "1e-6")
				.remove();

			var Z = node.z,
				margin_w = node.w * 0.1,
				margin_h = node.h * 0.1,
				hw = node.w / 2.0,
				hh = node.h / 2.0,
				xscale = d3.scale.linear().range([margin_w - hw, node.w - margin_w - hw]).domain([0, Z.length - 1]),
				yscale = d3.scale.linear().range([node.h - margin_h - hh, margin_h - hh]).domain([minZ, maxZ]);

			var positive = [], negative = [], x = 0, y = 0;
			
			x = xscale(0);
			y = yscale(0);
			
			if(Z[0] > 0) {
				positive.push([x, y]);
				positive.push([x, yscale(Z[i])]);
				negative.push([x, y]);
			} else {
				negative.push([x, y]);
				negative.push([x, yscale(Z[i])]);
				positive.push([x, y]);
			}
			
			for(var i = 1; i < Z.length -1; ++i) {
			
				x = xscale(i);
				y = yscale(0);
				
				if(Z[i] > 0) {
					positive.push([x, yscale(Z[i])]);
					negative.push([x, y]);
				} else {
					negative.push([x, yscale(Z[i])]);
					positive.push([x, y]);
				}
				
			}
			
			x = xscale(Z.length);
			y = yscale(0);
			
			if(Z[Z.length - 1] > 0) {
				positive.push([x, yscale(Z[i])]);
				positive.push([x, y]);
				negative.push([x, y]);
			} else {
				negative.push([x, yscale(Z[i])]);
				negative.push([x, y]);
				positive.push([x, y]);
			}


			var glyph = container.append("g")
				.attr("class", "glyph")
				.style("opacity", "1e-6");
			
			glyph.append("rect")
				.attr("x", -1 * node.w / 2.0)
				.attr("y", -1 * node.h / 2.0)
				.attr("width", node.w - margin_w)
				.attr("height", node.h - margin_h)
				.style("fill", "white")
				.style("stroke", "lightgrey")
				.attr("stroke-width", 0.5);
			
			glyph.append("line")
				.attr("x1", function(d){return xscale(0);})
				.attr("y1", function(d){return yscale(0);})
				.attr("x2", function(d){return xscale(Z.length);})
				.attr("y2", function(d){return yscale(0);})
				.attr("stroke", "red")
				.attr("stroke-width", 0.5)
				.attr("fill", 'none');				
			
			glyph.append("path")
				.attr("d", func(positive))
				.attr("stroke", "none")
				.attr("stroke-width", 0.5)
				.attr("fill", "#fb6a4a");
			
			glyph.append("path")
				.attr("d", func(negative))
				.attr("stroke", "none")
				.attr("stroke-width", 0.5)
				.attr("fill", "#fb6a4a");

			glyph
				.style("opacity", 1e-6)
				.transition()
				.delay(300)
				.style("opacity", "1");
		});

		return gzline;
	};

	gzline.minZ = function(_) {
		if (!arguments.length) return minZ;
		minZ = _;
		return gzline;
	};
	
	gzline.maxZ = function(_) {
		if (!arguments.length) return maxZ;
		maxZ = _;
		return gzline;
	};

	return gzline;
};
