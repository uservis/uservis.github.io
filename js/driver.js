/*
	System Driver
	Author : Nan Cao (nancao.org)
*/
var gview = glyphs.view().size([960, 650]),
	gstar = glyphs.gstar(),
	gmstar = glyphs.gmstar(),
	gzstar = glyphs.gzstar(),
	gline = glyphs.gline(),
	gmline = glyphs.gmline(),
	gzline = glyphs.gzline(),
	ecg_glyph = glyphs.ecg_glyph(),
	glyphs = null,
	taskid = 0,
	toolid = 0,
	runner = taskrunner();

// layout UI and setup events
$(document).ready(function() {
	
	 
	order = [
		[gstar, gmstar, gzstar, gline, gmline, gzline],
		[gmstar, gzstar, gline, gmline, gzline, gstar],
		[gzstar, gline, gmline, gzline, gstar, gmstar],
		[gline, gmline, gzline, gstar, gmstar, gzstar],
		[gmline, gzline, gstar, gmstar, gzstar, gline],
		[gzline, gstar, gmstar, gzstar, gline, gmline]
	];
	

	var params = location.search
		.replace ( "?", "" )
		.substr(1)
		.split("&"),
		idx = parseInt(params[0].split("=")[1]);
	
	if(!isNaN(idx)) {
		glyphs = order[idx];
	} else {
		glyphs = order[0];
	}
	
	var first = true;
	
	function assign(d) {
		data = d;
	};

	gview.container(d3.select("#mainview").append("svg"));
	gview.layout().render();
	
	var url = window.location.href,
		params = url.split('?');
	d3.json("./data/study.json", function(d) {
		runner.tasks(d);
	});
	
    $( "#next" ).button().click(function() {
    
    	if(!first && !gview.isReady()) {
    		alert("Please pick exact 3 outliers !");
	    	return;
    	}
    	
    	first = false;
	    runner.stop();
	    runner.next();
	    runner.start();
    });
    
    gview.dispatch.on('mouseover', function(d) {
		gview.highlight(d, true);
	});

	gview.dispatch.on('mouseout', function(d) {
		gview.highlight(d, false);
	});
	
    gview.dispatch.on('select', function(d){
	    gview.select(d);
    });
    
    runner.dispatch.on('start', function(d, tid, did) {
	});
	
	runner.dispatch.on('stop', function(d, tid, did) {
		gview.clear();
	});
	
	runner.dispatch.on('next', function(d, vid, did) {
		if(d) {
			display(d, glyphs[vid]);
		}
	});
	
});

function display(d, g) {
	
	if(d == null || g == null) {
		return;
	}
	
	// clean contents
	if(g.isZGlyph()) {
		g.minZ(d.data.minZ)
		.maxZ(d.data.maxZ);
	} else {
		g.means(d.data.mean)
		.minfs(d.data.min)
		.maxfs(d.data.max);
	}
	
	gview
		.clear()
		.glyph(g)
		.nodes(d.data.items)
		.task(d.name)
		.layout()
		.update();
};