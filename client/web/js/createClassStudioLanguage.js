var defaultLanguage = [
    'English',
    'Korean',
    'Spanish',
    'French',
    'German',
    'Russian',
    'Japanese',
    'Chinese',
    'Italian'
]

var otherLanguage = [
    'English',
    'Korean',
    'Spanish',
    'French',
    'German',
    'Russian',
    'Japanese',
    'Chinese',
    'Italian'
]

//추가언어 선택
// $(document).on('click', 'input[name="otherLanguage"]', function(){
//     var chkVal = $(this).data('text');
//     console.log(chkVal + ' chkval in ready')
//     var addLang = '<div class="addLang">' +
//                 '<span class="text addLangText">'+chkVal+'</span>' +
//                 '<button class="delBtn-on">' +
//                     '<img src="/web/img/BTN_REMOVE.png" alt="">' +
//                 '</button>' +
//             '</div>'
//     if($(this).is(":checked")) 
//     {
//         $('.getOtherLanguage').append(addLang)
//     }
//     $('.delBtn-on').click(function() {
//         $(this).parent('.addLang').remove();
//     })
// });

function addOtherLangList(){

    var checkedOtherLangLists = document.querySelectorAll('input[class="otherLangList"]:checked');
    var addList = '';
    var chkVal = ''
    var addLang = '';
    for(list in checkedOtherLangLists){
        if(checkedOtherLangLists[list].type!=undefined){
            chkVal= checkedOtherLangLists[list].getAttribute('id').slice(0, -1);
            addLang = '<div class="addLang">' +
                        '<span class="text addLangText">'+chkVal+'</span>' +
                        '<button class="delBtn-on" onclick="removeLang(this, \''+chkVal+'\')">' +
                            '<img src="/web/img/BTN_REMOVE.png" alt="">' +
                        '</button>' +
                    '</div>';
            
            addList = addList+addLang;
       }
    }
    document.getElementsByClassName('otherLangBox')[0].classList.remove('active');
    document.getElementById('otherLangDom').innerHTML = addList;
    
}

//메인언어 선택

document.addEventListener('DOMContentLoaded', function(){
    appendMainLanguageList()
    
});


function appendMainLanguageList(){
    var defaultLanguageOptionIn ='';
    var selectedMainLanguage = document.getElementById('mainLanguage').value;
    console.log('get selected ' +selectedMainLanguage);
    for(var i = 0; i < defaultLanguage.length; i++)
    {
        if(selectedMainLanguage!=defaultLanguage[i]){
            var defaultLanguageOption = '<li>'+
                                        '<input type="radio" value="'+defaultLanguage[i]+'" id="'+defaultLanguage[i]+'" name="defaultLanguageOption">' +
                                        '<label for="'+defaultLanguage[i]+'">' +
                                        '    <span>'+defaultLanguage[i]+'</span>' +
                                        '</label>' +
                                        '</li>'
            defaultLanguageOptionIn += defaultLanguageOption;

        }
    }
    document.getElementById('mainLanguageBox').innerHTML=defaultLanguageOptionIn;
    classObject.mainLanguage = selectedMainLanguage;

}

function appendOtherLanguageList(){
    console.log('comecheck');
    document.getElementById('otherLanguageDom').style.display='';
    var otherLanguageOptionIn ='';
    
    for(var i = 0; i < otherLanguage.length; i++)
    {
        if(otherLanguage[i]!=classObject.mainLanguage){
            var adder = otherLanguage[i]+2
            var otherLanguageOption = '<li>' +
            '<input class="otherLangList" type="checkbox" id="'+adder+'" name="otherLanguage" data-text="'+otherLanguage[i]+'">' +
            '<label for="'+otherLanguage[i]+'2">' +
                '<span class="box"></span>' +
                '<span class="text">'+otherLanguage[i]+'</span>' +
            '</label>' +
            '</li>'
            otherLanguageOptionIn +=otherLanguageOption
        }
    }
    $('.otherLanguageBox').html(otherLanguageOptionIn);

}

function removeLang(e, name){
    e.parentElement.remove();
    console.log('get name : ' +name);
    document.getElementById(name+2).checked=false;
}

