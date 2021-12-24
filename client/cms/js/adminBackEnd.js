function goInsertNotice()
{
    location.href="/admin/notice/create";
}

function goUpdateNotice(noticeUID)
{
    location.href="/admin/notice/update/" + noticeUID;
}

function insertNotice() {
    var title = $('#title').val();
    var contents = $('#contents').val();

    var data = {};
    data.protocol = 'insertNotice';
    data.title = title;
    data.contents = contents;

    protocolSendAjaxWithCallBack(data, function (data) {
        if (data.resultCode == 0) 
        {
            location.href="/admin/notice/list";
        }
        else 
        {
            alert(data.message);
        }
    });
}

function updateNotice(noticeUID) {
    var title = $('#title').val();
    var contents = $('#contents').val();

    var data = {};
    data.protocol = 'updateNotice';
    data.noticeUID = noticeUID;
    data.title = title;
    data.contents = contents;

    protocolSendAjaxWithCallBack(data, function (data) {
        if (data.resultCode == 0) 
        {
            location.reload();
        }
        else 
        {
            alert(data.message);
        }
    });
}

function deleteNotice(noticeUID) 
{
    if(confirm('공지사항을 삭제하시겠습니까?'))
    {
        var data = {};

        data.protocol = 'deleteNotice';
        data.noticeUID = noticeUID;

        protocolSendAjaxWithCallBack(data, function (data) {
            if (data.resultCode == 0) 
            {
                location.reload();
            }
            else 
            {
                alert(data.message);
            }
        });
    }
}