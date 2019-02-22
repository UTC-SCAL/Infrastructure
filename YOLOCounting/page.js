var videoPort = 3031;
var lastButtonClicked = null;
var videoVisible = true;

function init() {
    checkConnection();
    // $("#menubar").hide()

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
    $("#s").click();
}

function changeLiveStream(element, port) {
    // Check for current button conditions:
    if (element !== lastButtonClicked) {
        $(element).addClass("active");
        if (lastButtonClicked !== null) {
            $(lastButtonClicked).removeClass("active");
        }
        lastButtonClicked = element;
    }

    var newURL = document.getElementById("video").getAttribute("data-url");
    newURL = newURL.replace(videoPort, port);
    videoPort = port;
    $('#video').embed('destroy');
    document.getElementById("video").setAttribute("data-url", newURL);
    $('#video').embed();
}

function openInTab() {
    var url = document.getElementById("video").getAttribute("data-url");
    var win = window.open(url, '_blank');
    win.focus();
}

function checkConnection() {
    function setVideoIP(ip) {
        document.getElementById("video").setAttribute("data-url", (ip + ":" + videoPort + "/video_feed"));
        $('#video').embed();
        return ip;
    }
    $.ajax({
        url: "http://150.182.130.194:" + videoPort + "/video_feed",
        type: "HEAD",
        timeout: 1000,
        statusCode: {
            // Can connect
            200: function (response) {
                setVideoIP("http://150.182.130.194");
            },
            // Can't connect
            400: function (response) {
                $.ajax({
                    url: "http://10.199.1.152:" + videoPort + "/video_feed",
                    type: "HEAD",
                    statusCode: {
                        200: function (response) {
                            setVideoIP("http://10.199.1.152");
                        },
                        400: function (response) {
                            setVideoIP(null);
                        },
                        0: function (response) {
                            // Can connect
                            if (response.statusText === "error") {
                                setVideoIP("http://10.199.1.152");
                            } else {
                                setVideoIP(null);
                            }

                        }
                    }
                });
            },
            // Maybe can connect?
            0: function (response) {
                // Can connect
                if (response.statusText === "error") {
                    setVideoIP("http://150.182.130.194");
                } else {
                    $.ajax({
                        url: "http://10.199.1.152:" + videoPort + "/video_feed",
                        type: "HEAD",
                        timeout: 1000,
                        statusCode: {
                            200: function (response) {
                                setVideoIP("http://10.199.1.152");
                            },
                            400: function (response) {
                                setVideoIP(null);
                            },
                            0: function (response) {
                                if (response.statusText === "error") {
                                    setVideoIP("http://10.199.1.152");
                                } else {
                                    setVideoIP(null);
                                }
                            }
                        }
                    });
                }
            }
        }
    });
}

function toggleVideo(element) {
    // Return if the button is disabled; do nothing
    if ($(element).hasClass("disabled")) {
        return;
    }

    if (videoVisible) {
        $("#video").embed('destroy');
        $("#video").hide("slow");
    } else {
        changeLiveStream(lastButtonClicked, videoPort);
        $("#video").show("slow");
    }
    videoVisible = !videoVisible;
    $(element).removeClass(videoVisible ? "green" : "red");
    $(element).addClass(!videoVisible ? "green" : "red");
    $("#hide_button_icon").removeClass(videoVisible ? "play" : "stop");
    $("#hide_button_icon").addClass(videoVisible ? "stop" : "play");
}

function toggleSidebar() {
    if (videoVisible) {
        toggleVideo(document.getElementById("hide_button"));
    }
    $("#hide_button").removeClass("green");
    $("#hide_button").removeClass("red");
    $("#hide_button").addClass("disabled");
    document.getElementById("hide_button").innerText = "Refresh Page to See Stream";
    $('.ui.sidebar').sidebar('toggle');
}