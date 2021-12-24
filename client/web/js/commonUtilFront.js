$(()=>{
    $(window).on({
        resize:()=>{
            if($(window).innerWidth()>826)
            {
                $('.mobMenuBtn').removeClass('expanded');
                count = 0;
                $('.menuHead').css('right','-100vw');
            }
        }
    })
    $('input').on({
        focus: (e)=>{
            if($(e.target).data('check')==1)
            {
                $(e.target).next().css({'color':'#fff','transform':'translate(-125%,-50%)'})
            }
            else if($(e.target).data('check')==2)
            {
                $(e.target).next().css({'color':'#000','transform':'translate(0%,-200%)'})
                $(e.target).css({'border':'1px solid #000'})
            }
            else if($(e.target).data('check')==3)
            {
                $(e.target).next().css({'color':'#000','transform':'translate(0%,-200%)'})
                $(e.target).css({'border':'1px solid #000'})
            }
            else if($(e.target).data('check')==4)
            {
                $(e.target).next().css({ 'color': '#000', 'transform': 'translate(0%,-200%)' });
                $(e.target).css({ 'border': '1px solid #000' });
            }
        },
        keyup: function keyup(e) {
            if ($(e.target).attr('id') == 'email') {
                $('#emailCheck').val('false');
            }
            
            if($(e.target).data('regexp'))
            {
                let regExp = null
                if($(e.target).data('regexp')=='nameKr')
                {
                    regExp = /^[가-힣]{2,5}$/;
                }
                else if($(e.target).data('regexp')=='nameEn')
                {
                    regExp = /^[a-zA-Z]{2,40}$/;
                }
                else if($(e.target).data('regexp')=='number')
                {
                    regExp = /^[0-9]+$/;
                }
                else if($(e.target).data('regexp')=='email')
                {
                    regExp = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
                }
                else if($(e.target).data('regexp')=='mobile1')
                {
                    regExp = /^(01[016789])$/;
                }
                else if($(e.target).data('regexp')=='mobile2')
                {
                    regExp = /^[0-9]{3,4}$/;
                }
                else if($(e.target).data('regexp')=='required')
                {
                    regExp = null;
                }
                else if($(this).data('regexp')=='password')
                {
                    regExp = 'pass'
                }
                else if($(this).data('regexp')=='passwordCheck')
                {
                    regExp = 'passCheck'
                }
                else if($(this).data('regexp')=='updatePassword')
                {
                    regExp = 'updatePassword'
                }
                else if($(this).data('regexp')=='updatePasswordCheck')
                {
                    regExp = 'updatePasswordCheck'
                }

                let checkString = $(this).val()
                if(regExp==null)
                {
                    if(checkString=='')
                    {
                        $(e.target).next().html('입력해주세요.')
                        $(e.target).next().css({'color':'red','transform':'translate(0%,-200%)'})
                        $(e.target).css({'border':'1px solid red'})
                        return
                    }
                    else
                    {
                        $(e.target).next().html('완료')
                        $(e.target).next().css({'color':'green','transform':'translate(0%,-200%)'})
                        $(e.target).css({'border':'1px solid green'})
                        return
                    }
                }
                else if(regExp=='pass')
                {
                    let passCheck1 = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,30}$/.test(checkString)   //영문,숫자
                    let passCheck2 = /^(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,30}$/.test(checkString)  //영문,특수문자
                    let passCheck3 = /^(?=.*[^a-zA-Z0-9])(?=.*[0-9]).{8,30}$/.test(checkString)  //특수문자, 숫자
                    if(!(passCheck1||passCheck2||passCheck3))
                    {
                        $(e.target).next().html('영문 대소문자/숫자/특수문자 중 2가지 이상 조합, 8자리 이상 입력해 주세요.')
                        $(e.target).next().css({'color':'red','transform':'translate(0%,-200%)'})
                        $(e.target).css({'border':'1px solid red'})
                        return
                    }
                    else
                    {
                        $(e.target).next().html('완료')
                        $(e.target).next().css({'color':'green','transform':'translate(0%,-200%)'})
                        $(e.target).css({'border':'1px solid green'})
                        return
                    }
                }
                else if(regExp=='passCheck')
                {
                    if($('[data-regexp=passwordCheck]').val()!=$('[data-regexp=password]').val())
                    {
                        $(e.target).next().html('비밀번호가 틀렸습니다.')
                        $(e.target).next().css({'color':'red','transform':'translate(0%,-200%)'})
                        $(e.target).css({'border':'1px solid red'})
                        return
                    }
                    else
                    {
                        $(e.target).next().html('완료')
                        $(e.target).next().css({'color':'green','transform':'translate(0%,-200%)'})
                        $(e.target).css({'border':'1px solid green'})
                        return
                    }
                }
                else if(regExp=='updatePassword')
                {
                    let passCheck1 = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,30}$/.test(checkString)   //영문,숫자
                    let passCheck2 = /^(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,30}$/.test(checkString)  //영문,특수문자
                    let passCheck3 = /^(?=.*[^a-zA-Z0-9])(?=.*[0-9]).{8,30}$/.test(checkString)  //특수문자, 숫자
                    if(checkString && (!(passCheck1||passCheck2||passCheck3)))
                    {
                        $(e.target).next().html('영문 대소문자/숫자/특수문자 중 2가지 이상 조합, 8자리 이상 입력해 주세요.')
                        $(e.target).next().css({'color':'red','transform':'translate(0%,-200%)'})
                        $(e.target).css({'border':'1px solid red'})
                        return
                    }
                    else
                    {
                        $(e.target).next().html('완료')
                        $(e.target).next().css({'color':'green','transform':'translate(0%,-200%)'})
                        $(e.target).css({'border':'1px solid green'})
                        return
                    }
                }
                else if(regExp=='updatePasswordCheck')
                {
                    if($('[data-regexp=updatePasswordCheck]').val()!=$('[data-regexp=updatePassword]').val())
                    {
                        $(e.target).next().html('비밀번호가 틀렸습니다.')
                        $(e.target).next().css({'color':'red','transform':'translate(0%,-200%)'})
                        $(e.target).css({'border':'1px solid red'})
                        return
                    }
                    else
                    {
                        $(e.target).next().html('완료')
                        $(e.target).next().css({'color':'green','transform':'translate(0%,-200%)'})
                        $(e.target).css({'border':'1px solid green'})
                        return
                    }
                }
                
                if(regExp.test(checkString)==false)
                {
                    $(e.target).next().html('형식에 맞게 입력해주세요.')
                    $(e.target).next().css({'color':'red','transform':'translate(0%,-200%)'})
                    $(e.target).css({'border':'1px solid red'})
                }
                else
                {
                    $(e.target).next().html('완료')
                    $(e.target).next().css({'color':'green','transform':'translate(0%,-200%)'})
                    $(e.target).css({'border':'1px solid green'})
                }
            }
        },
        blur:(e)=>{
            if($(e.target).data('check')==1)
            {
                if($(e.target).val()==""){
                    $(e.target).next().css({'color':'#bbb','transform':'translate(0,-50%)'})
                }
            }
            else if($(e.target).data('check')==2)
            {
                if($(e.target).val()==""){
                    $(e.target).next().css({'color':'#bbb','transform':'translate(0,-50%)'})
                    $(e.target).css({'border':'1px solid #e2e6e9'})
                }
            }
            else if($(e.target).data('check')==3)
            {
                if($(e.target).val()==""){
                    $(e.target).next().css({'color':'#bbb','transform':'translate(0,-50%)'})
                    $(e.target).css({'border':'1px solid #e2e6e9'})
                }
            }
            else if($(e.target).data('check')==4)
            {
                if($(e.target).val()==""){
                    $(e.target).next().css({'color':'#bbb','transform':'translate(0,-50%)'})
                    $(e.target).css({'border':'1px solid #e2e6e9'})
                }
            }
        },
        click:(e)=>{
            if($(e.target).data('check')==5){
            $('.'+e.target.name).hide()
        }
        }
    })
    $('select').on({
        focus: (e)=>{
            if($(e.target).data('check')==1)
            {
                $(e.target).next().css({'color':'#fff','transform':'translate(-125%,-50%)'})
            }
            else if($(e.target).data('check')==2)
            {
                $(e.target).next().css({'color':'#000','transform':'translate(0%,-200%)'})
                $(e.target).css({'border':'1px solid #000'})
            }
            else if($(e.target).data('check')==3)
            {
                $(e.target).next().css({'color':'#000','transform':'translate(0%,-200%)'})
                $(e.target).css({'border':'1px solid #000'})
            }
        },
        blur:(e)=>{
            if($(e.target).data('check')==1)
            {
                if($(e.target).val()==""){
                    $(e.target).next().css({'color':'#bbb','transform':'translate(0,-50%)'})
                }
            }
            else if($(e.target).data('check')==2)
            {
                if($(e.target).val()==""){
                    $(e.target).next().css({'color':'#bbb','transform':'translate(0,-50%)'})
                    $(e.target).css({'border':'1px solid #e2e6e9'})
                }
            }
            else if($(e.target).data('check')==3)
            {
                if($(e.target).val()==""){
                    $(e.target).next().css({'color':'#bbb','transform':'translate(0,-50%)'})
                    $(e.target).css({'border':'1px solid #e2e6e9'})
                }
            }
        },
    })
    $('button').on({
        click:(e)=>{
            if($(e.target).data('parent') && $(e.target).data('next')  && !$(e.target).data('func'))
            {       
                customValidate($(e.target).data('parent'),$(e.target).data('next'))
            }
            else if($(e.target).data('parent') && $(e.target).data('back'))
            {
                backButton($(e.target).data('parent'),$(e.target).data('back'))
            }
            else if($(e.target).data('parent') && $(e.target).data('func') && !$(e.target).data('next'))
            {
                customValidate($(e.target).data('parent'),'',$(e.target).data('func'))
            }
            else if($(e.target).data('parent') && $(e.target).data('next')  && $(e.target).data('func'))
            {
                customValidate($(e.target).data('parent'),$(e.target).data('next'),$(e.target).data('func'))
            }
        }
    })

    //폼 검증 및 다음페이지 이동
    function customValidate(parent,next,saveNum){
        let checkArray = []
        let firstCheck = []


        $('.'+parent).find('[data-check]').each(function (e)
        {
            if($(this).data('check')==2)
            {
                if(($(this).data('regexp') != 'updatePassword' && $(this).data('regexp') != 'updatePasswordCheck') && $(this).val()=='')
                {
                    $(this).next().css({'color':'red','transform':'translate(0,-50%)'})
                    $(this).css({'border':'1px solid red'});
                    checkArray.push(false)
                    firstCheck.push($(this))
                }
                else
                {
                    if($(this).data('regexp'))
                    {
                        let regExp = null
                        if($(this).data('regexp')=='nameKr')
                        {
                            regExp = /^[가-힣]{2,5}$/;
                        }
                        else if($(this).data('regexp')=='nameEn')
                        {
                            regExp = /^[a-zA-Z]{2,40}$/;
                        }
                        else if($(this).data('regexp')=='number')
                        {
                            regExp = /^[0-9]+$/;
                        }
                        else if($(this).data('regexp')=='email')
                        {
                            regExp = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
                        }
                        else if($(this).data('regexp')=='mobile1')
                        {
                            regExp = /^(01[016789])$/;
                        }
                        else if($(this).data('regexp')=='mobile2')
                        {
                            regExp = /^[0-9]{3,4}$/;
                        }
                        else if($(this).data('regexp')=='password')
                        {
                            regExp = 'pass'
                        }
                        else if($(this).data('regexp')=='passwordCheck')
                        {
                            regExp = 'passCheck'
                        }
                        else if($(this).data('regexp')=='updatePassword')
                        {
                            regExp = 'updatePassword'
                        }
                        else if($(this).data('regexp')=='updatePasswordCheck')
                        {
                            regExp = 'updatePasswordCheck'
                        }

                        
                        let checkString = $(this).val()
                        if(regExp==null)
                        {
                            if(checkString=='')
                            {
                                $(e.target).next().html('입력해주세요.')
                                $(e.target).next().css({'color':'red','transform':'translate(0%,-200%)'})
                                $(e.target).css({'border':'1px solid red'})
                                checkArray.push(false)
                                firstCheck.push($(this))
                            }
                            else
                            {
                                $(e.target).next().html('완료')
                                $(e.target).next().css({'color':'green','transform':'translate(0%,-200%)'})
                                $(e.target).css({'border':'1px solid green'})
                                checkArray.push(true)
                            }
                            return
                        }
                        else if(regExp=='pass')
                        {
                            let passCheck1 = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,30}$/.test(checkString)   //영문,숫자
                            let passCheck2 = /^(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,30}$/.test(checkString)  //영문,특수문자
                            let passCheck3 = /^(?=.*[^a-zA-Z0-9])(?=.*[0-9]).{8,30}$/.test(checkString)  //특수문자, 숫자
                            if(!(passCheck1||passCheck2||passCheck3))
                            {
                                $(e.target).next().html('영문 대소문자/숫자/특수문자 중 2가지 이상 조합, 8자리 이상 입력해 주세요.')
                                $(e.target).next().css({'color':'red','transform':'translate(0%,-200%)'})
                                $(e.target).css({'border':'1px solid red'})
                                checkArray.push(false)
                                firstCheck.push($(this))
                            }
                            else
                            {
                                $(e.target).next().html('완료')
                                $(e.target).next().css({'color':'green','transform':'translate(0%,-200%)'})
                                $(e.target).css({'border':'1px solid green'})
                                checkArray.push(true)
                            }
                            return
                        }
                        else if(regExp=='passCheck')
                        {
                            if($('[data-regexp=passwordCheck]').val()!=$('[data-regexp=password]').val())
                            {
                                $(e.target).next().html('비밀번호가 틀렸습니다.')
                                $(e.target).next().css({'color':'red','transform':'translate(0%,-200%)'})
                                $(e.target).css({'border':'1px solid red'})
                                checkArray.push(false)
                                firstCheck.push($(this))
                            }
                            else
                            {
                                $(e.target).next().html('완료')
                                $(e.target).next().css({'color':'green','transform':'translate(0%,-200%)'})
                                $(e.target).css({'border':'1px solid green'})
                                checkArray.push(true)
                            }
                            return
                        }
                        else if(regExp=='updatePassword')
                        {
                            let passCheck1 = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,30}$/.test(checkString)   //영문,숫자
                            let passCheck2 = /^(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,30}$/.test(checkString)  //영문,특수문자
                            let passCheck3 = /^(?=.*[^a-zA-Z0-9])(?=.*[0-9]).{8,30}$/.test(checkString)  //특수문자, 숫자
                            if(checkString && (!(passCheck1||passCheck2||passCheck3)))
                            {
                                $(e.target).next().html('영문 대소문자/숫자/특수문자 중 2가지 이상 조합, 8자리 이상 입력해 주세요.')
                                $(e.target).next().css({'color':'red','transform':'translate(0%,-200%)'})
                                $(e.target).css({'border':'1px solid red'})
                                checkArray.push(false)
                                firstCheck.push($(this))
                            }
                            else
                            {
                                $(e.target).next().html('완료')
                                $(e.target).next().css({'color':'green','transform':'translate(0%,-200%)'})
                                $(e.target).css({'border':'1px solid green'})
                                checkArray.push(true)
                            }
                            return
                        }
                        else if(regExp=='updatePasswordCheck')
                        {
                            if($('[data-regexp=updatePasswordCheck]').val()!=$('[data-regexp=updatePassword]').val())
                            {
                                $(this).next().html('비밀번호가 틀렸습니다.')
                                $(this).next().css({'color':'red','transform':'translate(0%,-200%)'})
                                $(this).css({'border':'1px solid red'})
                                checkArray.push(false)
                                firstCheck.push($(this))
                            }
                            else
                            {
                                $(this).next().html('완료')
                                $(this).next().css({'color':'green','transform':'translate(0%,-200%)'})
                                $(this).css({'border':'1px solid green'})
                                checkArray.push(true)
                            }
                            return
                        }

                        if(regExp.test(checkString)==false)
                        {
                            $(this).next().html('입력해주세요.')
                            $(this).next().css({'color':'red','transform':'translate(0%,-200%)'})
                            $(this).css({'border':'1px solid red'})
                            checkArray.push(false)
                            firstCheck.push($(this))
                        }
                        else
                        {
                            $(this).next().html('완료')
                            $(this).next().css({'color':'green','transform':'translate(0%,-200%)'})
                            $(this).css({'border':'1px solid green'})
                            checkArray.push(true)
                        }
                    }
                }
            }
            else if($(this).data('check')==4)
            {
                checkArray.push(true)
            }
            else if($(this).data('check')==5)
            {
                if($('[name='+$(this)[0].name+']:checked').val())
                {
                    checkArray.push(true)
                }
                else
                {
                    $('.'+$(this)[0].name).show()
                    checkArray.push(false)
                    firstCheck.push($('#'+$(this)[0].name))
                }
                
            }
        })

        if(parent == 'regi1Wrap')
        {
            var emailCheck = $('#emailCheck').val();
            if(emailCheck == 'false')
            {
                var labelText = '';
                if($('.nowLang').val()=='ko')
                {
                    labelText = '이메일을 중복체크해 주세요.';
                }
                else if($('.nowLang').val()=='en')
                {
                    labelText = 'Please duplicate check your email.';
                }
                $('#emailCheckLabel').html(labelText)
                $('#emailCheckLabel').css({'color':'red','transform':'translate(0,-200%)'})
                $('#email').css({'border':'1px solid red'});
                checkArray.push(false);
                firstCheck.push($('#email'))
                return;
            }
        }
        
        if(checkArray.indexOf(false)>=0)
        {
            firstCheck[0].focus()
        }
        else
        {
            if(saveNum)
            {   
                if(eval(saveNum+'()'))
                {
                    $('.'+next).show();
                    $('.'+parent).hide();    
                }
            }
            else
            {
                $('.'+next).show();
                $('.'+parent).hide();
            }
            
            /*
            if(next=='')
            {
                if(saveNum)
                {   
                    eval(saveNum+'()')
                    return
                }
            }
            $('.'+next).show();
            $('.'+parent).hide();
            if(saveNum)
            {   
                eval(saveNum+'()')
                return
            }
            */
            
        }
    }

    //이전페이지 이동
    function backButton(parent,back){
        $('.'+back).show();
        $('.'+parent).hide();
    }
    //-----------------------------------------

    //정보 등록 함수
    function save(){
        console.log('함수 만들기')
    }

     //login 함수
    function login(){
        let memberId = $('#memberId').val()
        let memberName = $('#memberName').val()
        
        let sendJsonObject = {};
        sendJsonObject.protocol = '';
        sendJsonObject.memberId = memberId;
        sendJsonObject.memberName = memberName;
        //protocolSendAjax(sendJsonObject, true, '/');
        console.log(sendJsonObject)
    }
    //등록페이지 중간 저장
    function saveData(){
        let nameKr = $('#nameKr').val()
        let nameEn = $('#nameEn').val()
        let phoneNum = $('#phoneNum1').val()
        phoneNum += $('#phoneNum2').val()
        phoneNum += $('#phoneNum3').val()
        let companyKr = $('#companyKr').val()
        let companyEn = $('#companyEn').val()
        let email = $('#email').val()
        let program1 = $('[name=program1]:checked').val()
        if(program1==1)
        {
            if($('#companySelect').val()=='')
            {
                alert('회원사를 선택해주세요.')
                return false;
            }
        }
        else if(program1==3)
        {
            if($('#fileUpload').val()=='')
            {
                alert('학생증을 첨부 해주세요.')
                return false;
            }
        }
        $('.formName').html(nameKr)
        $('.formCompany').html(companyKr)
        $('.formPhone').html(phoneNum)
        $('.formEmail').html(email)
        $('.payType').html(program1)
        $('.paymentName').html(program1)
        $('.payment').html(program1)
        return true;
    }

    //등록
    function finalRegistration(){
        let nameKr = $('#nameKr').val()
        let nameEn = $('#nameEn').val()
        let phoneNum = $('#phoneNum1').val()
        phoneNum += $('#phoneNum2').val()
        phoneNum += $('#phoneNum3').val()
        let phoneCheck = $('#phoneCheck').val()
        let country = $('#country').val()
        let address = $('#address').val()
        let detailAddress = $('#detailAddress').val()
        let companyKr = $('#companyKr').val()
        let companyEn = $('#companyEn').val()
        let email = $('#email').val()
        let groupName = $('#groupName').val()
        let rank = $('#rank').val()
        let q1 = $('[name=q1]:checked').val()
        let q2 = $('[name=q2]:checked').val()
        let q3 = $('[name=q3]:checked').val()
        let q4 = $('[name=q4]:checked').val()
        let q5 = []
        $('[name=q5]:checked').each(function() { q5.push($(this).val())})
        let q6 = []
        $('[name=q6]:checked').each(function() { q6.push($(this).val())})
        let q7 = []
        $('[name=q7]:checked').each(function() { q7.push($(this).val())})
        let q8 = $('[name=q8]:checked').val()
        let q9 = $('[name=q9]:checked').val()
        let program1 = $('[name=program1]:checked').val()

        let sendJsonObject = {};
        sendJsonObject.protocol = 'protocolMemberListC';
        sendJsonObject.nameKr = nameKr;
        sendJsonObject.nameEn = nameEn;
        sendJsonObject.phoneNum = phoneNum;
        sendJsonObject.phoneCheck = phoneCheck;
        sendJsonObject.country = country;
        sendJsonObject.address = address;
        sendJsonObject.detailAddress = detailAddress;
        sendJsonObject.companyKr = companyKr;
        sendJsonObject.companyEn = companyEn;
        sendJsonObject.email = email;
        sendJsonObject.groupName = groupName;
        sendJsonObject.rank = rank;
        sendJsonObject.q1 = q1;
        sendJsonObject.q2 = q2;
        sendJsonObject.q3 = q3;
        sendJsonObject.q4 = q4;
        sendJsonObject.q5 = q5;
        sendJsonObject.q6 = q6;
        sendJsonObject.q7 = q7;
        sendJsonObject.q8 = q8;
        sendJsonObject.q9 = q9;
        sendJsonObject.program1 = program1;


        //console.log(JSON.stringify(sendJsonObject));
        //alert('등록 완료되었습니다.')
        //window.location.href='/regiCheck'
        //protocolSendAjax(sendJsonObject, true, '/');
        memberSignIn(sendJsonObject);
    }
    //디데이
    dayGap ();
    let ddaytimer = setInterval (dayGap, 1000)
    function dayGap () {
        let nowDate = new Date();
        let choice = '2021-02-03'
        let checkDate = new Date(choice);
        let distance = checkDate - nowDate;
    
        let d = Math.floor(distance / (1000 * 60 * 60 * 24));
        let h = Math.floor((distance / (1000*60*60)) % 24);
        let m = Math.floor((distance / (1000*60)) % 60);
        let s = Math.floor((distance / 1000) % 60);

        if (distance <= 0) 
        {
            clearInterval(ddaytimer)
            $('.ddayTimeWrap').html('<span class="ddayMent">WELCOME SEMICON 2021</span>');
        } 
        else 
        {
            $('.days').html(d);
            $('.hours').html(h);
            $('.monutes').html(m);
            $('.seconds').html(s);
        }
    }
    $('.langChange').on({
        click:()=>{
            if($('.nowLang').val()=='ko')
            {
                $('.nowLang').val('en')
                $('.langChange').html('Lang<br />EN')
                $('[data-lang-ko]').each(function(e){
                    $(this).html($(this).data('langEn'))
                })
            }
            else
            {
                $('.nowLang').val('ko')
                $('.langChange').html('Lang<br />KR')
                $('[data-lang-en]').each(function(e){
                    $(this).html($(this).data('langKo'))
                })
            }
        }
    })
    if($('.nowLang').val()=='en')
    {
        $('.nowLang').val('en')
        $('.langChange').html('Lang<br />EN')
        $('[data-lang-ko]').each(function(e){
            $(this).html($(this).data('langEn'))
        })
    }
    else
    {
        $('.nowLang').val('ko')
        $('.langChange').html('Lang<br />KR')
        $('[data-lang-en]').each(function(e){
            $(this).html($(this).data('langKo'))
        })
    }



    //탭메뉴 스크립트
    //--------------------------------
    //다른 프로젝트에서 사용시 
    //html
    //탭메뉴 button 태그를 가지고 있는 부모태그에 .selectBtnWrap 추가(div안에 button형식으로)
    //탭매뉴 각각의 button 태그안에 data-select="0"부터 차례대로 넣기
    //버튼클릭시 보여지는 메뉴를 감싸고 있는 부모태그에 .childTabMenuWrap 추가(div안에 div 형식으로)
    //각각의 보여질 메뉴에 data-active="0"부터 차례대로 넣기
    //css
    //제목에 넣을 class (.selected) 본문에 넣을 class (.active)
    //--------------------------------
    $('.selectBtnWrap>button').on({
        click:function(){
            $('.selectBtnWrap>button').each(function()
            {
                $(this).removeClass('selected');
            })

            $(this).addClass('selected');

            $('.childTabMenuWrap>div').each(function()
            {
                $(this).removeClass('active');
            })

            $('[data-active="'+$(this).data('select')+'"]').addClass('active');
        }
    })
})