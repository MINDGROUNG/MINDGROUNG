//---------------------------------------- 레이아웃 관련 ----------------------------------------
//=====================================
//파일 셀렉트 트리거
//-------------------------------------
function fileTrigger(e) 
{
    if ($(e).prev().attr('type') == 'file') 
    {
        $(e).prev().trigger('click');
    } 
    else 
    {
        $(e).parent().prev().trigger('click');
    }
}

//=====================================
//파일 셀렉트 미리보기
//-------------------------------------
function changeFunc(event) 
{
    var fileEle = event.target
    var reader = new FileReader();
    if(event.target.files.length==0)
    {
        if($(fileEle).prev().hasClass('form-control'))
        {
            $(fileEle).prev().text('파일을 선택해주세요.')
        }
        else
        {
            $(fileEle).prev().find('.fileViewWrap').text('미리보기')
            $(fileEle).prev().find('.fileTitleWrap').text('파일을 선택해주세요.')
            $(fileEle).prev().find('.fileViewWrap').css({backgroundImage: 'url()'});
        }
        return
    }
    if($(fileEle).prev().hasClass('form-control'))
    {
        reader.onload = function (event) 
        {
            $(fileEle).prev().text($(fileEle)[0].files[0].name)
        };
        reader.readAsDataURL(event.target.files[0]);
    }
    else
    {
        
        reader.onload = function (event) 
        {
            $(fileEle).prev().find('.fileViewWrap').text('')
            $(fileEle).prev().find('.fileTitleWrap').text($(fileEle)[0].files[0].name)
            $(fileEle).prev().find('.fileViewWrap').css({backgroundImage: 'url('+event.target.result+')'});
        };
        reader.readAsDataURL(event.target.files[0]);
    }
}
$(document).on('change','[type=file]',changeFunc);

//=====================================
//컴포넌트 동적생성
//-------------------------------------
function addComponent(e, type, isValidate)
{
    var ele = typeComponent[type]
    if(isValidate == false)
    {
        ele = ele.replace(/data-check="0"/g, '');
    }
    $(e).next().append(ele)
}
var typeComponent = {
    text:
    '<div class="input-group" style="margin-top: 10px">'+
        '<input type="text" class="addInputText form-control listTextColumn" placeholder="Amount" data-check="0"/>'+
        '<div class="input-group-addon" style="padding: 0">'+
            '<button type="button" class="btn btn-danger" style="height: 32px; border: 0; border-radius: 0" onclick="removeComponent(this,\'text\')">삭제</button>'+
        '</div>'+
    '</div>'+
    '<span class="errorWrap" style="color: red;">다시 입력해주세요.</span>',
    textarea:
    '<div class="input-group" style="display: flex; margin-top: 10px">'+
        '<textarea class="addInputTextarea form-control listTextAreaColumn" rows="3" placeholder="Type your message..." data-check="0"></textarea>'+
        '<button type="button" class="btn btn-danger" style="width: 100px" onclick="removeComponent(this,\'textarea\')">삭제</button>'+
    '</div>'+
    '<span class="errorWrap" style="color: red;">다시 입력해주세요.</span>',
    file:
    '<div class="input-group" style="margin-bottom: 10px">'+
        '<div class="input-group-addon fileOnlyPosition" style="width: 38px; border-right: 0;">↕</div>'+
        '<div class="form-control" style="border-right: 0;">파일을 선택해주세요.</div>'+
        '<input type="file" class="listFileColumn" style="display: none" data-check="0"/>'+
        '<div class="input-group-addon" style="padding: 0">'+
            '<button type="button" class="btn btn-light" style="height: 32px; border: 0; border-radius: 0" onclick="fileTrigger(this)">파일추가</button>'+
        '</div>'+
        '<div class="input-group-addon" style="padding: 0">'+
            '<button type="button" class="btn btn-danger" style="height: 32px; border: 0; border-radius: 0" onclick="removeComponent(this,\'file\')">항목삭제</button>'+
        '</div>'+
    '</div>',
    fileView:
    '<div class="input-group" style="display: flex; margin-bottom: 10px">'+
        '<div style="display: flex; width: 100%; border: 1px solid #bdc4c9">'+
            '<div class="filePosition fileOnlyPosition">↕</div>'+
            '<div class="fileView fileViewWrap">미리보기</div>'+
            '<div class="fileTitle fileTitleWrap">파일을 선택해주세요.</div>'+
        '</div>'+
        '<input type="file" class="listFileViewColumn" style="display: none" data-check="0"/>'+
        '<button type="button" class="btn btn-light" style="width: 100px; border-radius: 0;border-left: 0;border-right: 0;" onclick="fileTrigger(this)">파일추가</button>'+
        '<button type="button" class="btn btn-danger" style="width: 100px; border: 1px solid #bdc4c9; border-radius: 0" onclick="removeComponent(this,\'fileView\')">항목삭제</button>'+
    '</div>',
}

//=====================================
//컴포넌트 삭제
//-------------------------------------
function removeComponent(e,type)
{
    switch (type) {
        case 'text':$(e).parent().parent().remove();
            break;
        case 'textarea':$(e).parent().remove();
            break;
        case 'file':$(e).parent().parent().remove();
            break;
        case 'fileView':$(e).parent().remove();
            break;
    }
}

//=====================================
//동적생성 순서변경
//-------------------------------------
$( function() {
    $(".addElementWrap").sortable({
        handle: ".fileOnlyPosition",
        axis: "y"
    });
} );

//=============================================================
//↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓플러그인 기본 사용↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
//=============================================================

//=====================================
//CKEDITOR 기본 셋팅
//-------------------------------------
//기본 config 사용
CKEDITOR.replace( 'editorColumn1', {//textarea name넣기
    on: {
        instanceReady: function(e) {
            //데이터 넣기
            this.setData('default config 적용')
        }
    },
    customConfig: './config.js',
    height:'100px',//사용시 높이제거
});

// 커스텀 config 사용
CKEDITOR.replace( 'editorColumn2', {//textarea name넣기
    on: {
        instanceReady: function(e) {
            //데이터 넣기
            this.setData('커스텀 config 적용')
        }
    },
    customConfig: './testConfig.js',
    height:'100px',//사용시 높이제거
});

//=====================================
//datePicker 기본 셋팅
//-------------------------------------
//datePicker설정
var dateCustomSetting = {
    singleDatePicker: true,//true:singledatepicker / false:daterangepicker
    locale: {
        format: 'YYYY-MM-DD',//날짜 포멧
        applyLabel: "확인",// 확인 버튼 텍스트
        cancelLabel: "취소",// 취소 버튼 텍스트
        daysOfWeek: ["일", "월", "화", "수", "목", "금", "토"],//요일 한글
        monthNames: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"]//월 한글
    }
}
//datepicker생성
$('input[name="dateColumn"]').daterangepicker(dateCustomSetting);

//dateRangePicker설정
var dateRangeCustomSetting = {
    singleDatePicker: false,//true:singledatepicker / false:daterangepicker
    locale: {
        format: 'YYYY-MM-DD',//날짜 포멧
        applyLabel: "확인",// 확인 버튼 텍스트
        cancelLabel: "취소",// 취소 버튼 텍스트
        daysOfWeek: ["일", "월", "화", "수", "목", "금", "토"],//요일 한글
        monthNames: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"]//월 한글
    }
}
//daterangepicker생성
$('input[name="dateRange"]').daterangepicker(dateRangeCustomSetting);

//=====================================
//tagInput 기본 셋팅
//-------------------------------------
$('#tagsColumn').tagsInput({ width: 'auto', height: 'auto'});

//---------------------------------------- 레이아웃 관련 End ----------------------------------------



//=====================================
// 공통 유효성검사 체크 함수
//=====================================
function isValidationInput()
{
    var dataFail = []
    $('[data-check]').each(function()
    {
        var element = $(this);

        //==================================================
        //0: 값 유무 체크, checkWrap: checkBox 값 유무 체크, radioWrap: radio 값 유무 체크
        //==================================================
        var checkType = element.data('check');
        console.log(checkType);

        //값 유무체크
        if(checkType == '0')
        {
            if(element.val() == '')
            {
                dataFail.push(element);
            }
        }
        else if(checkType == 'checkWrap')
        {
            var listCheckBox = element.find('input');
            var isCheck = false;
            for(var i=0; i<listCheckBox.length; i++)
            {
                var checkBox = listCheckBox[i];
                if(checkBox.checked == true)
                {
                    isCheck = true;
                    break;
                }
            }

            if(!isCheck)
            {
                dataFail.push(element);
            }
        }
        else if(checkType == 'radioWrap')
        {
            var value = element.find(':radio[name="radioName"]:checked').val();
            if(value == '')
            {
                dataFail.push(element);
            }
        }






        // console.log($(this));
        // if($(this).val()=='' || $(this).val()=='default' && !$(this).is('div'))
        // {
        //     if(!$(this).hasClass('checkWrap'))
        //     {
        //         dataFail.push($(this))
        //     }
        //     if($(this).attr('type')=='file')
        //     {
        //         $(this).parent().prev().css('border-color','#f75d6fd8')
        //         return false;
        //     }
        //     $(this).css('border-color','#f75d6fd8')
        // }
        // else
        // {
        //     if($(this).attr('type')=='file')
        //     {
        //         $(this).parent().prev().css('border-color','#e4e6ef')
        //         return false;
        //     }
        //     $(this).css('border-color','#e4e6ef')
        // }
        // if($(this).attr('name'))
        // {
        //     var list = []
        //     $('input[name='+$(this).attr('name')+']:checked').each(function()
        //     {
        //         list.push(0)
        //     })
        //     if(list.length==0)
        //     {
        //         dataFail.push($('input[name='+$(this).attr('name')+']').closest('.form-control'))
        //         $('input[name='+$(this).attr('name')+']').closest('.form-control').css('border-color','#f75d6fd8')
        //     }
        //     else
        //     {
        //         console.log('?????????')
        //         $('input[name='+$(this).attr('name')+']').closest('.form-control').css('border-color','#e4e6ef')
        //     }
        // }
    })

    console.log(dataFail);
    if(dataFail.length>0)
    {
        var offset = dataFail[0].parent().offset();
        $('html, body').animate({scrollTop : (offset.top-105)}, 300);
        alert('필수항목을 입력해주세요.')
        return false;
    }

    return true;
}

$(function() {
    $('.tabInTab').click(function() {
        $(this).next('ul').slideDown();
    })
})