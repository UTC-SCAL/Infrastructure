$(document)
    .ready(function () {
        $('.masthead')
            .visibility(
                {
                    once: false,
                    onBottomPassed: function () {
                        $('.fixed.menu').transition('fade in');
                    },
                    onBottomPassedReverse: function () {
                        $('.fixed.menu').transition('fade out');
                    }
                });
    });

function resizeFrame(obj) {
    obj.style.width = document['body'].offsetWidth + 'px';
    obj.style.height = document['body'].offsetHeight + 'px';
}


