// PC 사이드 메뉴 컬러에 자동으로 active 주는 코드
// 각 페이지에 들어있어야 함
var path = window.location.pathname;
path = path.replace(/[/]/gi, ".");
$('.sideMenu').find(path).addClass('active');

// 모바일 사이드 메뉴 해당 페이지 네임 자동으로 변경되는 코드
var menuName = $('.commonArticle .articleBody > h3').text();
$('.mobSideMenu .menuHead span').text(menuName);
// console.log(menuName);
// 모바일 사이드 메뉴 동작 코드
function mobMenuOpen()
{
    $('.menuBody').slideToggle();
}