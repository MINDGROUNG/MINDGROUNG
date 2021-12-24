$(function(){
    var $partners = $('.partners ul'),
        $parLength = $partners.find('li').length;

    // console.log($parLength);

    $($partners).find('li:last').prependTo($partners);
    $($partners).css({marginLeft: -260, width:260*$parLength});

    var simplyScroll = gsap.to($partners, {
        repeat: -1,
        marginLeft: -260 * 2,
        duration: 3,
        ease: 'none',
        onRepeat: function(){
            $partners.css({ marginLeft: -260});
            $partners.find('li:first').appendTo($partners);
        }
    });
    $partners.on('mouseenter', function(){
        simplyScroll.pause();
    });
    $partners.on('mouseleave', function(){
        simplyScroll.play();
    });
});
