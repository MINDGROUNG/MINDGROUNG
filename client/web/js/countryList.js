//countryList, countryListKo 두개로 나뉘어져 있음
var countryList = [
  { num: "93", country: "Afghanistan" },

  { num: "355", country: "Albania" },

  { num: "213", country: "Algeria" },

  { num: "1684", country: "American Samoa" },

  { num: "376", country: "Andorra" },

  { num: "244", country: "Angola" },

  { num: "1264", country: "Anguilla" },

  { num: "672", country: "Antarctica" },

  { num: "1268", country: "Antigua & Barbuda" },

  { num: "54", country: "Argentina" },

  { num: "374", country: "Armenia" },

  { num: "297", country: "Aruba" },

  { num: "61", country: "Australia" },

  { num: "43", country: "Austria" },

  { num: "994", country: "Azerbaijan" },

  { num: "1242", country: "Bahamas" },

  { num: "973", country: "Bahrain" },

  { num: "880", country: "Bangladesh" },

  { num: "1246", country: "Barbados" },

  { num: "375", country: "Belarus" },

  { num: "32", country: "Belgium" },

  { num: "501", country: "Belize" },

  { num: "229", country: "Benin" },

  { num: "1441", country: "Bermuda" },

  { num: "975", country: "Bhutan" },

  { num: "591", country: "Bolivia" },

  { num: "387", country: "Bosnia Herzegovina" },

  { num: "267", country: "Botswana" },

  { num: "55", country: "Brazil" },

  { num: "673", country: "Brunei" },

  { num: "359", country: "Bulgaria" },

  { num: "226", country: "Burkina Faso" },

  { num: "257", country: "Burundi" },

  { num: "855", country: "Cambodia" },

  { num: "237", country: "Cameroon" },

  { num: "1", country: "Canada" },

  { num: "238", country: "Cape Verde Islands" },

  { num: "1345", country: "Cayman Islands" },

  { num: "236", country: "Central African Republic" },

  { num: "56", country: "Chile" },

  { num: "86", country: "China" },
  
  { num: "57", country: "Colombia" },

  { num: "269", country: "Comoros" },

  { num: "243", country: "Congo Democratic Republic" },

  { num: "242", country: "Congo Republic" },

  { num: "682", country: "Cook Islands" },

  { num: "506", country: "Costa Rica" },

  { num: "225", country: "Cote D'Ivoire" },

  { num: "385", country: "Croatia" },

  { num: "53", country: "Cuba" },

  { num: "357", country: "Cyprus South" },

  { num: "420", country: "Czech Republic" },

  { num: "45", country: "Denmark" },

  { num: "253", country: "Djibouti" },

  { num: "1767", country: "Dominica" },

  { num: "1829", country: "Dominican Republic" },

  { num: "670", country: "East Timor" },

  { num: "593", country: "Ecuador" },

  { num: "20", country: "Egypt" },

  { num: "503", country: "El Salvador" },

  { num: "240", country: "Equatorial Guinea" },

  { num: "291", country: "Eritrea" },

  { num: "372", country: "Estonia" },

  { num: "251", country: "Ethiopia" },

  { num: "500", country: "Falkland Islands" },

  { num: "298", country: "Faroe Islands" },

  { num: "679", country: "Fiji" },

  { num: "358", country: "Finland" },

  { num: "33", country: "France" },

  { num: "594", country: "French Guiana" },

  { num: "689", country: "French Polynesia" },

  { num: "241", country: "Gabon" },

  { num: "220", country: "Gambia" },

  { num: "995", country: "Georgia" },

  { num: "49", country: "Germany" },

  { num: "233", country: "Ghana" },

  { num: "350", country: "Gibraltar" },

  { num: "30", country: "Greece" },

  { num: "299", country: "Greenland" },

  { num: "1473", country: "Grenada" },

  { num: "590", country: "Guadeloupe" },

  { num: "1671", country: "Guam" },

  { num: "502", country: "Guatemala" },

  { num: "224", country: "Guinea" },

  { num: "245", country: "Guinea - Bissau" },

  { num: "592", country: "Guyana" },

  { num: "509", country: "Haiti" },

  { num: "504", country: "Honduras" },

  { num: "852", country: "Hong Kong" },

  { num: "36", country: "Hungary" },

  { num: "354", country: "Iceland" },

  { num: "91", country: "India" },

  { num: "62", country: "Indonesia" },

  { num: "98", country: "Iran" },

  { num: "964", country: "Iraq" },

  { num: "353", country: "Ireland" },

  { num: "972", country: "Israel" },

  { num: "39", country: "Italy" },

  { num: "1876", country: "Jamaica" },

  { num: "81", country: "Japan" },

  { num: "962", country: "Jordan" },

  { num: "7", country: "Kazakhstan" },

  { num: "254", country: "Kenya" },

  { num: "686", country: "Kiribati" },

  { num: "850", country: "Korea North" },

  { num: "82", country: "Korea, Republic of" },

  { num: "965", country: "Kuwait" },

  { num: "996", country: "Kyrgyzstan" },

  { num: "856", country: "Laos" },

  { num: "371", country: "Latvia" },

  { num: "961", country: "Lebanon" },

  { num: "266", country: "Lesotho" },

  { num: "231", country: "Liberia" },

  { num: "218", country: "Libya" },

  { num: "423", country: "Liechtenstein" },

  { num: "370", country: "Lithuania" },

  { num: "352", country: "Luxembourg" },

  { num: "853", country: "Macao" },

  { num: "389", country: "Macedonia" },

  { num: "261", country: "Madagascar" },

  { num: "265", country: "Malawi" },

  { num: "60", country: "Malaysia" },

  { num: "960", country: "Maldives" },

  { num: "223", country: "Mali" },

  { num: "356", country: "Malta" },

  { num: "692", country: "Marshall Islands" },

  { num: "596", country: "Martinique" },

  { num: "222", country: "Mauritania" },

  { num: "230", country: "Mauritius" },

  { num: "269", country: "Mayotte" },

  { num: "52", country: "Mexico" },

  { num: "691", country: "Micronesia" },

  { num: "373", country: "Moldova" },

  { num: "377", country: "Monaco" },

  { num: "976", country: "Mongolia" },

  { num: "1664", country: "Montserrat" },

  { num: "212", country: "Morocco" },

  { num: "258", country: "Mozambique" },

  { num: "95", country: "Myanmar" },

  { num: "264", country: "Namibia" },

  { num: "674", country: "Nauru" },

  { num: "977", country: "Nepal" },

  { num: "31", country: "Netherlands" },

  { num: "599", country: "Netherlands Antilles" },

  { num: "687", country: "New Caledonia" },

  { num: "64", country: "New Zealand" },

  { num: "505", country: "Nicaragua" },

  { num: "227", country: "Niger" },

  { num: "234", country: "Nigeria" },

  { num: "683", country: "Niue" },

  { num: "672", country: "Norfolk Islands" },

  { num: "1670", country: "Northern Marianas" },

  { num: "47", country: "Norway" },

  { num: "968", country: "Oman" },

  { num: "92", country: "Pakistan" },

  { num: "680", country: "Palau" },

  { num: "970", country: "Palestinian State" },

  { num: "507", country: "Panama" },

  { num: "675", country: "Papua New Guinea" },

  { num: "595", country: "Paraguay" },

  { num: "51", country: "Peru" },

  { num: "63", country: "Philippines" },

  { num: "48", country: "Poland" },

  { num: "351", country: "Portugal" },

  { num: "1787", country: "Puerto Rico" },

  { num: "974", country: "Qatar" },

  { num: "262", country: "Reunion" },

  { num: "40", country: "Romania" },

  { num: "7", country: "Russia" },

  { num: "250", country: "Rwanda" },

  { num: "685", country: "Samoa" },

  { num: "378", country: "San Marino" },

  { num: "239", country: "Sao Tome & Principe" },

  { num: "966", country: "Saudi Arabia" },

  { num: "221", country: "Senegal" },

  { num: "381", country: "Serbia" },

  { num: "248", country: "Seychelles" },

  { num: "232", country: "Sierra Leone" },

  { num: "65", country: "Singapore" },

  { num: "421", country: "Slovak Republic" },

  { num: "386", country: "Slovenia" },

  { num: "677", country: "Solomon Islands" },

  { num: "252", country: "Somalia" },

  { num: "27", country: "South Africa" },

  { num: "34", country: "Spain" },

  { num: "94", country: "Sri Lanka" },

  { num: "290", country: "St. Helena" },

  { num: "1869", country: "St. Kitts" },

  { num: "1758", country: "St. Lucia" },

  { num: "508", country: "St. Pierre and Miquelon" },

  { num: "1784", country: "St. Vincent and the Grenadines" },

  { num: "249", country: "Sudan" },

  { num: "597", country: "Suriname" },

  { num: "268", country: "Swaziland" },

  { num: "46", country: "Sweden" },

  { num: "41", country: "Switzerland" },

  { num: "963", country: "Syria" },

  { num: "886", country: "Taiwan" },

  { num: "992", country: "Tajikstan" },

  { num: "255", country: "Tanzania" },

  { num: "66", country: "Thailand" },

  { num: "228", country: "Togo" },

  { num: "690", country: "Tokelau" },

  { num: "676", country: "Tonga" },

  { num: "1868", country: "Trinidad & Tobago" },

  { num: "216", country: "Tunisia" },

  { num: "90", country: "Turkey" },

  { num: "993", country: "Turkmenistan" },

  { num: "1649", country: "Turks & Caicos Islands" },

  { num: "688", country: "Tuvalu" },

  { num: "256", country: "Uganda" },

  { num: "380", country: "Ukraine" },

  { num: "44", country: "UK" },

  { num: "971", country: "United Arab Emirates" },

  { num: "598", country: "Uruguay" },
  
  { num: "1", country: "USA" },

  { num: "998", country: "Uzbekistan" },

  { num: "678", country: "Vanuatu" },

  { num: "418", country: "Vatican City" },

  { num: "58", country: "Venezuela" },

  { num: "84", country: "Vietnam" },

  { num: "1284", country: "Virgin Islands - British" },

  { num: "1340", country: "Virgin Islands - US" },

  { num: "681", country: "Wallis & Futuna" },

  { num: "969", country: "Yemen" },

  { num: "967", country: "Yemen (South)" },

  { num: "260", country: "Zambia" },

  { num: "263", country: "Zimbabwe" },
];


var countryListKo = [
  { num: "82", country: "Korea, Republic of" },

  { num: "93", country: "Afghanistan" },

  { num: "355", country: "Albania" },

  { num: "213", country: "Algeria" },

  { num: "1684", country: "American Samoa" },

  { num: "376", country: "Andorra" },

  { num: "244", country: "Angola" },

  { num: "1264", country: "Anguilla" },

  { num: "672", country: "Antarctica" },

  { num: "1268", country: "Antigua & Barbuda" },

  { num: "54", country: "Argentina" },

  { num: "374", country: "Armenia" },

  { num: "297", country: "Aruba" },

  { num: "61", country: "Australia" },

  { num: "43", country: "Austria" },

  { num: "994", country: "Azerbaijan" },

  { num: "1242", country: "Bahamas" },

  { num: "973", country: "Bahrain" },

  { num: "880", country: "Bangladesh" },

  { num: "1246", country: "Barbados" },

  { num: "375", country: "Belarus" },

  { num: "32", country: "Belgium" },

  { num: "501", country: "Belize" },

  { num: "229", country: "Benin" },

  { num: "1441", country: "Bermuda" },

  { num: "975", country: "Bhutan" },

  { num: "591", country: "Bolivia" },

  { num: "387", country: "Bosnia Herzegovina" },

  { num: "267", country: "Botswana" },

  { num: "55", country: "Brazil" },

  { num: "673", country: "Brunei" },

  { num: "359", country: "Bulgaria" },

  { num: "226", country: "Burkina Faso" },

  { num: "257", country: "Burundi" },

  { num: "855", country: "Cambodia" },

  { num: "237", country: "Cameroon" },

  { num: "1", country: "Canada" },

  { num: "238", country: "Cape Verde Islands" },

  { num: "1345", country: "Cayman Islands" },

  { num: "236", country: "Central African Republic" },

  { num: "56", country: "Chile" },

  { num: "86", country: "China" },
  
  { num: "57", country: "Colombia" },

  { num: "269", country: "Comoros" },

  { num: "243", country: "Congo Democratic Republic" },

  { num: "242", country: "Congo Republic" },

  { num: "682", country: "Cook Islands" },

  { num: "506", country: "Costa Rica" },

  { num: "225", country: "Cote D'Ivoire" },

  { num: "385", country: "Croatia" },

  { num: "53", country: "Cuba" },

  { num: "357", country: "Cyprus South" },

  { num: "420", country: "Czech Republic" },

  { num: "45", country: "Denmark" },

  { num: "253", country: "Djibouti" },

  { num: "1767", country: "Dominica" },

  { num: "1829", country: "Dominican Republic" },

  { num: "670", country: "East Timor" },

  { num: "593", country: "Ecuador" },

  { num: "20", country: "Egypt" },

  { num: "503", country: "El Salvador" },

  { num: "240", country: "Equatorial Guinea" },

  { num: "291", country: "Eritrea" },

  { num: "372", country: "Estonia" },

  { num: "251", country: "Ethiopia" },

  { num: "500", country: "Falkland Islands" },

  { num: "298", country: "Faroe Islands" },

  { num: "679", country: "Fiji" },

  { num: "358", country: "Finland" },

  { num: "33", country: "France" },

  { num: "594", country: "French Guiana" },

  { num: "689", country: "French Polynesia" },

  { num: "241", country: "Gabon" },

  { num: "220", country: "Gambia" },

  { num: "995", country: "Georgia" },

  { num: "49", country: "Germany" },

  { num: "233", country: "Ghana" },

  { num: "350", country: "Gibraltar" },

  { num: "30", country: "Greece" },

  { num: "299", country: "Greenland" },

  { num: "1473", country: "Grenada" },

  { num: "590", country: "Guadeloupe" },

  { num: "1671", country: "Guam" },

  { num: "502", country: "Guatemala" },

  { num: "224", country: "Guinea" },

  { num: "245", country: "Guinea - Bissau" },

  { num: "592", country: "Guyana" },

  { num: "509", country: "Haiti" },

  { num: "504", country: "Honduras" },

  { num: "852", country: "Hong Kong" },

  { num: "36", country: "Hungary" },

  { num: "354", country: "Iceland" },

  { num: "91", country: "India" },

  { num: "62", country: "Indonesia" },

  { num: "98", country: "Iran" },

  { num: "964", country: "Iraq" },

  { num: "353", country: "Ireland" },

  { num: "972", country: "Israel" },

  { num: "39", country: "Italy" },

  { num: "1876", country: "Jamaica" },

  { num: "81", country: "Japan" },

  { num: "962", country: "Jordan" },

  { num: "7", country: "Kazakhstan" },

  { num: "254", country: "Kenya" },

  { num: "686", country: "Kiribati" },

  { num: "850", country: "Korea North" },

  { num: "965", country: "Kuwait" },

  { num: "996", country: "Kyrgyzstan" },

  { num: "856", country: "Laos" },

  { num: "371", country: "Latvia" },

  { num: "961", country: "Lebanon" },

  { num: "266", country: "Lesotho" },

  { num: "231", country: "Liberia" },

  { num: "218", country: "Libya" },

  { num: "423", country: "Liechtenstein" },

  { num: "370", country: "Lithuania" },

  { num: "352", country: "Luxembourg" },

  { num: "853", country: "Macao" },

  { num: "389", country: "Macedonia" },

  { num: "261", country: "Madagascar" },

  { num: "265", country: "Malawi" },

  { num: "60", country: "Malaysia" },

  { num: "960", country: "Maldives" },

  { num: "223", country: "Mali" },

  { num: "356", country: "Malta" },

  { num: "692", country: "Marshall Islands" },

  { num: "596", country: "Martinique" },

  { num: "222", country: "Mauritania" },

  { num: "230", country: "Mauritius" },

  { num: "269", country: "Mayotte" },

  { num: "52", country: "Mexico" },

  { num: "691", country: "Micronesia" },

  { num: "373", country: "Moldova" },

  { num: "377", country: "Monaco" },

  { num: "976", country: "Mongolia" },

  { num: "1664", country: "Montserrat" },

  { num: "212", country: "Morocco" },

  { num: "258", country: "Mozambique" },

  { num: "95", country: "Myanmar" },

  { num: "264", country: "Namibia" },

  { num: "674", country: "Nauru" },

  { num: "977", country: "Nepal" },

  { num: "31", country: "Netherlands" },

  { num: "599", country: "Netherlands Antilles" },

  { num: "687", country: "New Caledonia" },

  { num: "64", country: "New Zealand" },

  { num: "505", country: "Nicaragua" },

  { num: "227", country: "Niger" },

  { num: "234", country: "Nigeria" },

  { num: "683", country: "Niue" },

  { num: "672", country: "Norfolk Islands" },

  { num: "1670", country: "Northern Marianas" },

  { num: "47", country: "Norway" },

  { num: "968", country: "Oman" },

  { num: "92", country: "Pakistan" },

  { num: "680", country: "Palau" },

  { num: "970", country: "Palestinian State" },

  { num: "507", country: "Panama" },

  { num: "675", country: "Papua New Guinea" },

  { num: "595", country: "Paraguay" },

  { num: "51", country: "Peru" },

  { num: "63", country: "Philippines" },

  { num: "48", country: "Poland" },

  { num: "351", country: "Portugal" },

  { num: "1787", country: "Puerto Rico" },

  { num: "974", country: "Qatar" },

  { num: "262", country: "Reunion" },

  { num: "40", country: "Romania" },

  { num: "7", country: "Russia" },

  { num: "250", country: "Rwanda" },

  { num: "685", country: "Samoa" },

  { num: "378", country: "San Marino" },

  { num: "239", country: "Sao Tome & Principe" },

  { num: "966", country: "Saudi Arabia" },

  { num: "221", country: "Senegal" },

  { num: "381", country: "Serbia" },

  { num: "248", country: "Seychelles" },

  { num: "232", country: "Sierra Leone" },

  { num: "65", country: "Singapore" },

  { num: "421", country: "Slovak Republic" },

  { num: "386", country: "Slovenia" },

  { num: "677", country: "Solomon Islands" },

  { num: "252", country: "Somalia" },

  { num: "27", country: "South Africa" },

  { num: "34", country: "Spain" },

  { num: "94", country: "Sri Lanka" },

  { num: "290", country: "St. Helena" },

  { num: "1869", country: "St. Kitts" },

  { num: "1758", country: "St. Lucia" },

  { num: "508", country: "St. Pierre and Miquelon" },

  { num: "1784", country: "St. Vincent and the Grenadines" },

  { num: "249", country: "Sudan" },

  { num: "597", country: "Suriname" },

  { num: "268", country: "Swaziland" },

  { num: "46", country: "Sweden" },

  { num: "41", country: "Switzerland" },

  { num: "963", country: "Syria" },

  { num: "886", country: "Taiwan" },

  { num: "992", country: "Tajikstan" },

  { num: "255", country: "Tanzania" },

  { num: "66", country: "Thailand" },

  { num: "228", country: "Togo" },

  { num: "690", country: "Tokelau" },

  { num: "676", country: "Tonga" },

  { num: "1868", country: "Trinidad & Tobago" },

  { num: "216", country: "Tunisia" },

  { num: "90", country: "Turkey" },

  { num: "993", country: "Turkmenistan" },

  { num: "1649", country: "Turks & Caicos Islands" },

  { num: "688", country: "Tuvalu" },

  { num: "256", country: "Uganda" },

  { num: "380", country: "Ukraine" },

  { num: "44", country: "UK" },

  { num: "971", country: "United Arab Emirates" },

  { num: "598", country: "Uruguay" },
  
  { num: "1", country: "USA" },

  { num: "998", country: "Uzbekistan" },

  { num: "678", country: "Vanuatu" },

  { num: "418", country: "Vatican City" },

  { num: "58", country: "Venezuela" },

  { num: "84", country: "Vietnam" },

  { num: "1284", country: "Virgin Islands - British" },

  { num: "1340", country: "Virgin Islands - US" },

  { num: "681", country: "Wallis & Futuna" },

  { num: "969", country: "Yemen" },

  { num: "967", country: "Yemen (South)" },

  { num: "260", country: "Zambia" },

  { num: "263", country: "Zimbabwe" },
];