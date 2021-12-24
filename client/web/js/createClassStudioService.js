//스튜디오 서비스 프로그램, 디벨롭 선택
$(document).on('click', '.commonPickBtn', function() {
    var chkNum = $(this).data('num');
    $('.commonPickBtn').removeClass('active');
    $(this).addClass('active');
    $('.get-commonForm').html(commonForm);
    if(chkNum == 1)
    {
        $('.get-commonForm').append(onlyDevelopInputBox);
    }

    //셀렉박스 열기 공통
    // $('input[type="button"]').click(function() {
    //     $(this).parent().next('.selectBox1-hdnMenu1').toggleClass('active')
    // });
    studioServiceBoxChange()

});

function studioServiceBoxChange(){
        //price셀렉박스값 받아오기
        $('input[name="selectPrice"]').click(function() {
            var thisVal = $(this).val();
            $('#selectPrice').val(thisVal);
            $(this).parents('.selectBox1-hdnMenu1').removeClass('active');
            valueChange();
    
        })
    
    
    
        
    
    
        //인원수제한박스
        $('input[name="audience"]').click(function() {
            var thisVal = $(this).val();
            $('#audience').val(thisVal)
            $(this).parents('.selectBox1-hdnMenu1').removeClass('active');
            if(thisVal == 'Input' || thisVal == '직접 입력')
            {
                $('.createInputBox').html('<input type="text" id="inputAudience">');
            }
            else
            {
                $('.createInputBox > input').remove();
            }
        })
}