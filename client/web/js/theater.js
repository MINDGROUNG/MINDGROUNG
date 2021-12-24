$(function () {
    var vtop = 0;

    $('.record').on('mousewheel', function (e) {
        var wheel = e.originalEvent.wheelDelta;
        if (wheel < 0) {
            $('.scrollBtn').fadeOut();
        } else {
            $('.scrollBtn').fadeIn();
        }
    });
});
