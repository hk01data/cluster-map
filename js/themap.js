var G = {};
G['useCluster'] = true;
G['useLayer'] = false;
G['initPan'] = [114.1547683,22.2818436];
G['keyword'] = '';
G['gSwiper'] = null;
G['gSwiperDuration'] = 200;
G['markers'] = null;
G['matchedResult'] = {};
G['matchedCount'] = 0;
G['desktopWidth'] = 700;
G['markerClusters'] = null;
G['mymap'] = null;
G['currIndex'] = -1;
G['theMapGeoJson'] = null;
// G['polygonSelected'] = null;
G['shapeFileObj'] = null;
G['theUpdateJson'] = null;
G['sidebar'] = [];
G['entrySource'] = '';
G['trackingCate'] = 'primarymap';
G['previousOption'] = null;
G['storedText'] = '';
G['config'] = {
    geoJsonPath: './js/geojson/data.geojson',
    // shapeFilePath: './js/SchoolNet2019.geojson',20190923New
    updateURL: 'https://script.google.com/macros/s/AKfycbzuK19ZpawBOY_qVuufqLATvYWsCkoRtZHG3NVvhnIrCsp9MDs/exec?type=list&table_name=forUpdateInfoTest',
    clusterOptions: { 
        spiderfyOnMaxZoom: false,
        maxClusterRadius: 60,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: false
    }
};

/* previous/next buttons */
addEvent(document, 'click', '#prevBtn', function(e){
    if (this.getAttribute("disabled") !== "true"){

        G['mymap'].setZoom(18);
        //console.log("clicked prevBtn ")
        //console.log(G['matchedResult'])
        var allMatched = G['matchedResult'];
        var currIndex = G['currIndex'];
        //console.log(currIndex)
        // get clicked marker's id in matched list
        var preId_inMatched = allMatched.length-1;

        for (var i = 0; i < allMatched.length; i++ ) {
            if ((allMatched[i].properties.id).toString() === currIndex.toString()){
                i-1 >= 0 ? preId_inMatched = i - 1 : preId_inMatched = allMatched.length-1
            }
        }
        //console.log(preId_inMatched)

        var objPre = allMatched[preId_inMatched];
    
    // ZOOM to clicked Marker
        var currentURL = window.location.href
        var newURL = currentURL.split('#')[0] + "#id/"+objPre.properties.id;
        //var newURL = currentURL.split('?')[0] + "?id="+objPre.properties.id;
        processHash(newURL)

    //  change window URL
        document.location.assign(newURL)
        // update card content and map view 
        tableContent(objPre.properties);
        //updateView(objPre.geometry.coordinates);

        // update currIndex: the id of marker, which currently showed on card 
        G['currIndex'] = objPre.properties.id;

        // fire PV and event
        //fireArticlePV(removehash(newURL));
        fireMapPV(removehash(newURL));

        /*fireEvent(`${G['trackingCate']}`, 'click_preArrow', {
            'school_id': objPre.properties.id,
            'anonymous_id': getAnonymousId(),
            'session_id': getSessionId(),
            'ts': Date.now()
        });*/
    }
});

addEvent(document, 'click', '#nextBtn', function(e){
    if (this.getAttribute("disabled") !== "true"){
        G['mymap'].setZoom(18);
        //console.log("clicked next ")
        // console.log(allMatched)
        //console.log(G['matchedResult'])
        var allMatched = G['matchedResult'];
        var currIndex = G['currIndex'];
        //console.log(currIndex)
        // get clicked marker's id in matched list
        var nextId_inMatched = 0

        for (var i = 0; i < allMatched.length; i++ ) {
            if ((allMatched[i].properties.id).toString() === currIndex.toString()){
                i+1 < allMatched.length ? nextId_inMatched = i + 1 : nextId_inMatched = 0
                //console.log("in search result")
            }
        }
        //console.log(nextId_inMatched)

        var objNext = allMatched[nextId_inMatched];
    
    // ZOOM to clicked Marker
        var currentURL = window.location.href
        // console.log(currentURL)
        // var idRegexp = /id\/(.+)&?/g;
        // var match = idRegexp.exec(currentURL);
        // console.log(match)
        var newURL = currentURL.split('#')[0] + "#id/"+objNext.properties.id;
        //var newURL = currentURL.split('?')[0] + "?id="+objNext.properties.id;
        processHash(newURL)
    //  change window URL
        document.location.assign(newURL)
        // update card content and map view 
        tableContent(objNext.properties);
    // updateView(objNext.geometry.coordinates);

        // update currIndex: the id of marker, which currently showed on card 
        G['currIndex'] = objNext.properties.id;

        // fire PV and event
        //fireArticlePV(removehash(newURL));
        fireMapPV(removehash(newURL));

        /*fireEvent(`${G['trackingCate']}`, 'click_nextArrow', {
            'school_id': objNext.properties.id,
            'anonymous_id': getAnonymousId(),
            'session_id': getSessionId(),
            'ts': Date.now()
        });*/
    }
});

/* Click item in sidebar */
addEvent(document, 'click', '#listings div', function (e) {
    var that = this; // Or e.target.closest('#listings a');
    var href = that.getAttribute('id');
    //console.log('ahash', href);
    //console.log("///////////////")
    // console.log(G['mymap'].getZoom())
    G['mymap'].setZoom(18);
    // console.log(G['mymap'].getZoom())
    processHash(href);
    if (Object.keys(G['gSwiper']).length) {
        G['gSwiper'].slideTo(1, G['gSwiperDuration'], false);
    }; 
    G['currIndex'] = href.split("id/")[1];

    var currentURL = window.location.href

    var newURL = currentURL.split('#')[0] + "#id/"+ G['currIndex'];

    document.location.assign(newURL)
    //fire pv add event
    //fireMapPV(removehash(window.location.href.split("#")[0]+href));
    fireMapPV(removehash(newURL));
    //fireArticlePV(removehash(window.location.href.split("#")[0]+href));
    /*fireEvent(`${G['trackingCate']}`, 'click_listItem', {
        'school_id': href.split("id/")[1],
        'anonymous_id': getAnonymousId(),
        'session_id': getSessionId(),
        'ts': Date.now()
    });*/
});
/* Click article link in map card */
addEvent(document, 'click','#articleLink', function(e) {
    var that = this;
    var href = that.getAttribute('href');
    // fire event
    /*fireEvent(`${G['trackingCate']}`, 'click_articleLink', {
        'articleLink': href.split("?")[0],
        'anonymous_id': getAnonymousId(),
        'session_id': getSessionId(),
        'ts': Date.now()
    });*/
});
/* Short the card */
document.querySelector('#close-card').addEventListener('click', function (e) {
    document.querySelector('#wholeCard').classList.toggle('short');
    // cardShow = 'hidden';
    var currentClass = document.querySelector('#wholeCard').getAttribute("class");
    var isCollapse = (currentClass.includes("short"))? true:false
    // Send Map Event
    /*fireEvent(`${G['trackingCate']}`, 'change_cardLength', {
        'collapse': isCollapse,
        'anonymous_id': getAnonymousId(),
        'session_id': getSessionId(),
        'ts': Date.now()
    });*/
});

/* Search and filtering */
document.querySelector('#searchBtn').addEventListener('click', function (e) {

    var keywordEl = document.querySelector('#keyword');
    var inp = keywordEl.value;
    G['keyword'] = inp;
    //console.log('search: ', G['keyword']);
    if (G['mymap']) {
        G['mymap'].removeLayer(G['markerClusters']);
        if (G['markerClusters']) {
            G['markerClusters'].clearLayers();
            loadAndSidebar();
        }
    }
    // fire event
    /*fireEvent(`${G['trackingCate']}`, 'click_searchButton', {
        'keyword_searched':inp,
        'anonymous_id': getAnonymousId(),
        'session_id': getSessionId(),
        'ts': Date.now()
    });*/
});

// document.querySelector('#keyword').addEventListener('input', function (e) {
//     var keywordEl = document.querySelector('#keyword');
//     var inp = keywordEl.value;

//     if (e.keyCode == 13) {
//         G['keyword'] = inp;
//         console.log('search: ', G['keyword']);
//         keywordEl.blur();
//         if (G['mymap']) { 
//             G['mymap'].removeLayer(G['markerClusters']);
//             if (G['markerClusters']) {
//                 G['markerClusters'].clearLayers();
//                 loadAndSidebar();
//             }
//         } 
//     }
//     // fire event, record the serched key word
// });
addEvent(document, 'keyup', '#keyword', function (e) {
    var keywordEl = document.querySelector('#keyword');
    var inp = keywordEl.value;

    if (e.keyCode === 13) {
        G['keyword'] = inp;
        //console.log('search: ', G['keyword']);
        keywordEl.blur();
        if (G['mymap']) { 
            G['mymap'].removeLayer(G['markerClusters']);
            if (G['markerClusters']) {
                G['markerClusters'].clearLayers();
                loadAndSidebar();
            }
        } 
        // fire event
        /*fireEvent(`${G['trackingCate']}`, 'click_searchButton', {
            'keyword_searched':inp,
            'anonymous_id': getAnonymousId(),
            'session_id': getSessionId(),
            'ts': Date.now()
        });*/
    }
    // reset map and filter wehen empty
    if (inp === ''){
        //console.log('empty empty')
        // remove heighlit of finance type menu
        var financeTypeElem = document.querySelector('.aDropdownList[data-filter="FinanceTypeChi"]');
        if (financeTypeElem.getAttribute("style")){
            financeTypeElem.removeAttribute("style")
        }

        // if (G['polygonSelected'] != null){
        //     G['mymap'].removeLayer(G['polygonSelected']);
        // }
        window.location.hash = '';
    
        // reset the G['currIndex']
        G['currIndex'] = 0
    
        filterDistricts.map(o => {
            G[o.varName] = o.initVal
        });
        filtersTerms.map(o => {
            o.varName !== 'FinanceTypeChi' ? G[o.varName] = o.initVal : G[o.varName] = "不限", o.displayName = "選擇類別";
        });
        //disappear schoolNet drop down menu
        var schoolNetSelect = document.querySelectorAll('#districtCont .aDropdownList[data-filter="schoolNet"]');
        if (schoolNetSelect.length) {
            schoolNetSelect[0].remove();
        }
        G['keyword'] = '';
        document.querySelector('#keyword').value = '';
        document.querySelectorAll('.aDropdownList').forEach(o => {
            o.value = '不限';
        });
        var districtSelect = document.querySelectorAll('#districtCont .aDropdownList[data-filter="district"]');
        if (districtSelect.length) {
            districtSelect[0].remove();
        }
        // change text showed on finance type drop-down menu
        // var financeTypeEle = document.querySelector('.aDropdownList[data-filter="FinanceTypeChi"]');
        
        // fire event
        // fireEvent(`${G['trackingCate']}`, 'click_resetButton', {
        //     'anonymous_id': getAnonymousId(),
        //     'session_id': getSessionId(),
        //     'ts': Date.now()
        // });
    
        if (G['mymap']) {
            G['mymap'].removeLayer(G['markerClusters']);
            if (G['markerClusters']) {
                G['markerClusters'].clearLayers();
                loadAndSidebar(true);
            }
        }
    }
    // fire event, record the serched key word
});

addEvent(document, 'change', '.aDropdownList', function (e) {
    //console.log("change change")
    // G['useCluster'] = true;
    var inp = e.target.value;
    var filterName = e.target.getAttribute('data-filter');
    G[filterName] = inp;
    //console.log(filterName, G[filterName]);

    if (filterName === 'schoolNet') {
        // fire event
        /*fireEvent(`${G['trackingCate']}`, 'click_memu_schoolNet', {
        'schoolNet':inp,
        'anonymous_id': getAnonymousId(),
        'session_id': getSessionId(),
        'ts': Date.now()
        });*/
        // inp = school net number
        var dropMeu = document.querySelector(".aDropdownList[data-filter='schoolNet']")
        // var selectedOption = dropMeu.options[dropMeu.selectedIndex];

        if(G['previousOption'] !=null){
            G['previousOption'].text = G['storedText']
        }
        G['previousOption'] = dropMeu.options[dropMeu.selectedIndex];
        G['storedText']=G['previousOption'].text;

        dropMeu.options[dropMeu.selectedIndex].text ="餐廳: " + inp.toString();
    }

    // if (G['polygonSelected'] != null){
    //     G['mymap'].removeLayer(G['polygonSelected']);
    // }
    if (filterName === 'region') {
        //console.log('region', inp);
            // fire event
        /*fireEvent(`${G['trackingCate']}`, 'click_menu_region', {
            'region':inp,
            'anonymous_id': getAnonymousId(),
            'session_id': getSessionId(),
            'ts': Date.now()
        });*/
        var districtSelect = document.querySelectorAll('#districtCont .aDropdownList[data-filter="district"]');
        var schoolNetSelect = document.querySelectorAll('#districtCont .aDropdownList[data-filter="schoolNet"]');
        if (districtSelect.length) {
            districtSelect[0].remove();
        }
        if (schoolNetSelect.length) {
            schoolNetSelect[0].remove();
        }       
        G['district'] = '地區';
        if (inp !== '全港') {
            var mapping = {
                '香港島': island,
                '九龍': kowloon,
                '新界': newTerritories,
            };
            buildFilters('#districtCont > div', 'district', '選擇地區', mapping[inp]);
        }
    }
    if (filterName === 'district') {
        //console.log('district', inp);
        // fire event
        /*fireEvent(`${G['trackingCate']}`, 'click_menu_district', {
            'district':inp,
            'anonymous_id': getAnonymousId(),
            'session_id': getSessionId(),
            'ts': Date.now()
        });*/
        var districtSelect = document.querySelectorAll('#districtCont .aDropdownList[data-filter="district"]');
        var schoolNetSelect = document.querySelectorAll('#districtCont .aDropdownList[data-filter="schoolNet"]');
        if (schoolNetSelect.length) {
            schoolNetSelect[0].remove();
        }
        G['schoolNet'] = '不限';
        var mapping = {
            // island
            "中西區": schoolNet["中西區"],
            "灣仔區": schoolNet["灣仔區"],
            "東區": schoolNet["東區"],
            "南區": schoolNet["南區"],
            // kowloon
            "油尖區": schoolNet["油尖區"],
            "旺角區": schoolNet["旺角區"],
            "深水埗區": schoolNet["深水埗區"],
            "九龍城區": schoolNet["九龍城區"],
            "黃大仙區": schoolNet["黃大仙區"],
            "觀塘區":  schoolNet["觀塘區"],            
            // newTerritories
            "葵青區": schoolNet["葵青區"],
            "荃灣區": schoolNet["荃灣區"],
            "屯門區": schoolNet["屯門區"],
            "元朗區": schoolNet["元朗區"],
            "北區": schoolNet["北區"],
            "大埔區": schoolNet["大埔區"],
            "沙田區": schoolNet["沙田區"],
            "西貢區": schoolNet["西貢區"],
            "離島區": schoolNet["離島區"]
        };
        // var lenNet = Object.keys(mapping[inp])
        // if (lenNet.length === 1){
            // G['schoolNet']= lenNet[0].split(" ")[0]
        // }
        /*buildFilters('#districtCont > div', 'schoolNet', '不限校網', mapping[inp]);*/
    }
    if (filterName === 'FinanceTypeChi') {
        // remove heighlit of finance type menu
        var financeTypeElem = document.querySelector('.aDropdownList[data-filter="FinanceTypeChi"]');
        if (financeTypeElem.getAttribute("style")){
            financeTypeElem.removeAttribute("style")
        }
        // fire event
        /*fireEvent(`${G['trackingCate']}`, 'click_menu_financeType', {
            'finance_type':inp,
            'anonymous_id': getAnonymousId(),
            'session_id': getSessionId(),
            'ts': Date.now()
        });*/
    }
    if (filterName === 'StudentGenderChi') {
        // fire event
        /*fireEvent(`${G['trackingCate']}`, 'click_menu_studentGender', {
            'student_gender':inp,
            'anonymous_id': getAnonymousId(),
            'session_id': getSessionId(),
            'ts': Date.now()
        });*/
    }        
    if (G['mymap']) {
        if (G['useCluster']) {
            G['mymap'].removeLayer(G['markerClusters']);
            if (G['markerClusters']) {
                G['markerClusters'].clearLayers();
                loadAndSidebar();
            // add polygon
            if (filterName === 'schoolNet') {
                // if (G['polygonSelected'] != null){
                //     G['mymap'].removeLayer(G['polygonSelected']);
                // }
                // G['polygonSelected'] = L.geoJSON(G['shapeFileObj'], {
                //     filter: function(feature) {
                //     if ((feature.properties.NAME).toString() === G[filterName]){
                //         return true
                //     } 
                //     }                    
                // })

                // G['polygonSelected'].addTo(G['mymap'])
            }
            }
        } else {
            // use normal
            G['mymap'].removeLayer(G['markers']);
            G['markers'].clearLayers();
            loadAndSidebar();
        }
    }
});

addEvent(document, 'click', '.resetFilter', function (e) {
    
    var financeTypeElem = document.querySelector('.aDropdownList[data-filter="FinanceTypeChi"]');
    if (financeTypeElem.getAttribute("style")){
        financeTypeElem.removeAttribute("style")
    }

    // if (G['polygonSelected'] != null){
    //     G['mymap'].removeLayer(G['polygonSelected']);
    // }
    window.location.hash = '';

    // reset the G['currIndex']
    G['currIndex'] = 0

    filterDistricts.map(o => {
        G[o.varName] = o.initVal
    });
    filtersTerms.map(o => {
        o.varName !== 'FinanceTypeChi' ? G[o.varName] = o.initVal : G[o.varName] = "不限", o.displayName = "選擇餐廳類別";
    });
    //disappear schoolNet drop down menu
    var schoolNetSelect = document.querySelectorAll('#districtCont .aDropdownList[data-filter="schoolNet"]');
    if (schoolNetSelect.length) {
        schoolNetSelect[0].remove();
    }
    G['keyword'] = '';
    document.querySelector('#keyword').value = '';
    document.querySelectorAll('.aDropdownList').forEach(o => {
        o.value = '不限';
    });
    var districtSelect = document.querySelectorAll('#districtCont .aDropdownList[data-filter="district"]');
    if (districtSelect.length) {
        districtSelect[0].remove();
    }
    // change text showed on finance type drop-down menu
    // var financeTypeEle = document.querySelector('.aDropdownList[data-filter="FinanceTypeChi"]');
    
    // fire event
    /*fireEvent(`${G['trackingCate']}`, 'click_resetButton', {
        'anonymous_id': getAnonymousId(),
        'session_id': getSessionId(),
        'ts': Date.now()
    });*/

    if (G['mymap']) {
        G['mymap'].removeLayer(G['markerClusters']);
        if (G['markerClusters']) {
            G['markerClusters'].clearLayers();
            loadAndSidebar(true);
        }
    }

});

/* Card Nav */
addEvent(document, 'click', '#swipeBack', function (e) {
    if (Object.keys(G['gSwiper']).length) {
        G['gSwiper'].slideTo(0, G['gSwiperDuration'], false);
            // fire event
        /*fireEvent(`${G['trackingCate']}`, 'click_swipeBack', {
            'anonymous_id': getAnonymousId(),
            'session_id': getSessionId(),
            'ts': Date.now()
        });*/
    }
});

/* Card Display Status */
addEvent(document, 'click touchstart', '#Mapid', function (e) {
    document.querySelector('#keyword').blur();
});

addEvent(document, 'mousemove touchmove', '#Mapid', function (e) {
    if (document.querySelector('body').classList.contains('leaflet-dragging')) {
        document.querySelector('#wholeCard').classList.add('short');
    }
});

addEvent(document, 'click', 'a[href]', function (e) {
    var href = this.getAttribute('href');
});

addEvent(document, 'click', 'a.navbar-brand', function (e) {

    /*fireEvent(`${G['trackingCate']}`, 'click_logo', {
        'anonymous_id': getAnonymousId(),
        'session_id': getSessionId(),
        'ts': Date.now()
    });*/
});

/* Marker Handlers */
function markerClickHandler (e) {
    var arrF = [];
    arrF.push(e.target.feature);
    positionMarkerZoom(arrF);
}

function markerClusterClickHandler (e) {
    var arr = [];
    var padding = 0.000008;
    var latLngBounds = e.layer.getBounds();
    // var clusterMarkers = e.layer.getAllChildMarkers(arr); // e.layer is actually a cluster
    var arrF = G['theMapGeoJson'].features.filter(function (o) {
        var fLat = o.geometry.coordinates[1];
        var fLng = o.geometry.coordinates[0];
        var matched = matchedCrtiteria(o);
        return (latLngBounds._northEast.lat + padding > fLat && latLngBounds._southWest.lat - padding < fLat) &&
            (latLngBounds._northEast.lng + padding > fLng && latLngBounds._southWest.lng - padding < fLng) &&
            matched;
    });
    // console.log(e.layer, e.layer._latlng);
    // console.log('cluster ' + clusterMarkers.length);
    //console.log('中', arrF.length, arrF);

    addItemsToList(arrF);
    document.querySelector('#wholeCard').classList.remove('short');
    if (Object.keys(G['gSwiper']).length) {
        //console.log('gSwiper');
        G['gSwiper'].slideTo(0, G['gSwiperDuration'], false);
        // enable cycling
        // cycleMatched(arrF)
        G['matchedResult'] = arrF;
        G['currIndex'] = arrF[0].properties.id;
    }

    positionMarkerZoom(arrF);
}

function welcome() {
                // if (initialID == 0) {
                var myModal = document.getElementById('welcomeModal');

                var options = {
                    backdrop: true
                }
                // OR initialize and show the modal right away
                var myModalInstance = new Modal(myModal, options);
                myModalInstance.show();
                console.log('welcome')
            }

/* Init */

function init () {

    welcome()
    // document.querySelector('#searchBtn').click
    // get update dateG['config']['updateURL']

    fireMapPV(window.location.href)

    axios.get(G['config']['updateURL'])
    .then(function (response) {
        G['theUpdateJson'] = response.data
        //console.log(G['theUpdateJson'])
    })
    .catch(function (error) {
        // handle error
        console.log(error);
    });

    // get shape data dateG['config']['updateURL']
    // axios.get(G['config']['shapeFilePath'])
    // .then(function (response) {
    //     G['shapeFileObj'] = response.data.features
    // })
    // .catch(function (error) {
    //     // handle error
    //     console.log(error);
    // });


    G['gSwiper'] = new Swiper('.swiper-container', {
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            renderBullet: function (index, className) {
                var icon = [
                    `<i class="fas fa-list-ol"></i>`,
                    `<i class="fas fa-graduation-cap"></i>`
                ]
                return '<span class="' + className + '">' + icon[index] + '</span>';
            }
        }
    });
    document.querySelector('.swiper-pagination').addEventListener('click', function (e) {
        var clickedTarget = e.target.className;
        var actionName = (clickedTarget === 'fas fa-graduation-cap') ? 'click_show_detail' : 'click_show_list'
       
        // fire event 
        /*fireEvent(`${G['trackingCate']}`, actionName, {
            'anonymous_id': getAnonymousId(),
            'session_id': getSessionId(),
            'ts': Date.now()
        });*/
    });
    Object.assign(G['config']['clusterOptions'], {
        // iconCreateFunction: function (cluster) {
        //     var markers = cluster.getAllChildMarkers();
        //     var n = 0;
        //     for (var i = 0; i < markers.length; i++) {
        //         n += 1 // markers[i].number;
        //     }
        //     return L.divIcon({
        //         html: n,
        //         className: 'mycluster-' + parseInt(n / (300 / 4)),
        //         iconSize: L.point(40, 40)
        //     });
        // }
    })

    if (G['useCluster']) {
        if (G['useLayer']) {
            G['markerClusters'] = L.markerClusterGroup.layerSupport(G['config']['clusterOptions']);
        } else {
            G['markerClusters'] = L.markerClusterGroup(G['config']['clusterOptions']);
        }
    }
    G['baselayer'] = L.tileLayer('https://maptile.hk01.com/tile/{z}/{x}/{y}.png', {
        maxZoom: 18,
        minZoom: 10,
        hq: '@2x'
    });
    // G['initZoom'] = (window.outerWidth >= G['desktopWidth']) ? 14 : 12;
    G['initZoom'] = (window.outerWidth >= G['desktopWidth']) ? 13 : 14;
    G['initPan'] = (window.outerWidth >= G['desktopWidth']) ? [22.327579, 114.176697] : [22.329627, 114.178566];

    G['mymap'] = L.map('Mapid', {
        zoom: G['initZoom'],
        zoomControl: false,
        maxBounds: ([
            [21.795661, 113.073929],
            [23.113786, 115.230749]
        ]),
        attributionControl: false,
        keyboard: false, // Prevent jumping in iframe
        layers: [G['baselayer']]
    }).setView(G['initPan'], G['initZoom']);

    L.control.zoom({
        position: 'topleft'
    }).addTo(G['mymap']);

    setTimeout(function(){ G['mymap'].invalidateSize()}, 500);

    G['mymap'].on('baselayerchange', onBaseLayerChange);
    G['mymap'].on('overlayadd', onOverlayAdd);
    G['mymap'].on('overlayremove', onOverlayRemove);

    function onBaseLayerChange (e) {
        //console.log(`onBaseLayerChange`, e.name);
        document.querySelector('#wholeCard').classList.add('short');
        document.querySelector('#wholeCard').classList.remove('init-box');

        // Send Map Event
        /*fireEvent(`${G['trackingCate']}`, 'click_layerChange', {
            'layer': e.name,
            'anonymous_id': getAnonymousId(),
            'session_id': getSessionId(),
            'ts': Date.now()
        });*/
    }

    function onOverlayAdd (e) {
        //console.log(`onOverlayAdd`, e.name);
        document.querySelector('#wholeCard').classList.add('short');
        document.querySelector('#wholeCard').classList.remove('init-box');

        // Send Map Event
        /*fireEvent(`${G['trackingCate']}`, 'click_layerAdd', {
            'layer': e.name,
            'anonymous_id': getAnonymousId(),
            'session_id': getSessionId(),
            'ts': Date.now()
        });*/
    }

    function onOverlayRemove (e) {
        //console.log(`onOverlayRemove`, e.name);
        document.querySelector('#wholeCard').classList.add('short');
        document.querySelector('#wholeCard').classList.remove('init-box');

        // Send Map Event
        /*fireEvent(`${G['trackingCate']}`, 'click_layerRemove', {
            'layer': e.name,
            'anonymous_id': getAnonymousId(),
            'session_id': getSessionId(),
            'ts': Date.now()
        });*/
    }

    L.control.locate({
        collapsed: false,
        position: 'topleft',
        setView: 'always',
        flyTo: true,
        showPopup: true,
        locateOptions: {
            maxZoom: 15
        }
    }).addTo(G['mymap']);

    setTimeout(function(){ G['mymap'].invalidateSize()}, 500);

    G['mymap'].once('locationfound', function (e) {
        // Send Map Event
        /*fireEvent(`${G['trackingCate']}`, 'click_gps', {
            'lat': e.latlng.lat,
            'lng': e.latlng.lng,
            'anonymous_id': getAnonymousId(),
            'session_id': getSessionId(),
            'ts': Date.now()
        });*/
    });

    // Clustered marker is clicked
    if (G['markerClusters']) {
        G['markerClusters'].on('clusterclick', markerClusterClickHandler);
    }

    // Init Filter Values
    filterDistricts.map(o => {
        G[o.varName] = o.initVal
    });
    filtersTerms.map(o => {
        G[o.varName] = o.initVal
    });

    // Load Filter Options
    filterDistricts.map(o => {
        if (o.initVal !== '') {
            buildFilters(o.container, o.varName, o.displayName, o.terms);
        }
    });
    filtersTerms.map(o => {
        if (o.initVal !== '') {
            buildFilters(o.container, o.varName, o.displayName, o.terms);
        }
    });

    // Load Markers
    // loadGeoJSON();
    var financeTypeElem = document.querySelector('.aDropdownList[data-filter="FinanceTypeChi"]');
    financeTypeElem.value = "不限";
    //financeTypeElem.style.borderColor= "#FFD700";
    // financeTypeElem.style.borderColor= "#FF8C00";
    //financeTypeElem.style.borderWidth="4px";
    // console.log(financeTypeElem)
    loadAndSidebar();

    if (window.location.hash) {
        // Accept Hash
        processHash(window.location.hash);
    } else {
        G['mymap'].setView(G['initPan'], G['initZoom']);
    }
}

function detectSource (callback) {
    let linkText = window.location.href;
    //console.log(linkText);
    entrySource = (linkText.match(/#/)) ? ((linkText.match(/#(.*?)(&|$|\?)/)) ? linkText.match(/#(.*?)(&|$|\?)/)[1] : 'organic') : 'organic';
    initialID = (linkText.match(/&id=/)) ? ((linkText.match(/&id=(\d+)/)) ? parseInt(linkText.match(/&id=(\d+)/)[1]) : 0) : 0;
    G['entrySource'] = entrySource;

    switch (entrySource) {
        case 'article':
        case 'base':
        case 'issue':
            break;
        default:
            entrySource = 'organic';
            //fireArticlePV(removehash(window.location.href));
    }

    //console.log(entrySource + ' | initialID: ' + initialID);

    /*fireEvent(`${G['trackingCate']}`, 'view_landing', {
        'start_mode': entrySource,
        'anonymous_id': getAnonymousId(),
        'session_id': getSessionId(),
        'ts': Date.now()
    });*/

    //fireMapPV(removehash(window.location.href));

    callback(initialID);
}


// Entry point
axios.get(G['config']['geoJsonPath'])
    .then(function (response) {
        G['theMapGeoJson'] = response.data
        detectSource(init);
    })
    .catch(function (error) {
        // handle error
        console.log(error);
    });

function adsHeight(){
    var ads = document.getElementById('footer')
    var height = ads.offsetHeight

    var card = document.getElementById('wholeCard')
    card.style.bottom = height+"px"

    console.log('height')

}

document.addEventListener("DOMContentLoaded", function(){
    setTimeout(function(){
         adsHeight()
    }, 2000);
});
