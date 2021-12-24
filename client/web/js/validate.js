
var validateCheck = false;
function customValidate(e,regex,alertText,spanChoice)
{
    var checkRegex = null;
    var checkVal = $(e).val();
    var classCheck= $(spanChoice);//오류문구 넣은 태그

    switch (regex){//정규식 모음
        case "text" :
            checkRegex = /^[가-힣a-zA-Z~!@#$%^&*()__+.,\s\d]{1,200}$/;//글자 1~200자
            break;
        case "textKr" :
            checkRegex = /^[가-힣]{2,5}$/;//한글 2~5자
            break;
        case "textEn" :
            checkRegex = /^[a-zA-Z]{2,40}$/;//영문 2~40자
            break;
        case "number" :
            checkRegex = /^[0-9]+$/;//숫자
            break;
        case "email" :
            checkRegex = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;//이메일
            break;
        case "phone1" :
            checkRegex = /^(01[016789]+)([0-9]{7,8})$/;//폰번호
            break;
        case "phone2" :
            checkRegex = /^[0-9]{3,4}$/;//폰번호 중간 뒷자리
            break;
        default :
            checkRegex = null;
    }
    
    if(regex=='password')
    {
        var passCheck1 = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,30}$/.test(checkVal); //.test(checkString)   //영문,숫자
        var passCheck2 = /^(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,30}$/.test(checkVal); //.test(checkString)  //영문,특수문자
        var passCheck3 = /^(?=.*[^a-zA-Z0-9])(?=.*[0-9]).{8,30}$/.test(checkVal); //.test(checkString)  //특수문자, 숫자
        if(!(passCheck1))
        {
            if(checkVal=='')
            {
                classCheck.text('Please fill out the required fields.');
            }
            else
            {
                classCheck.text(alertText);
            }
            $(e).attr('data-check',0);
            return
        }
        else
        {
            $(e).attr('data-check',1);
            classCheck.text('');
            return
        }
    }
    else if(regex=='passwordCheck')
    {
        if($('#password').val() != $(e).val())
        {
            if(checkVal=='')
            {
                classCheck.text('Please fill out the required fields.');
            }
            else
            {
                classCheck.text(alertText);
            }
            $(e).attr('data-check','0');
            return
        }
        else
        {
            classCheck.text('');
            $(e).attr('data-check','1');
            return
        }
    }
    else if(regex=="check")
    {
        if($(e).is(':checked')==true)
        {
            classCheck.text('');
            $(e).attr('data-check','1');
            return
        }
        else
        {
            classCheck.text('Please fill out the required fields.');
            $(e).attr('data-check','0');
            return
        }
    }
    else if(regex=="select")
    {
        
        if($(e).val()!=0)
        {
            classCheck.text('');
            $(e).attr('data-check','1');
            return
        }
        else
        {
            classCheck.text('Please fill out the required fields.');
            $(e).attr('data-check','0');
            return
        }
    }
    else if(regex=='certificationNumber')
    {
        //certificationNumber
        var cerNum1 = /^([a-zA-Z]{3})+([0-9]{3})$/.test(checkVal);
        var cerNum2 = /^([0-9]{3})+([a-zA-Z]{3})$/.test(checkVal);        
        if(!(cerNum1 || cerNum2))
        {
            if(checkVal=='')
            {
                classCheck.text('Please fill out the required fields.');
            }
            else
            {
                classCheck.text(alertText);
            }
            $(e).attr('data-check','0');
            $(e).attr('data-verify','0');
            return
        }
        else
        {
            $(e).attr('data-verify','1');
            classCheck.text('');
            return
        }
    }
    else
    {
        if(checkRegex.test(checkVal) == false)
        {
            if(checkVal=='')
            {
                classCheck.text('Please fill out the required fields.');
            }
            else
            {
                classCheck.text(alertText);
            }
            $(e).attr('data-check','0');
            return
        }
        else
        {
            $(e).attr('data-check','1');
            classCheck.text('');
            return
        }
    }
}
/*저장시
function join()
{
    var successList = []
    $('[data-check]').each(function(e){
        if($(this).attr('data-check')==0)
        {
            successList.push('0')
            $(this).trigger('onkeyup','onclick')
        }
    })
    if(successList.length==0)
    {
        alert('가입완료')
    }
    else
    {
        alert('가입실패')
    }
}
*/