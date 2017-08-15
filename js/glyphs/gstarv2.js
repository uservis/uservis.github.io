/*
	Star Glyph

	Traditional Star Glyph with only contour

	Author : Nan Cao (nancao.org)
*/

glyphs.gstarv2 = function() {

	//private variables///////////////////////////////////////////////////////////
	var radius = 20,
		means,
		minfs,
		maxfs;

	var func = d3.svg.line()
			.x(function(d){return d[0];})
			.y(function(d){return d[1];})
			.interpolate("linear-closed");

	//public methods///////////////////////////////////////////////////////////
	gstarv2 = function(selection) {
	
		selection.each(function(node, i) {
			
			node.r = 0.8 * node.w / 2.0;

			var container = d3.select(this);
			container.selectAll(".glyph").remove();
			
			var fs = node.fs;
			
			var fscale = d3.scale.linear().range([0, node.r]);
			var angle = d3.scale.linear().domain([0, fs.length]).range([0, Math.PI * 2]);

			var polyline = [], mpolygon = [];
			for(var i = 0; i < fs.length; ++i) {
				
				fscale.domain([0, maxfs[i]]);
				
				var a = angle(i);
				var p = [0, 0];
				p[0] = fscale(fs[i]) * Math.cos(a);
				p[1] = fscale(fs[i]) * Math.sin(a);
				
				polyline.push(p);
				
				if(means) {
					var mp = [0, 0];
					mp[0] = fscale(means[i]) * Math.cos(a);
					mp[1] = fscale(means[i]) * Math.sin(a);
					mpolygon.push(mp);
				}				
			}

			var glyph = container.append("g")
				.attr("class", "glyph");
				
			glyph.append("circle")
				.attr("class", "boundary")
				.attr("stroke", "lightgrey")
				.attr("stroke-width", 0.5)
				.attr("r", node.r)
				.attr("fill", "white");
			
			if(means) {
				glyph.append("path")
					.attr("d", func(mpolygon))
					.attr("stroke", "red")
					.attr("stroke-width", 1)
					.attr("fill", 'none');
			}
			
			glyph.append("path")
				.attr("d", func(polyline))
				.style("stroke", 'grey')
				.attr("stroke-width", 1)
				.attr("fill", 'none');			
						
		});

		return gstarv2;
	};
	
	gstarv2.type = function() {
		return 'Star Glyph V2';
	};
	
	gstarv2.isZGlyph = function() {
		return false;
	};

	gstarv2.radius = function(_) {
		if(!arguments.length) {
			return radius;
		}
		radius = _;
		return gstarv2;
	};

	gstarv2.means = function(_) {
		if(arguments.length == 0) {
			return means;
		}
		means = _;
		return gstarv2;
	};
	
	gstarv2.minfs = function(_) {
		if (!arguments.length) return minfs;
		minfs = _;
		return gstarv2;
	};
	
	gstarv2.maxfs = function(_) {
		if (!arguments.length) return maxfs;
		maxfs = _;
		return gstarv2;
	};

	return gstarv2;
};
