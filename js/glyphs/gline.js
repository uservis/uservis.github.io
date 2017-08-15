/*
	Star Glyph

	Traditional Star Glyph

	Author : Nan Cao (nancao.org)
*/

glyphs.gline = function() {

	//private variables///////////////////////////////////////////////////////////
	var means = null,
		minfs = null,
		maxfs = null,
		rscale = null;

	var func = d3.svg.line()
			.x(function(d){return d[0];})
			.y(function(d){return d[1];})
			.interpolate("linear");

	//public methods///////////////////////////////////////////////////////////
	gline = function(selection) {
		selection.each(function(node, i) {

			var container = d3.select(this);
			container.selectAll(".glyph")
				.transition()
				.duration(500)
				.style("opacity", "1e-6")
				.remove();

			var fs = node.fs,
				margin_w = node.w * 0.1,
				margin_h = node.h * 0.1,
				hw = node.w / 2.0,
				hh = node.h / 2.0,
				xscale = d3.scale.linear().range([margin_w - hw, hw - 2 *margin_w]).domain([0, fs.length]),
				yscale = d3.scale.linear().range([node.h - margin_h - hh, margin_h - hh]).domain([0, d3.max(maxfs)]);

			var polygon = [], mpolygon = []
			for(var i = 0; i < fs.length; ++i) {
				
				polygon.push([xscale(i), yscale(fs[i])]);
				
				if(means) {
					mpolygon.push([xscale(i), yscale(means[i])]);
				}				
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
			
			if(means) {
				glyph.append("path")
					.attr("d", func(mpolygon))
					.attr("stroke", "red")
					.attr("stroke-width", 1)
					.attr("fill", 'none');				
			}
			
			glyph.append("path")
				.attr("d", func(polygon))
				.attr("stroke", "black")
				.attr("stroke-width", 0.5)
				.attr("fill", "none");

			glyph
				.style("opacity", 1e-6)
				.transition()
				.delay(300)
				.style("opacity", "1");
		});

		return gline;
	};
	
	gline.type = function() {
		return 'Line Glyph';
	};
	
	gline.isZGlyph = function() {
		return false;
	};

	gline.means = function(_) {
		if(arguments.length == 0) {
			return means;
		}
		means = _;
		return gline;
	};
	
	gline.minfs = function(_) {
		if (!arguments.length) return minfs;
		minfs = _;
		return gline;
	};
	
	gline.maxfs = function(_) {
		if (!arguments.length) return maxfs;
		maxfs = _;
		return gline;
	};

	return gline;
};
