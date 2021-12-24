function protocolSendAjax(data, isAlert, movePage) {
    $.ajax({
        type: 'post',
        url: '/protocol',
        dataType: 'json',
        data: data,
        success: function (data) {
            if (data.resultCode == 0) {
                if (isAlert) {
                    alert(data.message);
                }

                if (movePage == 'reload') {
                    window.location.reload();
                }
                //none
                else if (movePage == 'none') {
                }
                //close
                else if (movePage == 'close') {
                    opener.window.location.reload();
                    window.close();
                }
                //else
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
        url: '/protocol',
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

function protocolSendAjaxNormal(data, isAlert, movePage) {
    $.ajax({
        type: 'post',
        url: '/protocol',
        dataType: 'json',
        data: data,
        success: function (data) {
            if (data.resultCode == 0) {
                if (isAlert) {
                    alert(data.message);
                }

                if (movePage == 'reload') {
                    window.location.reload();
                }
                //none
                else if (movePage == 'none') {
                }
                //close
                else if (movePage == 'close') {
                    opener.window.location.reload();
                    window.close();
                }
                //else
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

function protocolSendAjaxToJson(data, isAlert, movePage) {
    $.ajax({
        type: 'post',
        url: '/protocol',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        data: data,
        success: function (data) {
            if (data.resultCode == 0) {
                if (isAlert) {
                    alert(data.message);
                }

                if (movePage == 'reload') {
                    window.location.reload();
                } else if (movePage == 'none') {
                } else if (movePage == 'close') {
                    window.close();
                } else {
                    window.location.href = movePage;
                }
            }
        },
        error: function (e) {
            alert('An error has occurred. If the problem persists, please contact the administrator.');
        },
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

function protocolGetAjaxResult(data, isAlert) {
    let result;
    $.ajax({
        type: 'post',
        url: '/protocol',
        dataType: 'json',
        async: false,
        data: data,
        success: function (data) {
            if (data.resultCode == 0) {
                result = data;
                if (isAlert) {
                    alert(data.message);
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
    return result;
}

function protocolFileUpload(data) {
    var result = {};
    result.resultCode = 1;
    result.message = '서버의 응답이 존재하지 않습니다.';
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

//파일 업로드
function fileUpload(target, successCallback){
    var files = target.files;
    var formData = new FormData();
    for(var i=0; i<files.length; i++){
        formData.append("uploadFile", files[i]);
    }

    $.ajax({
        type: 'post',
        url: '/protocol/protocolFileUpload',
        processData: false,
        contentType: false,
        data: formData,
        async: false, // 비동기로 동작 시 respone를 받기 전에 메소드가 return 해버리기 떄문에
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
            alert('오류가 발생했습니다. 문제가 계속될 시 관리자에게 문의해 주세요.');
        }
    });
}