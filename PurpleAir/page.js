var vals = []
var times = []
var time_to_datetime = {}
var datetimes = []

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

    $.getJSON("https://www.purpleair.com/json?show=14561", function (data) {
        vals.push(parseFloat(data["results"][0]["PM2_5Value"]))
        times.push(data["results"][0]["LastSeen"])
        time_to_datetime[(data["results"][0]["LastSeen"])] = new Date()
        datetimes.push(new Date())

    })

    var data = [{
        x: datetimes,
        y: vals,
        mode: 'lines+markers',
        name: 'PM 2.5 Time Series',
        line: {shape: 'hvh'}
    }]

    var layout = {
        title: "PM 2.5 at the Intersection of MLK & Peeples",
        xaxis: {
            title: 'Date & Time of Reading',
            showgrid: false,
            zeroline: false
        },
        yaxis: {
            title: 'PM 2.5 Reading',
            showline: false
        }
    }

    Plotly.plot(document.getElementById("pa_plot"), data, layout)

    setInterval(() => {
        // Repeated every minute:
        $.getJSON("https://www.purpleair.com/json?show=14561", function (data) {
            vals.push(parseFloat(data["results"][0]["PM2_5Value"]))
            times.push(data["results"][0]["LastSeen"])
            time_to_datetime[(data["results"][0]["LastSeen"])] = new Date()
            datetimes.push(new Date())
            // document.getElementById("pa_plot").innerHTML = ""
            data = [{
                x: datetimes,
                y: vals,
                mode: 'lines+markers',
                name: 'PM 2.5 Time Series',
                line: {shape: 'hvh'}
            }]

            Plotly.react(document.getElementById("pa_plot"), data, layout)
        })
    }, 1000);
}



function toggleSidebar() {
    $('.ui.sidebar').sidebar('toggle');
}