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
    }
    else {
        $(video).show("slow")
    }
    hidden = !hidden;

    element.innerText = hidden ? "Show Live Stream" : "Hide Live Stream";
}

