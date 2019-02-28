var vals = {};
var currentSelection = "";
var chartType = "";

function change(element, graph) {
    $("#plot_segment").addClass("loading");
    if (currentSelection !== "") {
        $("#" + currentSelection).removeClass("active");
    }
    $(element).addClass("active");
    currentSelection = graph;
}

function changeChart(element, type) {
    $("#plot_segment").addClass("loading");
    if (chartType !== "") {
        $("#" + chartType).removeClass("active");
    }
    $(element).addClass("active");
    chartType = type;
}

function init() {

    $(document)
        .ready(function () {
            $('.masthead')
                .visibility({
                    once: false,
                    onBottomPassed: function () {
                        $('.fixed.menu').transition('fade in');
                    },
                    onBottomPassedReverse: function () {
                        $('.fixed.menu').transition('fade out');
                    }
                });
        });
    $("#central").click();
    $("#spline").click();
    getIP();
}

function toProper(text) {
    return text.substring(0, 1).toUpperCase() + text.substring(1).toLowerCase();
}

function getIP() {
    function setIP(url) {

        $.ajax({
            url: url,
            dataType: 'jsonp',
            success: function (data) {
                vals = data;
                var xs = [];
                var ys = [];
                for (var i in vals[currentSelection]) {
                    xs.push(vals[currentSelection][i][1]);
                    ys.push(vals[currentSelection][i][0]);
                }

                var plotly_data = [{
                    x: xs,
                    y: ys,
                    mode: 'lines+markers',
                    name: 'PM 2.5 Time Series',
                    line: {
                        shape: chartType
                    }
                }];

                var layout = {
                    title: {
                        text: "PM 2.5 at the Intersection of MLK & " + toProper(currentSelection),
                        font: {
                            color: "#EEEEEE"
                        }
                    },
                    plot_bgcolor: "#202020",
                    paper_bgcolor: "#202020",
                    text_color: "#EEEEEE",
                    xaxis: {
                        title: 'Date & Time of Reading',
                        showgrid: false,
                        zeroline: false,
                        color: "#EEEEEE"
                    },
                    yaxis: {
                        title: 'PM 2.5 Reading',
                        showline: false,
                        color: "#EEEEEE"
                    }
                };

                Plotly.plot(document.getElementById("pa_plot"), plotly_data, layout);
                $("#plot_segment").removeClass("loading");
                
                setInterval(() => {
                    $.ajax({
                        url: url,
                        dataType: 'jsonp',
                        success: function (data) {
                            vals = data;
                            var xs = [];
                            var ys = [];
                            for (var i in vals[currentSelection]) {
                                xs.push(vals[currentSelection][i][1]);
                                ys.push(vals[currentSelection][i][0]);
                            }

                            var plotly_data = [{
                                x: xs,
                                y: ys,
                                mode: 'lines+markers',
                                name: 'PM 2.5 Time Series',
                                line: {
                                    shape: chartType
                                }
                            }];

                            // We have to re-make layout because the title will change
                            var layout = {
                                title: {
                                    text: "PM 2.5 at the Intersection of MLK & " + toProper(currentSelection),
                                    font: {
                                        color: "#EEEEEE"
                                    }
                                },
                                plot_bgcolor: "#202020",
                                paper_bgcolor: "#202020",
                                text_color: "#EEEEEE",
                                xaxis: {
                                    title: 'Date & Time of Reading',
                                    showgrid: false,
                                    zeroline: false,
                                    color: "#EEEEEE"
                                },
                                yaxis: {
                                    title: 'PM 2.5 Reading',
                                    showline: false,
                                    color: "#EEEEEE"
                                }
                            };

                            Plotly.react(document.getElementById("pa_plot"), plotly_data, layout);
                            $("#plot_segment").removeClass("loading");
                        }
                    });
                }, 1000);
            }
        });
    }
    $.ajax({
        url: "http://150.182.130.194:3100/api",
        type: "HEAD",
        timeout: 1000,
        statusCode: {
            // Can connect
            200: function (response) {
                setIP("http://150.182.130.194:3100/api");
            },
            // Can't connect
            400: function (response) {
                $.ajax({
                    url: "http://10.199.1.152:3100/api",
                    type: "HEAD",
                    statusCode: {
                        200: function (response) {
                            setIP("http://10.199.1.152:3100/api");
                        },
                        400: function (response) {
                            setIP(null);
                        },
                        0: function (response) {
                            // Can connect
                            if (response.statusText === "error") {
                                setIP("http://10.199.1.152:3100/api");
                            } else {
                                setIP(null);
                            }

                        }
                    }
                });
            },
            // Maybe can connect?
            0: function (response) {
                // Can connect
                if (response.statusText === "error") {
                    setIP("http://150.182.130.194:3100/api");
                } else {
                    $.ajax({
                        url: "http://10.199.1.152:3100/api",
                        type: "HEAD",
                        timeout: 1000,
                        statusCode: {
                            200: function (response) {
                                setIP("http://10.199.1.152:3100/api");
                            },
                            400: function (response) {
                                setIP(null);
                            },
                            0: function (response) {
                                if (response.statusText === "error") {
                                    setIP("http://10.199.1.152:3100/api");
                                } else {
                                    setIP(null);
                                }
                            }
                        }
                    });
                }
            }
        }
    });
}

function toggleSidebar() {
    $('.ui.sidebar').sidebar('toggle');
}