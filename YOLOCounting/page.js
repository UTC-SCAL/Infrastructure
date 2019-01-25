var videoPort = 3031
var lastButtonClicked = null
var videoVisible = true
var email_whitelist = ["ggy323@mocs.utc.edu", "mina-sartipi@utc.edu"]

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
}

function changeLiveStreamWithAuth(element, port) {
    // Load the Google API in
    gapi.load('client', () => {
        gapi.client.init({
            'apiKey': 'AIzaSyC9HvlrGYBF9wZrmjD-hJqpitf4Btag9N4',
            'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
            'clientId': '248719166848-v49k5c12g3011lhil342ebmqe89okjc5.apps.googleusercontent.com',
            'scope': 'email',
        }).then(function () {
            GoogleAuth = gapi.auth2.getAuthInstance();
            GoogleAuth.signIn();
        }).then(function () {
            // Keep looping to check if we're signed in...
            var loop = setInterval(() => {
                if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
                    clearInterval(loop);
                }
            }, 100);
            var user = gapi.auth2.getAuthInstance().currentUser.get()
            var email = user["w3"]["U3"]
            // User is logged in and whitelisted
            if (email_whitelist.includes(email.toLowerCase())) {
                // Check for current button conditions:
                if (element !== lastButtonClicked) {
                    $(element).addClass("active");
                    if (lastButtonClicked !== null) {
                        $(lastButtonClicked).removeClass("active");
                    }
                    lastButtonClicked = element;
                }

                var newURL = document.getElementById("video").getAttribute("data-url")
                newURL = newURL.replace(videoPort, port)
                videoPort = port;
                $('#video').embed('destroy')
                document.getElementById("video").setAttribute("data-url", newURL)
                $('#video').embed()
            } else {
                alert("This stream requires permissions you have not been given")
                return;
            }

        });
    });
}

function changeLiveStream(element, port) {
    // Do GoogleAuth if checking on port 3030
    if (port === 3030) {
        changeLiveStreamWithAuth(element, port);
    } else {
        // Check for current button conditions:
        if (element !== lastButtonClicked) {
            $(element).addClass("active");
            if (lastButtonClicked !== null) {
                $(lastButtonClicked).removeClass("active");
            }
            lastButtonClicked = element;
        }

        var newURL = document.getElementById("video").getAttribute("data-url")
        newURL = newURL.replace(videoPort, port)
        videoPort = port;
        $('#video').embed('destroy')
        document.getElementById("video").setAttribute("data-url", newURL)
        $('#video').embed()
    }
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

function toggleVideo(element) {
    // Return if the button is disabled; do nothing
    if ($(element).hasClass("disabled")) {
        return;
    }

    if (videoVisible) {
        $("#video").embed('destroy')
        $("#video").hide("slow")
    } else {
        changeLiveStream(lastButtonClicked, videoPort)
        $("#video").show("slow")
    }
    videoVisible = !videoVisible;
    element.innerText = !videoVisible ? "Start Live Stream" : "Stop Live Stream";
    $(element).removeClass(videoVisible ? "green" : "red")
    $(element).addClass(!videoVisible ? "green" : "red")
}

function toggleSidebar() {
    if (videoVisible) {
        toggleVideo(document.getElementById("hide_button"))
    }
    $("#hide_button").removeClass("green")
    $("#hide_button").removeClass("red")
    $("#hide_button").addClass("disabled")
    document.getElementById("hide_button").innerText = "Refresh Page to See Stream"
    $('.ui.sidebar').sidebar('toggle');
}