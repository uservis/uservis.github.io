/*
	Star Glyph

	Traditional Star Glyph

	Author : Nan Cao (nancao.org)
*/

glyphs.gbar = function() {

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
	gbar = function(selection) {
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
				xscale = d3.scale.linear().range([margin_w - hw, node.w - margin_w - hw]).domain([0, fs.length]),
				yscale = d3.scale.linear().range([node.h - margin_h - hh, margin_h - hh]).domain([0, d3.max(maxfs)]),
				hscale = d3.scale.linear().range([0, node.h - 2 * margin_h]).domain([0,  d3.max(maxfs)]);

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
				.attr("x", -1 * hh )
				.attr("y", -1 * hw)
				.attr("width", node.w - margin_w)
				.attr("height", node.h - margin_h)
				.style("fill", "white")
				.style("stroke", "lightgrey")
				.attr("stroke-width", 0.5);
			
			var bw = (node.w - 2 * margin_w) / fs.length;
			
			glyph.selectAll(".bar")
				.data(polygon).enter()
				.append("rect")
				.attr("class", "bar")
				.attr("x", function(d){return d[0] - bw / 2.0;})
				.attr("y", function(d){return d[1];})
				.attr("width", function(d){return bw;})
				.attr("height", function(d, i){return hscale(fs[i]);})
				.style("fill", "black");
			
			if(means) {
				glyph.append("path")
					.attr("d", func(mpolygon))
					.attr("stroke", "red")
					.attr("fill", 'none');				
			}

			glyph
				.style("opacity", 1e-6)
				.transition()
				.delay(300)
				.style("opacity", "1");
		});

		return gbar;
	};

	gbar.means = function(_) {
		if(arguments.length == 0) {
			return means;
		}
		means = _;
		return gbar;
	};
	
	gbar.minfs = function(_) {
		if (!arguments.length) return minfs;
		minfs = _;
		return gbar;
	};
	
	gbar.maxfs = function(_) {
		if (!arguments.length) return maxfs;
		maxfs = _;
		return gbar;
	};

	return gbar;
};
