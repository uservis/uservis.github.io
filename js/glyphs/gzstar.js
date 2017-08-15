/*
	Z Score Star Glyph

	This is a star glyph that highlights the z-scores of a set of feature vectors.

	Author : Nan Cao (nancao.org)
*/

glyphs.gzstar = function() {

	var minZ = 0,
		maxZ = 0;

	//private variables///////////////////////////////////////////////////////////
	var func = d3.svg.line()
			.x(function(d){return d[0];})
			.y(function(d){return d[1];})
			.interpolate("basis-closed");

	//public methods///////////////////////////////////////////////////////////
	gzstar = function(selection) {
		selection.each(function(node, i) {

			var container = d3.select(this),
				Z = node.z,
				radii = 1 * node.w / 2.0,
				rr = radii / 2
			
			container.selectAll(".glyph")
				.transition()
				.duration(500)
				.style("opacity", "1e-6")
				.remove();
			
			if(!Z) {
				return gzstar;
			}

			var r = d3.scale.pow(0.3).domain([minZ, maxZ]).range([0, radii]);
			var angle = d3.scale.linear().domain([0, Z.length]).range([0, Math.PI * 2]);

			var p1 = [0,0], 
				p2 = [0,0], 
				p = [0,0],
				pz = 0,
				a = angle(0),
				cc = [0,0,r(0)];
			
			// generating z-series
			
			var series = [],
				negitive_series = [];
			
			p1[0] =  r(Z[0]) * Math.cos(a);
			p1[1] =  r(Z[0]) * Math.sin(a);
			if(Z[0] > 0) {
				p[0] = cc[2] * Math.cos(a);
				p[1] = cc[2] * Math.sin(a);
				negitive_series.push(p);
			} else {
				negitive_series.push(p1);
			}
			series.push(p1);
			
			for(var i = 1; i < Z.length; ++i) {
				a = angle(i);
				p2 = [0, 0];
				p2[0] = r(Z[i]) * Math.cos(a);
				p2[1] = r(Z[i]) * Math.sin(a);
				
				p = null;
				if(Z[i - 1] * Z[i] < 0) {
					p = intersection(p1, p2, cc);
					negitive_series.push(p);
				}
				
				if(Z[i] > 0) {
					p = [0,0];
					p[0] = cc[2] * Math.cos(a);
					p[1] = cc[2] * Math.sin(a);
					negitive_series.push(p);
				} else {
					negitive_series.push(p2);
				}
				series.push(p2);
				
				p1 = p2;
			}
			
			a = angle(Z.length);
			p2 = [0, 0];
			p2[0] = r(Z[0]) * Math.cos(a);
			p2[1] = r(Z[0]) * Math.sin(a);
			
			if(Z[0] * Z[Z.length - 1] < 0) {				
				p = intersection(p1, p2, cc);
				negitive_series.push(p);
			}
			
			p = [0,0];
			p[0] = cc[2] * Math.cos(a);
			p[1] = cc[2] * Math.sin(a);
			if(Z[i] > 0) {
				negitive_series.push(p);
			}

			var glyph = container.append("g")
				.attr("class", "glyph")
				.style("opacity", "1e-6");
			
			glyph
				.append("circle")
				.attr("class", "boundary")
				.attr("stroke", "lightgrey")
				.attr("stroke-width", 0.5)
				.attr("r", radii * 0.8)
				.attr("fill", "white");
				
			glyph
				.append("path")
				.attr("d", func(series))
				.style("stroke", "grey")
				.attr("stroke-width", 0.5)
				.attr("fill", "#d7191c");
/* 				.attr("fill", "#fb6a4a"); */
/* 				.attr("fill", "#fdae61"); */
			
			glyph
				.append("circle")
				.attr("stroke", "black")
				.attr("stroke-width", 0.5)
				.attr("r", cc[2])
				.attr("fill", "#2c7bb6");
// 				.attr("fill", "#0571b0");
/* 				.attr("fill", "#fdae61"); */
			
			glyph
				.append("path")
				.attr("d", func(negitive_series))
				.style("stroke", "grey")
				.attr("stroke-width", 0.5)
				.attr("fill", "white");
			
				
			glyph
				.style("opacity", 1e-6)
				.transition()
				.delay(300)
				.style("opacity", "1");

		});

		return gzstar;
	};
	
	gzstar.type = function() {
		return 'Z-Star Glyph';
	};
	
	gzstar.isZGlyph = function() {
		return true;
	};

	
	gzstar.minZ = function(_) {
		if (!arguments.length) return minZ;
		minZ = _;
		return gzstar;
	};
	
	gzstar.maxZ = function(_) {
		if (!arguments.length) return maxZ;
		maxZ = _;
		return gzstar;
	};
		
	function intersection(a, b, c) {
		// Calculate the euclidean distance between a & b
		eDistAtoB = Math.sqrt( Math.pow(b[0]-a[0], 2) + Math.pow(b[1]-a[1], 2) );
	
		// compute the direction vector d from a to b
		d = [ (b[0]-a[0])/eDistAtoB, (b[1]-a[1])/eDistAtoB ];
	
		// Now the line equation is x = dx*t + ax, y = dy*t + ay with 0 <= t <= 1.
	
		// compute the value t of the closest point to the circle center (cx, cy)
		t = (d[0] * (c[0]-a[0])) + (d[1] * (c[1]-a[1]));
	
		// compute the coordinates of the point e on line and closest to c
	    var e = [0, 0];
		e[0] = (t * d[0]) + a[0];
		e[1] = (t * d[1]) + a[1];
	
		// Calculate the euclidean distance between c & e
		eDistCtoE = Math.sqrt( Math.pow(e[0]-c[0], 2) + Math.pow(e[1]-c[1], 2) );
	
		// test if the line intersects the circle
		if( eDistCtoE < c[2] ) {
		
			// compute distance from t to circle intersection point
		    dt = Math.sqrt( Math.pow(c[2], 2) - Math.pow(eDistCtoE, 2));
	
		    // compute first intersection point
		    
		    var p1 = [0, 0];
		    p1[0] = ((t-dt) * d[0]) + a[0];
		    p1[1] = ((t-dt) * d[1]) + a[1];
 		    	
		    var p2 = [0, 0];
		    p2[0] = ((t+dt) * d[0]) + a[0];
		    p2[1] = ((t+dt) * d[1]) + a[1];
		    
		    return is_on(a, b, p1) ? p1 : is_on(a, b, p2) ? p2 : null;
		    
		} else if (parseInt(eDistCtoE) === parseInt(c[2])) {
			return e;
		} else {
			return null
		}
	};
	
	function distance(a,b) {
		return Math.sqrt( Math.pow(a[0]-b[0], 2) + Math.pow(a[1]-b[1], 2) )
	};
	
	function is_on(a, b, c) {
		return Math.abs(distance(a,c) + distance(c,b) - distance(a,b)) < 1e-3;
	};
	
	return gzstar;
};
