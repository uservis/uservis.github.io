/*
	Circle Glyph
	Author : Nan Cao (nancao.org)
*/


glyphs.grect = function() {

	grect = function(selection) {
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

			glyph.append("rect")
				.attr("x", -1 * node.w / 2.0)
				.attr("y", -1 * node.h / 2.0)
				.attr("width", node.w)
				.attr("height", node.h)
				.style("fill", "white")
				.style("stroke", "black");

			glyph
				.style("opacity", 1e-6)
				.transition()
				.delay(300)
				.style("opacity", "1");
		});

		return grect;
	};

	return grect;
};
