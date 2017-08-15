/*
	Circle Glyph
	Author : Nan Cao (nancao.org)
*/


glyphs.gcircle = function() {

	gcircle = function(selection) {
		selection.each(function(node, i) {
			var container = d3.select(this);

			container.selectAll(".glyph")
				.transition()
				.duration(500)
				.style("opacity", "1e-6")
				.remove();


			var glyph = container.append("g")
				.attr("class", "glyph")
				.style("opacity", "1e-6");
			
			
			glyph.append("circle")
				.attr("r", 10)
				.style("fill", "red");

			glyph
				.style("opacity", 1e-6)
				.transition()
				.delay(300)
				.style("opacity", "1");
		});

		return gcircle;
	};

	return gcircle;
};
