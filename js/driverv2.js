/*
	System Driver
	Author : Nan Cao (nancao.org)
*/
var time = 2000;
var gview = glyphs.view().size([960, 650]),
    pview = glyphs.pointview().size([650, 650]),
    gstarv1 = glyphs.gstarv1(),
    gstarv2 = glyphs.gstarv2(),
    gzstar = glyphs.gzstar(),
    gzarea = glyphs.gzline(),
    ecg_glyph = glyphs.ecg_glyph(),
    glyphs = null,
    taskid = 0,
    toolid = 0,
    runner = taskrunner();

// layout UI and setup events
$(document).ready(function() {

    var params = location.search
        .replace("?", "")
        .substr(1)
        .split("&"),
        idx = parseInt(params[0].split("=")[1]);

    glyphs = [gstarv1, gstarv2, gzstar, gzarea];

    var terminate = true;
    var first = false;
    var second = first;

    function assign(d) {
        data = d;
    };

    pview.container(d3.select("#mainview").append("svg"));
    pview.layout().render();

    var url = window.location.href,
        params = url.split('?');

    d3.json("./data/pilot_study.json", function(d) {
        //abnormal_height
        runner.tasks(d);
    });

    $("#yes").button().click(function() {
        runner.judge(1);
    });

    $("#no").button().click(function() {
        runner.judge(0);
    });

    var counter = 5;
    var interval = setInterval(function() {
        counter--;
        // Display 'counter' wherever you want to display it.
        pview.container().append("text")
            .attr("class", "click")
            .attr("transform", "translate(" + pview.size()[0] / 2 + ", " + pview.size()[1] / 3 + ")")
            .attr("dy", "1em")
            .text(counter + 1)
            .transition()
            .duration(1000)
            .style("opacity", 0)
            .remove();

        if (counter == 0) {
            // Display a login box
            first = true;
            clearInterval(interval);
        }
    }, 1000);
    
    setTimeout(function() {
        setInterval(function(){    
            if(terminate) {
                runner.stop();
                runner.next();
                runner.start();
            }
        }, time); //单位毫秒
    }, 5000);

    pview.dispatch.on('select', function(d) {
        pview.select(d);
    });

    runner.dispatch.on('start', function(d, tid, did) {});

    runner.dispatch.on('stop', function(d, tid, did) {
        pview.clear();
    });

    runner.dispatch.on('terminate', function() {
        terminate = false;
    });

    runner.dispatch.on('next', function(d, vid, did) {
        if (d) {
            display(d);
        }
    });

});

function display(d) {

    if (d == null) {
        return;
    }

    pview
        .clear()
        // .glyph(g)
        .nodes(d)
        // .task(d)
        .layout()
        .update();
};
