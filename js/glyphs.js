/**
 *
 * The initial package of the system
 *
 * @author Nan Cao (nancao.org)
 */

// the singleton
glyphs = function() {
	var glyphs = {},
		type = 'line'; // zline, zstar, star
	
	glyphs.anormaly = d3.scale.linear()
		.domain([-1.0, 0, 1.0]).range(['#2b83ba', 'white', '#990000']);
	
	glyphs.fill = function(d) {
		return activityvis.anormaly(d.score);
	};

	return glyphs;
}();
