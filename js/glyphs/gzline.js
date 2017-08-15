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
				xscale = d3.scale.linear().range([margin_w -hw, hw - 2 *margin_w]).domain([0, Z.length]),
				yscale = d3.scale.linear().range([node.h - margin_h - hh, margin_h - hh]).domain([minZ, maxZ]),
				series = [],
				pos = [],
				neg = [];
			
			pos.push([xscale(0), yscale(0)]);
			neg.push([xscale(0), yscale(0)]);
			series.push([xscale(0), yscale(0)]);	
			for(var i = 0; i < Z.length; ++i) {
				if(Z[i] > 0) {
					pos.push([xscale(i), yscale(Z[i])]);
					neg.push([xscale(i), yscale(0)]);
				} else {
					neg.push([xscale(i), yscale(Z[i])]);
					pos.push([xscale(i), yscale(0)]);
				}
				series.push([xscale(i), yscale(Z[i])]);				
			}
			series.push([xscale(Z.length - 1), yscale(0)]);
			pos.push([xscale(Z.length - 1), yscale(0)]);
			neg.push([xscale(Z.length - 1), yscale(0)]);



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
			
			/*
glyph.append("path")
				.attr("d", func(series))
				.attr("stroke", "black")
				.attr("stroke-width", 0.5)
				.attr("fill", "#0571b0");
*/

			glyph.append("path")
				.attr("d", func(neg))
				.attr("stroke", "grey")
				.attr("stroke-width", 0.5)
				.attr("fill", "#d7191c");
				
			glyph.append("path")
				.attr("d", func(pos))
				.attr("stroke", "grey")
				.attr("stroke-width", 0.5)
				.attr("fill", "#2c7bb6");
			
			glyph.append("line")
				.attr("x1", function(d){return xscale(0);})
				.attr("y1", function(d){return yscale(0);})
				.attr("x2", function(d){return xscale(Z.length);})
				.attr("y2", function(d){return yscale(0);})
				.attr("stroke", "red")
				.attr("stroke-width", 0.5)
				.attr("fill", 'none');
			
			glyph
				.style("opacity", 1e-6)
				.transition()
				.delay(300)
				.style("opacity", "1");
		});

		return gzline;
	};
	
	gzline.type = function() {
		return 'Z-Line Glyph';
	};
	
	gzline.isZGlyph = function() {
		return true;
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
