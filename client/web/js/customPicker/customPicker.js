var entwizCalendar = (function()
{
    var rangeDateObj = {};
    var chageCheck = false;
    var toDayMonth;
    var toDayDate;
    var lastCheckDate = ''
    return{
        init:function(id,option)
        {
            //---------옵션이 없을경우 옵션 생성-------
            var option = option?option:{}
            rangeDateObj[id] = []
            //---------------------------------------
            //----------------------기본옵션값-------------------
            if(!option.pastDateNotCheck)
            {
                option.pastDateNotCheck = false;
            }
            if(!option.singleDate)
            {
                option.singleDate = false;
            }
            if(!option.todayStart)
            {
                option.todayStart = false;
            }
            if(!option.nDayCheck)
            {
                option.nDayCheck = {}
                if(!option.nDayCheck.check)
                {
                    option.nDayCheck.check = false;
                }
            }
            else
            {
                if(!option.nDayCheck.days)
                {
                    option.nDayCheck.days = 7;
                }
            }
            //----------------------기본옵션값-------------------

            //--------------(익스 대응)
            //forEach 생성 
            if (window.NodeList && !NodeList.prototype.forEach)
            {
                NodeList.prototype.forEach = Array.prototype.forEach;
            }
            //remove 생성
            if (!('remove' in Element.prototype)) {
                Element.prototype.remove = function() {
                    if (this.parentNode) {
                        this.parentNode.removeChild(this);
                    }
                };
            }
            //--------------(익스 대응)

            var calendarTextWrap =  document.createElement('div') //캘린더 영역 생성
            calendarTextWrap.classList.add('calendarWrap'); // 캘린더 영역에 id 생성
            //캘린더 폼

            if(sessionStorage.getItem('datePickerSession') != null && sessionStorage.getItem('datePickerSession') != undefined && sessionStorage.getItem('datePickerSession') == 'datePicker') {
                var calendarText =
                '<div class="entwizSoft-btnWrap">'+
                    '<div class="entwizSoft-yearMonth"></div>'+
                    '<button class="resetbtn entwizSoft-prev"><i class="xi-angle-left-thin"></i></button>'+
                    '<button class="resetbtn entwizSoft-next"><i class="xi-angle-right-thin"></i></button>'+
                '</div>'+
                '<table class="entwizSoft-calendarTable" align="center">'+
                    '<thead>'+
                        '<tr>'+
                            '<td class="entwizSoft-sun">SUN</td>'+
                            '<td>MON</td>'+
                            '<td>TUE</td>'+
                            '<td>WED</td>'+
                            '<td>THU</td>'+
                            '<td>FRI</td>'+
                            '<td class="entwizSoft-sat">SAT</td>'+
                        '</tr>'+
                    '</thead>'+
                    '<tbody class="entwizSoft-calendarContents calendarContents"></tbody>'+
                '</table>' +
                '<ul class="chkInfo">' +
                '<li><span class="box box1"></span><span class="text">Setting in progress</span></li>'+
                '<li><span class="box box2"></span><span class="text">Complete</span></li>'+
                '</ul>';

                sessionStorage.removeItem('datePickerSession');
            } else {
                var calendarText =
                '<div class="entwizSoft-btnWrap">'+
                    '<div class="entwizSoft-yearMonth"></div>'+
                    '<button class="resetbtn entwizSoft-prev"><i class="xi-angle-left-thin"></i></button>'+
                    '<button class="resetbtn entwizSoft-next"><i class="xi-angle-right-thin"></i></button>'+
                '</div>'+
                '<table class="entwizSoft-calendarTable" align="center">'+
                    '<thead>'+
                        '<tr>'+
                            '<td class="entwizSoft-sun">SUN</td>'+
                            '<td>MON</td>'+
                            '<td>TUE</td>'+
                            '<td>WED</td>'+
                            '<td>THU</td>'+
                            '<td>FRI</td>'+
                            '<td class="entwizSoft-sat">SAT</td>'+
                        '</tr>'+
                    '</thead>'+
                    '<tbody class="entwizSoft-calendarContents calendarContents"></tbody>'+
                '</table>' ;
            }

            calendarTextWrap.innerHTML = calendarText //캘린더 폼 생성
            document.getElementById(id).appendChild(calendarTextWrap)

            var currentTitle = document.querySelector('#'+id+' .entwizSoft-yearMonth'); // 현재 년,월 영역 id
            var calendarBody = document.querySelector('#'+id+' .entwizSoft-calendarContents'); //캘린더 영역 id
            var today = new Date(); //현재 날짜 가져오기
            var first = new Date(today.getFullYear(), today.getMonth(), 1); // 현재 년,월 1일
            var monthList = ['01','02','03','04','05','06','07','08','09','10','11','12'] //달
            var leapYear = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; 
            var notLeapYear = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            var pageFirst = first;
            var pageYear;
            var tdGroup = [];

            toDayMonth = (today.getMonth()+1) //현재 달
            toDayDate = today.getDate() //현재 일

            //윤년 계산기
            function leapYearCal()
            {
                if (first.getFullYear() % 4 === 0) //현재 년도가 4로 나눴을때 나머지가 0이면 윤년
                {
                    pageYear = leapYear;
                }
                else
                {
                    pageYear = notLeapYear;
                }
            }
            leapYearCal();

            //현재 년월 생성
            currentTitle.innerHTML = first.getFullYear() + ' ' + monthList[first.getMonth()];

            //1자리수 달에 앞에 0 붙여줌
            if(toDayMonth<10) 
            {
                toDayMonth = '0' + toDayMonth
            }
            //1자리수 일 앞에 0 붙여줌
            if(toDayDate<10)
            {
                toDayDate = '0'+today.getDate()
            }

            //캘린더 생성 함수 호출
            showCalendar(today.getFullYear(), toDayMonth);

            //캘린더 생성후 클릭이벤트 실행
            clickStart();

            //캘린더 생성후 당일 시작 값이 있으면 당일시작으로 변경
            if(option.todayStart)
            {
                document.querySelector('#'+id+' [data-date="'+new Date().getFullYear() + '' + toDayMonth + '' + toDayDate+'"]').classList.add('entwizSoft-active')
                rangeDateObj[id].push(new Date().getFullYear() + '' + toDayMonth + '' + toDayDate)
            }


            var checkedDate = document.getElementById(today.getDate()); //현재 일 id
            var prevBtn = document.querySelector('#'+id+' .entwizSoft-prev'); //이전 달로 이동 id
            var nextBtn = document.querySelector('#'+id+' .entwizSoft-next'); //다음 달로 이동 id
            prevBtn.addEventListener('click', prev); //이전달버튼 클릭시 prev 실행
            nextBtn.addEventListener('click', next); //다음달버튼 클릭시 prev 실행

            //캘린더 생성 함수
            function showCalendar(year, month)
            {
                var viewDay = 1;  //보여지는 일
                var todayArr = 0;
                var emptyArr = []; //달 줄 판별기
                var monthLine = 5; //달 줄 기본값
                var nextDay = 1;
                var prevDay = 0;

                if(first.getFullYear() % 4 === 0 && first.getMonth()-1 === -1)
                {
                    prevDay = leapYear[11]-first.getDay()+1;
                }
                else if(first.getFullYear() % 4 !== 0 && first.getMonth()-1 === -1)
                {
                    prevDay = notLeapYear[11]-first.getDay()+1;
                }
                else
                {
                    prevDay = pageYear[first.getMonth()-1]-first.getDay()+1;
                }
                
                for(var i = 0; i < 6; i++) //현재 달 수 체크
                {
                    for (var s = 0; s < 7; s++)
                    {
                        if(((i === 0 && s < first.getDay()) || viewDay > pageYear[first.getMonth()]))
                        {
                            emptyArr.push('0');
                        }
                    }
                }
                if((emptyArr.length == 5 && pageYear[first.getMonth()] == 31) || (emptyArr.length == 6 && pageYear[first.getMonth()] == 30) || (emptyArr.length == 6 && pageYear[first.getMonth()] == 31))
                {
                    monthLine = 6;
                }

                for (var i = 0; i < monthLine; i++) //이번 달의 줄 수
                {
                    var tableTr = document.createElement('tr'); //tr태그 생성 변수
                    for (var s = 0; s < 7; s++) //7일
                    {
                        if ((i === 0 && s < first.getDay())) //이전 달 다음달 영역
                        {
                            var tableTd = document.createElement('td'); 
                            var spanList = document.createElement('span');
                            
                            spanList.textContent = prevDay;
                            prevDay++;
                            tableTr.appendChild(tableTd);
                            tableTd.classList.add('disableDay')
                            tableTd.appendChild(spanList);
                        }
                        else if(viewDay > pageYear[first.getMonth()])
                        {
                            var tableTd = document.createElement('td'); 
                            var spanList = document.createElement('span');
                            
                            spanList.textContent = nextDay;
                            nextDay++;
                            tableTr.appendChild(tableTd);
                            tableTd.classList.add('disableDay')
                            tableTd.appendChild(spanList);
                        }
                        else //그 외 정상적인 현재 달의 일 영역
                        {
                            var tableTd = document.createElement('td');
                            var spanList = document.createElement('span'); 

                            spanList.textContent = viewDay;
                            tableTd.setAttribute('class', 'day'+viewDay+id);
                            tableTr.appendChild(tableTd);
                            tableTd.appendChild(spanList);

                            viewDay++ //일 증가
                            todayArr++ //data-date에 찍히는 일 증가
                            if(todayArr<10)
                            {
                                todayArr = '0'+todayArr
                            }
                            keyValue = year + '' + month + '' + todayArr //년월일
                            if(option.pastDateNotCheck)
                            {
                                if(keyValue<new Date().getFullYear() + '' + toDayMonth + '' + toDayDate)
                                {
                                    tableTd.classList.add('disableDay')
                                }
                            }
                            if(option.nDayCheck.check)
                            {
                                //console.log('keyValue',,' / ','toDayMonth : ',)
                                if(new Date(keyValue.substr(0,4)+'-'+keyValue.substr(4,2)+'-'+keyValue.substr(6,2)).getTime() > new Date(new Date().getFullYear() + '-' + toDayMonth + '-' +toDayDate).getTime()+((option.nDayCheck.days-1)*3600*24*1000))
                                {
                                    tableTd.classList.add('disableDay')
                                }
                            }
                            tableTd.setAttribute('data-date',keyValue) //td에 data-date 값 생성
                        }
                    }
                    calendarBody.appendChild(tableTr); //이번 달의 줄 생성
                }
                //오늘 날짜에 getToday 클래스 추가
                if(document.querySelector('#'+id+' [data-date="'+new Date().getFullYear() + '' + toDayMonth + '' + toDayDate+'"]'))
                {
                    document.querySelector('#'+id+' [data-date="'+new Date().getFullYear() + '' + toDayMonth + '' + toDayDate+'"]').classList.add('getToday');
                }
            }

            //캘린더 초기화
            function removeCalendar()
            {
                var tableTr = document.querySelectorAll('#'+id+' .entwizSoft-calendarContents tr');
                for (var i = 0; i < tableTr.length; i++)
                {
                    tableTr[i].remove();
                }
            }

            function rangeDateCheck(rangeDate)
            {
                return document.querySelector('#' + id + ' [data-date="'+rangeDate+'"]')
            }

            //이전 달 이동 이벤트함수
            function prev()
            {
                leapYearCal()
                if (pageFirst.getMonth() === 1)
                {
                    pageFirst = new Date(first.getFullYear() - 1, 12, 1);
                    first = pageFirst;
                    if (first.getFullYear() % 4 === 0)
                    {
                        pageYear = leapYear;
                    }
                    else
                    {
                        pageYear = notLeapYear;
                    }
                }
                else
                {
                    pageFirst = new Date(first.getFullYear(), first.getMonth() - 1, 1);
                    first = pageFirst;
                }

                today = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
                currentTitle.innerHTML = first.getFullYear() + ' ' + monthList[first.getMonth()];
                removeCalendar();
                showCalendar(first.getFullYear(), monthList[first.getMonth()]);
                moveCheck();
                clickStart();
            }

            //다음 달 이동 이벤트함수
            function next()
            {
                leapYearCal()
                if (pageFirst.getMonth() === 12)
                {
                    pageFirst = new Date(first.getFullYear() + 1, 1, 1);
                    first = pageFirst;
                    if (first.getFullYear() % 4 === 0)
                    {
                        pageYear = leapYear;
                    }
                    else
                    {
                        pageYear = notLeapYear;
                    }
                }
                else
                {
                    pageFirst = new Date(first.getFullYear(), first.getMonth() + 1, 1);
                    first = pageFirst;
                }

                today = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
                currentTitle.innerHTML = first.getFullYear() + ' ' + monthList[first.getMonth()];
                removeCalendar(); //캘린더 초기화
                showCalendar(first.getFullYear(), monthList[first.getMonth()]); //캘린더 생성
                moveCheck();
                clickStart();
            }

            function moveCheck()
            {
                if(option.nDayCheck.check===false)
                {
                    if(rangeDateObj[id].length==1)
                    {
                        if(rangeDateCheck(rangeDateObj[id][0]))
                        {
                            rangeDateCheck(rangeDateObj[id][0]).classList.add('entwizSoft-active');
                        }
                    }
                    else if(rangeDateObj[id].length==2)
                    {
                        if(rangeDateCheck(rangeDateObj[id][0]))
                        {
                            rangeDateCheck(rangeDateObj[id][0]).classList.add('entwizSoft-leftActive');
                        }
                        if(rangeDateCheck(rangeDateObj[id][1]))
                        {
                            rangeDateCheck(rangeDateObj[id][1]).classList.add('entwizSoft-rightActive');
                        }
                        var viewDate = document.querySelectorAll('#' + id + ' [data-date]')
                        for(var i =0; i<viewDate.length; i++)
                        {
                            if(Number(viewDate[i].getAttribute('data-date')) > rangeDateObj[id][0] && Number(viewDate[i].getAttribute('data-date'))<rangeDateObj[id][1])
                            {
                                viewDate[i].classList.add('entwizSoft-rangeActive')
                            }
                        }
                    }
                    else
                    {
                        if(document.querySelector('#' + id + ' [data-date="'+new Date().getFullYear() + '' + toDayMonth + '' + toDayDate+'"]'))
                        {
                            document.querySelector('#' + id + ' [data-date="'+new Date().getFullYear() + '' + toDayMonth + '' + toDayDate+'"]').classList.add('getToday');
                        }
                    }
                }
                else
                {
                    if(option.singleDate===false)
                    {
                        if(rangeDateObj[id].length==1)
                        {
                            if(rangeDateCheck(rangeDateObj[id][0]))
                            {
                                rangeDateCheck(rangeDateObj[id][0]).classList.add('entwizSoft-active');
                            }
                        }
                        else if(rangeDateObj[id].length==2)
                        {
                            if(rangeDateCheck(rangeDateObj[id][0]))
                            {
                                rangeDateCheck(rangeDateObj[id][0]).classList.add('entwizSoft-leftActive');
                            }
                            if(rangeDateCheck(rangeDateObj[id][1]))
                            {
                                rangeDateCheck(rangeDateObj[id][1]).classList.add('entwizSoft-rightActive');
                            }
                            var viewDate = document.querySelectorAll('#' + id + ' [data-date]')
                            for(var i =0; i<viewDate.length; i++)
                            {
                                if(Number(viewDate[i].getAttribute('data-date')) > rangeDateObj[id][0] && Number(viewDate[i].getAttribute('data-date'))<rangeDateObj[id][1])
                                {
                                    viewDate[i].classList.add('entwizSoft-rangeActive')
                                }
                            }
                        }
                        else
                        {
                            if(document.querySelector('#' + id + ' [data-date="'+new Date().getFullYear() + '' + toDayMonth + '' + toDayDate+'"]'))
                            {
                                document.querySelector('#' + id + ' [data-date="'+new Date().getFullYear() + '' + toDayMonth + '' + toDayDate+'"]').classList.add('getToday');
                            }
                        }
                    }
                    else
                    {
                        if(rangeDateCheck(rangeDateObj[id][0]))
                        {
                            for(var i = 0; i < rangeDateObj[id].length; i++)
                            {
                                rangeDateCheck(rangeDateObj[id][i]).classList.add('entwizSoft-active');
                            }
                        }
                    }
                }
            }

            //클릭 이벤트 함수
            function clickStart()
            {
                for (var i = 1; i <= pageYear[first.getMonth()]; i++)
                {
                    tdGroup[i] = document.querySelector('.day'+i+id);
                    if(tdGroup[i])
                    {
                        tdGroup[i].addEventListener('click', changeToday);
                        tdGroup[i].addEventListener('mouseover', overDay);
                        tdGroup[i].addEventListener('mouseout', outDay);
                    }
                }
            }

            //마우스호버 이벤트
            function overDay(e)
            {
                var test;
                if(e.target.nodeName==='SPAN')
                {
                    test = e.target.parentNode
                }
                else
                {
                    test = e.target
                }
                if(option.singleDate)
                {
                    test.classList.add('entwizSoft-hover')
                }
                else if(option.singleDate === false && option.todayStart===true)
                {
                    var dataDate = document.querySelectorAll('#' + id + ' [data-date]')
                    if(rangeDateObj[id].length===1)
                    {
                        if(test.getAttribute('data-date')<rangeDateObj[id][0])
                        {
                            test.classList.add('entwizSoft-leftHover')
                            for(var i = 0; i < dataDate.length; i++)
                            {
                                if(test.getAttribute('data-date') < dataDate[i].getAttribute('data-date') && rangeDateObj[id][0] > dataDate[i].getAttribute('data-date'))
                                {
                                    dataDate[i].classList.add('entwizSoft-rangeHover')
                                }
                                else
                                {
                                    dataDate[i].classList.remove('entwizSoft-rangeHover')
                                }
                            }
                        }
                        else if(test.getAttribute('data-date')>rangeDateObj[id][0])
                        {
                            test.classList.add('entwizSoft-rightHover')
                            for(var i = 0; i < dataDate.length; i++)
                            {
                                if(test.getAttribute('data-date') > dataDate[i].getAttribute('data-date') && rangeDateObj[id][0] < dataDate[i].getAttribute('data-date'))
                                {
                                    dataDate[i].classList.add('entwizSoft-rangeHover')
                                }
                                else
                                {
                                    dataDate[i].classList.remove('entwizSoft-rangeHover')
                                }
                            }
                        }
                        else
                        {
                            for(var i = 0; i < dataDate.length; i++)
                            {
                                dataDate[i].classList.remove('entwizSoft-rangeHover')
                            }
                            test.classList.add('entwizSoft-hover')
                        }
                    }
                }
                else if(option.singleDate === false && option.todayStart===false)
                {
                    if(rangeDateObj[id].length === 0)
                    {
                        test.classList.add('entwizSoft-hover')
                    }
                    else if(rangeDateObj[id].length == 1)
                    {
                        mouseOn = true;
                        var dataDate = document.querySelectorAll('#'+ id +' [data-date]')

                        if(test.getAttribute('data-date')<rangeDateObj[id][0])
                        {
                            test.classList.add('entwizSoft-leftHover')
                            for(var i = 0; i < dataDate.length; i++)
                            {
                                if(test.getAttribute('data-date') < dataDate[i].getAttribute('data-date') && rangeDateObj[id][0] > dataDate[i].getAttribute('data-date'))
                                {
                                    dataDate[i].classList.add('entwizSoft-rangeHover')
                                }
                                else
                                {
                                    dataDate[i].classList.remove('entwizSoft-rangeHover')
                                }
                            }
                        }
                        else if(test.getAttribute('data-date')>rangeDateObj[id][0])
                        {
                            test.classList.add('entwizSoft-rightHover')
                            for(var i = 0; i < dataDate.length; i++)
                            {
                                if(test.getAttribute('data-date') > dataDate[i].getAttribute('data-date') && rangeDateObj[id][0] < dataDate[i].getAttribute('data-date'))
                                {
                                    dataDate[i].classList.add('entwizSoft-rangeHover')
                                }
                                else
                                {
                                    dataDate[i].classList.remove('entwizSoft-rangeHover')
                                }
                            }
                        }
                        else
                        {
                            for(var i = 0; i < dataDate.length; i++)
                            {
                                dataDate[i].classList.remove('entwizSoft-rangeHover')
                            }
                            test.classList.add('entwizSoft-hover')
                        }
                    }
                }
            }

            //마우스 호버 땠을때 이벤트
            function outDay(e)
            {
                var test;
                if(e.target.nodeName==='SPAN')
                {
                    test = e.target.parentNode
                }
                else
                {
                    test = e.target
                }
                if(option.nDayCheck.check === false)
                {
                    if(rangeDateObj[id].length == 0)
                    {
                        test.classList.remove('entwizSoft-hover')
                    }
                    else if(rangeDateObj[id].length == 1)
                    {
                        test.classList.remove('entwizSoft-hover')
                        test.classList.remove('entwizSoft-leftHover')
                        test.classList.remove('entwizSoft-rightHover')
                    }
                }
                else if(option.nDayCheck.check === true && option.singleDate === false)
                {
                    if(rangeDateObj[id].length == 0)
                    {
                        test.classList.remove('entwizSoft-hover')
                    }
                    else if(rangeDateObj[id].length == 1)
                    {
                        test.classList.remove('entwizSoft-hover')
                        test.classList.remove('entwizSoft-leftHover')
                        test.classList.remove('entwizSoft-rightHover')
                    }
                }
                else
                {
                    test.classList.remove('entwizSoft-hover')
                }
            }

            //마우스 클릭 이벤트
            function changeToday(e)
            {
                var test;
                if(e.target.nodeName==='SPAN')
                {
                    test = e.target.parentNode
                }
                else
                {
                    test = e.target
                }
                if(test.classList[1]==='disableDay' || test.classList[0] === 'disableDay')
                {
                    return
                }
                if(option.singleDate && option.nDayCheck.check === false)
                {
                    if(rangeDateObj[id].length===0)
                    {
                        checkedDate = e.currentTarget;
                        checkedDate.classList.add('entwizSoft-active');
                        rangeDateObj[id].push(test.getAttribute('data-date'))
                        chageCheck=true;
                    }
                    else if(rangeDateObj[id].length===1)
                    {
                        var dataDate = document.querySelectorAll('#'+id+' [data-date]')
                        rangeDateObj[id]=[]
                        for(var i = 0; i < dataDate.length; i++)
                        {
                            dataDate[i].classList.remove('entwizSoft-leftHover')
                            dataDate[i].classList.remove('entwizSoft-rightHover')
                            dataDate[i].classList.remove('entwizSoft-rangeHover')
                            dataDate[i].classList.remove('entwizSoft-active')
                            dataDate[i].classList.remove('entwizSoft-rangeActive')
                            dataDate[i].classList.remove('entwizSoft-leftActive')
                            dataDate[i].classList.remove('entwizSoft-rightActive')
                        }
                        checkedDate = e.currentTarget;
                        checkedDate.classList.add('entwizSoft-active');
                        rangeDateObj[id].push(test.getAttribute('data-date'))
                        chageCheck=true;
                    }
                }
                else if(option.singleDate && option.nDayCheck.check)
                {
                    var check = true;
                    checkedDate = e.currentTarget;
                    for(let i = 0; i < rangeDateObj[id].length; i++) {
                        if(rangeDateObj[id][i] === test.getAttribute('data-date'))
                        {
                            if($(this).parent().parent().parent().parent().parent().attr('id') == 'datepicker') {
                                rangeDateObj[id].splice(i, 1);
                                i--;
                                check = false;
                                checkedDate.classList.remove('entwizSoft-active2');
                                checkedDate.classList.remove('entwizSoft-active3');
                            } else {
                                rangeDateObj[id].splice(i, 1);
                                i--;
                                check = false;
                                checkedDate.classList.remove('entwizSoft-active');
                            }
                        }
                    }
                    if(check)
                    {
                        if($(this).parent().parent().parent().parent().parent().attr('id') == 'datepicker') {
                            $('.entwizSoft-calendarContents > tr').find('td').each(function() {
                                for(var i = 0; i < rangeDateObj[id].length; i++) {
                                    if(rangeDateObj[id][i] == $(this).data('date')) {
                                        $(this).removeClass('entwizSoft-active2');
                                        $(this).addClass('entwizSoft-active3');
                                    }
                                }
                            });
                            rangeDateObj[id].push(test.getAttribute('data-date'))
                            rangeDateObj[id] = rangeDateObj[id].sort()
                            checkedDate.classList.add('entwizSoft-active2');
                        } else {
                            rangeDateObj[id].push(test.getAttribute('data-date'))
                            rangeDateObj[id] = rangeDateObj[id].sort()
                            checkedDate.classList.add('entwizSoft-active');
                        }
                    }
                    lastCheckDate = test.getAttribute('data-date')
                    chageCheck=true;
                }
                else if(option.singleDate === false && option.todayStart===true)
                {
                    if(rangeDateObj[id].length===1)
                    {
                        checkedDate = e.currentTarget;
                        checkedDate.classList.add('entwizSoft-active');
                        rangeDateObj[id].push(test.getAttribute('data-date'))
                        rangeDateObj[id] = rangeDateObj[id].sort()
                        chageCheck=true;
                    }
                    else if(rangeDateObj[id].length===2)
                    {
                        var dataDate = document.querySelectorAll('[data-date]')
                        rangeDateObj[id].length = 1;
                        for(var i = 0; i < dataDate.length; i++)
                        {
                            dataDate[i].classList.remove('entwizSoft-leftHover')
                            dataDate[i].classList.remove('entwizSoft-rightHover')
                            dataDate[i].classList.remove('entwizSoft-rangeHover')
                            dataDate[i].classList.remove('entwizSoft-active')
                            dataDate[i].classList.remove('entwizSoft-rangeActive')
                            dataDate[i].classList.remove('entwizSoft-leftActive')
                            dataDate[i].classList.remove('entwizSoft-rightActive')
                        }
                        if(document.querySelector('#'+id+' [data-date="'+new Date().getFullYear() + '' + toDayMonth + '' + toDayDate+'"]'))
                        {
                            document.querySelector('#'+id+' [data-date="'+new Date().getFullYear() + '' + toDayMonth + '' + toDayDate+'"]').classList.add('entwizSoft-active')
                        }
                    }
                }
                else if(option.singleDate === false && option.todayStart===false)
                {
                    if(rangeDateObj[id].length === 0)
                    {
                        checkedDate = e.currentTarget;
                        checkedDate.classList.add('entwizSoft-active');
                        rangeDateObj[id].push(checkedDate.getAttribute('data-date'))
                        chageCheck=true;
                    }
                    else if(rangeDateObj[id].length === 1)
                    {
                        rangeDateObj[id].push(test.getAttribute('data-date'))
                        rangeDateObj[id] = rangeDateObj[id].sort()
                        chageCheck=true;
                    }
                    else if(rangeDateObj[id].length === 2)
                    {
                        var dataDate = document.querySelectorAll('#'+ id +' [data-date]')
                        rangeDateObj[id] = [];
                        chageCheck=true;
                        for(var i = 0; i < dataDate.length; i++)
                        {
                            dataDate[i].classList.remove('entwizSoft-leftHover')
                            dataDate[i].classList.remove('entwizSoft-rightHover')
                            dataDate[i].classList.remove('entwizSoft-rangeHover')
                            dataDate[i].classList.remove('entwizSoft-active')
                            dataDate[i].classList.remove('entwizSoft-rangeActive')
                            dataDate[i].classList.remove('entwizSoft-leftActive')
                            dataDate[i].classList.remove('entwizSoft-rightActive')
                        }
                    }
                }
            }
            
        },
        on:function(test,func)
        {
            var data = {}
            if(test==='change')
            {
                setInterval(function()
                {
                    if(chageCheck)
                    {
                        func(rangeDateObj,lastCheckDate)
                        chageCheck = false;
                    }
                },100)                
            }
        },
    }
})()