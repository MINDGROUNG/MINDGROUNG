//유저 데이터 변경
function signUp() {
    //==========================
    // 데이터 가져오기
    //==========================
    var member_id = document.querySelector('#member_id').value;
    var password = document.querySelector('#member_pw').value;
    var member_pw_check = document.querySelector('#member_pw_check').value;
    var name = document.querySelector('#name').value;
    var grade = document.querySelector('#grade').value;
    var mobile = document.querySelector('#mobile').value;
    var age = document.querySelector('#age').value;
    var gender = document.querySelector('#gender').value;
    var job = document.querySelector('#job').value;
    var joinPath = document.querySelector('#joinPath').value;

    //==========================
    // 데이터 체크
    //==========================
    if (!member_id) {
        alert('아이디를 입력해주세요.');
        return;
    }

    if (!password) {
        alert('비밀번호를 입력해주세요.');
        return;
    }

    if (!member_pw_check) {
        alert('비밀번호 확인을 입력해주세요.');
        return;
    }

    if (!name) {
        alert('이름을 입력해주세요.');
        return;
    } 

    if (!grade) {
        alert('권한을 선택해주세요.');
        return;
    }

    if (!joinPath) {
        alert('찾아오신경로를 선택해주세요.');
        return;
    }

    if (!age) {
        alert('나이를 입력해주세요.');
        return;
    }

    if (!gender) {
        alert('성별을 입력해주세요.');
        return;
    }

    if (!job) {
        alert('직업을 입력해주세요.');
        return;
    }

    if (!mobile) {
        alert('휴대폰 번호를 입력해주세요.');
        return;
    }

    //==========================
    // 데이터 정규식 체크
    //==========================
    if (!getRegEmail().test(member_id)) {
        alert('아이디는 이메일 형식이여야합니다.');
        return;
    }

    var pw_min_length = 6;
    var pw_max_length = 16;
    if (password.length < pw_min_length || password.length > pw_max_length) {
        alert('비밀번호는 6자리 ~ 16자리 까지 가능합니다.');
        return;
    }

    if (!getRegEnglishNumberSpecialChar().test(password)) {
        alert('비밀번호는 영어, 숫자, 특수문자만 입력가능합니다.');
        return;
    }

    if (password != member_pw_check) {
        alert('비밀번호와 비밀번호 확인이 다릅니다.');
        return;
    }

    if (!getRegName().test(name)) {
        alert('이름을 확인해주세요.');
        return;
    } else if(!getRegEnglish().test(name)) {
        alert('영문 이름을 기입해주세요.');
        return;
    }

    if (!getRegNumber().test(age)) {
        alert('나이는 숫자만 입력가능합니다.');
        return;
    }

    if (!getRegNumber().test(age)) {
        alert('나이는 숫자만 입력가능합니다.');
        return;
    }

    if (!getRegMobile().test(mobile)) {
        alert('휴대폰 번호를 확인해주세요.');
        return;
    }

    var sendJsonObject = {};
    sendJsonObject.protocol = 'signUp';

    sendJsonObject.member_id = member_id;
    sendJsonObject.password = password;
    sendJsonObject.name = name;
    sendJsonObject.grade = grade;
    sendJsonObject.mobile = mobile;
    sendJsonObject.age = age;
    sendJsonObject.gender = gender;
    sendJsonObject.job = job;
    sendJsonObject.join_path = joinPath;

    alert('회원가입 완료.')

    protocolSendAjax(sendJsonObject, true, '/');
}


//유저 데이터 변경
function memberU(member_uid) {
    //==========================
    // 데이터 가져오기
    //==========================
    var member_id = document.querySelector('#member_id').value;
    var password = document.querySelector('#member_pw').value;
    var member_pw_check = document.querySelector('#member_pw_check').value;
    var name = document.querySelector('#name').value;
    var grade = document.querySelector('#grade').value;

    /*
    var mobile = document.querySelector('#mobile').value;
    var age = document.querySelector('#age').value;
    var gender = document.querySelector('#gender').value;
    var job = document.querySelector('#job').value;
    var joinPath = document.querySelector('#joinPath').value;
    */

    //==========================
    // 데이터 체크
    //==========================
    if (!member_id) {
        alert('아이디를 입력해주세요.');
        return;
    }

    if (!password) {
        alert('비밀번호를 입력해주세요.');
        return;
    }

    if (!member_pw_check) {
        alert('비밀번호 확인을 입력해주세요.');
        return;
    }

    if (!name) {
        alert('이름을 입력해주세요.');
        return;
    }

    if (!grade) {
        alert('권한을 선택해주세요.');
        return;
    }

    // if (!joinPath) {
    //     alert('찾아오신경로를 선택해주세요.');
    //     return;
    // }

    // if (!age) {
    //     alert('나이를 입력해주세요.');
    //     return;
    // }

    // if (!gender) {
    //     alert('성별을 입력해주세요.');
    //     return;
    // }

    // if (!job) {
    //     alert('직업을 입력해주세요.');
    //     return;
    // }

    // if (!mobile) {
    //     alert('휴대폰 번호를 입력해주세요.');
    //     return;
    // }

    //==========================
    // 데이터 정규식 체크
    //==========================
    if (!getRegEmail().test(member_id)) {
        alert('아이디는 이메일 형식이여야합니다.');
        return;
    }

    var pw_min_length = 6;
    var pw_max_length = 16;
    if (password.length < pw_min_length || password.length > pw_max_length) {
        alert('비밀번호는 6자리 ~ 16자리 까지 가능합니다.');
        return;
    }

    if (!getRegEnglishNumberSpecialChar().test(password)) {
        alert('비밀번호는 영어, 숫자, 특수문자만 입력가능합니다.');
        return;
    }

    if (password != member_pw_check) {
        alert('비밀번호와 비밀번호 확인이 다릅니다.');
        return;
    }

    if (!getRegName().test(name)) {
        alert('이름을 확인해주세요.');
        return;
    }

    /*
    if (!getRegNumber().test(age)) {
        alert('나이는 숫자만 입력가능합니다.');
        return;
    }

    if (!getRegNumber().test(age)) {
        alert('나이는 숫자만 입력가능합니다.');
        return;
    }

    if (!getRegMobile().test(mobile)) {
        alert('휴대폰 번호를 확인해주세요.');
        return;
    }
    */

    var sendJsonObject = {};
    sendJsonObject.protocol = 'memberU';

    sendJsonObject.member_uid = member_uid;
    sendJsonObject.member_id = member_id;
    sendJsonObject.password = password;
    sendJsonObject.name = name;
    sendJsonObject.grade = grade;
    /*
    sendJsonObject.mobile = mobile;
    sendJsonObject.age = age;
    sendJsonObject.gender = gender;
    sendJsonObject.job = job;
    sendJsonObject.join_path = joinPath;
    */
    protocolSendAjax(sendJsonObject, true, '/admin/');
}


//유저 데이터 변경
function login() {
    var member_id = document.querySelector('#member_id').value;
    var password = document.querySelector('#password').value;

    if (!member_id) {
        // alert('아이디를 입력해주세요.');
        document.querySelector('.wrongMessage-email').style.display = 'block'
        return;
    }

    if (!password) {
        // alert('비밀번호를 입력하세요.');
        document.querySelector('.wrongMessage-pwd').style.display = 'block'
        return;
    }

    var sendJsonObject = {};
    sendJsonObject.protocol = 'login';

    sendJsonObject.member_id = member_id;
    sendJsonObject.password = password;

    protocolSendAjax(sendJsonObject, false, '/');
}

//클래스 on off
var count = 0;
function classToggle(e, className, eventClass, num) {
    if (eventClass != null) {
        //변형 토글 버튼
        var targetTag = document.querySelector('.' + eventClass);
        count++;
        count = count % 2;
        if (count == 1) {
            e.classList.add(className);
            targetTag.style.height = num + 'px';
        } else {
            e.classList.remove(className);
            targetTag.style.height = 0;
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
}

var isPopUpOpen = 0;
function faqToggle(e, className) {
    const faqList = document.querySelectorAll('.faqList');
    //일반 토글 버튼
    if (e.className == 'faqList open') {
        for (var i = 0; i < faqList.length; i++) {
            faqList[i].classList.remove(className);
        }
        return;
    }
    for (var i = 0; i < faqList.length; i++) {
        faqList[i].classList.remove(className);
        isPopUpOpen = 0;
    }
    isPopUpOpen++;
    isPopUpOpen = isPopUpOpen % 2;
    if (isPopUpOpen == 1) {
        e.classList.add(className);
    } else {
        e.classList.remove(className);
    }
}

function logout() {
    var sendJsonObject = {};
    sendJsonObject.protocol = 'logout';

    protocolSendAjax(sendJsonObject, false, '/');
}

//==========================
// 엑셀다운로드
//==========================
function downloadExcel(winnerListString) {
    var winnerList = JSON.parse(winnerListString);

    if (winnerList.length == 0) {
        alert('다운로드할 데이터가 없습니다.');
        return;
    }

    //엑셀 시트 항목
    var excelArray = [['NO.', '회원번호', 'Email', '이름', '핸드폰번호', '직업', '나이', '성별', '가입경로', '가입일']];
    for (var i = 0; i < winnerList.length; i++) {
        var data = winnerList[i];

        //엑셀 데이터
        var rowValue = [];
        rowValue.push(i + 1);
        rowValue.push(data.member_uid);
        rowValue.push(data.member_id);
        rowValue.push(data.name);
        rowValue.push(data.mobile);
        rowValue.push(data.job);
        rowValue.push(data.age);
        if (data.gender == 'M') {
            rowValue.push('남성');
        } else if (data.gender == 'W') {
            rowValue.push('여성');
        } else {
            rowValue.push('기타');
        }
        rowValue.push(data.join_path);
        rowValue.push(moment(data.reg_date).format('YYYY-MM-DD HH:mm:ss'));

        excelArray.push(rowValue);
    }

    // step 1. workbook 생성
    var wb = XLSX.utils.book_new();

    // step 2. 시트 만들기
    var newWorksheet = XLSX.utils.aoa_to_sheet(excelArray);

    // step 3. workbook에 새로만든 워크시트에 이름을 주고 붙인다.
    XLSX.utils.book_append_sheet(wb, newWorksheet, '회원리스트');

    // step 4. 엑셀 파일 만들기
    var wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

    // step 5. 엑셀 파일 내보내기
    saveAs(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }), '회원리스트.xlsx');
}

function s2ab(s) {
    var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
    var view = new Uint8Array(buf); //create uint8array as viewer
    for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff; //convert to octet
    return buf;
}
//==========================
// 정규식 모음
//==========================
function getRegEnglish() {
    return /^[a-zA-Z]+$/;
}

function getRegEnglishNumber() {
    return /^[a-zA-Z0-9]+$/;
}

function getRegEnglishNumberSpecialChar() {
    return /^[0-9a-zA-Z~`!@#$%\\^&*()-_+={}:;"']+$/;
}

function getRegNumber() {
    return /^[0-9]+$/;
}

function getRegKorean() {
    return /^[가-힣]+$/;
}

function getRegEnglishKorean() {
    return /^[a-zA-Z가-힣]+$/;
}

function getRegName() {
    return /^[가-힣]{2,5}|[a-zA-Z]{2,40}$/;
}

function getRegMobile() {
    return /^(01[016789])[0-9]{3,4}[0-9]{4}$/;
}
function getRegMobileWithHyphen() {
    return /^(01[016789])-[0-9]{3,4}-[0-9]{4}$/;
}

function getRegEmail() {
    return /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
}

function moveLogin() {
    alert('로그인후 이용가능합니다.');
    window.location.href = '/login';
}
