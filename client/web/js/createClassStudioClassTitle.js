// 4단계 클래스 제목 및 소개 5개 제한 (쉼표 , 들어가있는 항목 수정 해야함)
// 수정 해야할 항목 영어 : Eating Disorder, Panic Disorder, Mental Health, Weight Loss
// 수정 해야할 항목 한글 : (숙면,잠) , (학습, 공부), (직업, 취직), (학문, 학술), 체중감량,  

$(document).on('click', '.allKeywords input[type="checkbox"]', function(){
    var chkVal = $(this).data('keyword');
    var chkName = $(this).next().text();
    var addLKeyword = '<div class="chkKeyWord" id="'+chkVal+'comple" name="keywords">' +
                        '<span class="keyWordText">'+chkName+'</span>' +
                        '</div>'

    if($(this).is(":checked"))
    {
        if($('.chkKeyWord').length == 5)
        {
            $('#'+chkVal+'comple').remove();
            $('.chkKeyWord').length -= 1;
            return false;
        }
        else{
            $('.getKeyWords').append(addLKeyword);
        }
    }
    else
    {
        $('#'+chkVal+'comple').remove();
    }

  
   
    console.log('length!!!!!!!!!!------>>>'+$('.chkKeyWord').length);
});

//제목 글자수 제한
// $(document).on('keyup','#classTitleInput', function() {
//     var textCount = $(this).val();
//     $('.titleCount').html(textCount.length);
//     if(textCount.length >= 100)
//     {
//         alert('더 이상 입력할 수 없습니다')
//     }
// })
// //설명 글자수 제한
// $(document).on('keyup','#classDesc', function() {
//     var textCount = $(this).val();
//     $('.descCount').html(textCount.length);
//     if(textCount.length >= 1500)
//     {
//         alert('더 이상 입력할 수 없습니다')
//     }
// })
