var island = {
    "中西區": [],
    "灣仔區": [],
    "東區": [],
    "南區": [],
};

var kowloon = {
    "油尖旺區": [],
    "深水埗區": [],
    "九龍城區": [],
    "黃大仙區": [],
    "觀塘區": [],
};

var newTerritories = {
    "葵青區": [],
    "荃灣區": [],
    "屯門區": [],
    "元朗區": [],
    "北區": [],
    "大埔區": [],
    "沙田區": [],
    "西貢區": [],
    "離島區": [],
};

var schoolNet = {
    // island
    "中西區": {
        "11 (中環、上環、西營盤...)": [],
        "其他":[],
    },
    "灣仔區": {
        "12 (灣仔、銅鑼灣、跑馬地...)": [],
        "其他":[],
    },
    "東區": {
       "14 (北角、鰂魚涌、太古城...)" : [],
       "16 (西灣河、筲箕灣、柴灣...)" : [],
       "其他":[],
    },
    "南區": {
       "18 (香港仔、黃竹坑、赤柱...)" : [],
       "其他":[],
    },
    // kowloon
    "油尖旺區": {
        "31 (尖沙咀、佐敦、油麻地...)": [],
        "32 (旺角、大角咀...)":[],
        "其他":[],
    },
    "深水埗區": {
        "40 (深水埗、長沙灣、荔枝角、石硤尾...)":[],
        "其他":[],
    },
    "九龍城區": {
        "34 (何文田、土瓜灣、啟德...)": [],
        "35 (紅磡...)": [],
        "41 (九龍城、九龍塘...)": [],
        "其他":[],
    },
    "黃大仙區": {
        "43 (樂富、黃大仙、新蒲崗...)": [],
        "45 (慈雲山、鑽石山、彩虹邨...)": [],
        "其他":[],
    },
    "觀塘區": {
        "46 (九龍灣、佐敦谷、順利...)": [],
        "48 (觀塘、藍田、油塘...)": [],
        "其他":[],
    },
    // newTerritories
    "葵青區": {
        "64 (石籬、梨木樹...)": [],
        "65 (荔景、葵芳、大窩口...)": [],
        "66 (青衣...)": [],
    },
    "荃灣區": {
        "62 (荃灣、深井、馬灣...)": [], 
        "64 (石籬、梨木樹...)": []      
    },
    "屯門區": {
        "70 (屯門西、藍地、兆康...)": [], 
        "71 (屯門東、三聖邨、屯門市廣場、虎地..)": [],  
        "其他":[],      
    },
    "元朗區": {
        "72 (天水圍、洪水橋、廈村...)": [], 
        "73 (元朗西、水邊園、朗屏、大棠...)": [], 
        "74 (元朗東、元朗舊墟、錦田、八鄉...)": [],  
        "其他":[],      
    },
    "北區": {
        "80 (上水、石湖墟、古洞...)": [], 
        "81 (粉嶺、聯和墟、鹿頸...)": [], 
        "83 (沙頭角、鴨洲、吉澳…)": [],        
    },
    "大埔區": {
        "84 (大埔、大美督...)": [],
        "其他":[],
    },
    "沙田區": {
        "88 (大圍、顯徑…)": [], 
        "89 (馬鞍山、烏溪沙、大水坑...)": [], 
        "91 (沙田、火炭...)": [],
        "其他":[],        
       
    },
    "西貢區": {
        "95 (西貢、將軍澳、坑口…)": [],
        "其他":[],
    },
    "離島區": {
        "96 (南丫島、蒲台島…)": [], 
        "97 (長洲、索罟群島...)": [], 
        "98 (大嶼山、東涌...)": [],        
        "99 (坪洲、愉景灣…)": [],
    }
}

var mapDetails = {
    "mapName": "診所地圖",
    "searchPlaceholder": "搜尋診所（醫生姓名、診所名稱、電話號碼等）",
    "swipeIcon": "<i class=\"fas fa-user-md\"></i>"
};

var filterDistricts = [{
        "name": "region",
        "container": "#districtCont > div",
        "varName": "region",
        "displayName": "選擇全港區域",
        "initVal": "全港",
        "terms": {
            "香港島": [],
            "九龍": [],
            "新界": [],
            "全港": []
        }
    },
    {
        "name": "district",
        "container": "#districtCont > div",
        "varName": "district",
        "displayName": "",
        "initVal": "",
        "terms": {}
    },
    {
        "name": "schoolNet",
        "container": "#districtCont > div",
        "varName": "schoolNet",
        "displayName": "",
        "initVal": "",
        "terms": {}
    }
];

var matchField = [{
        "varName": "region",
        "initVal": "全港",
        "geojsonFieldName": "region"
    },
    {
        "varName": "district",
        "initVal": "地區",
        "geojsonFieldName": "district"
    },
    {
        "varName": "FinanceTypeChi",
        "initVal": "不限",
        "geojsonFieldName": "FinanceTypeChi"
    },
    {
        "varName": "StudentGenderChi",
        "initVal": "不限",
        "geojsonFieldName": "StudentGenderChi"
    },
    {
        "varName": "schoolNet",
        "initVal": "不限",
        "geojsonFieldName": "schoolNet"       
    }
];

var filtersTerms = [{
        "name": "docLang",
        "container": "#filterCont > div",
        "varName": "FinanceTypeChi",
        "displayName": "選擇資助類別",
        "initVal": "不限",
        "terms": {
            "不限": [2446, ""],
            "資助": [2446, ""],
            "官立": [2446, ""],
            "私立及直資": [373, ""]
        }
    },
    {
        "name": "docSpecialty",
        "container": "#filterCont > div",
        "varName": "StudentGenderChi",
        "displayName": "選擇學校類別",
        "initVal": "不限",
        "terms": {
            "不限": [2446, ""],
            "男女": [270, ""],
            "男": [207, ""],
            "女": [181, ""]
        }
    }
];

var sidebarField = [
    // {
//     "name": "specialty",
//     "container": "#filterCont > div",
//     // "varName": "specialty",
//     "varName": "StudentGenderChi",
//     "displayName": "註冊專科",
//     "initVal": "不限",
//     "wrapClass": "listings-specialties",
//     "itemClass": "listings-specialty btn-light"
// },
{
    "name": "specialty",
    "container": "#filterCont > div",
    // "varName": "specialty",
    "varName": "FinanceTypeChi",
    "displayName": "註冊專科",
    "initVal": "不限",
    "wrapClass": "listings-specialties",
    "itemClass": "listings-specialty btn-light"
}];

var changingKey = {
    'SchoolAddressChi': '<i class="fas fa-map-marker-alt"></i>',
    'schoolNet': '校網',
    'FinanceTypeChi':'資助類別',
    'StudentGenderChi':'學校類別',
    'name': '<i class="fas fa-school"></i>',
    'TelephoneNumber': '<i class="fas fa-phone"></i>',
    'district': '<i class="fas fa-compass"></i>',
    'qualification':'資格',
    'forms_submitDate':'交表日期',
    'documentsExpected':'所需文件',
    'interviewDate':'面試日期'
};

var iconFactory = {
    "defaultSizeIcon": {
        "options": {
            options: {
                iconSize: [50, 50],
                iconAnchor: [25, 53]
            }
        }
    },
    "largeSizeIcon": {
        "options": {
            options: {
                iconSize: [50, 50],
                iconAnchor: [25, 53]
            }
        }
    }
};

var iconBuild = {
    "遞交表格": {
        "type": "defaultSizeIcon",
        "options": {
            "iconUrl": "icon/submit.png"
        }
    },
    "base": {
        "type": "defaultSizeIcon",
        "options": {
            "iconUrl": "icon/net.png",
            "iconUrl": "icon/green.png",
            "iconUrl": "icon/nonNet.png"
        }
    },
    "郵寄": {
        "type": "largeSizeIcon",
        "options": {
            "iconUrl": "icon/mail.png"
        }
    }
};

var overlayMapsListControl = {
    "遞交表格": {
        "type": "base",
        "initOn": false
    },
    "base": {
        "type": "base",
        "initOn": true
    },
    "郵寄": {
        "type": "overlay",
        "initOn": false
    },
    "heatMap":{
        "type": "base",
        "initOn": false       
    }
};
