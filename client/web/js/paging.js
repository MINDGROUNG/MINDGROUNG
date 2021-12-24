function leftMove() {
    let nowPage = $('#nowPage').val();
    let type = $('#type').val();

    let link = document.location.href;
    let requestUrl = link.split('?');

    document.location.href = requestUrl[0] + '?pageIndex=' + (Number(nowPage) - 1);
}

function rightMove() {
    let nowPage = $('#nowPage').val();

    let link = document.location.href;
    let requestUrl = link.split('?');

    document.location.href = requestUrl[0] + '?pageIndex=' + (Number(nowPage) + 1);
}

function pageButtonClick(index) {
    let nowPage = $('#nowPage').val();

    let link = document.location.href;
    let requestUrl = link.split('?');

    if (index == nowPage) {
        return;
    } else {
        document.location.href = requestUrl[0] + '?pageIndex=' + index ;
    }
}

$(document).ready(function () {
    let buttons = $('.pagination');
    let nowPage = Number($('#nowPage').val());
    let totalPage = Number($('#totalPage').val());

    if (totalPage == 0) {
        $('.pagination').remove();
        return;
    }

    let startIndex = 0;
    let endIndex = 0;

    if (totalPage <= 10) {
        startIndex = 1;
        endIndex = totalPage;
    }
    else if (10 < totalPage && nowPage <= 6) {
        startIndex = 1;
        endIndex = 10;
    }
    else if (totalPage - nowPage < 4) {
        startIndex = (totalPage - 9);
        endIndex = totalPage;
    }
    else if (10 < totalPage && nowPage < totalPage) {
        startIndex = (nowPage - 5);
        endIndex = (nowPage + 4);
    }


    let html = '';
    for (let i = startIndex; i <= endIndex; i++) {
        html += '<button id="pageButton' + i + '" onclick="javascript:pageButtonClick(' + i + ')">' + i + '</button>';
    }

    let rightButton = $('#rightButton');
    let leftButton = $('#leftButton');

    rightButton.before(html);
    $('#pageButton' + nowPage).addClass('checked');
    $('#pageButton' + nowPage).children(0).css('z-index', 0);

    if (totalPage == 1) {
        leftButton.remove();
        rightButton.remove();
    } else if (nowPage == 1) {
        leftButton.remove();
    } else if (totalPage == nowPage) {
        rightButton.remove();
    }
});