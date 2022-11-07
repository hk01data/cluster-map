var G = {};
G['useCluster'] = true;
G['useLayer'] = false;
G['initPan'] = [22.30128, 114.16838];
G['keyword'] = '';
G['gSwiper'] = null;
G['gSwiperDuration'] = 200;
G['markers'] = null;
G['matchedResult'] = {};
G['matchedCount'] = 0;
G['desktopWidth'] = 700;
G['markerClusters'] = null;
G['mymap'] = null;
G['currIndex'] = 0;
G['theMapGeoJson'] = null;
G['polygonSelected'] = null;
G['shapeFileObj'] = null;
G['theUpdateJson'] = null;
G['sidebar'] = [];
G['entrySource'] = '';
G['trackingCate'] = 'primarymap';
G['config'] = {
    geoJsonPath: './js/20190429AppendRegion.geojson',
    shapeFilePath: './js/SchoolNet2019.geojson',
    updateURL: 'https://script.google.com/macros/s/AKfycbzuK19ZpawBOY_qVuufqLATvYWsCkoRtZHG3NVvhnIrCsp9MDs/exec?type=list&table_name=forUpdateInfoTest',
    clusterOptions: { 
        spiderfyOnMaxZoom: false,
        maxClusterRadius: 60,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: false
    }
};

/* previous/next buttons */

document.querySelectorAll(' #nextBtn, #prevBtn').forEach(o => {
    o.addEventListener('click', function (e) {
        e.stopPropagation();
        e.preventDefault();
        var matchedItems = G['theMapGeoJson'].features.filter(matchedCrtiteria);
        console.log(G['currIndex'], ' of ', matchedItems.length);
        if (G['currIndex'] > matchedItems.length) {
            G['currIndex'] = 0;
        }
        if (e.currentTarget.id === 'nextBtn') {
            G['currIndex']++;
            if (G['currIndex'] === matchedItems.length) {
                G['currIndex'] = 0;
            }
        } else {
            G['currIndex']--;
            if (G['currIndex'] < 0) {
                G['currIndex'] = matchedItems.length - 1;
            }
        }
        var aObject = matchedItems[G['currIndex']];
        tableContent(aObject.properties);
        updateView(aObject.geometry.coordinates);
    });
});
/* read in G varable: G['matchedResult']*/
function cycleMatched (allMatched){
    addEvent(document, 'click', '#nextBtn', function(e){
        console.log("clicked next ")
        console.log(allMatched)
        // var aMatched = matchedItems[0]
        // tableContent(aMatched.properties)
        // updateView(aMatched.geometry.coordinates)
    })

}

/* Click item in sidebar */
addEvent(document, 'click', '#listings a', function (e) {
    var that = this; // Or e.target.closest('#listings a');
    var href = that.getAttribute('href');
    console.log('ahash', href);
    G['mymap'].setZoom(18);
    processHash(href);
    if (Object.keys(G['gSwiper']).length) {
        G['gSwiper'].slideTo(1, G['gSwiperDuration'], false);
    }; 
    //fire pv add event

    fireArticlePV(removehash(window.location.href.split("#")[0]+href));
    fireEvent(`${G['trackingCate']}`, 'click_listItem', {
        'school_id': href.split("id/")[1],
        'anonymous_id': getAnonymousId(),
        'session_id': getSessionId(),
        'ts': Date.now()
    });
});

/* Short the card */
document.querySelector('#close-card').addEventListener('click', function (e) {
    document.querySelector('#wholeCard').classList.toggle('short');
    // cardShow = 'hidden';

    // Send Map Event
    fireEvent(`${G['trackingCate']}`, 'close_place', {
        'anonymous_id': getAnonymousId(),
        'session_id': getSessionId(),
        'ts': Date.now()
    });
});

/* Search and filtering */
addEvent(document, 'click', '#searchBtn', function (e) {

    var keywordEl = document.querySelector('#keyword');
    var inp = keywordEl.value;
    G['keyword'] = inp;
    console.log('search: ', G['keyword']);
    if (G['mymap']) {
        G['mymap'].removeLayer(G['markerClusters']);
        if (G['markerClusters']) {
            G['markerClusters'].clearLayers();
            loadAndSidebar();
        }
    }
});

addEvent(document, 'keyup', '#keyword', function (e) {
    var keywordEl = document.querySelector('#keyword');
    var inp = keywordEl.value;
    var cleanBtn = document.querySelector('#cleanBtn');
    if (inp === '' && cleanBtn !== null){
        cleanBtn.parentNode.removeChild(cleanBtn)
    }else if (inp !== '' && cleanBtn == null) {
        var span = document.createElement("span")
        span.setAttribute("id","cleanBtn");
        span.setAttribute("class","input-group-text amber lighten-3")
        span.innerHTML = `<i class="far fa-times-circle" aria-hidden="true"></i>`
        keywordEl.parentNode.insertBefore(span, keywordEl.nextSibling)
    }
    if (e.keyCode === 13) {
        G['keyword'] = inp;
        console.log('search: ', G['keyword']);
        keywordEl.blur();
        if (G['mymap']) { 
            G['mymap'].removeLayer(G['markerClusters']);
            if (G['markerClusters']) {
                G['markerClusters'].clearLayers();
                loadAndSidebar();
            }
        } 
    }
});

addEvent(document, 'change', '.aDropdownList', function (e) {
    var inp = e.target.value;
    var filterName = e.target.getAttribute('data-filter');
    G[filterName] = inp;
    console.log(filterName, G[filterName]);
    if (G['polygonSelected'] != null){
        G['mymap'].removeLayer(G['polygonSelected']);
    }
    if (filterName === 'region') {
        console.log('region', inp);
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
            buildFilters('#districtCont > div', 'district', '地區', mapping[inp]);
        }
    }
    if (filterName === 'district') {
        console.log('district', inp);
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
            "油尖旺區": schoolNet["油尖旺區"],
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
        buildFilters('#districtCont > div', 'schoolNet', '不限校網', mapping[inp]);
    }
      
    if (G['mymap']) {
        if (G['useCluster']) {
            G['mymap'].removeLayer(G['markerClusters']);
            if (G['markerClusters']) {
                G['markerClusters'].clearLayers();
                loadAndSidebar();
            // add polygon
            if (filterName === 'schoolNet') {
                if (G['polygonSelected'] != null){
                    G['mymap'].removeLayer(G['polygonSelected']);
                }
                G['polygonSelected'] = L.geoJSON(G['shapeFileObj'], {
                    filter: function(feature) {
                    if ((feature.properties.NAME).toString() === G[filterName]){
                        return true
                    } 
                    }                    
                })

                G['polygonSelected'].addTo(G['mymap'])
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
addEvent(document, 'click', '#cleanBtn', function(e){
    if (G['polygonSelected'] != null){
        G['mymap'].removeLayer(G['polygonSelected']);
    }
// clean search box
    document.querySelector('#keyword').value = '';
// clean card
    if (G['mymap']) {
        G['mymap'].removeLayer(G['markerClusters']);
        if (G['markerClusters']) {
            G['markerClusters'].clearLayers();
            loadAndSidebar(true);
        }
    }
// remove the button itself
    var cleanBtn = document.querySelector('#cleanBtn');
    cleanBtn.parentNode.removeChild(cleanBtn)


});
addEvent(document, 'click', '.resetFilter', function (e) {
    if (G['polygonSelected'] != null){
        G['mymap'].removeLayer(G['polygonSelected']);
    }
    window.location.hash = '';

    filterDistricts.map(o => {
        G[o.varName] = o.initVal
    });
    filtersTerms.map(o => {
        G[o.varName] = o.initVal
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

    fireEvent(`${G['trackingCate']}`, 'click_logo', {
        'anonymous_id': getAnonymousId(),
        'session_id': getSessionId(),
        'ts': Date.now()
    });
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
    console.log('中', arrF.length, arrF);

    addItemsToList(arrF);
    document.querySelector('#wholeCard').classList.remove('short');
    if (Object.keys(G['gSwiper']).length) {
        console.log('gSwiper');
        G['gSwiper'].slideTo(0, G['gSwiperDuration'], false);
        cycleMatched(arrF)
    }

    positionMarkerZoom(arrF);
}

/* Init */
function init () {
    // document.querySelector('#searchBtn').click
    // get update dateG['config']['updateURL']
    axios.get(G['config']['updateURL'])
    .then(function (response) {
        G['theUpdateJson'] = response.data
        console.log(G['theUpdateJson'])
    })
    .catch(function (error) {
        // handle error
        console.log(error);
    });

    // get shape data dateG['config']['updateURL']
    axios.get(G['config']['shapeFilePath'])
    .then(function (response) {
        G['shapeFileObj'] = response.data.features
    })
    .catch(function (error) {
        // handle error
        console.log(error);
    });


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
    G['initZoom'] = (window.outerWidth >= G['desktopWidth']) ? 14 : 12;
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

    G['mymap'].on('baselayerchange', onBaseLayerChange);
    G['mymap'].on('overlayadd', onOverlayAdd);
    G['mymap'].on('overlayremove', onOverlayRemove);

    function onBaseLayerChange (e) {
        console.log(`onBaseLayerChange`, e.name);
        document.querySelector('#wholeCard').classList.add('short');
        document.querySelector('#wholeCard').classList.remove('init-box');

        // Send Map Event
        fireEvent(`${G['trackingCate']}`, 'click_layerChange', {
            'layer': e.name,
            'anonymous_id': getAnonymousId(),
            'session_id': getSessionId(),
            'ts': Date.now()
        });
    }

    function onOverlayAdd (e) {
        console.log(`onOverlayAdd`, e.name);
        document.querySelector('#wholeCard').classList.add('short');
        document.querySelector('#wholeCard').classList.remove('init-box');

        // Send Map Event
        fireEvent(`${G['trackingCate']}`, 'click_layerAdd', {
            'layer': e.name,
            'anonymous_id': getAnonymousId(),
            'session_id': getSessionId(),
            'ts': Date.now()
        });
    }

    function onOverlayRemove (e) {
        console.log(`onOverlayRemove`, e.name);
        document.querySelector('#wholeCard').classList.add('short');
        document.querySelector('#wholeCard').classList.remove('init-box');

        // Send Map Event
        fireEvent(`${G['trackingCate']}`, 'click_layerRemove', {
            'layer': e.name,
            'anonymous_id': getAnonymousId(),
            'session_id': getSessionId(),
            'ts': Date.now()
        });
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

    G['mymap'].once('locationfound', function (e) {
        // Send Map Event
        fireEvent(`${G['trackingCate']}`, 'click_gps', {
            'lat': e.latlng.lat,
            'lng': e.latlng.lng,
            'anonymous_id': getAnonymousId(),
            'session_id': getSessionId(),
            'ts': Date.now()
        });
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
    loadGeoJSON();
    // enableBtn();

    if (window.location.hash) {
        // Accept Hash
        processHash(window.location.hash);
    } else {
        G['mymap'].setView(G['initPan'], G['initZoom']);
    }
}

function detectSource (callback) {
    let linkText = window.location.href;
    console.log(linkText);
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
            fireArticlePV(removehash(window.location.href));
    }

    console.log(entrySource + ' | initialID: ' + initialID);

    fireEvent(`${G['trackingCate']}`, 'view_landing', {
        'start_mode': entrySource,
        'anonymous_id': getAnonymousId(),
        'session_id': getSessionId(),
        'ts': Date.now()
    });

    fireMapPV(removehash(window.location.href));

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
