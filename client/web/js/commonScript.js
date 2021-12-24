function isValidationData()
{
    var dataFail = []
    $('[data-check]').each(function()
    {
        if($(this).val()=='' || $(this).val()=='default' && !$(this).is('div'))
        {
            if(!$(this).hasClass('checkWrap'))
            {
                dataFail.push($(this))
            }
            if($(this).attr('type')=='file')
            {
                $(this).parent().prev().css('border-color','#f75d6fd8')
                return false;
            }
            $(this).css('border-color','#f75d6fd8')
        }
        else
        {
            if($(this).attr('type')=='file')
            {
                $(this).parent().prev().css('border-color','#e4e6ef')
                return false;
            }
            $(this).css('border-color','#e4e6ef')
        }
        if($(this).attr('name'))
        {
            var list = []
            $('input[name='+$(this).attr('name')+']:checked').each(function()
            {
                list.push(0)
            })
            if(list.length==0)
            {
                dataFail.push($('input[name='+$(this).attr('name')+']').closest('.form-control'))
                $('input[name='+$(this).attr('name')+']').closest('.form-control').css('border-color','#f75d6fd8')
            }
            else
            {
                $('input[name='+$(this).attr('name')+']').closest('.form-control').css('border-color','#e4e6ef')
            }
        }
    })
    if(dataFail.length>0)
    {
        console.log(dataFail)
        var offset = dataFail[0].parent().offset();
        $('html, body').animate({scrollTop : (offset.top-105)}, 300);
        alert('필수항목을 입력해주세요.')
        return false;
    }

    return true;
}

$(document).ready(function(){
    var temp = ('<%- JSON.stringify(user) %>');
    var user = JSON.parse(temp);
    if(user.hasOwnProperty('userName')){
        // var user = JSON.parse('<%- JSON.stringify(user) %>');
        var afterLogin = document.getElementById('myInfo');
        afterLogin.classList.add('active')
        var beforeLogin = document.getElementById('signIn');
        beforeLogin.classList.remove('active');
        document.getElementById('userName').innerHTML=user.userName;

    }else{
        var afterLogin = document.getElementById('myInfo');
        afterLogin.classList.remove('active')
        var beforeLogin = document.getElementById('signIn');
        beforeLogin.classList.add('active');
    }
})
