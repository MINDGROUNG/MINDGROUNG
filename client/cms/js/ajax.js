function protocolSendAjax(data, isAlert, movePage) {
    $.ajax({
        type: 'post',
        url: '/admin/protocol',
        data: JSON.stringify(data),
        processData: false,
        contentType: "application/json; charset=UTF-8",
        success: function (data) {
            if (data.resultCode == 0) {
                if (isAlert) {
                    alert(data.message);
                }
                if (movePage == 'reload') {
                    window.location.reload();
                }
                else if (movePage == 'none') {
                }
                else if (movePage == 'close') {
                    opener.window.location.reload();
                    window.close();
                }
                else {
                    window.location.href = movePage;
                }
            } else if (data.resultCode == 1) {
                if (isAlert) {
                    alert(data.message);
                }
            }
        },
        error: function (e) {
            alert('An error has occurred. If the problem persists, please contact the administrator.');
        },
    });
}

function protocolSendAjaxWithCallBack(data, callback) {
    $.ajax({
        type: 'post',
        url: '/admin/protocol',
        data: JSON.stringify(data),
        processData: false,
        contentType: "application/json; charset=UTF-8",
        success: callback,
        error: function error(e) {
            console.log(e)
            alert('An error has occurred. If the problem persists, please contact the administrator.');
        }
    });
}

function protocolNewsImageUpload(data) {
    let result;

    $.ajax({
        type: 'post',
        url: '/protocol/newsImageUpload',
        data: data,
        dataType: 'json',
        async: false,
        cache: false,
        contentType: false,
        processData: false,
        success: function (data) {
            if (data.resultCode == 0) {
                result = data;
            }
        },
        error: function (e) {
            console.log(e);
        },
    });

    return result;
}

function protocolFileUpload(data) {
    var result = {};
    result.resultCode = 1;
    result.message = '????????? ????????? ???????????? ????????????.';
    result.resultData = '';

    $.ajax({
        type: 'post',
        url: '/protocol/protocolFileUpload',
        data: data,
        dataType: 'json',
        async: false,
        cache: false,
        contentType: false,
        processData: false,
        success: function(data){
            console.log(data)
            result = data;
        },
        error: function (e) {
            var data = {};
            data.resultCode = 1;
            data.messate = e;
            result = data;
        },
    });
    return result;
}

//?????? ?????????
function fileUpload(target, successCallback){
    var files = target.files;
    console.log('files.length = '+files.length);

    var formData = new FormData();
    for(var i=0; i<files.length; i++){
        formData.append("uploadFile", files[i]);
    }

    if(files.length == 0)
    {   
        successCallback(); 
        return;
    }

    $.ajax({
        type: 'post',
        url: '/protocol/protocolFileUpload',
        processData: false,
        contentType: false,
        data: formData,
        async: false, // ???????????? ?????? ??? respone??? ?????? ?????? ???????????? return ???????????? ?????????
        dataType: 'json',
        success: function (data) {
            var fileInfo = data.listFileInfo;
            // console.log(filePath);

            // var img = document.createElement("img");
            // img.setAttribute("src", filePath);
            // document.getElementById('test').setAttribute("src", filePath);

            // if(!successCallback)
            // {
            //     var img = $(target.parentNode.nextElementSibling).find('img');
            //     img.attr('src', fileInfo.filePath);
            //     img.attr('data-fileuid', fileInfo.fileListUID);
            //     img.css('display', 'block');
            // }
            // else
            // {
                successCallback(fileInfo);
            // }
        },
        error: function (e) {
            console.log(e);
            alert('????????? ??????????????????. ????????? ????????? ??? ??????????????? ????????? ?????????.');
        }
    });
}