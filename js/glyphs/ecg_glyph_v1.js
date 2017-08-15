glyphs.ecg_glyph = function() {

    var ecg_glyph = {},
        container = null,
        global_size = [1000, 500],
        local_size = [500, 250],
        signal = null,
        beats = null;

    ecg_glyph.container = function(_) {
        if (!arguments.length) return container;
        container = _;
        return ecg_glyph;
    };
    ecg_glyph.global_size = function(_) {
        if (!arguments.length) return global_size;
        global_size = _;
        return ecg_glyph;
    };
    ecg_glyph.local_size = function(_) {
        if (!arguments.length) return local_size;
        local_size = _;
        return ecg_glyph;
    };
    ecg_glyph.signal = function(_) {
        if (!arguments.length) return signal;
        signal = _;
        return ecg_glyph;
    };
    ecg_glyph.beats = function(_) {
        if (!arguments.length) return beats;
        beats = _;
        return ecg_glyph;
    };

    ///////////////////////////////////////////////////
    // Private Parameters

    //local scales, need to specify domain according to actual data
    // var x_local = d3.scaleLinear().range([0, local_size[0]]),
    //     y_local = d3.scaleLinear().range([0, local_size[1]]);


    ///////////////////////////////////////////////////
    // Public Function

    ecg_glyph.render = function() {

        var length_name = ['Pon', 'QRSon', 'QRSoff', 'Ton', 'Toff'];

        var std_length = [
            [0.12, 0.2], //PR
            [0.06, 0.11], //QRS
            [0.08, 0.12], //ST
            [0.1, 0.25] //T
        ];

        var height_name = ['Pheight', 'QRSheight', 'STheight', 'Theight'];

        var std_height = [
            [0, 250], 
            [200, 1000], 
            [-50, 90], 
            [0, 500]
        ];

        var big_div = container
            .selectAll('div')
            .data(beats)
            .enter()
                .append('div')
                .attr('class', 'big_div')
                .attr('id', function (d, i) {
                    return 'big_div_' + i;
                })
                .style('min-width', local_size[0] + 'px')
                .style('min-height', (local_size[1] + 20) + 'px')
                .style('overflow', 'hidden')
                .style('float', 'left')
                .style('border', '1px solid rgba(0, 0, 0, 0.3)');

        var event_div = big_div
            .append('div')
            .attr('class', 'event_div')
            .attr('id', function (d, i) {
                return 'event_div_' + i;
            })
            .style('width', local_size[0] + 'px')
            .style('height', local_size[1] + 'px');

        var button_div = big_div
            .append('div')
            .attr('class', 'button_div')
            .attr('id', function (d, i) {
                return 'button_div_' + i;
            })
            .style('width', local_size[0] +'px')
            .style('height', '20px');

        var event_group = event_div
            .append('svg')
            .attr('width', local_size[0])
            .attr('height', local_size[1])
            .attr('float', 'left')
                .append('g')
                .on('click', function (d, i) {
                    //debugging
                    // console.log(d);
                    var x_scale = d3.scaleLinear().domain([0, 1000]).range([0, local_size[0]]);
                    var y_scale = d3.scaleLinear().domain([1100, -1100]).range([0, local_size[1]]);
                    //we fix the p wave length to be the half of the pr interval
                    var lengths = [];
                    var heights = [];
                    for (var i = 0; i < 4; i++) {
                        lengths.push(d[length_name[i + 1]] - d[length_name[i]]);
                        heights.push(d[height_name[i]]);
                    }
                    //debugging
                    // console.log(lengths);
                    // console.log(heights);
                    var x_sample = makeArray(0, 1, 1000);
                    // var x_values = makeArray(0, local_size[0], 1000);
                    var y_values = [];
                    x_sample.forEach(function(x) {
                        if (x <= d['Pon']) {
                            y_values.push(y_scale(0));
                        }
                        //we fix the p wave length to be the half of the pr interval
                        else if (x > d['Pon'] && x <= (d['Pon'] + lengths[0] / 2)) {
                            var period = lengths[0];
                            y_values.push(y_scale(heights[0] * Math.sin((x - d['Pon']) * (2 * Math.PI / period))));
                        }
                        else if (x > (d['Pon'] + lengths[0] / 2) && x <= d['QRSon']) {
                            y_values.push(y_scale(0));
                        }
                        else if (x > d['QRSon'] && x <= d['QRSoff']) {
                            var period = lengths[1] * 2;
                            y_values.push(y_scale(heights[1] * Math.sin((x - d['QRSon']) * (2 * Math.PI / period))));
                        }
                        else if (x > d['QRSoff'] && x <= d['Ton']) {
                            y_values.push(y_scale(heights[2]));
                        }
                        else if (x > d['Ton'] && x <= d['Toff']) {
                            var period = lengths[3] * 2;
                            y_values.push(y_scale(heights[3] * Math.sin((x - d['Ton']) * (2 * Math.PI / period))));
                        }
                        else if (x > d['Toff']) {
                            y_values.push(y_scale(0));
                        }
                    });
                    var ecg_line = d3.select(this).append('path');
                    var lineGenerator = d3.line();
                    lineGenerator
                        .x(function (d, i) {
                            return x_scale(i);
                        })
                        .y(function (d) {
                            return d;
                        });
                    var line = lineGenerator(y_values);
                    ecg_line
                        .attr('d', line)
                        .attr('stroke', 'steelblue')
                        .attr('stroke-width', '2')
                        .attr('fill', 'none');
                    ecg_line.transition().duration(500);
                });


        var event_bg = event_group
            .append('rect')
            .attr('class', 'event_bg')
            .attr('id', function (d, i) {
                return 'event_bg_' + (i + 1);
            })
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', function (d) {
                if (isNaN(+d['end'])) 
                    return;
                var x_local = d3.scaleLinear().domain([+d['start'], +d['end']]).range([0, local_size[0]]);
                return (x_local(+d['end']) - x_local(+d['start']));
            })
            .attr('height', local_size[1])
            .style('fill', 'rgb(255, 214, 0')
            .style('fill-opacity', 0.2);

        var button = button_div
            .append('input')
            .attr('type', 'checkbox')
            .attr('id', function (d, i) {
                return i;
            })
            .attr('value', function (d, i) {
                return i;
            });

        event_group.each(function(d, i) {

            var x_local = d3.scaleLinear().domain([+d['start'], +d['end']]).range([0, local_size[0]]);

            for (var k = 0; k < 4; k++) {
                if (((+d[length_name[k + 1]] - +d[length_name[k]])) >= std_length[k][0] && ((+d[length_name[k + 1]] - +d[length_name[k]])) <= std_length[k][1]) {
                    d3.select(this).append('circle')
                        .attr('class', 'eventdiff eventdiff_' + length_name[k] + '_c')
                        .attr('cx', function(d) {
                            var stx = x_local(+d[length_name[k]]);
                            var edx = x_local(+d[length_name[k + 1]]);
                            return (stx + edx) / 2;
                        })
                        .attr('cy', local_size[1] / 2)
                        .attr('r', 4)
                        .attr('fill', 'black');
                } 
                else if (((+d[length_name[k + 1]] - +d[length_name[k]])) < std_length[k][0]) {
                    d3.select(this).append('rect')
                        .attr('class', 'eventdiff eventdiff_' + length_name[k] + '_rs')
                        .attr('x', function(d) {
                            var stx = x_local(+d[length_name[k]]);
                            var edx = x_local(+d[length_name[k + 1]]);
                            var scale = std_length[k][0]
                            return (2 * edx - (x_local(scale) - x_local(0))) / 2;
                        })
                        .attr('y', local_size[1] / 2)
                        .attr('height', 8)
                        .attr('width', function(d) {
                            var stx = x_local(+d[length_name[k]]);
                            var edx = x_local(+d[length_name[k + 1]]);
                            var scale = std_length[k][0];
                            return ((x_local(scale) - x_local(0)) - (edx - stx));
                        })
                        .attr('fill', '#1684bf');
                } 
                else {
                    d3.select(this).append('rect')
                        .attr('class', 'eventdiff eventdiff_' + length_name[k] + '_rl')
                        .attr('x', function(d) {
                            var stx = x_local(+d[length_name[k]]);
                            var edx = x_local(+d[length_name[k + 1]]);
                            var scale = std_length[k][1];
                            return (2 * stx + (x_local(scale) - x_local(0))) / 2;
                        })
                        .attr('y', local_size[1] / 2)
                        .attr('height', 4)
                        .attr('width', function(d) {
                            var stx = x_local(+d[length_name[k]]);
                            var edx = x_local(+d[length_name[k + 1]]);
                            var scale = std_length[k][1];
                            return ((edx - stx) - (x_local(scale) - x_local(0)))
                        })
                        .attr('fill', '#f0027f');
                }
            }

            for (var k = 0; k < 4; k++) {
                if (+d[height_name[k]] < std_height[k][0]) {
                    //debugging
                    // console.log('low');
                    // console.log(k);
                    d3.select(this).append('path')
                        .attr('class', 'eventdiff eventdiff_' + length_name[k] + '_hein')
                        .attr('d', function(d) {
                            var stx = x_local(+d[length_name[k]]);
                            var edx = x_local(+d[length_name[k + 1]]);
                            var diff = (+d[height_name[k]] - std_height[k][0]);
                            return "M" + (stx + edx) / 2 + ",150" + 'L' + (stx + edx) / 2 + ',' + local_size[1] /2;
                        })
                        .style('stroke-width', 2)
                        .style('stroke', 'black');
                    d3.select(this).append('circle')
                        .attr('class', 'eventdiff eventdiff_' + length_name[k] + '_c')
                        .attr('cx', function(d) {
                            var stx = x_local(+d[length_name[k]]);
                            var edx = x_local(+d[length_name[k + 1]]);
                            return (stx + edx) / 2;
                        })
                        .attr('cy', function(d) {
                            return (local_size[1] / 2);
                        })
                        .attr('r', 4)
                        .attr('fill', 'black');
                } 
                else if (+d[height_name[k]] > std_height[k][1]) {
                    //debugging
                    // console.log('high');
                    // console.log(k);
                    d3.select(this).append('path')
                        .attr('class', 'eventdiff eventdiff_' + length_name[k] + '_heip')
                        .attr('d', function(d) {
                            var stx = x_local(+d[length_name[k]]);
                            var edx = x_local(+d[length_name[k + 1]]);
                            var diff = +d[height_name[k]] - std_height[k][1];
                            return "M" + (stx + edx) / 2 + ",100" + 'L' + (stx + edx) / 2 + ',' + local_size[1] / 2;
                        })
                        .style('stroke-width', 2)
                        .style('stroke', 'black');
                    d3.select(this).append('circle')
                        .attr('class', 'eventdiff eventdiff_' + length_name[k] + '_c')
                        .attr('cx', function(d) {
                            var stx = x_local(+d[length_name[k]]);
                            var edx = x_local(+d[length_name[k + 1]]);
                            return (stx + edx) / 2;
                        })
                        .attr('cy', function(d) {
                            return (local_size[1] / 2);
                        })
                        .attr('r', 4)
                        .attr('fill', 'black');
                }
            }
        })




    }

    return ecg_glyph;
}
