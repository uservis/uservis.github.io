/*
	Star Glyph

	Traditional Star Glyph

	Author : Nan Cao (nancao.org)
*/

glyphs.gstar = function() {

	//private variables///////////////////////////////////////////////////////////
	var radii = 30,
		means,
		minfs,
		maxfs,
		rscale;

	var func = d3.svg.line()
			.x(function(d){return d[0];})
			.y(function(d){return d[1];})
			.interpolate("linear-closed");

	//public methods///////////////////////////////////////////////////////////
	gstar = function(selection) {
		selection.each(function(node, i) {
			
			radii = 0.8 * node.w / 2.0;

			var container = d3.select(this);
			container.selectAll(".glyph")
				.transition()
				.duration(500)
				.style("opacity", "1e-6")
				.remove();
			
			var fs = node.fs;
			
			var fscale = d3.scale.linear().domain([0, d3.max(maxfs)]).range([0, radii]);
			var angle = d3.scale.linear().domain([0, fs.length]).range([0, Math.PI * 2]);

			var polygon = [], mpolygon = []
			for(var i = 0; i < fs.length; ++i) {
				
				var a = angle(i);
				var p = [0, 0];
				p[0] = fscale(fs[i]) * Math.cos(a);
				p[1] = fscale(fs[i]) * Math.sin(a);
								
				polygon.push(p);
				
				if(means) {
					var mp = [0, 0];
					mp[0] = fscale(means[i]) * Math.cos(a);
					mp[1] = fscale(means[i]) * Math.sin(a);
					mpolygon.push(mp);
				}				
			}

			var glyph = container.append("g")
				.attr("class", "glyph")
				.style("opacity", "1e-6");
				
			glyph.append("circle")
				.attr("class", "boundary")
				.attr("stroke", "lightgrey")
				.attr("stroke-width", 0.5)
				.attr("r", radii)
				.attr("fill", "white");
							
			glyph.append("path")
				.attr("d", func(polygon))
				.attr("stroke", "grey")
				.attr("stroke-width", 0.5)
				.attr("fill", "#2c7bb6");
			
			if(means) {
				glyph.append("path")
					.attr("d", func(mpolygon))
					.attr("stroke", "red")
					.attr("stroke-width", 1)
					.attr("fill", 'none');
			}

			
			glyph
				.style("opacity", 1e-6)
				.transition()
				.delay(300)
				.style("opacity", "1");
		});

		return gstar;
	};
	
	gstar.type = function() {
		return 'Star Glyph';
	};
	
	gstar.isZGlyph = function() {
		return false;
	};


	gstar.rscale = function(_) {
		if (!arguments.length) return rscale;
		rscale = _;
		return gstar;
	};

	gstar.radii = function(_) {
		if(!arguments.length) {
			return radii;
		}
		radii = _;
		return gstar;
	};

	gstar.means = function(_) {
		if(arguments.length == 0) {
			return means;
		}
		means = _;
		return gstar;
	};
	
	gstar.minfs = function(_) {
		if (!arguments.length) return minfs;
		minfs = _;
		return gstar;
	};
	
	gstar.maxfs = function(_) {
		if (!arguments.length) return maxfs;
		maxfs = _;
		return gstar;
	};

	return gstar;
};
