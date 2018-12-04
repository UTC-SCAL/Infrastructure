var tooltips = []

function init() {
    tooltips.push(
        tippy('#counter_icon', {
            content: "Copy to Clipboard",
            delay: 100,
            arrow: true,
            arrowType: 'round',
            size: 'large',
            duration: 500,
            animation: 'scale',
            hideOnClick: false
        })
    )

    // Embed the video via JQuery
    $('#video').embed()
}

function copyURL(link, element) {
    document.getElementById("copyText").value = link;
    document.getElementById("copyText").removeAttribute("style")
    /* Get the text field */
    var textArea = document.getElementById("copyText");

    /* Select the text field */
    textArea.select();

    /* Copy the text inside the text field */
    document.execCommand("copy");

    /* Alert the copied text */
    document.getElementById("copyText").setAttribute("style", "display:none");
    element._tippy.setContent("Copied!");
}

function hideVideo(element) {
    const video = document.getElementById("video")
    var hidden = video.style.display === "none" ? true : false;
    if (!hidden) {
        $(video).hide("slow")
    } else {
        $(video).show("slow")
    }
    hidden = !hidden;

    element.innerText = hidden ? "Show Live Stream" : "Hide Live Stream";
}

function checkConnection() {
    $.ajax({
        url: "http://150.182.130.194:3030/video_feed",
        type: "HEAD",
        timeout: 1000,
        statusCode: {
            // Can connect
            200: function (response) {
                console.log(200)
                $('#counting_feed_err').hide()
            },
            // Can't connect
            400: function (response) {
                $.ajax({
                    url: "http://10.199.1.152:3030/video_feed",
                    type: "HEAD",
                    statusCode: {
                        200: function (response) {
                            console.log(400, 200)
                            // Can connect, do something with embed() replace
                            $('#counting_feed_err').hide()
                            document.getElementById("video").setAttribute("data-url", "http://10.199.1.152:3030/video_feed")
                            $('#video').embed()
                        },
                        400: function (response) {
                            console.log(400, 400)
                            // Really can't connect.
                            $('#video_feed').hide()
                            $('#video').embed('destroy')
                        },
                        0: function (response) {
                            // Can connect
                            console.log(400, 0)
                            if (response.statusText === "error") {
                                $('#counting_feed_err').hide()
                            } else {
                                $('#video_feed').hide()
                                $('#video').embed('destroy')
                            }
                        }
                    }
                });
            },
            // Maybe can connect?
            0: function (response) {
                // Can connect
                if (response.statusText === "error") {
                    $('#counting_feed_err').hide()
                } else {
                    $.ajax({
                        url: "http://10.199.1.152:3030/video_feed",
                        type: "HEAD",
                        statusCode: {
                            200: function (response) {
                                console.log(0, 200)
                                // Can connect, do something with embed() replace
                                $('#counting_feed_err').hide()
                                document.getElementById("video").setAttribute("data-url", "http://10.199.1.152:3030/video_feed")
                                $('#video').embed()
                            },
                            400: function (response) {
                                console.log(0, 400)
                                // Really can't connect.
                                console.log("Error 400")
                                $('#video_feed').hide()
                                $('#video').embed('destroy')
                            },
                            0: function (response) {
                                console.log(0, 0)
                                // Can connect
                                if (response.statusText === "error") {
                                    $('#counting_feed_err').hide()
                                    document.getElementById("video").setAttribute("data-url", "http://10.199.1.152:3030/video_feed")
                                    $('#video').embed()
                                    console.log("changing to internal ip")
                                } else {
                                    console.log("ho")
                                    $('#video_feed').hide()
                                    $('#video').embed('destroy')
                                }
                            }
                        }
                    });
                }
            }
        }
    });
}