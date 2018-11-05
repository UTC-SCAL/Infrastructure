function copyURL(link) {
    document.getElementById("copyText").value = link;
    document.getElementById("copyText").removeAttribute("style")
    /* Get the text field */
    var textArea = document.getElementById("copyText");

    /* Select the text field */
    textArea.select();

    /* Copy the text inside the text field */
    document.execCommand("copy");

    /* Alert the copied text */
    alert("Copied the text: " + document.getElementById("copyText").value);
    document.getElementById("copyText").setAttribute("style", "display:none");
}