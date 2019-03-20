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

        $('.ui.sidebar').sidebar({
            transition: 'overlay'
        });

        $('.dropdown').dropdown({
            on: "hover"
        });
    });



function toggleSidebar() {
    $('.ui.sidebar').sidebar('toggle');
}