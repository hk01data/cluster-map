var cardShow = '';
var areaId = '';
var hospitalAddrId = '';
var isActivate = '';
var propertiesObjectList = [];
var geometryObjectList = [];

/**
 * Category: Utility
 * To add event listener
 * @param {String} "parent, evt, selector, handler"
 */
// addEvent(document, 'click', 'a[href]', function (e) {
//     var href = this.getAttribute('href');
// });
function addEvent(parent, evt, selector, handler) {
    //console.log(parent, evt, selector, handler)
    // let target = (parent === document) ? document.getElementsByTagName('html')[0] : parent;
    evt.split(' ').map(eventName => {
        parent.addEventListener(eventName, function (event) {
            if (event.target.matches(selector + ', ' + selector + ' *')) {
                handler.apply(event.target.closest(selector), arguments);
            }
        }, false);
    });
}

/**
 * Category: Utility
 * To get unique of area
 * @param {String} finalList
 */
function formatArea (value) {
    var areaList = !value ? value : value.split(',');
    var uniqueArea = new Set(areaList);
    var finalList = [];
    for (var item of uniqueArea) {
        if (item !== '') {
            finalList.push(item);
        }
    }
    return finalList.toString();
}


/**
 * Category: Utility
 * To check empty object
 * @returns {Boolean} Truthiness of an object emptiness
 */
function notEmpty (obj) {
    return !!Object.keys(obj).length;
}

/**
 * Category: timecode
 * To start of transfer the opening hour format (24Hour representation)
 * @param {Array} listForCheck
 */
function flipBack (listForCheck) {
    for (var i = 0; i < listForCheck.length; i++) {
        if (listForCheck[i] > '23') {
            var temp = parseInt(listForCheck[i]) - 24 + '';
            if (temp < 10) {
                temp = '0' + temp;
            }
            listForCheck[i] = listForCheck[i].replace(/^.{2}/g, temp);
        }
    }
    return listForCheck;
}


/**
 * Category: timecode
 * To reduce overlapping time period for once
 * @param {String} value
 */
function openTimeTransfer (value) {
    var matchList = value.match(/\d{1,2}:\d{2}([ap]m)?/g);

    if (matchList) {
        var matchedLen = matchList.length;
        if (matchedLen > 2) {
            openTime = [];
            closeTime = [];
            for (var i = 0; i < matchedLen; i++) {
                if ((i + 2) % 2 === 0) {
                    openTime.push(matchList[i]);
                } else {
                    closeTime.push(matchList[i]);
                }
            }

            for (var i = 0; i < openTime.length; i++) {
                if (closeTime[i] < openTime[i]) {
                    var temporary = parseInt(closeTime[i]) + 24;
                    var temporary = temporary + '';
                    closeTime[i] = closeTime[i].replace(/^.{2}/g, temporary);
                }
            }

            var result = [];
            for (var j = 0; j < openTime.length; j++) {
                if (j + 1 <= openTime.length) {
                    if (openTime[j] < closeTime[j + 1] && openTime[j + 1] <= closeTime[j]) {
                        earliest = openTime[j] <= openTime[j + 1] ? openTime[j] : openTime[j + 1];
                        latest = closeTime[j] >= closeTime[j + 1] ? closeTime[j] : closeTime[j + 1];

                        var listForCheck = [];
                        listForCheck.push(earliest);
                        listForCheck.push(latest);
                        var tiemSlot = flipBack(listForCheck)[0] + " - " + flipBack(listForCheck)[1];
                        result.push(tiemSlot);
                        j = j + 1;

                    } else {
                        for (var i = 0; i < matchList.length; i++) {
                            if (matchList[1] < openTime[0]) {
                                var temporary = parseInt(matchList[1]) + 24 + '';
                                matchList[i] = matchList[i].replace(/^.{2}/g, temporary);
                            }
                        }
                        var listForCheck = [];
                        listForCheck.push(openTime[j]);
                        listForCheck.push(closeTime[j]);
                        var tiemSlot = flipBack(listForCheck)[0] + " - " + flipBack(listForCheck)[1];
                        result.push(tiemSlot);
                    }
                }

                //end of for loop
            }
            return result.toString();
            //end of if loop
        } else {

            var resultList = flipBack(matchList);
            var tiemSlot = resultList[0] + " - " + resultList[1];
            return tiemSlot;

        }

        //end of outmost if loop
    } else {
        return '休息';
    }
}


/**
 * Category: Card(Heading)
 * To check opening state of marker item
 * @param {String} todaytimeS
 * @returns {String} Truthiness of an object emptiness
 */
function ifOpeningNow (todaytimeS) {
    var matchList = todaytimeS.match(/\d{1,2}:\d{2}([ap]m)?/g);
    if (matchList) {
        var matchedLen = matchList.length;
        var openTime = [];
        var closeTime = [];
        var tempResult = [];
        for (var i = 0; i < matchedLen; i++) {
            if ((i + 2) % 2 === 0) {
                openTime.push(matchList[i]);
            } else {
                closeTime.push(matchList[i]);
            }
        }
        for (var i = 0; i < openTime.length; i++) {
            if (parseInt(closeTime[i]) < parseInt(openTime[i])) {
                var temporary = parseInt(closeTime[i]) + 24;
                var temporary = temporary + '';
                closeTime[i] = closeTime[i].replace(/^.{2}/g, temporary);
            }
            // compare current time with open/closeTime list
            var currentT = getCurrentT();
            // var currentT = 1000;
            // console.log(typeof (currentT) + 'type')
            // console.log(currentT)
            var openT = stringToNumber(openTime[i]);
            var closeT = stringToNumber(closeTime[i]);
            // console.log(openT)
            // console.log(closeT)
            if (openT <= currentT && currentT <= closeT) {
                tempResult.push('true');
            } else {
                tempResult.push('false');
            }
        }
        if (tempResult.indexOf('true') !== -1) {
            document.querySelector('#openStateIcon').setAttribute('class', 'openColor');
            document.querySelector('#openState').setAttribute('class', 'openColor');
            document.querySelector('#openState').innerText = '開放中';
        } else {
            document.querySelector('#openStateIcon').setAttribute('class', 'closeColor');
            document.querySelector('#openState').setAttribute('class', 'closeColor');
            document.querySelector('#openState').innerText = '休息';
        }
    } else {
        document.querySelector('#openStateIcon').setAttribute('class', 'closeColor');
        document.querySelector('#openState').setAttribute('class', 'closeColor')
    }
}


/**
 * Category: Card(Table)
 * To assign key-value pairs to table cell
 * @external "document.getElementById('table1')"
 * @param {String} key
 * @param {String} value
 */

function createRowColum (key, value,logoNew) {
    var dynamicTable = document.getElementById('table1');
    var newRow = dynamicTable.insertRow(-1);
    var newColKey = newRow.insertCell(-1);
    var newColValue = newRow.insertCell(-1);
    var newLogo = newRow.insertCell(-1);
    if (window.outerWidth > G['desktopWidth']) {
        dynamicTable.classList.add('swiper-no-swiping');
    }
    newColKey.innerHTML = key;
    newColValue.innerHTML = value;
    newLogo.innerHTML = logoNew
}

/**
 * Category: Card(Table)
 * To synthesize HTML code for table in Card
 * @external "jQuery"
 * @param {Object} allProperties
 */
function adaptableClass(){
   return (window.outerWidth > G['desktopWidth']) ? "class=table table-borderless table-hover swiper-no-swiping" : "class=table table-borderless table-hover";
}

function tableContent (allProperties) {
    var schoolNet = allProperties.schoolNet;
    if (schoolNet !== "/"){
        var tableTemplate = `
        <table id="table1" ${(window.outerWidth > G['desktopWidth']) ? "class='table table-borderless table-hover swiper-no-swiping'" : "class='table table-borderless table-hover'"}>
            <tbody>
                <tr>
                    <td><i class="fas fa-school"></i></td>
                    <td>${allProperties.name}</td>
                </tr>
                
                <tr>
                    <td><i class="fas fa-compass"></i></td>
                    <td>${allProperties.district}</td>
                </tr>

                <tr>
                    <td><i class="fas fa-route"></i></td>
                    <td>${allProperties.SchoolAddressChi}</td>
                </tr>

                <tr>
                    <td><i class="fas fa-info-circle"></i></td>
                    <td>類別：${allProperties.FinanceTypeChi}</td>
                </tr>

                <tr>
                    <td><i class="fas fa-tags"></i></td>
                    <td>菜式：${allProperties.qualification}</td>
                </tr>

                <tr>
                    <td><i class="far fa-bookmark"></i></td>
                    <td>${allProperties.TelephoneNumber}</td>
                </tr>

                            
            </tbody>
        </table>
        `;
    } else{
        // <td>校長收生貼士：<a id="articleLink" href=${allProperties.interviewTips}?utm_source=DatanewsMap&utm_medium=referral&utm_campaign=PrimarySchool19" target="_blank">》》 最新內容</a></td>
        var tableTemplate = `
        <table id="table1" ${(window.outerWidth > G['desktopWidth']) ? "class='table table-borderless table-hover swiper-no-swiping'" : "class='table table-borderless table-hover'"}>
            <tbody>
                <tr>
                    <td><i class="fas fa-school"></i></td>
                    <td>${allProperties.name}</td>
                </tr>
                
                <tr>
                    <td><i class="fas fa-compass"></i></td>
                    <td>${allProperties.district}</td>
                </tr>

                <tr>
                    <td><i class="fas fa-route"></i></td>
                    <td>${allProperties.SchoolAddressChi}</td>
                </tr>

                <tr>
                    <td><i class="fas fa-info-circle"></i></td>
                    <td>類別：${allProperties.FinanceTypeChi}</td>
                </tr>

                <tr>
                    <td><i class="fas fa-tags"></i></td>
                    <td>菜式：${allProperties.qualification}</td>
                </tr>

                <tr>
                    <td><i class="far fa-bookmark"></i></td>
                    <td>${allProperties.TelephoneNumber}</td>
                </tr>

                           
            </tbody>
        </table>
        `;
    }

    // document.querySelector('#collapseDiv').style.display = 'none';
    var container = document.getElementById('tableContainer');
    container.innerHTML = ``;
    container.innerHTML=tableTemplate;

}

/**
 * Category: Card(Logos)
 * Load Logos to cards
 */
function logosContent (allProperties) {
  var container = document.getElementById('logosContainer');
  container.innerHTML = `<a href="" title="123" style="width:64px; height: 64px; display: inline-block; font-size: 12px; line-height: 1; border: 1px solid black;"> <img width="64" height="64" src="" alt="${allProperties.name}" />.</a>\n `;
}

/**
 * Category: Card(Table)
 * To synchornize update date in Airtable, and show it on table in Card
 * @param string clickedId
 */
// function updateProperties(clicedId){
//     allProperties  = '';
//     for (var rowIndex in G['theUpdateJson'].records){
//         if (typeof(G['theUpdateJson'].records[rowIndex].fields.updateDate) !== 'undefined'){
//             var idUpdated = G['theUpdateJson'].records[rowIndex].fields.id;
//             console.log(idUpdated)
//             console.log(clicedId === idUpdated)
//             if (clicedId === idUpdated){
//                 allProperties = G['theUpdateJson'].records[rowIndex].fields;
//             }
//         }

//     }
//     return allProperties;
// }


/**
 * Category: Card(Cycle)
 * To enable cycle buttons
 */
// function enableBtn () {
//     document.querySelector('#nextBtn').classList.add('short');
//     document.querySelector('#wholeCard').classList.remove('init-box');
//     $('#nextBtn').prop('disabled', false)
//         .removeClass('card_control_disable')
//         .addClass('card_control');

//     $('#prevBtn').prop('disabled', false)
//         .removeClass('card_control_disable')
//         .addClass('card_control');

//     isActivate = 'yes';
// }


/**
 * Category: Card(Cycle)
 * To enable cycle buttons
 */
function disableBtn () {
    // $('#nextBtn').prop('disabled', true)
    //     .removeClass('card_control')
    //     .addClass('card_control_disable');

    // $('#prevBtn').prop('disabled', true)
    //     .removeClass('card_control')
    //     .addClass('card_control_disable');

    isActivate = 'no';
}


/**
 * Category: Card(Cycle)
 * To update Card table and then update map view when new sub-district is selected
 * @param {Array} indexesoftheDistrict: indexes of marker items belongs to this sub-district
 */
// function refreshTable (indexesoftheDistrict) {
//     var defaultIndex = indexesoftheDistrict[0];
//     var allfeatures = propertiesObjectList[defaultIndex];
//     var hospitalCoordinate = geometryObjectList[defaultIndex].coordinates;

//     tableContent(allfeatures);
//     updateView(hospitalCoordinate);
// }


/**
 * Category: Card(Cycle)
 * To update map view
 * @param {Array} hospitalCoord
 * inate
 */
function updateView (hospitalCoordinate) {
    var nextCenterS = JSON.stringify(hospitalCoordinate);
    var pure0 = nextCenterS.replace('[', '');
    var pure1 = pure0.replace(']', '');
    var latLngList = pure1.split(',');

    var lng = parseFloat(latLngList[0]);
    var lat = parseFloat(latLngList[1]);
    var bounds = G['mymap'].getBounds();
    var lat_bounds = bounds._northEast.lat - bounds._southWest.lat;
    var lng_bounds = bounds._northEast.lng - bounds._southWest.lng;
    // if (window.outerWidth > G['desktopWidth']) {
    //     G['mymap'].setView([lat, lng - lng_bounds * 0.1]); // desktop
    // } else {
    //     G['mymap'].setView([lat - lat_bounds * 0.3, lng]); // mobile
    // }
    if (window.outerWidth > G['desktopWidth']) {
        // G['mymap'].panTo([center[1], center[0] - lng_bounds * 0.1]); // desktop
        G['mymap'].panTo([center[1] - lat_bounds * 0.3, center[0] - lng_bounds * 0.3]); // desktop
        //console.log("desktop panTo")
    } else {
        G['mymap'].panTo([center[1] - lat_bounds * 0.3, center[0]]); // mobile
    }
}


/**
 * Category: Card(Filter)
 * To build one marker item
 * @param {Object} inObj: one geojson feature
 */
function addOneToSidebar (inObj) {
    var props = inObj.properties;
    // var theId = `<p class="listings-id"><small class="text-muted">${props.id}</small></p>`;
    var name = !props['name'] ? '' : props['name'].split(',').filter(function (o) {
        return o.length;
    }).map(function (o) {
        return (o.length) ? `${o}` : '';
    }).join('、');
    var district = !props['district'] ? '' : props['district'].split(',').reduce(function (a, b) {
        return ((a.length === 0) ? b : a);
    });
    var region = (function (d) {
        if (d in island) return 'island';
        if (d in kowloon) return 'kowloon';
        if (d in newTerritories) return 'newTerritories';
    }(district));

    G['sidebar'] = sidebarField.map(f => {
        return !props[f.varName] ? '' : props[f.varName].split(',').map(function (o) {
            return ((o.length) ? `<p class="${f.wrapClass}"><span class="${f.itemClass}">${o}</span></p>` : '');
        }).join('');
    });

    // var addtionalFields = `
    //     ${G['sidebar'].map(o => { return o; })}
    //     ${theId}
    // `;
    var addtionalFields = `
        ${G['sidebar'].map(o => { return o; })}
    `;
    var template = `<li class="listings-item" id="listing-${props.id}">
        <div class="listings-title" id="#/id/${props.id}">
            <p class="listings-region color-${region}"><small class="text-muted">${district}</small></p>
            <p class="listings-name">${name}</p>
            ${addtionalFields}
        </div>
    </li>`;
    // var template = `<li class="listings-item" id="listing-${props.id}">
    //     <a class="listings-title" href="#/id/${props.id}">
    //         <p class="listings-region color-${region}"><small class="text-muted">${district}</small></p>
    //         <p class="listings-name">${name}</p>
    //         ${addtionalFields}
    //     </a>
    // </li>`;
    return template;
}


/**
 * Category: Card(Filter)
 * To synthesize a list of marker items
 * @param {Array} inObj: one geojson feature
 */
function addItemsToList (arr) {
    var sideBarEl = document.getElementById('listings');
    var newHtml = '';

    while (sideBarEl.firstChild) {
        sideBarEl.removeChild(sideBarEl.firstChild);
    }
    arr.map(o => {
        newHtml += addOneToSidebar(o);
    });
    sideBarEl.innerHTML = newHtml;
}


/**
 * Category: Card(Filter)
 * To build dropdown for filtering
 * @param {String} id: id of dropdown
 * @param {String} name: the norminal dropdown name
 * @param {Object} items: the options of dropdown
 */
// function buildFilters (cont, id, name, items) {
//     var itemsKeys = Object.keys(items);
//     // var $selectEl = $(`<select class="aDropdownList" data-filter="${id}"></select>`);
//     // $selectEl.append($(`<option class="dropdown-item" value="不限" disabled selected>${name}</option>`));

//     // if (itemsKeys.length) {
//     //     itemsKeys.map(function (o) {
//     //         $selectEl.append($(`<option class="dropdown-item" value="${o}">${o}</option>`));
//     //     });
//     // }

//     // $(cont).append($selectEl);
// }
function buildFilters (cont, id, name, items) {
    var itemsKeys = Object.keys(items);
    var htmlToEl = function (astring) {
        var el = document.createElement('div');
        el.innerHTML = astring;

        return el.querySelector('*');
    };
    var $selectEl = htmlToEl(`<select class="aDropdownList" data-filter="${id}"></select>`);
    // if (itemsKeys.length > 1) {
    // $selectEl.appendChild(htmlToEl(`<option class="dropdown-item" value="不限" disabled selected>${name}</option>`));
    if (name == "不限校網"){
        $selectEl.appendChild(htmlToEl(`<option class="dropdown-item" value="不限"  selected>${name}</option>`));
    } else{
        $selectEl.appendChild(htmlToEl(`<option class="dropdown-item" value="不限" disabled selected>${name}</option>`));
    }

    // }

    if (itemsKeys.length) {
        itemsKeys.map(function (o) {
            if (name === '不限校網'){
                if (o != '其他'){
                    valueId = o.split(" ")[0]
                    $selectEl.appendChild(htmlToEl(`<option class="dropdown-item" value="${valueId}">${o}</option>`));
                } else {
                    $selectEl.appendChild(htmlToEl(`<option class="dropdown-item" value="/">${o}</option>`));
                }
            } else {
                $selectEl.appendChild(htmlToEl(`<option class="dropdown-item" value="${o}">${o}</option>`));
            }
        });
    }
    

    document.querySelector(cont).appendChild($selectEl);
}

/**
 * Category: Marker
 * To reposition map to the marker
 * @param {Array} hitMarker: the feature of an marker
 */
function positionMarkerZoom (hitMarker) {
    var center = hitMarker[0].geometry.coordinates;

    // Show Details
    var allProperties = hitMarker[0].properties;
    // var clicedId = (allProperties.id).toString();
    // newData = updateProperties(clicedId);
    // if (newData !== ''){
    //     tableContent(newData);
    // } else{
    //     tableContent(allProperties)
    // }
    tableContent(allProperties);
    logosContent(allProperties);
    G['gSwiper'].slideTo((hitMarker.length > 1 ? 0 : 1), G['gSwiperDuration'], false);

    // Pan and Zoom
    // G['mymap'].setZoom(18);
    document.querySelector('#wholeCard').classList.remove('short');

    // mobile reposition
    setTimeout(function () {
        var bounds = G['mymap'].getBounds();
        var lat_bounds = bounds._northEast.lat - bounds._southWest.lat;
        var lng_bounds = bounds._northEast.lng - bounds._southWest.lng;
        if (window.outerWidth > G['desktopWidth']) {
            // G['mymap'].panTo([center[1], center[0] - lng_bounds * 0.1]); // desktop
            G['mymap'].panTo([center[1] - lat_bounds * 0.3, center[0] - lng_bounds * 0.3]); // desktop
            //console.log("desktop panTo")
        } else {
            G['mymap'].panTo([center[1] - lat_bounds * 0.3, center[0]]); // mobile
        }
    }, 400);
}


/**
 * Category: Marker
 * To synthesize a list of marker items
 * @param {Array} inObj: one geojson feature
 */
function processHash (hash) {
    // var id = hash.replace('#', '');
    //console.log('see the hash')
    // console.log(hash)
    var idRegexp = /id\/(.+)&?/g;
    //console.log(idRegexp)
    var match = idRegexp.exec(hash);
    if (match !== null){
        var id = match[1];
        //console.log('hash', hash, 'id:', id);
    
        var hitMarker = G['theMapGeoJson'].features.filter(function (o) {
            return (o.properties.id.toString()) ?
                o.properties.id.toString() === id:
                false
        });
    
        if (hitMarker.length) {
            positionMarkerZoom(hitMarker);
        }
    }
}


/**
 * Category: filter
 * To check feature matches criteria
 * @param {Array} o: one geojson feature
 */
function matchedCrtiteria (o) {
    var smallFilter = function (inObj, x) {
        var varName = inObj.varName;
        var initVal = inObj.initVal;
        var geojsonFieldName = inObj.geojsonFieldName;

        
        
        return ((G[varName] === initVal) ?
            true :
            (x.properties[geojsonFieldName]) ?
            x.properties[geojsonFieldName].indexOf(G[varName]) !== -1:
            ((x.properties[geojsonFieldName] === "") ? false : true)
        );
    }

    var isMatch = matchField.reduce((a, b) => {
        if (b.varName === 'StudentGenderChi') {
            return a && ((G[b.varName] === b.initVal) ?
            true :
            (o.properties[b.geojsonFieldName]) ?
            o.properties[b.geojsonFieldName] === G[b.varName] :
            true
        )
        } else if(b.varName === 'FinanceTypeChi'){
            // console.log(G[b.varName])
            switch(G[b.varName]){
                case "不限":
                    return a && true;
                case "酒店":
                    return a && ( (o.properties[b.geojsonFieldName]) ?
                    o.properties[b.geojsonFieldName] === G[b.varName] :
                    true);
                case "FineDining":
                    return a && ( (o.properties[b.geojsonFieldName]) ?
                    o.properties[b.geojsonFieldName] === G[b.varName] :
                    true);
                //case "私立及直資":
                   // if (((o.properties[b.geojsonFieldName]).indexOf("私立") !== -1)||((o.properties[b.geojsonFieldName]).indexOf("計劃") !== -1)){
                    //    return a && true;
                    //}else{
                       // return a && false;
                   // }                 
            }
        }else {
            return (a && smallFilter(b, o))
        }
    }, true);
    /** 
     * parameters used for the search bar
    */
    
    var matched = isMatch &&
        ((G['keyword'] === '') ? true : (
            (o.properties['name'].indexOf(G['keyword']) !== -1) 
            // (o.properties['TelephoneNumber'].indexOf(G['keyword']) !== -1) ||
            // (fax.indexOf(G['keyword']) !== -1) ||
            // (o.properties['SchoolAddressChi'].indexOf(G['keyword']) !== -1) ||
            // (o.properties['FinanceTypeChi'].indexOf(G['keyword']) !== -1) ||
            // (o.properties['StudentGenderChi'].indexOf(G['keyword']) !== -1) ||
            // (o.properties['schoolNet'].indexOf(G['keyword']) !== -1) 
        ));
    // console.log("uuuuuu",matched)
    return matched;
}


/**
 * Category: Load data
 * To load data from GeoJSON
 * @param {Function} cb: callback
 * @param {Function} filterFunc: filtering function
 */

function loadGeoJSON (cb, filterFunc) {
    forHeatMap = [];
    var dotsCollect = G['theMapGeoJson'].features
    // var dotsCollect = G['theMapGeoJson'].features
    // dotsCollect.forEach(function (dot){
    //     var everyHeatDot = {}

    //     var dotCoordinates = dot.geometry.coordinates;
    //     everyHeatDot['lat'] = dotCoordinates[1];
    //     everyHeatDot['lng'] = dotCoordinates[0];
    //     // console.log(dotCoordinates)
    //     everyHeatDot['count'] = dot.properties.count;
    //     forHeatMap.push(everyHeatDot)
    // })


    var overlayMapsList = {};
    Object.keys(overlayMapsListControl).map(o => {
        overlayMapsList[o] = [];
    });

    G['markers'] = L.geoJSON(G['theMapGeoJson'], {
        onEachFeature: function (feature, layer) {
            if (!G['useCluster']) {
                layer.on({
                    click: function (e) {
                        markerClickHandler(e);
                    }
                })
            }
        },
        pointToLayer: function (feature, latlng) {
            let options = {};
            var mm = {};
            // everyHeatDot = {}
            function addAPoint (layer, latlng, options) {
                // var dotCoordinates = feature.geometry.coordinates;

                mm = L.marker(latlng, options).on('click', function (e) {
                    //console.log(`mmm`)
                    // if (isActivate !== 'yes') {
                    // enableBtn();
                    // }
                    var allProperties = feature.properties;
                    // console.log(allProperties)
                    // var clicedId = (allProperties.id).toString();
                    // newData = updateProperties(clicedId);
                    // if (newData !== ''){
                    //     tableContent(newData);
                    // } else{
                    //     tableContent(allProperties)
                    // }
                    // rewrite G['currIndex']
                    G['currIndex'] = allProperties['id'];
                    tableContent(allProperties)
                    document.querySelector('#wholeCard').classList.remove('short');
                    if (Object.keys(G['gSwiper']).length) {
                        //console.log('gSwiper');
                        G['gSwiper'].slideTo(1, G['gSwiperDuration'], false);
                    }

                    //offset the center
                    bounds = G['mymap'].getBounds();
                    var center = feature.geometry.coordinates;
                    var lat_bounds = bounds._northEast.lat - bounds._southWest.lat;
                    var lng_bounds = bounds._northEast.lng - bounds._southWest.lng;

                    if (window.outerWidth > G['desktopWidth']) {
                        // G['mymap'].panTo([center[1], center[0] - lng_bounds * 0.1]); // desktop
                        G['mymap'].panTo([center[1] - lat_bounds * 0.3, center[0] - lng_bounds * 0.3]); // desktop
                        //console.log("desktop panTo")
                    } else {
                        G['mymap'].panTo([center[1] - lat_bounds * 0.26, center[0]]); // mobile
                    }
                    //change two district buttons
                    var areaValue = allProperties.district || allProperties.地區;
                    var markerArea = formatArea(areaValue);

                    document.querySelector('#wholeCard').classList.remove('init-box');
                    // }, '', `#/id/${allProperties['id']}&utm_source=${G['entrySource']}`);

                    window.history.pushState({
                        'id': allProperties['id']
                    }, '', `#/id/${allProperties['id']}`);

                    //fireArticlePV(removehash(window.location.href));
                    fireMapPV(removehash(window.location.href))
                    /console.log('wow')
                    /*fireEvent(`${G['trackingCate']}`, 'click_marker', {
                        'school_id':allProperties['id'],
                        'school_name': allProperties['name'],
                        'school_lat': e.latlng.lat,
                        'school_lng': e.latlng.lng,
                        'school_district': allProperties['district'],
                        'anonymous_id': getAnonymousId(),
                        'session_id': getSessionId(),
                        'ts': Date.now()
                    });*/
                });
                overlayMapsList[layer].push(mm);
            }

            // IconBuild
            if (feature['properties']['layer']) {
                var layerName = feature['properties']['layer'];
                var iconbuilderObj = iconBuild[layerName];
                var typeName = iconbuilderObj['type'];
                var iconType = L.Icon.extend(iconFactory[typeName]['options']);
                // options.icon = new iconType(iconBuild[layerName]['options']);
                //if (feature['properties']['schoolNet']!= '/'){
                if (feature['properties']['FinanceTypeChi'] == 'FineDining'){
                    options.icon = new iconType({"iconUrl":"icon/fd.png"});
                } else{
                    options.icon = new iconType({"iconUrl":"icon/nonNet.png"});
                }
                addAPoint(feature['properties']['layer'], latlng, options);
            }
            // var m = L.marker(latlng);
            // forHeatMap.push(everyHeatDot)
            G['matched_result']++;
            if (G['markerClusters']) {
                if (G['useLayer']) {
                    // cluster and layer
                } else {
                    G['markerClusters'].addLayer(mm);
                }
            } else {
                // use normal
                return L.marker(latlng, options);
            }
        },
        filter: function (feature) {
            var matched = matchedCrtiteria(feature);

            return matched && ((filterFunc) ? filterFunc(feature) : true);
        }
    });
    // Add Map Layers
    var theBaseMaps = {};
    var theOverlayMaps = {};
    var overlayMaps = {};
    Object.keys(overlayMapsListControl).map(o => {
        overlayMaps[o] = L.layerGroup(overlayMapsList[o]);

        if (G['useLayer'] && overlayMapsListControl[o]['initOn']) {
            G['mymap'].addLayer(overlayMaps[o]);
        }
        if (overlayMapsListControl[o]['type'] === 'base') {
            theBaseMaps[o] = overlayMaps[o];
        }
        if (overlayMapsListControl[o]['type'] === 'overlay') {
            theOverlayMaps[o] = overlayMaps[o];
        }
    });
    if (G['useCluster']) {
        if (G['useLayer']) {
            // cluster and layer
            Object.keys(overlayMapsListControl).map(o => {
                //console.log(`dfvklb dhiuejwnfdkvb`, o)
                G['markerClusters'].checkIn(overlayMaps[o]);
                overlayMaps[o].addTo(G['mymap']);
            });
        } else {
            overlayMaps = {}
        }
    } else {
        // use normal
    }
    //console.log(`overlayMaps`, overlayMaps);
    // heat map
    // if(G['useHeatMap']){
    //     // var hh = forHeatMap.slice(1,10)
    //     heatMapData = {data: forHeatMap}
    //     console.log(heatMapData)
    //     var heatmapLayer = new HeatmapOverlay(G['heatMapCfg']);
    //     heatmapLayer.setData(heatMapData);
    //     G['mymap'].addLayer(heatmapLayer);
        
    //     if (overlayMapsListControl['heatMap']['type'] === 'base') {
    //         theBaseMaps['heatMap'] = heatmapLayer
    //     }
    //     if (overlayMapsListControl['heatMap']['type'] === 'overlay') {
    //         theOverlayMaps['heatMap'] = heatmapLayer
    //     }
    // }
    if (G['useLayer']) {
        // Add control layer
        L.control.layers(theBaseMaps, theOverlayMaps, {
            collapsed: false,
            position: 'topright'
        }).addTo(G['mymap']);
    }

    if (G['markerClusters']) {
        G['mymap'].addLayer(G['markerClusters']);
    } else {
        // use normal
        G['mymap'].addLayer(G['markers']);
    }
    //console.log('m: ', G['matched_result']);

    // console.log('heatMapData', forHeatMap)

    if (cb) {
        cb(G['matched_result']);
    }
}

/**
 * Category: Load data
 * To assign filtered result to sidebar
 */
function loadAndSidebar (reset) {   
    loadGeoJSON(function (matchedResult) {
        document.querySelector('#wholeCard').classList.remove('short');
        if (Object.keys(G['gSwiper']).length) {
            G['gSwiper'].slideTo(0, G['gSwiperDuration'], false);
        }
        var arrF = G['theMapGeoJson'].features.filter(matchedCrtiteria);
        //console.log('中', arrF.length)
        if (arrF.length){
            // if only one schoool match
            // diable the cycle arrow
            // directly to go slide to 
            if (arrF.length === 1) {
                // directly show this school's detail
                G['gSwiper'].slideTo(1, G['gSwiperDuration'], false);
                // if cycle arrow still function, remove class property from an element

                if (document.querySelector('#prevBtn').classList.contains("card_control")){
                    document.querySelector('#prevBtn').classList.replace("card_control", "card_control_disable");
                    document.querySelector('#nextBtn').classList.replace("card_control", "card_control_disable");
                    document.querySelector('#nextBtn').setAttribute('disabled', true);
                    document.querySelector('#prevBtn').setAttribute('disabled', true);
                }
            } else if (!(document.querySelector('#prevBtn').classList.contains("card_control"))){
                document.querySelector('#prevBtn').classList.replace("card_control_disable", "card_control")
                document.querySelector('#nextBtn').classList.replace("card_control_disable", "card_control") 
                document.querySelector('#nextBtn').setAttribute('disabled', false);
                document.querySelector('#prevBtn').setAttribute('disabled', false); 
            }
            // cycleMatched(arrF)
            G['matchedResult'] = arrF;
            //console.log(G['matchedResult'])
            G['currIndex'] = arrF[0].properties.id;
            // shot the detail of first item to table content
            tableContent(arrF[0].properties)
        } else if (document.querySelector('#prevBtn').classList.contains("card_control")){
            document.querySelector('#prevBtn').classList.replace("card_control", "card_control_disable");
            document.querySelector('#nextBtn').classList.replace("card_control", "card_control_disable");
            document.querySelector('#nextBtn').setAttribute('disabled', true);
            document.querySelector('#prevBtn').setAttribute('disabled', true);

            var container = document.getElementById('tableContainer');
            container.innerHTML = `<font color="#B7B2B2">未有搜尋結果`
                                   +`，請檢查搜索字眼</font>`;
            G['gSwiper'].slideTo(1, G['gSwiperDuration'], false);

        } else {
            document.querySelector('#prevBtn').classList.replace("card_control", "card_control_disable");
            document.querySelector('#nextBtn').classList.replace("card_control", "card_control_disable");
            document.querySelector('#nextBtn').setAttribute('disabled', true);
            document.querySelector('#prevBtn').setAttribute('disabled', true);
            var container = document.getElementById('tableContainer');
            container.innerHTML = `<font color="#B7B2B2">未有搜尋結果`
                                    +`，請檢查搜索字眼</font>`;
            G['gSwiper'].slideTo(1, G['gSwiperDuration'], false);
                       
        }

        if (reset) {
            // clean the table content
            var container = document.getElementById('tableContainer');
            G['currIndex'] = -1;
            container.innerHTML = `随隨便睇睇？<br>&nbsp;&nbsp;&nbsp;點擊<b>右上角< >圖標</b>，開始揀餐廳啦。`;
            // G['gSwiper'].slideTo(1, G['gSwiperDuration'], false);

            // clean the item list
            document.querySelectorAll('#listings > li').forEach(o => {
                o.remove();
            });
        } else {
            addItemsToList(arrF);
        }
    });
}
