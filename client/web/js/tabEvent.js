//모바일 카테고리 필터 여닫기
$(window).on('resize load', function() {
    if($(this).innerWidth() > 1279)
    {
        $('.filtersBtn').click(function() {
            $('.filtersBtn').removeClass('active');
            $(this).next().toggleClass('active');
            $(this).addClass('active');
        })
        $('.onlyFixed').click(function() {
            $('.filtersBtn').removeClass('active');
            $('.filtersBtn').next().removeClass('active')
        });
        $('.btns').css('display', 'flex');
    }
    else
    {
        $('.btns').css('display', 'none');
    }
});
$('.moFiltersBtn > button').click(function() {
    $(this).parents().next('.btns').fadeToggle();
    $('.moCloseBtn').click(function() {
        $('.btns').fadeOut();
    });
    console.log('filterOpen')
});

// //커리큘럼 챕터 더보기

// $('.viewDetails > button').click(function() {
//         if($(this).html() == 'Summary View')
//         {
//             $(this).html('View Details');
//         }
//         else 
//         {
//             $(this).html('Summary View');
//         }
//         $(this).parents('.textWrap').children('.hiddenDetail').slideToggle();
// });


function classParticipateEventListener(){
    //커리큘럼 챕터 더보기

    $('.viewDetails > button').click(function() {
        if($(this).html() == 'Summary View')
        {
            $(this).html('View Details');
        }
        else 
        {
            $(this).html('Summary View');
        }
        $(this).parents('.textWrap').children('.hiddenDetail').slideToggle();
    });
    //클래스 participate 챕터 펼치기
    $('.chapterNo').click(function() {
        $(this).toggleClass('active').next().slideToggle();
    });
    //클래스 participate 챕터 펼치기
    $('.mainTabBtn').click(function() {
        $('.mainTabBtn').removeClass('active');
        $(this).addClass('active');
        if($(this).hasClass('viewChapter'))
        {
            $(this).parents().children('.hiddenDetail-chapter').slideDown();
        }
        else
        {
            $('.hiddenDetail-chapter').slideUp();
        }
        switchClassParticipateContent(this.innerText, this)
    })

}

//챕터 모바일에서 보여지는 레이아웃 수정
$(window).on('resize load', function() {
    if($(this).innerWidth() <= 767) 
    {
        $('.moSlide').removeClass('active');
        $('.moTitleTab').removeClass('active');
    }
    else
    {
        $('.moSlide').addClass('active');
        $('.moTitleTab').addClass('active');
    }
});

//classParticipate
$('.moSlideTab').click(function() {
    $(this).next('.moSlide').toggleClass('active');
    $(this).toggleClass('active');
});

$('.mainTabBtn').click(function() {
    var targetText = $(this).text();
    $(this).parents('.moSlide').prev('.moSlideTab').children('h4').text(targetText);
    $(this).parents('.moSlide').removeClass('active');
    $('.moSlideTab').removeClass('active');
});

//classParticipateContents
$('.moTitleTab').click(function() {
    $(this).next('.tab-chapter').toggleClass('active');
    $(this).toggleClass('active');
});

function tabClose() {
    $('.tabInTab > li').click(function() {
        console.log('ggg')
        $('.tab-chapter').removeClass('active');
    })
}
