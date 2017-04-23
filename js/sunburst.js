
/**
*   Sunburst chart control
*   @param {object} element: DOM element with the container
*   @param {string} path: URL where is the json data
*/
var Sunburst = function (element, path) {
    if (element === null || element.offsetParent === null) return;

    function sunBurst(selector) {
        var _graph = {};
        var _ux = '#2980B8',
            _front = '#f39c12',
            _back = '#e45e41',
            _experience = '#FFF';

        var _data,
            _width = element.offsetWidth * 2,
            _height = element.offsetHeight - 50,
            _radius = Math.min(_width, _height) / 2,
            _svg,
            _bodyG,
            _labelsG,
            _partition,
            _arc,
            _x = d3.scaleLinear().range([0, Math.PI * 2]),
            _y = d3.scaleSqrt().range([0, _radius]);

        _graph.render = function () {
            if (!_svg) {
                _svg = d3.select(selector).append('svg').attr('width', _width).attr('height', _height);
            }

            renderBody();
        }

        function renderBody() {
            if (!_bodyG) {
                _bodyG = _svg.append('g').attr('class', 'body').attr('transform', 'translate(0, ' + _height / 2 + ')');
            }

            processData();
            renderCircles();
        }

        function processData() {
            _data = d3.hierarchy(_data).sum(function (d) {
                return d.size;
            });
            _partition = d3.partition();
            _arc = d3.arc()
                        .startAngle(function (d) {
                            var x0 = Math.min(Math.PI, _x(d.x0 / Math.PI * 1.57));
                            return Math.max(0, x0);
                        })
                        .endAngle(function (d) {
                            var x1 = Math.min(Math.PI, _x(d.x1 / Math.PI * 1.57));
                            return Math.max(0, x1);
                        })
                        .innerRadius(function (d) {
                            return Math.max(0, _y(d.y0));
                        })
                        .outerRadius(function (d) {
                            return Math.max(0, _y(d.y1));
                        });
        }

        function renderCircles() {
            var node = _partition(_data).descendants();

            var pathG = _bodyG.selectAll('path')
                    .data(node)
                    .enter()
                    .append('g');

            pathG.append('path')
                .attr('data-skill', function (d) {
                    return d.data.skill;
                })
                .attr('data-skill-chain', function (d) {
                    var skill = '',
                        path = d;
                    for (var i = d.depth; i > 0; i--) {
                        skill += path.data.skill + '-';
                        path = path.parent;
                    }

                    return skill;
                })
                .attr('stroke', 'white')
                .attr('fill', function (d) {
                    var group = d.data.name;
                    if (d.depth === 2) {
                        group = d.parent.data.name;
                    } else if (d.depth === 3) {
                        group = d.parent.parent.data.name;
                    }
                    switch (group) {
                        case 'UX':
                            return d3.color(_ux).darker((d.depth - 1) / 2);
                            return _ux;
                            break;
                        case 'Front-End':
                            return d3.color(_front).darker((d.depth - 1) / 2);
                            return _front;
                            break;
                        case 'Back-End':
                            return d3.color(_back).darker((d.depth - 1) / 2);
                            return _back;
                            break;
                        default:
                            return '#FFF';
                            break;
                    }
                })
                .attr('d', _arc);

            pathG.append("text")
                    .text(function (d) {
                        return d.data.name;
                    })
                    .classed("label", true)
                    .attr("x", function (d) { return d.x; })
                    .attr("style", function (d) {
                        if (d.depth === 1) {
                            return 'font-size: 1.5em';
                        }
                        else {
                            return 'font-size: .9em';
                        }
                    })
                    .attr("text-anchor", function (d) {
                        if (d.depth === 1) {
                            return 'middle';
                        }
                        else {
                            return 'middle';
                        }
                    })
                    .attr("transform", function (d) {
                        if (d.depth > 0) {
                            return "translate(" + _arc.centroid(d) + ")" +
                                    "rotate(" + getAngle(d) + ")";
                        } else {
                            return null;
                        }
                    })
                    .attr("dx", "6")
                    .attr("dy", ".35em")
                    .attr("pointer-events", "none");
        }

        function getAngle(d) {
            var thetaDeg = (180 / Math.PI * (_arc.startAngle()(d) + _arc.endAngle()(d)) / 2 - 90);
            var rotation = (thetaDeg > 90) ? thetaDeg - 180 : thetaDeg + 180;

            return rotation;
        }

        _graph.data = function (data) {
            if (!arguments.length) return _data;
            _data = data;
            return _graph;
        }

        return _graph;
    }

    d3.json(path, function (error, data) {
        if (error) console.warn('Sunburst data not found');

        element.innerHTML = null;
        sunBurst('#' + element.id).data(data).render();
    });
}