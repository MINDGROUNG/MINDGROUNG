// 영문
var departmentList = [
  { 
    department: "Clinical Science", 
    disabled: "disabled", 
    class: "disabled"
  },
  { 
    department: "Internal Medicine",
    disabled: "", 
    class: ""
  },
  { 
    department: "Surgery",
    disabled: "", 
    class: ""
  },
  { 
    department: "Anesthesiology and Pain Medicine",
    disabled: "", 
    class: ""
  },
  { 
    department: "Dermatology",
    disabled: "", 
    class: ""
  },
  { 
    department: "Emergency Medicine",
    disabled: "", 
    class: ""
  },
  { 
    department: "Family Medicine ",
    disabled: "", 
    class: ""
  },
  { 
    department: "Laboratory Medicine",
    disabled: "", 
    class: ""
  },
  { 
    department: "Neurology",
    disabled: "", 
    class: ""
  },
  { 
    department: "Neuropsychiatry",
    disabled: "", 
    class: ""
  },
  { 
    department: "Neurosurgery",
    disabled: "", 
    class: ""
  },
  { 
    department: "Nuclear Medicine",
    disabled: "", 
    class: ""
  },
  { 
    department: "Obstetrics and Gynecology",
    disabled: "", 
    class: ""
  },
  { 
    department: "Ophthalmology",
    disabled: "", 
    class: ""
  },
  { 
    department: "Orthopedic Surgery",
    disabled: "", 
    class: ""
  },
  { 
    department: "Otorhinolaryngology",
    disabled: "", 
    class: ""
  },
  { 
    department: "Pediatric Hemato-Oncology",
    disabled: "", 
    class: ""
  },
  { 
    department: "Plastic and Reconstructive Surgery",
    disabled: "", 
    class: ""
  },
  { 
    department: "Radiation Oncology",
    disabled: "", 
    class: ""
  },
  { 
    department: "Radiology",
    disabled: "", 
    class: ""
  },
  { 
    department: "Rehabilitation Medicine",
    disabled: "", 
    class: ""
  },
  { 
    department: "Thoracic and Cardiovascular Surgery",
    disabled: "", 
    class: ""
  },
  { 
    department: "Urology",
    disabled: "", 
    class: ""
  },
  { 
    department: "Basic Medical Science", 
    disabled: "disabled",
    class: "disabled"
  },
  { 
    department: "Anatomy",
    disabled: "", 
    class: ""
  },
  { 
    department: "Biochemistry",
    disabled: "", 
    class: ""
  },
  { 
    department: "Biological Sciences",
    disabled: "", 
    class: ""
  },
  { 
    department: "Genetics",
    disabled: "", 
    class: ""
  },
  { 
    department: "Immunology",
    disabled: "", 
    class: ""
  },
  { 
    department: "Microbiology",
    disabled: "", 
    class: ""
  },
  { 
    department: "Molecular Biology",
    disabled: "", 
    class: ""
  },
  { 
    department: "Pathology",
    disabled: "", 
    class: ""
  },
  { 
    department: "Pharmacology",
    disabled: "", 
    class: ""
  },
  { 
    department: "Pharmacy",
    disabled: "", 
    class: ""
  },
  { 
    department: "Physiology",
    disabled: "", 
    class: ""
  },
  { 
    department: "Preventive Medicine",
    disabled: "", 
    class: ""
  },
  { 
    department: "Miscellaneous", 
    disabled: "disabled",
    class: "disabled"
  },
  { 
    department: "Dentistry",
    disabled: "", 
    class: ""
  },
  { 
    department: "Nursing",
    disabled: "", 
    class: ""
  },
  { 
    department: "Nutrition",
    disabled: "", 
    class: ""
  },
  { 
    department: "Public Health",
    disabled: "", 
    class: ""
  },
  { 
    department: "Statistics",
    disabled: "", 
    class: ""
  },
  { 
    department: "Others",
    disabled: "",
    class: "readOnly"
  }
];

var InternalSpecialty = [
  {
    specialty: "Hematology/Medical Oncology"
  },
  {
    specialty: "Gastroenterology"
  },
  {
    specialty: "Pulmonary and Critical Care Medicine"
  },
  {
    specialty: "Others"
  },
];

var surgerySpecialty = [
  {
    specialty: "Breast and Endocrine Surgery"
  },
  {
    specialty: "Colorectal Surgery"
  },
  {
    specialty: "Gastrointestinal Surgery"
  },
  {
    specialty: "Hepatobiliary and Pancreatic Surgery"
  },
  {
    specialty: "Others"
  }
];

//국문
var departmentListKo = [
{ 
  departmentListKo: "임상의학",
  disabled: "disabled", 
  class: "disabled"
},
{ 
  departmentListKo: "내과",
  disabled: "", 
  class: ""
},
{ 
  departmentListKo: "외과",
  disabled: "", 
  class: ""
},
{ 
  departmentListKo: "마취통증의학과",
  disabled: "", 
  class: ""
},
{ 
  departmentListKo: "피부과",
  disabled: "", 
  class: ""
},
{ 
  departmentListKo: "응급의학과",
  disabled: "", 
  class: ""
},
{ 
  departmentListKo: "가정의학과",
  disabled: "", 
  class: ""
},
{ 
  departmentListKo: "진단검사의학과",
  disabled: "", 
  class: ""
},
{ 
  departmentListKo: "신경과",
  disabled: "", 
  class: ""
},
{ 
  departmentListKo: "정신건강의학과",
  disabled: "", 
  class: ""
},
{ 
  departmentListKo: "신경외과",
  disabled: "", 
  class: ""
},
{ 
  departmentListKo: "핵의학과",
  disabled: "", 
  class: ""
},
{ 
  departmentListKo: "산부인과",
  disabled: "", 
  class: ""
},
{ 
  departmentListKo: "안과",
  disabled: "", 
  class: ""
},
{ 
  departmentListKo: "정형외과",
  disabled: "", 
  class: ""
},
{ 
  departmentListKo: "이비인후과",
  disabled: "", 
  class: ""
},
{ 
  departmentListKo: "소아청소년과",
  disabled: "", 
  class: ""
},
{ 
  departmentListKo: "성형외과",
  disabled: "", 
  class: ""
},
{ 
  departmentListKo: "방사선종양학과",
  disabled: "", 
  class: ""
},
{ 
  departmentListKo: "영상의학과",
  disabled: "", 
  class: ""
},
{ 
  departmentListKo: "재활의학과",
  disabled: "", 
  class: ""
},
{ 
  departmentListKo: "흉부외과",
  disabled: "", 
  class: ""
},
{ 
  departmentListKo: "비뇨기과",
  disabled: "", 
  class: ""
},
{ 
  departmentListKo: "기초의약학",
  disabled: "disabled", 
  class: "disabled"
},
{ 
  departmentListKo: "해부학",
  disabled: "", 
  class: ""
},
{ 
  departmentListKo: "생화학",
  disabled: "", 
  class: ""
},
{ 
  departmentListKo: "생명과학",
  disabled: "", 
  class: ""
},
{ 
  departmentListKo: "유전학",
  disabled: "", 
  class: ""
},
{ 
  departmentListKo: "면역학",
  disabled: "", 
  class: ""
},
{ 
  departmentListKo: "미생물학",
  disabled: "", 
  class: ""
},
{ 
  departmentListKo: "분자생물학",
  disabled: "", 
  class: ""
},
{ 
  departmentListKo: "병리학",
  disabled: "", 
  class: ""
},
{ 
  departmentListKo: "약리학",
  disabled: "", 
  class: ""
},
{ 
  departmentListKo: "약학",
  disabled: "", 
  class: ""
},
{ 
  departmentListKo: "생리학",
  disabled: "", 
  class: ""
},
{ 
  departmentListKo: "예방의학",
  disabled: "", 
  class: ""
},
{ 
  departmentListKo: "기타전공분야",
  disabled: "disabled", 
  class: "disabled"
},
{ 
  departmentListKo: "치의학",
  disabled: "", 
  class: ""
},
{ 
  departmentListKo: "간호학",
  disabled: "", 
  class: ""
},
{ 
  departmentListKo: "영양학",
  disabled: "", 
  class: ""
},
{ 
  departmentListKo: "보건학",
  disabled: "", 
  class: ""
},
{ 
  departmentListKo: "통계학",
  disabled: "", 
  class: ""
},
{ 
  departmentListKo: "직접입력",
  disabled: "", 
  class: "readOnly"
}
];

var InternalSpecialtyKo = [
  { 
    specialtyKo: "혈액종양내과"
  },
  { 
    specialtyKo: "소화기내과"
  },
  { 
    specialtyKo: "호흡기내과 "
  },
  { 
    specialtyKo: "해당없음"
  },
  { 
    specialtyKo: "직접입력"
  }
];

var surgerySpecialtyKo = [
  {
    specialtyKo: "유방내분비외과"
  },
  {
    specialtyKo: "대장항문외과"
  },
  {
    specialtyKo: "위장관외과"
  },
  {
    specialtyKo: "간담췌외과"
  },
  {
    specialtyKo: "해당없음"
  },
  {
    specialtyKo: "직접입력"
  }
];  