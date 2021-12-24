var params = new URL(location.href);
var lang = params.searchParams.get("clang");

var keywordsList = [
    {
        title: 'lifestyle',
        keywords: [
            'Sleep',
            'Focus',
            'Study',
            'Relaxation',
            'Family',
            'Love',
            'Relationship',
            'Stress',
            'Balance',
            'Leisure',
            'Hobby',
            'Self-improvement',
            'Positivity',
            'Happiness',
            'Self-esteem',
            'Couple',
            'Children',
            'Parenting',
            'Peace',
            'Rest', 
            'Cooking',
            'Community', 
            'Habbit', 
            'Spirituality', 
            'Compassion'
        ]
    },
    {
        title: 'work',
        keywords: [
            'Leadership',
            'Work',
            'Career',
            'Productivity',
            'Business',
            'Motivation',
            'Communication',
            'Academic',
            'School',
            'Education',
        ]
    },
    // 중첩되는 항목 있음 Self-Care
    {
        title: 'health',
        keywords: [
            'Anxiety',
            'Depression',
            'Resilience',
            'Addiction',
            'Health',
            'Eating Disorder',
            'Panic Disorder',
            'Wellbeing',
            'Self-Care',
            'Healthcare',
            'Neuroscience',
            'Weight Loss',
            'Flexibility',
            'Strength',
            'Detox',
            'Trauma',
            'Anger',
            'Mental Health'
        ]
    }
]

var keywordsListKor = [
    {
        title: 'lifestyle',
        keywords: [
            '숙면, 잠',
            '집중력',
            '학습, 공부',
            '기분전환',
            '가족',
            '사랑',
            '관계',
            '스트레스',
            '균형',
            '여가',
            '취미',
            '자기개발',
            '긍정',
            '행복',
            '자존감',
            '연애',
            '어린이',
            '육아',
            '평안',
            '휴식', 
            '요리',
            '공동체', 
            '습관', 
            '영성', 
            '연민'
        ]
    },
    {
        title: 'work',
        keywords: [
            '리더십',
            '일, 업무',
            '직업, 취직',
            '생산성',
            '비즈니스',
            '동기부여',
            '소통',
            '학문, 학술',
            '학교',
            '교육',
        ]
    },
    // 중첩되는 항목 있음 Self-Care
    {
        title: 'health',
        keywords: [
            '긴장',
            '우울',
            '회복탄력성',
            '중독',
            '건강',
            '섭식장애',
            '공황장애',
            '웰빙',
            '셀프케어',
            '보건의료',
            '뇌과학',
            '체중 감량',
            '유연성',
            '근력 강화',
            '디톡스',
            '트라우마',
            '분노',
            '정신건강'
        ]
    }
]

//체크박스리스트
for(var i = 0; i < keywordsList.length; i++)
{
    if(lang === 'en')
    {
        var inner = keywordsList;
    }
    else
    {
        var inner = keywordsListKor;
    }

    for(var z = 0; z < keywordsList[i].keywords.length; z++)
    {
        var chkTag = '<div class="chkBox">' +
                        '<input type="checkbox" id="'+keywordsList[i].keywords[z]+'" data-keyword="'+keywordsList[i].keywords[z]+'" ' + 'value="' + keywordsList[i].keywords[z] + '"' + 'onclick="' + 'keywordsObjectPushFunc(this);"' + '>' +
                        '<label for="'+keywordsList[i].keywords[z]+'">' +
                            inner[i].keywords[z] +
                        '</label>' +
                    '</div>'
        if(keywordsList[i].title == 'lifestyle')
        {
            $('.lifestyle').append(chkTag);
        }
        else if(keywordsList[i].title == 'work')
        {
            $('.work').append(chkTag);
        }
        else if(keywordsList[i].title == 'health')
        {
            $('.health').append(chkTag);
        }
    }
}