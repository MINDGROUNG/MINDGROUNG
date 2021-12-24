'use strict';

const { collapseTextChangeRangesAcrossMultipleVersions } = require("typescript");



// 익스플로러 remove메소드
if (!('remove' in Element.prototype)) {
    Element.prototype.remove = function () {
        if (this.parentNode) {
            this.parentNode.removeChild(this);
        }
    };
}
var stopScrollEvent = true;
//클래스 on off
var count = 0;
var classToggle = function classToggle(e, className, eventClass, num) {
    if (eventClass != null) {
        //변형 토글 버튼
        var targetTag = document.querySelector('.' + eventClass);
        
        count++;
        count = count % 2;
        if (count == 1) {
            e.classList.add(className);
            $(targetTag).fadeIn();
            $('nav').addClass('noneEvent')
        } else {
            e.classList.remove(className);
            $(targetTag).fadeOut();
            $('nav').removeClass('noneEvent')
        }
    } else {
        //일반 토글 버튼
        count++;
        count = count % 2;
        if (count == 1) {
            e.classList.add(className);
        } else {
            e.classList.remove(className);
        }
    }
};

var closeBtn = function closeBtn() {
    var targetTag = document.querySelector('.hiddenMenuWrap');
    count = 0;
    $('.mobMenuBtn ').removeClass('expanded');
    $('.hiddenMenu').animate({ right: '-100vw' });
    $('body').css('overflow', 'auto');
    $('.hiddenMenuWrap').fadeOut();
};

//---------------------------------------------
//커스텀 모달
//type: (모달타입)Number
//1: 커스텀 confirm
//2: 커스텀 alert
//3:
//4:
//5 ~ : 자유모달
//title: (모달제목)String
//desc: (모달내용)String
//func: (모달내부 버튼함수)String

//버튼에 추가 할 이벤트  onclick="customModal(타입,제목,내용,함수)"
//함수가 넣어질 클래스버튼 <button class="funcBtn" onclick=""></button>\
//닫기가 넣어질 클래스버튼 <button class="closeBtn" onclick=""></button>
//---------------------------------------------
var num = 0;
function customModal(type, title, desc, func, jsonData, target, e) {
    //jsonData 존재할경우 문자열로 넘어온 객체 파싱
    if (jsonData && type != 15) {
        jsonData = JSON.parse(jsonData);
    }

    // $('body').css('overflow', 'hidden');

    if (type == 1 || type == 2) {
        $('.modal' + type).fadeIn();
        $('.modal' + type).find('h3').html(title);
        $('.modal' + type).find('p').html(desc);
        $('.closeBtn').attr('onclick', 'customModalClose(' + type + ')');
        if (type == 1) {
            $('.funcBtn').attr('onclick', func + '()');
        }
    } else if (type == 3) {
        //고정모달 넣기
    } else if (type == 4) {
        //고정모달 넣기
    }
    else if (type == 6) {
        stopScrollEvent = false;
        $('.modal' + type).fadeIn();
        $('.modalFrame1').fadeIn();
    }
    else if (type == 7) {
        var modal7SuccessButtonData = document.getElementById('modal7SuccessButton').dataset;
        modal7SuccessButtonData.functionname = desc;
        if(-1 < desc.indexOf('post'))
        {
            modal7SuccessButtonData.postuid = title;
        }
        else
        {
            modal7SuccessButtonData.commentuid = title;
        }

        $('.modal' + type).fadeIn();
    }
    else if (type == 8) {
        stopScrollEvent = false;
        $('.modal' + type).fadeIn();
        $('.modalFrame2').fadeIn();
    }
    else {
        //자유모달
        stopScrollEvent = false;
        $('.modal' + type).fadeIn();
        if(type==100){
            document.getElementById('allContents').innerHTML=loginText;
            $('.innerContent-login').show();
            $('.modal100 .title').html('Enjoy your mindful playground');
        }

        if(type==18) {
            //모달 오픈 시 디폴트화면
            var wrap = document.getElementById('allContentsWrap');
            wrap.innerHTML=typeListWrap;
            // 디버깅중
            // $(document).on('click', '.selectContetnts', function() {
            //     // input file에 change 이벤트 부여
            //     const inputFile = document.getElementById("videoContents");
            //     const video = document.getElementById("video");
            
            //     inputFile.addEventListener("change", function()
            //     {
            //         const file = inputFile.files[0];
            //         const videourl = URL.createObjectURL(inputFile);
            //         video.setAttribute("src", videourl);
            //         video.play();
            //     })
            // });
            document.getElementsByTagName('input')[0].addEventListener('change', function(event) {});
            //비디오파일 업로드시 파일명 받아오면서 화면전환
            var videoCon = document.getElementById('videoContents');

            videoCon.addEventListener('change', function(e) 
            {
                document.getElementById('videoContentsTemp').files  = videoCon.files;
                
                var file = e.target.files[0];
                var fileReader = new FileReader();
                var fileName = e.currentTarget.files[0].name;
                console.log(file)
                if (file.type.match('image')) 
                {
                    fileReader.onload = function() 
                    {
                        var img = document.createElement('img');
                        img.src = fileReader.result;
                        //document.getElementsByTagName('div')[0].appendChild(img);
                    };
                    fileReader.readAsDataURL(file);
                }
                else
                {
                    fileReader.onload = function() 
                    {
                        var blob = new Blob([fileReader.result], {type: file.type});
                        var url = URL.createObjectURL(blob);
                        var video = document.createElement('video');
                        var timeupdate = function() 
                        {
                            if (snapImage()) 
                            {
                                video.removeEventListener('timeupdate', timeupdate);
                                video.pause();
                            }
                        };
                        video.addEventListener('loadeddata', function() 
                        {
                            if (snapImage()) 
                            {
                                video.removeEventListener('timeupdate', timeupdate);
                            }
                        });
                        var snapImage = function() 
                        {
                            var canvas = document.createElement('canvas');
                            canvas.width = video.videoWidth;
                            canvas.height = video.videoHeight;
                            canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
                            var image = canvas.toDataURL();
                            var success = image.length > 100000;
                            if (success) 
                            {
                                var img = document.createElement('img');
                                img.src = image;
                                img.style.width = "100%"
                                document.querySelector('.contentFileUpload-thumb .getFile').style.backgroundImage = 'url("'+image+'")'
                                URL.revokeObjectURL(url);
                            }
                            return success;
                        };
                        video.addEventListener('timeupdate', timeupdate);
                        video.preload = 'metadata';
                        video.src = url;
                        // Load video in Safari / IE11
                        video.muted = true;
                        video.playsInline = true;
                        video.play();
                    };
                    fileReader.readAsArrayBuffer(file);
                }

                wrap.innerHTML = videoContentHTML(fileName);

                // //비디오컨텐츠 내부 파일 업로드하기
                // var uploadThumb = document.getElementById('uploadThumb');
                // var getThumbFile = document.querySelector('.getFile');
                // var scriptUploadBtn = document.getElementsByClassName('scriptUploadBtn');
                // var uploadBtn6 = document.getElementById('uploadBtn6');
                // if(wrap)
                // {
                //     //썸네일 등록하면서 이미지 전환
                //     uploadThumb.addEventListener('change', function(e) {
                //         var thumbFileName = e.currentTarget.files[0].name;
                //         var thumbFileType = e.currentTarget.files[0].type;
                //         if(thumbFileType == "image/jpeg" || thumbFileType == "image/png" || thumbFileType == "image/gif") {
                //             getThumbFile.setAttribute('style', 'background-image: url(\'/web/img/'+thumbFileName+'\');');
                //         }
                //         else {
                //             alert('사진이 아닙니다')
                //         }
                //     })

                //     //언어 스크립트파일 등록
                //     for(var i = 0; i < scriptUploadBtn.length; i++)
                //     {
                //         scriptUploadBtn[i].addEventListener('change', function(e) {
                //             var scriptFileName = e.currentTarget.files[0].name;
                //             var targetText = e.currentTarget.previousSibling;
                //             targetText.innerHTML = scriptFileName;
                //         })
                //     }

                //     //파일리스트 업로드
                //     commonFilesUpload(uploadBtn6, videoAppendFiles);
                // }
                
            });

            //오디오파일 업로드시 파일명 받아오면서 화면 전환
            var audioCon = document.getElementById('audioContents');
            audioCon.addEventListener('change', function(e) {

                document.getElementById('audioContentsTemp').files  = audioCon.files;

                var fileName = e.currentTarget.files[0].name;
                wrap.innerHTML = audioContentHTML(fileName);
                
                var uploadBtn1 = document.getElementById('uploadBtn1');
                // if(wrap) {
                //     //파일리스트 업로드
                //     commonFilesUpload(uploadBtn1, audioAppendFiles);
                // }
            });
        }
        if(type === 17)
        {
            // console.log(title.parentElement.parentElement.style.background-image)
            var canvas  = document.querySelector('#canvasImgContainer')
            var context = canvas.getContext('2d');
            // context.restore()
            // context.clearRect(0, 0, canvas.width, canvas.height);
            // var canvasElement = document.createElement('canvas');
            // var context = canvas.getContext("2d")
            // document.querySelector('#showImgArea').innerHTML = canvasElement;

            console.log('1111111')
            var imgElement = title.parentElement.parentElement, 
            imgStyle = imgElement.currentStyle || window.getComputedStyle(imgElement, false),
            bi = imgStyle.backgroundImage.slice(4, -1).replace(/"/g, "");
            
            console.log('##################'+bi + 'get new bi')
            var img = '';
            img = new Image()
            img.src = bi
            img.onload = function(res){
                // console.log(img)
                console.log(img.height + ' get height ' + img.width)
                context.canvas.height=img.height;
                context.canvas.width = img.width;
                context.drawImage(img, 0, 0);
                const cropper = new Cropper(canvas, {
                    aspectRatio: 1 / 1,
                    crop(event) {
                        // console.log(event.detail.x);
                        // console.log(event.detail.y);
                        // console.log(event.detail.width);
                        // console.log(event.detail.height);
                        // console.log(event.detail.rotate);
                        // console.log(event.detail.scaleX);
                        // console.log(event.detail.scaleY);
                    },
                });

                $('#editImgBtn').on('click', function () {   
                    var croppedImageDataURL = cropper.getCroppedCanvas().toDataURL("image/png"); 
                    async function createFile(){
                        var croppedFile = await fetch(croppedImageDataURL);
                        var data = await croppedFile.blob();
                        let metadata = {
                            type : 'image/jpeg'
                        }
                        var time = new Date();
                        var editedTime = time.getMilliseconds();
                        var croppedImage = new File([data], editedTime+'.jpg', metadata)
                        console.log(croppedImage)
                        var formedImageList = []
                        formedImageList.push(croppedImage)
                        var sendObject = {};
                        sendObject.files=formedImageList;
                        imageUploadFunc(sendObject);

                    }
                    createFile()
                    customModalClose(17)

                });
            }

            

            // document.querySelector('.showImgArea > div').style.backgroundImage = $(title).closest('.mainContentThumb').css('background-image')
            // document.querySelector('#editImg').style.backgroundImage =`url("${bi}")`
            
        }
        if(type == 19)
        {
            $('#certificatesDetail').css({"background-image":"url("+title+")"})
            // document.getElementById('certificatesDetail').style.backgroundImage = title;
        }
        if(type == 15) {
            // 저널 모달 데이터 셋팅 함수
            journalModalDataSetting(title, desc, func, jsonData);
        }

        if(type == 42) {
            // 클래스 participate 모달 셋팅 함수
            classModalSettingFunc(title);
        }

        if(type == 33) {
            // 클래스, 게더링 상세 페이지 이미지 뷰어 모달 셋팅 함수
            imageViewerModalSettingFunc(title);
        }

    }
}

// function imageUploadFunc(croppedImage){



// }

//파일리스트 업로드
function commonFilesUpload(varName, funName) {
    varName.addEventListener('change', function(e) {

        e.currentTarget.files.length;

        var filesName = e.currentTarget.files[0].name;
        var filesListWrap = document.querySelector('.filesListWrap');
        num++;
        filesListWrap.innerHTML += funName(num+'.'+ filesName);
    })
}

//글자수제한(타겟인풋, 카운트를 세는 영역, 제한숫자)
function limitText(idName, targetName, countNum) {
    var textCount = $('#'+idName+'').val();
    $('.'+targetName+'').html(textCount.length);
    if(textCount.length >= countNum)
    {
        alert('더 이상 입력할 수 없습니다');
    }
}

function customModalClose(type) {
    $('body').css('overflow', 'auto');
    stopScrollEvent = true;
    if (type == 1 || type == 2) {
        setTimeout(function () {
            $('.modal' + type).find('h3').html('');
            $('.modal' + type).find('p').html('');
            $('.funcBtn').attr('onclick', '');
        }, 300);
    }
    else if (type == 6 ) {
        $('.modal' + type).fadeOut();
        $('.modalFrame1').fadeOut();
    }
    else if (type == 7) {
        $('.modal' + type).fadeOut();
    }
    else if (type == 8 ) {
        $('.modal' + type).fadeOut();
        $('.modalFrame2').fadeOut();
    }
    else if (type == 9) {
        $('.modal' + type).fadeOut();
    }
    else if(type == 90) {
        $('.modal' + type).fadeOut();
        closeModal90();
    } else if(type == 22) {
        $('.modal90').fadeOut();
        $('.modal' + type).fadeOut();
        closeModal22();
        closeModal90();
    } else if(type == 15) {
        $('.modal15').fadeOut();

        $('#journalModalAudioControlID').find('audio').get(0).pause();
        $('#journalModalImageAndVideoAppendID').find('video').get(0).pause();
        document.querySelector('body').removeProperty('overflow');

    } else if(type == 38) {
        $('.modal38').fadeOut();
        document.getElementById('hostDeletePasswordFailedMessageControlID').style.display = 'none';
        
    } else if(type == 33) {
        document.getElementById('modal33VideoAndImageControlID').innerHTML = '';
        $('.modal33').fadeOut();
    }else {
        $('.modal').fadeOut();
        if(type==100){
        }
    }
    
    $('.removeSrc').attr('src', '');
}
//---------------------------------------------

//아이디 쿠키 불러오기
function getCookie(cookie_name) {
    var x = void 0,
        y = void 0;
    var val = document.cookie.split(';');

    for (var i = 0; i < val.length; i++) {
        x = val[i].substr(0, val[i].indexOf('='));
        y = val[i].substr(val[i].indexOf('=') + 1);
        x = x.replace(/^\s+|\s+$/g, ''); // 앞과 뒤의 공백 제거하기
        if (x == cookie_name) {
            return unescape(y); // unescape로 디코딩 후 값 리턴
        }
    }
}
function setCookie(cookie_name, value, days) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + days);
    // 설정 일수만큼 현재시간에 만료값으로 지정
    var cookie_value = escape(value) + (days == null ? '' : '; expires=' + exdate.toUTCString());
    document.cookie = cookie_name + '=' + cookie_value;
}

// 모바일 헤더 메뉴 보여주기
var startDate = new Date("2021/03/22 10:00:00");

if (Date.now() >= startDate) {
    $('.hiddenMenu .menuBody').css('display', 'block');
}

function likePost(target, postUID, callBackLike)
{
    var addLikeCount = 1;
    
    var mapPostLike = getCookie('mapPostLike');
    if(mapPostLike)
    {
        mapPostLike = JSON.parse(mapPostLike);
    }
    else
    {
        mapPostLike = {};
    }

    if(mapPostLike.hasOwnProperty(postUID) && mapPostLike[postUID] == 1)
    {
        addLikeCount = -1;
    }

    var data = {};
    data.protocol = 'addLikePost';
    data.postUID = postUID;
    data.addLikeCount = addLikeCount;

    protocolSendAjaxWithCallBack(data, function(result){
        if(result.resultCode == 0)
        {
            if(addLikeCount == 1)
            {
                target.src = '/img/likeCheckBtn.png';
                var likeText = $(target).parent().parent().find('.likeCount').eq(0);
                likeText.text(Number(likeText.text()) + 1);
                likeText.css('color', '#60269e');

                mapPostLike[postUID] = 1;
                setCookie('mapPostLike', JSON.stringify(mapPostLike), 365);
                alert('좋아요가 완료되었습니다.');

                //좋아요 갱신용 콜백
                if(callBackLike)
                {
                    //1 좋아요 , 좋아요 수
                    callBackLike(1, Number(likeText.text()));
                }
            }
            else
            {
                target.src = '/img/likeBtn.png';
                var likeText = $(target).parent().parent().find('.likeCount').eq(0);
                likeText.text(Number(likeText.text()) -1);
                likeText.css('color', '#000');

                mapPostLike[postUID] = 0;
                setCookie('mapPostLike', JSON.stringify(mapPostLike), 365);
                alert('좋아요가 취소되었습니다.');

                //좋아요 갱신용 콜백
                if(callBackLike)
                {
                    //0 좋아요 취소 , 좋아요 수
                    callBackLike(0, Number(likeText.text()));
                }
            }
        }
        else
        {
            alert(result.message);
        }
    });
}

function moveSearchPage(text) {
    location.href = '/search?text=' + encodeURIComponent(text);
}

function searchText(type) {
    var text = '';
    if(type == 'main')
    {
        text = $('#mainSearch').val();
    }
    else if(type == 'search')
    {
        text = $('#searchKeyword').val();
    }
    else if(type == 'common')
    {
        text = $('#commonSearchText').val();
    }

    moveSearchPage(text);
}

function sendToMessage(targetUID, targetName){

    var sendJsonObject = {};
    sendJsonObject.protocol = 'getMessage';
    sendJsonObject.targetUID = targetUID;
    sendJsonObject.targetName = targetName;
    protocolSendAjaxWithCallBack(sendJsonObject, function(result){
        console.log(JSON.stringify(result));
        makeChatRoomModal(result);
    })

}

function makeChatRoomModal(chatInfo){

    // sameChatroomExistCheck(chatInfo.)
    var chatRoom = document.querySelector('#msgModalWrap');
    chatRoom.classList.add('active');
}

function sameChatroomExistCheck(){

}

$(document).ready(function (e) {
    $('#commonSearchText').keyup(function (e) {
        if (e.keyCode == 13) {
            var text = $('#commonSearchText').val();
            if(!text)
            {
                alert('검색어를 입력해주세요.');
                return;
            }
            moveSearchPage(text);
        }
    });
})

function journalModalReset() {
    document.getElementById('journalModalTopTile').innerText = '';
    document.getElementById('journalUniqueID').value = '';
    document.getElementById('journalModalEditBtnID').setAttribute('onclick', '');
    document.getElementById('journalModalShareBtnControl').style.display = 'none';
    document.getElementById('journalModalDeleteBtnControl').style.display = 'none';
    document.getElementById('journalModalEditBtnControl').style.display = 'none';
    document.getElementById('journalModalBookMarkBtnControl').style.display = 'none';
    document.getElementById('journalModalReportBtnControl').style.display = 'none';
    document.getElementById('hdn-BtnControlID').classList.remove('active');
    document.getElementById('journalModalUserRingID').src = '';
    document.getElementById('journalModalUserNameID').innerText = '';
    document.getElementById('journalModalUserHostType').innerText = '';
    document.getElementById('journalModalUserHostType').style.display = 'none';
    document.getElementById('journalModalTotalTimeID').innerText = '';
    document.getElementById('journalModalScopeID').dataset.type = '';
    document.querySelector('#journalModalScopeID > img').src = '';
    document.getElementById('journalModalDateID').innerText = '';
    document.getElementById('journalModalContentID').innerText = '';
    $('#journalModalVideoSrcID').src = undefined;
    $('#journalModalAudioSrcID').src = undefined;
    document.getElementById('journalModalAudioControlID').style.display = 'none';
    document.getElementById('journalModalImageAndVideoControlID').style.display = 'none';
    $('#journalModalImageAndVideoAppendID > *').remove();
    document.getElementById('journalModalEmotionControlID').style.display = 'none';
    $('#journalModalEmotionControlID > *').remove();
    document.getElementById('journalModalKeyWordControlID').style.display = 'none';
    $('#journalModalKeyWordControlID > *').remove();
    document.getElementById('journalModalMoodEntryControlID').style.display = 'none';
    $('#appendEmojiWrapID > *').remove();
    document.getElementById('journalModalStampEntryControlID').style.display = 'none';
    $('#appendStampWrapID > *').remove();
    document.getElementById('journalModalMindfulControlID').style.display = 'none';
    $('.chkWrap > input[type="checkBox"]').prop('checked', false);
    document.getElementById('journalModalBodyScanControlID').style.display = 'none';
    $('#bodyAreaControlID > *').css('display', 'none');
    $('#journalMoadlRelatedClassID > *').remove();
    $('#journalModalTagControlID > *').remove();
} 

function journalModalDataSetting(requestJournalData, requstUserCheckData, flag, relatedClassObject) {
    journalModalReset();
    
    document.querySelector('body').style.setProperty('overflow', 'hidden');

    var journalObject = '';
    var checkUserData = requstUserCheckData;

    if(flag != 'all') {
        journalObject = requestJournalData.classObject;
        journalObject.journalID = requestJournalData._id;
        journalObject.userUID = requestJournalData.userUID;
        journalObject.userName = requestJournalData.userName;
        journalObject.hostType = requestJournalData.hostType;
    } else {
        journalObject = requestJournalData;
    }

    var verifyTitle = verifyData(journalObject.journalCategory);
    console.log(verifyTitle);
    document.getElementById('journalModalTopTile').innerText = getTranslation('journal', verifyTitle);
    document.getElementById('journalUniqueID').value = journalObject.journalID;
    var journelEditURL = "journal/edit/" + journalObject.journalID;
    document.getElementById('journalModalEditBtnID').setAttribute('onclick', 'location.href="' + journelEditURL + '"');

    if(checkUserData != 'noUser' && checkUserData.userUID == journalObject.userUID) {
        document.getElementById('journalModalDeleteBtnControl').style.display = 'block';
        document.getElementById('journalModalEditBtnControl').style.display = 'block';
    } else if(checkUserData != 'noUser' && checkUserData.userUID != journalObject.userUID) {
        document.getElementById('journalModalReportBtnControl').style.display = 'block';
        document.getElementById('journalModalBookMarkBtnControl').style.display = 'block';
        document.getElementById('journalModalShareBtnControl').style.display = 'block';
    }

    document.getElementById('journalModalUserRingID').src = '/web/img/userRing/' + journalObject.userUID + '.png';
    document.getElementById('journalModalUserNameID').innerText = journalObject.userName;
    
    if(journalObject.hostType != '') {
        document.getElementById('journalModalUserHostType').innerText = getTranslation('hostStudio', journalObject.hostType);
        document.getElementById('journalModalUserHostType').style.display = 'block';
    }

    document.getElementById('journalModalWeatherIconControlID').src = '/web/img/weather/' + journalObject.journalWriteWeather + '.png';
    document.getElementById('journalModalTotalTimeID').innerText = journalObject.journalTotalTime;

    var journalAccess = journalObject.journalAccess;
    document.getElementById('journalModalScopeID').dataset.type = journalAccess;
    var journalAccessIcon = '/web/img/ICN_' + journalAccess.toUpperCase() + '.png'
    document.querySelector('#journalModalScopeID > img').src = journalAccessIcon;
    
    document.getElementById('journalModalDateID').innerText = journalObject.journalWriteDate;

    document.getElementById('journalModalContentID').innerText = journalObject.journalMainText;

    journalModalMakeTag(journalObject.selectPracticeCategoryObject);

    if(journalObject.journalCategory == 'GRATITUDE JOURNAL' || journalObject.journalCategory == 'THOUGHT SCAN') {
        if(journalObject.journalAudio != null && journalObject.journalAudio != undefined) {
            document.getElementById('journalModalAudioSrcID').src = journalObject.journalAudio[0].filePath;
            document.getElementById('journalModalAudioControlID').style.display = 'block';
        }
    }

    var imgCount = 1;
    if(journalObject.journalCategory == 'ASANA JOURNAL') {
        if(journalObject.journalVideo != null && journalObject.journalVideo != undefined) {
            journalModalMakeImageAndVideo(journalObject.journalVideo[0], 'video', imgCount);
            imgCount++;
        }
    }

    if(journalObject.journalCategory == 'GRATITUDE JOURNAL' || journalObject.journalCategory == 'THOUGHT SCAN' || journalObject.journalCategory == 'ASANA JOURNAL') {
        document.getElementById('journalModalImageAndVideoControlID').style.display = 'block';

        for(var i = 0; i < journalObject.journalImage.length; i++) {
            journalModalMakeImageAndVideo(journalObject.journalImage[i], 'img', imgCount);
            imgCount++;
        }
    }

    if(journalObject.journalCategory == 'EMOTION SCAN') {
        journalModalMakeEmotion(journalObject.journalEmotionScanResult);

        document.getElementById('journalModalEmotionControlID').style.display = 'block';
    }

    if(journalObject.journalCategory == 'KEYWORD ENTRY') {
        journalModalMakeKeyword(journalObject.journalKeyWordEntryResult);

        document.getElementById('journalModalKeyWordControlID').style.display = 'block';
    }

    if(journalObject.journalCategory == 'MOOD ENTRY') {
        journalModalMakeMoodEntry(journalObject.journalMoodEntryResult);

        document.getElementById('journalModalMoodEntryControlID').style.display = 'block';
    }

    if(journalObject.journalCategory == 'STAMP ENTRY') {
        journalModalMakeStampEntry(journalObject.journalStampEntryResult);

        document.getElementById('journalModalStampEntryControlID').style.display = 'block';
    }

    if(journalObject.journalCategory == 'MINDFUL CHALLENGE CHECKIST') {
        journalModalMakeMindful(journalObject.journalMindfulResult);

        document.getElementById('journalModalMindfulControlID').style.display = 'block';
    }

    if(journalObject.journalCategory == 'BODY SCAN') {
        journalModalMakeBodyScan(journalObject.journalBodyScanResult);
        document.getElementById('bodyImgID').style.display = 'block';
        document.getElementById('journalModalBodyScanControlID').style.display = 'block';
    }

    var tempPracticeList = Object.keys(journalObject.selectPracticeObject);

    console.log(JSON.stringify(tempPracticeList));
    if(!tempPracticeList.includes('Self Practice') && !tempPracticeList.includes('Other')) {
        journalRelatedClassSetting(journalObject.selectPracticeCategoryObject, relatedClassObject);
    }
}

function journalModalMakeTag(requestData) {
    for(var category in requestData) {
        var journalModalTagHtml = `<span class="tag">#`;
        journalModalTagHtml += getTranslation('openClass', category);
        journalModalTagHtml += `&nbsp;</span>`;
        document.getElementById('journalModalTagControlID').innerHTML += journalModalTagHtml;
    }
    
}

function journalModalMakeImageAndVideo(requestData, type, index) {
    var appendVideoHtml = '';
    var appendImgHtml = '';

    if(type == 'video') {
        appendVideoHtml = `<a class="slideThumb imgBox video active" data-num="${index}"><video id="journalModalVideoSrcID" preload="metadata" controls src="${requestData.filePath}#t=0.5"></video></a>`;
        document.getElementById('journalModalImageAndVideoAppendID').innerHTML += appendVideoHtml;
    } else {
        if(index == 1) {
            appendImgHtml = `<a class="slideThumb imgBox active" data-num="${index}" style="background-image: url('${requestData.filePath}')"></a>`;
        } else {
            appendImgHtml = `<a class="slideThumb imgBox" data-num="${index}" style="background-image: url('${requestData.filePath}')"></a>`;
        }

        document.getElementById('journalModalImageAndVideoAppendID').innerHTML += appendImgHtml;
    }
}

function journalModalMakeEmotion(requestEmotionArray) {
    var appendJournalEmotionHtml = '';
    var journalEmotionCount = 0;
    
    for(var i = 0; i < requestEmotionArray.length; i++) {
        if(journalEmotionCount == 0) {
            appendJournalEmotionHtml = `<div class="figureWrap">`;
        }

        appendJournalEmotionHtml += `<div class="figure" data-number="${requestEmotionArray[i].feeling}"><span class="text">${requestEmotionArray[i].observed}</span></div>`;

        if(journalEmotionCount == 3 || (i + 1) == requestEmotionArray.length) {
            appendJournalEmotionHtml += `</div>`;
            document.getElementById('journalModalEmotionControlID').innerHTML += appendJournalEmotionHtml;
        }
        
        journalEmotionCount++;

        if(journalEmotionCount == 4) {
            journalEmotionCount = 0;
        }
    }
}

function journalModalMakeKeyword(requestKeywordArray) {
    var appendJournalKeyWordHtml = '';
    var journalKeyWordCount = 0;
    
    for(var i = 0; i < requestKeywordArray.length; i++) {
        if(journalKeyWordCount == 0) {
            appendJournalKeyWordHtml = `<div class="keywordWrap">`;
        }

        appendJournalKeyWordHtml += `<span class="keyword">${requestKeywordArray[i]}</span>`;

        if(journalKeyWordCount == 2 || (i + 1) == requestKeywordArray.length) {
            appendJournalKeyWordHtml += `</div>`;
            document.getElementById('journalModalKeyWordControlID').innerHTML += appendJournalKeyWordHtml;
        }
        
        journalKeyWordCount++;

        if(journalKeyWordCount == 3) {
            journalKeyWordCount = 0;
        }
    }
}

function journalModalMakeMoodEntry(moodEntryResultMap) {
    for(var imgSrc in moodEntryResultMap) {
        var appendMoodEntryHtml = `<img src="${moodEntryResultMap[imgSrc]}" alt="">`;

        document.getElementById('appendEmojiWrapID').innerHTML += appendMoodEntryHtml;
    }
}

function journalModalMakeStampEntry(stampEntryResultMap) {
    for(var imgSrc in stampEntryResultMap) {
        var appendStampEntryHtml = `<img src="${stampEntryResultMap[imgSrc]}" alt="">`;
        
        document.getElementById('appendStampWrapID').innerHTML += appendStampEntryHtml;
    }
}

function journalModalMakeMindful(mindfuldResultMap) {
    for(var checkKey in mindfuldResultMap) {
        document.getElementById(checkKey).checked = true;
    }
}

function journalModalMakeBodyScan(bodyScanResultArray) {
    for(var i = 0; i < bodyScanResultArray.length; i++) {
        document.getElementById(bodyScanResultArray[i].part +'ImgID').style.display = 'block';

        if(bodyScanResultArray[i].part == 'back') {
            document.getElementById('backImgID').style.zIndex = 9;
        }

        var appendBodyScanHtml = `
            <div class="figureBox">
                <input type="hidden" id="${bodyScanResultArray[i].area}AreaValue" value="${bodyScanResultArray[i].area}">
                <input type="hidden" id="${bodyScanResultArray[i].sensation}SensationValue" value="${bodyScanResultArray[i].sensation}">
                <div class="figureBox-top">
                    <h6>${bodyScanResultArray[i].part}</h6>
                    <span class="dots"></span>
                    <h6>Shooting</h6>
                </div>
                <div class="figureBox-bottom">
                    <div class="figure" data-number="${bodyScanResultArray[i].intense}">
                        <span class="text">Intense</span>
                    </div>
                    <div class="figure" data-number="${bodyScanResultArray[i].pleasant}">
                        <span class="text">Pleasant</span>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('bodyScanAppendID').innerHTML += appendBodyScanHtml;
    }
}

function journalRelatedClassSetting(journalCategory, relatedClassObject) {
    var classCount = 0;
    var tempJournalClassObject = '';

    for(var i in journalCategory) {
        tempJournalClassObject = relatedClassObject[i];
        
        if(classCount == 3) {
            break;
        }

        for(var j = 0; j < tempJournalClassObject.length; j++) {
            if(classCount == 3) {
                break;
            }

            var journalModalClassHtml = ''; 
                if(classCount == 0) {
                    journalModalClassHtml += `<a href="/classProgramListing/${tempJournalClassObject[j]._id}" class="fixContentThumb imgBox active" data-journal="${classCount + 1}">`;
                } else {
                    journalModalClassHtml += `<a href="/classProgramListing/${tempJournalClassObject[j]._id}" class="fixContentThumb imgBox" data-journal="${classCount + 1}">`;
                }
                journalModalClassHtml += `
                    <div class="thumbArea" style="background-image: url('${tempJournalClassObject[j].classObject.thumbNailMain.filePath}');">
                        <div class="graBar"></div>
                    </div>
                    <div class="detailArea">
                        <h4 class="detailArea-title">
                            ${tempJournalClassObject[j].classObject.title}
                        </h4>
                        <div class="ringInfo">
                            <div class="ring hover-ring">
                                <img src="/web/img/userRing/${tempJournalClassObject[j].userUID}.png" alt="">
                            </div>
                            <h5 class="name">
                                ${tempJournalClassObject[j].userName}
                            </h5>
                            <strong class="type">
                            `;
                            journalModalClassHtml += getTranslation('hostStudio', tempJournalClassObject[j].hostType);
                        
                        journalModalClassHtml += `
                            </strong>
                        </div>
                        <p class="text">${tempJournalClassObject[j].classObject.description}</p>
                    </div>
                </a>
            `;

            classCount++;
            document.getElementById('journalMoadlRelatedClassID').innerHTML += journalModalClassHtml;
        }
    }
}

// 저널 삭제 함수
function journalDeleteFunc() {
    var journalUniqueID = document.getElementById('journalUniqueID').value;

    var sendJsonObject = {};
    sendJsonObject.journalUniqueID = journalUniqueID;

    $.ajax({
        type : "POST",
        url:"/journalObjectDeleteMongo",
        data: JSON.stringify(sendJsonObject),
        processData: false,
        contentType: "application/json; charset=UTF-8",
        success : function(data){
            alert('저널 삭제를 완료하였습니다.');
            location.href = '/journalMain';
        },
        error : function(error)
        {
            alert('저널 삭제에 실패하였습니다.');
        }
    });
}

function classModalSettingFunc(requestClassObject) {
    var classObject = requestClassObject.classObject;
    
    document.getElementById('transformClassObjectUserRingID').src = `/web/img/userRing/${requestClassObject.userUID}.png`;
    document.getElementById('transformClassObjectHostTypeID').innerText = requestClassObject.hostType;
    document.getElementById('transformClassObjectUserNameID').innerText = requestClassObject.userName;
    
    var weekDayObject = {
        '(SUN)': 'Sunday',
        '(MON)': 'Monday',
        '(TUE)': 'Tuesday',
        '(WED)': 'Wednesday',
        '(THU)': 'Thursday',
        '(FRI)': 'Friday',
        '(SAT)': 'Saturday'
    };

    var classObjectDate = classObject.classOpenDate;
    var classObjectOpenDate = classObjectDate.openDate;
    var weekDayKey = classObjectOpenDate.substring(13, classObjectOpenDate.length);
    var makeDateFormat = classObjectOpenDate.substring(0, 13) + weekDayObject[weekDayKey] + ' ' + classObjectDate.openTime + ' - ' + classObjectDate.endTime;
    
    document.getElementById('transformClassObjectDateID').innerText = makeDateFormat;

    if(classObject.online == 'online') {
        document.getElementById('transformClassObjectOnlineStateID').innerText = 'Online Method';
        document.getElementById('transformClassObjectOnlineMethodID').innerText = classObjectDate.classMethod;
        document.getElementById('onlineMethodControlID').style.display = 'block';
    } else {
        document.getElementById('transformClassObjectOnlineStateID').innerText = 'Offline Place';
        document.getElementById('transformClassObjectOfflinePlaceID').innerText = classObjectDate.classLocation;
        mindgroundMap('modal');
        document.getElementById('offlinePlaceControlID').style.display = 'block';
    }
}

function imageViewerModalSettingFunc(type) {
    if(type == 'gathering') {
        var gatheringImageCount = 1;
        var getMainImageSrc = $('#mainImageId img').attr('src');
        var checkFileType = (getMainImageSrc).substring((getMainImageSrc).length - 3, (getMainImageSrc).length);

        var mainImageHtml = '';

        if(checkFileType == 'mp4' || checkFileType == 'mov' || checkFileType == 'wmv' || checkFileType == 'avi') {
            mainImageHtml = `<li data-no="1" class="active"><video id="videoModalVideoControlID" src="getMainImageSrc"></video></li>`;
            gatheringImageCount++;
        } else {
            mainImageHtml = `<li data-no="1" class="active" style="background-image: url('${getMainImageSrc}')"></li>`;
            gatheringImageCount++;
        }

        document.getElementById('modal33VideoAndImageControlID').innerHTML += mainImageHtml;

        $('#subImageId').find('img').each(function() {
            var tempSubThumbNailSrc = $(this).attr('src');
            
            var subImageHtml = `<li data-no="${gatheringImageCount}" style="background-image: url('${tempSubThumbNailSrc}')"></li>`;

            gatheringImageCount++;

            document.getElementById('modal33VideoAndImageControlID').innerHTML += subImageHtml;
        });        

        document.querySelector('#checkImageCountControlID > span:nth-child(1)').innerText = 1;
        document.querySelector('#checkImageCountControlID > span:nth-child(2)').innerText = ' / ' + (gatheringImageCount - 1);
    } else if(type == 'class') {
        var classImageCount = 1;
        var getMainImageSrc = '';

        if(document.getElementById('classDetailMainVideoID') != undefined && document.getElementById('classDetailMainVideoID') != null) {
            getMainImageSrc = $('#classDetailMainVideoID').attr('src');
        } else {
            getMainImageSrc = $('#mainThumbNail > a').css('background-image').replace('url("', '').replace('")', '');
        }
        
        var checkFileType = (getMainImageSrc).substring((getMainImageSrc).length - 3, (getMainImageSrc).length);

        var mainImageHtml = '';

        if(checkFileType == 'mp4' || checkFileType == 'mov' || checkFileType == 'wmv' || checkFileType == 'avi') {
            mainImageHtml = `<li data-no="1" class="active"><video id="videoModalVideoControlID" src="${getMainImageSrc}" controls></video></li>`;
            classImageCount++;
        } else {
            mainImageHtml = `<li data-no="1" class="active" style="background-image: url('${getMainImageSrc}')"></li>`;
            classImageCount++;
        }

        document.getElementById('modal33VideoAndImageControlID').innerHTML += mainImageHtml;

        $('#subThumbNailList').find('a').each(function() {
            var tempSubThumbNailSrc = $(this).css('background-image').replace('url("', '').replace('")', '');
            
            var subImageHtml = `<li data-no="${classImageCount}" style="background-image: url('${tempSubThumbNailSrc}')"></li>`;

            classImageCount++;

            document.getElementById('modal33VideoAndImageControlID').innerHTML += subImageHtml;
        });        

        document.querySelector('#checkImageCountControlID > span:nth-child(1)').innerText = 1;
        document.querySelector('#checkImageCountControlID > span:nth-child(2)').innerText = ' / ' + (classImageCount - 1);
    }
}



