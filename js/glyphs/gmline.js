/*
	Star Glyph

	Traditional Star Glyph

	Author : Nan Cao (nancao.org)
*/

glyphs.gmline = function() {

	//private variables///////////////////////////////////////////////////////////
	var maxZ = null,
		minZ = null;

	var func = d3.svg.line()
			.x(function(d){return d[0];})
			.y(function(d){return d[1];})
			.interpolate("linear");

	//public methods///////////////////////////////////////////////////////////
	gmline = function(selection) {
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
				xscale = d3.scale.linear().range([margin_w -hw, hw - 2 *margin_w]).domain([0, Z.length]),
				yscale = d3.scale.linear().range([node.h - margin_h - hh, margin_h - hh]).domain([minZ, maxZ]),
				series = [];
						
			for(var i = 0; i < Z.length; ++i) {
				series.push([xscale(i), yscale(Z[i])]);				
			}


			var glyph = container.append("g")
				.attr("class", "glyph")
				.style("opacity", "1e-6");
			
			glyph.append("rect")
				.attr("class", "boundary")
				.attr("x", -1 * node.w / 2.0)
				.attr("y", -1 * node.h / 2.0)
				.attr("width", node.w - margin_w)
				.attr("height", node.h - margin_h)
				.style("fill", "white");
							
			glyph.append("line")
				.attr("x1", function(d){return xscale(0);})
				.attr("y1", function(d){return yscale(0);})
				.attr("x2", function(d){return xscale(Z.length);})
				.attr("y2", function(d){return yscale(0);})
				.attr("stroke", "red")
				.attr("stroke-width", 1)
				.attr("fill", 'none');
			
			glyph.append("path")
				.attr("d", func(series))
				.attr("stroke", "black")
				.attr("stroke-width", 0.5)
				.attr("fill", "none");
			
			glyph
				.style("opacity", 1e-6)
				.transition()
				.delay(300)
				.style("opacity", "1");
		});

		return gmline;
	};
	
	gmline.type = function() {
		return 'Standardized Line Glyph';
	};
	
	gmline.isZGlyph = function() {
		return true;
	};


	gmline.minZ = function(_) {
		if (!arguments.length) return minZ;
		minZ = _;
		return gmline;
	};
	
	gmline.maxZ = function(_) {
		if (!arguments.length) return maxZ;
		maxZ = _;
		return gmline;
	};

	return gmline;
};
