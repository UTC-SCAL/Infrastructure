var tooltips = []
var videoPort = 3031
var lastButtonClicked = null

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

function changeLiveStream(element, port) {
    // Check for current button conditions:
    if (element == lastButtonClicked) {
        return;
    }
    $(element).addClass("active");
    if (lastButtonClicked !== null) {
        $(lastButtonClicked).removeClass("active");
    }
    lastButtonClicked = element;

    var newURL = document.getElementById("video").getAttribute("data-url")
    newURL = newURL.replace(videoPort, port)
    videoPort = port;
    $('#video').embed('destroy')
    document.getElementById("video").setAttribute("data-url", newURL)
    $('#video').embed()

}


function checkConnection() {
    function setVideoIP(ip) {
        document.getElementById("video").setAttribute("data-url", (ip + ":" + videoPort + "/video_feed"))
        $('#video').embed()
        $("#s").click()
        return ip
    }
    $.ajax({
        url: "http://150.182.130.194:" + videoPort + "/video_feed",
        type: "HEAD",
        timeout: 1000,
        statusCode: {
            // Can connect
            200: function (response) {
                setVideoIP("http://150.182.130.194")
            },
            // Can't connect
            400: function (response) {
                $.ajax({
                    url: "http://10.199.1.152:3030/video_feed",
                    type: "HEAD",
                    statusCode: {
                        200: function (response) {
                            setVideoIP("http://10.199.1.152")
                        },
                        400: function (response) {
                            setVideoIP(null)
                        },
                        0: function (response) {
                            // Can connect
                            if (response.statusText === "error") {
                                setVideoIP("http://10.199.1.152")
                            } else {
                                setVideoIP(null)
                            }

                        }
                    }
                });
            },
            // Maybe can connect?
            0: function (response) {
                // Can connect
                if (response.statusText === "error") {
                    setVideoIP("http://150.182.130.194")
                } else {
                    $.ajax({
                        url: "http://10.199.1.152:" + videoPort + "/video_feed",
                        type: "HEAD",
                        timeout: 1000,
                        statusCode: {
                            200: function (response) {
                                setVideoIP("http://10.199.1.152")
                            },
                            400: function (response) {
                                setVideoIP(null)
                            },
                            0: function (response) {
                                if (response.statusText === "error") {
                                    setVideoIP("http://10.199.1.152")
                                } else {
                                    setVideoIP(null)
                                }
                            }
                        }
                    });
                }
            }
        }
    });
}