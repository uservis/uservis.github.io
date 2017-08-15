/**
 *
 * The initial package of the system
 *
 * @author Nan Cao (nancao.org)
 */

glyphs.view = function() {
	
	
	var view = {},
		container = null,
		nodes = [],
		features = null,
		size = [960, 800],
	 	margin = {left:10, top:10, right:10, bottom:10},
		dispatch = d3.dispatch("select", "mouseover", "mouseout"),
		glyph = null,
		taskname = '';
	
	view.container = function(_) {
		if (!arguments.length) return container;
		container = _;
		return view;
	};
	
	view.task = function(_) {
		if (!arguments.length) return taskname;
		taskname = _;
		return view;
	};
	
	view.nodes = function(_) {
		if (!arguments.length) return nodes;
		nodes = _;
		return view;
	};
	
	view.similarity = function(_) {
		if (!arguments.length) return similarity;
		similarity = _;
		return view;
	}
	
	view.size = function(_) {
		if (!arguments.length) return size;
		size = _;
		return view;
	};
	
	view.margin = function(_) {
		if (!arguments.length) return margin;
		margin = _;
		return view;
	};
	
	view.glyph = function(_) {
		if (!arguments.length) return glyph;
		glyph = _;
		return view;
	};
	
	view.dispatch = dispatch;
	
	
	///////////////////////////////////////////////////
	// Private Parameters
	var grid = [],
		validslots = {},
		free = [], used = [],
		center = {},
		energy = 0,
		edgenum, 
		gridsize = 65;
    
	///////////////////////////////////////////////////
	// Public Function
	view.render = function() {
		
		container
            .attr("width", size[0])
            .attr("height", size[1]);

        container.append("svg:defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", size[0])
            .attr("height", size[1])
            .attr("fill", "white");
        
        _viewport = container.append("g")
            .attr("class", "viewport");

        // initialize pixel panel
        var vplain = _viewport
            .append("g")
            .attr("class", "vplain");
        
		return view.update();
	};
	
    view.highlight = function(d, flag) {
        container.select("#n" + d.id).classed("highlighted", flag);
        return view;
    };
    
    view.select = function(d) {
	    
	    if(d.selected) {
		    d.selected = false;
		    container.select("#n" + d.id).classed("selected", false);
	    } else {
		    d.selected = true;
		    container.select("#n" + d.id).classed("selected", true);
	    }
	    
        return view;
    };
    
    view.isReady = function() {
    	
    	var cnt = 0;
    	
    	for(var i = 0; i < nodes.length; ++i) {
			if(nodes[i].selected) {
				cnt ++;
			}
    	}
    	
	    return cnt == 3;
    };
	
	view.clear = function() {
        
        selected = [];
        
        container
        	.selectAll("text")
        	.remove();
        
        container
        	.selectAll(".vertex")
        	.remove();
        
        return view;
	};
		
	view.update = function() {
		
        container.append("text")
        	.attr("transform", "translate(80,50)")
        	.attr("text-anchor", "middle")
			.style("fill", "black")
        	.text(taskname.replace('72', '24'));
        
		
		var vplain = container.select(".vplain");
		
        var vg = vplain.selectAll(".vertex")
        	.data(nodes, function(d) {
            	return d.id
        	});
        	
        vg.exit().remove();

        var ng = vg.enter()
            .append("g")
            .attr("id", function(d) {
                return "n" + d.id;
            })
            .attr("class", "vertex")
            .attr("transform", function(d) {
                return "translate(" + (d.x + d.w /2.0) + "," + (d.y + d.h / 2.0) + ")";
            });
        
        if(glyph) {
	        container.append("text")
	        	.attr("transform", "translate(80,70)")
	        	.attr("text-anchor", "middle")
				.style("fill", "black")
	        	.text(glyph.type());
	    	vg.call(glyph);
        }
        
        ng.on("click", function(d) {
			dispatch.select(d);
        })
        .on("mouseover", function(d) {
			dispatch.mouseover(d);
        })
        .on("mouseout", function(d) {
			dispatch.mouseout(d);
        });

		updateTooltips();
		
		return view;
	};
	
	function updateTooltips() {
		
		$(".doc").tipsy({ 
			gravity: 'nw', 
			html: true, 
			fade: false, 
			opacity: 1,
			delayIn: 500,
			title: function() {			
				var d = this.__data__,
					words = d3.map();
					
				for(var i = 0; i < d.keywords.length; ++i) {
					for(var j = 0; j < d.keywords[i].length; ++j) {
						var k = d.keywords[i][j];
						if(words.has(k))
							words.set(k, words.get(k) + 1);
						else
							words.set(k, 1);
					}
				}
				
				words = words.entries()
					.sort(function(a, b) {return b.value - a.value;})
					.map(function(w) {return w.key;});
					
				var tip = "<div style='text-align:left'><div class='contents'>"
					+ "keywords: " + words.join(", ")
					+" </div></div>";
				return tip;	
			}
		});			
	};
		
	view.layout = function() {
		
		if(!nodes) {
			return view;
		}
		
		var rows = Math.sqrt(nodes.length),
			cols = rows,
			ss = rows * gridsize,
			sx = (size[0] - ss) / 2.0,
			sy = (size[1] - ss) / 2.0;
		        	
        var hsize = gridsize / 2.0;
        
		for(var i = 0; i < rows; ++i) {
			for(var j = 0; j < cols; ++j) {
				var idx = i * cols + j;
				if(idx >= nodes.length) {
					break;
				}
				nodes[idx].x = sx + j * gridsize;
				nodes[idx].y = sy + i * gridsize;
				nodes[idx].w = gridsize;
				nodes[idx].h = gridsize;
			}
		}
        		
		return view;
	};
	
	view.cluster = function() {
		
		if (!nodes || !similarity) {
            return view;
        }
        
        // 1. initialize pixel grid
        
        var colsize = Math.floor(size[0] / gridsize),
        	rowsize = Math.floor(size[1] / gridsize);
                
        for(var i = 0; i < rowsize; ++i) {
        	grid.push([]);
	        for(var j = 0; j < colsize; ++j) {
		        grid[i].push(-1);
	        }
        }
        
        var id = Math.floor(rowsize / 2) + ":" + Math.floor(colsize / 2);
        center = {row:Math.floor(rowsize / 2), col:Math.floor(colsize / 2)};
        validslots = {};
        
        // 2. initialize
        edgenum = 0;
        energy = 0;
        free = [];
        used = [];
        for (var i = 0; i < nodes.length; ++i) {
            free.push(nodes[i]);
            nodes[i].idx = i;
        }

        // compute the layout
        while (true) {
	        
            var node = recommend_node();
            if (!node) {
                break;
            }

            var slot = recommend_slot(node);
            if (!slot) {
                break;
            }
            
            grid[slot.row][slot.col] = node.idx;
            node.x = slot.col * gridsize;
            node.y = slot.row * gridsize;
            
            used.push(node);
            
            // update validate slots
            if(slot.col + 1 < grid.length) {
	            sid = slot.row + ":" + (slot.col + 1);
	            if(!validslots[sid] && grid[slot.row][slot.col + 1] == -1) {
		        	validslots[sid] = {row:slot.row, col:slot.col + 1};
	            }	            
            }
            
            if(slot.col - 1 >= 0) {
	            sid = slot.row + ":" + (slot.col - 1);            
	            if(!validslots[sid] && grid[slot.row][slot.col - 1] == -1) {
		        	validslots[sid] = {row:slot.row, col:slot.col - 1};   
	            }
            }
            
            if(slot.row + 1 < grid.length) {
	            sid = (slot.row + 1) + ":" + (slot.col);            
	            if(!validslots[sid] && grid[slot.row + 1][slot.col - 1] == -1) {
		        	validslots[sid] = {row:slot.row + 1, col:slot.col - 1};   
	            }	            
            }
            
            if(slot.row - 1 >= 0) {
	            sid = (slot.row - 1) + ":" + (slot.col);            
	            if(!validslots[sid] && grid[slot.row - 1][slot.col1] == -1) {
		        	validslots[sid] = {row:slot.row - 1, col:slot.col};   
	            }	            
            }
        }
        
        validslots = null;
		
		return view;
	};
		
	///////////////////////////////////////////////////
	// Private Functions
    function recommend_slot(node) {
    	
    	if(used.length == 0) {
			return center;
    	}
    	
		var slot = null,
            nidx = -1,
            delta_e = 0,
            delta_E = 0,
            inc_E = 0,
            inc_e = 0,
            max_e = 0,
            sidx = 0,
            ee = 0,
            ecnt = 0;
    	
    	// compute energy
    	for(var key in validslots) {
	    	
	    	slot = validslots[key],
	    		delta_E = 0,
				delta_e = 0;
			
			if(slot.row + 1 < grid.length) {
		    	nidx = grid[slot.row + 1][slot.col];
		    	if(nidx != -1) {
		    		delta_E += similarity[nidx][node.idx];
		    		delta_e ++;
		    	}				
			}
	    	
	    	if(slot.row - 1 >= 0) {
		    	nidx = grid[slot.row - 1][slot.col];
		    	if(nidx != -1) {
			    	delta_E += similarity[nidx][node.idx];
		    		delta_e ++;
		    	}
	    	}
	    	
	    	if(slot.col - 1 >= 0) {
		    	nidx = grid[slot.row][slot.col - 1];
		    	if(nidx != -1) {
			    	delta_E += similarity[nidx][node.idx];
		    		delta_e ++;
		    	}		    	
	    	}
	    	
	    	if(slot.col + 1 < grid.length) {
		    	nidx = grid[slot.row][slot.col + 1];
		    	if(nidx != -1) {
			    	delta_E += similarity[nidx][node.idx];
		    		delta_e ++;
		    	}		    	
	    	}
	    	
	    	ee = (energy + delta_E) / (edgenum + delta_e);
	    	if (ee > max_e) {
                sidx = key;
                max_e = ee;
                inc_e = delta_e;
                inc_E = delta_E;
            }
    	}
    	
    	slot = validslots[sidx];
        energy += inc_E;
        edgenum += inc_e;
        
        return slot;
    };

    function recommend_node() {
    
    	var degree = 0, 
    		maxd = 0,
    		idx = -1,
    		node = null;
    		
    	if(free.length == 0) {
	    	return null;
    	}
    	
    	if(used.length == 0) {
	    	for(var i = 0; i < free.length; ++i) {
	    		for(var j = i + 1; j < free.length; ++j) {
		    		degree += similarity[free[i].idx][free[j].idx];
	    		}
	    		if(degree > maxd) {
		    		maxd = degree;
		    		idx = i;
	    		}
	    	}	    	
    	} else {
	    	for(var i = 0; i < free.length; ++i) {
		    	for(var j = 0; j < used.length; ++j) {
		    		if(maxd < similarity[free[i].idx][used[j].idx]) {
			    		idx = i;
			    		maxd = similarity[free[i].idx][used[j].idx];
		    		}
				}
	    	}
    	}
    	
    	return free.splice(idx, 1)[0];
    };
	
	return view;
}