var params = new URL(location.href);
var lang = params.searchParams.get("clang");

var formatSelectBox = [
    'Retreat',
    'Meeting',
    'Workshop',
    'Certificate Course',
    'Public Talk',
    'Class',
    '1:1',
    'Other'
];

var level = [
    'All',
    'Beginner',
    'Intermediate',
    'Advanced'
];

var formatSelectBoxKor = [
    '리트릿',
    '미팅',
    '워크샵',
    '수료증 코스',
    '대중 강연 & 토크',
    '클래스',
    '1:1',
    '기타'
];

var levelKor = [
    '전체',
    '초급',
    '중급',
    '고급'
];



// 영어 부분에서도 한글로 나옴
var category = [
    'Mindfulness',
    'Meditation',
    'Yoga',
    'Somatic',
    'Movement & Activity',
    'Counseling & Coaching',
    'Others'
];

var categoryKor = [
    '마인드풀니스',
    '명상',
    '요가',
    '소매틱',
    '액티비티',
    '상담 & 코칭',
    '기타'
];

var categoryMindFulness = [
    'Mindfulness-Based Childbirth and Parenting (MBCP)',
    'Mindfulness-Based Compassionate Living (MBCL)',
    'Mindfulness-Based Living Course (MBLC)',
    'Mindfulness-Based Cognitive Therapy (MBCT)',
    'Mindfulness-Based Stress Reduction (MBSR)',
    'Mindful Self Compassion (MSC)',
    'Search Inside Yourself (SIY)',
    'Mindfulness in Schools Programme (MiSP)',
    'Mindfulness-Based Relapse Prevention (MBRP)',
    'Breathworks',
    'Acceptance Commitment Therapy (ACT)',
    'Cognitively-based Compassion Training(CBCT)',
    'Compassion Cultivation Training (CCT)',
    'ReSource Project',
    'Compassion Focused Therapy (CFT)',
    'Others'
];

var categoryMeditation = [
    'Breathing Meditations',
    'Mindfulness Meditations',
    'Focus Meditations',
    'Movement Meditation',
    'Walking Meditations',
    'Mantra Meditations',
    'Open Awareness meditation',
    'Buddhist Meditations',
    'Loving-kindness meditation',
    'Zen meditation',
    'Self-Enquiry Meditation',
    'Vipassana Meditation',
    'Christian Meditation',
    'Spiritual Meditations',
    'Transcendental Meditations',
    'Progressive Relaxation Meditations',
    'Qigong (Chi kung)',
    'Tai chi',
    'Taoist Meditations',
    'Others'
];

var categoryYoga = [
    'Vinyasa yoga',
    'Hatha yoga',
    'Iyengar yoga',
    'Kundalini yoga',
    'Ashtanga yoga',
    'Bikram yoga',
    'Yin yoga',
    'Restorative yoga',
    'Prenatal yoga',
    'Anusara yoga',
    'Jivamukti yoga',
    'Acro yoga',
    'Others'
];

var categorySomatics = [
    'Alexander Technique',
    'Body-Mind Centering',
    'Bodywork and Somatic Education (BASE)',
    'Functional Integration (Feldenkrais Method)',
    'Neurokinetic Therapy',
    'Rolfing Structural Integration',
    'Rosen Method Bodywork',
    'Trager Approach',
    'Contact Improvisation',
    'Continuum Movement',
    'Hanna Somatics',
    'Skinner Releasing Technique',
    'Somatic Expression',
    'Others'
];




//포맷 두번째단계 옵션넣기
for(var i = 0; i < formatSelectBox.length; i++)
{
    if(lang === 'en')
    {
        var inner = formatSelectBox[i];
    }
    else
    {
        var inner = formatSelectBoxKor[i];
    }   

    var formatOption = '<li>'+
                            '<input type="radio" value="'+formatSelectBox[i]+'" id="'+formatSelectBox[i]+'" name="formatSelect2">' +
                            '<label for="'+formatSelectBox[i]+'">' +
                            '    <span id="'+formatSelectBox[i]+'inner">'+inner+'</span>' +
                            '</label>' +
                        '</li>'
                        ;

    $('.formatSelectBox2').append(formatOption);
}

//카테고리 첫단계 옵션넣기
for(var i = 0; i < category.length; i++)
{
    if(lang === 'en')
    {
        var inner = category[i];
    }
    else
    {
        var inner = categoryKor[i];
    }

    var categoryOption = '<li>'+
                            '<input type="radio" value="'+category[i]+'" id="'+category[i]+'" name="categotyOption">' +
                            '<label for="'+category[i]+'">' +
                            '    <span id="'+category[i]+'inner">'+inner+'</span>' +
                            '</label>' +
                        '</li>'
                        ;

    $('.categorySelectBox1').append(categoryOption);
}

//레벨 옵션넣기
for(var i = 0; i < level.length; i++)
{
    if(lang === 'en')
    {
        var inner = level[i];
    } 
    else
    {
        var inner = levelKor[i];
    }

    var levelOption = '<li>' +
                        '<input type="radio" value="'+level[i]+'" id="'+level[i]+'2" name="levelOption">' +
                        '<label for="'+level[i]+'2">' +
                            '<span id="'+level[i]+'inner">'+inner+'</span>' +
                        '</label>' +
                    '</li>'
                    ;
    
    $('.levelSelectBox1').append(levelOption);
}