//some comment to make code diff
function changeView(value) {
    current_view = value;
    if (current_reloader != null)
        clearTimeout(current_reloader);
    makePOSTRequestGeneral('/SNMP3/snmpmap.php', loadContents, 'function=getall&view=' + value);
}
function dimEQValue(inpname) {
    if ($('#' + inpname + '_gt').val() == $('#' + inpname + '_lt').val()) {
        //$('#' + inpname + '_gt').css({'backgroundColor': '#ddd', 'color': '#777'});
        //$('#' + inpname + '_lt').css({'backgroundColor': '#ddd', 'color': '#777'});

    } else {
        //$('#' + inpname + '_gt').css({'backgroundColor': '#fff', 'color': '#000'});
        //$('#' + inpname + '_lt').css({'backgroundColor': '#fff', 'color': '#000'});
    }
}
function divPos(divname, x, y) {
    var div = $('#' + divname);
    if (x < 0) {
        x = $(document).width() + x - parseInt(div.css("width"));
        div.css("left", x + "px")
    } else {
        div.css("left", x + "px")
    }
    if (y < 0) {
        y = $(document).height() + y - parseInt(div.css("height"));
        div.css("top", y + "px")
    } else {
        div.css("top", y + "px")
    }
}
function appendColhist() {
    var display_value = 'none';
    if ($("#gradient").prop('selectedIndex') <= 0) {
        $('#histcol').html('');
        var cnt = 0;
        for (var i in tbs) {
            if ($('#' + tbs[i]["id"] + '_lt').val() != "" || $('#' + tbs[i]["id"] + '_gt').val() != "") {
                icon = parseInt(tbs[i]["icon"]) + 1;
                name = tbs[i]["name"];
                html_content = $('#histcol').html();
                html_content += '<div style="padding-left:4px;padding-top:4px;padding-right:0px;padding-bottom:0px;"><img style="float:left;margin-right:5px;" src="/img//dots/a' + icon + '.png"><div style="padding-top:2px;">' + name + '</div></div><br>';
                $('#histcol').html(html_content);
                cnt++;
            }
        }
        if (cnt > 0) {
            display_value = 'block';
        }
    }
    $('#histcol').css('display', display_value);
    $('#histcoltrans').css('display', display_value);

}
function appendGradient() {

    var grad = $('#gradient').val();
    if ($("#gradient").prop('selectedIndex') <= 0) {
        $('#gradhist').hide()
        //$('gradhisttrans').hide();
    } else {
        var name = $("#gradient").val();
        $("#svggrad").attr("src", "/SNMP3/test1.php?name=" + name);
        $('#gradhist').show();
        //$('#gradhisttrans').show();
        alignGradient();

    }
}

function   getDatePicker(){    
    var date = $("#date").val();
    var time = $("#time").val();
    var dateobj=new Date(date + " " + time);

    if(!isNaN(dateobj)){

     var day= dateobj.getDate()  ;
     var month=dateobj.getMonth();
        month++;
       month=("0" + month).slice(-2);                
     var year=dateobj.getFullYear();
     var hours=dateobj.getHours();
     hours = ("0" + hours).slice(-2);        
     var minutes=dateobj.getMinutes();
     minutes = ("0" + minutes).slice(-2);                
        console.log(year+"/"+month +"/"+day+" "+ hours+":"+minutes);           
	return year+"/"+month +"/"+day+" "+ hours+":"+minutes;
        //console.log(new Date(date + " " + time, 'dd/M/yy'));        
    }
    else{
	return "";
    }
}

function appendClock() {
}
function initialize_timemout(func, tm_val) {
    if (timerhandler != null)
        clearTimeout(timerhandler);
    timerhandler = setTimeout(func, tm_val);
}
function getParamString(argarray) {
    var function_name = argarray['function'];
    var view = argarray['view'];
    var referer_view = null;
    if (argarray['referer_view'])
        referer_view = argarray['referer_view'];

    var reqArray = [];
    reqArray.push({"function": function_name});
    timerhandler = null;
    $.each(tbs, function(i, tb) {
        var o = new Object;
        o[tb["id"] + '_lt'] = $('#' + tb["id"] + '_lt').val();
        reqArray.push(o);
        o = new Object;
        o[tb["id"] + '_gt'] = $('#' + tb["id"] + '_gt').val();
        reqArray.push(o);
    });
    reqArray.push({chn: $('#chn').val()});
    reqArray.push({gradient: $('#gradient').val()});
    reqArray.push({status: $('#status').val()});
    //alert($('#date').val()+ " " + $('#time').val());	
    pastdatetime=getDatePicker();
    reqArray.push({pastdatetime: pastdatetime});
    var usifs = '';
    var usifselect = $('#usif');
    /*if ($("#usif option:selected").length>0) {
        for (var x = 0; x < usifselect.options.length; x++)
            if (usifselect.options[x].selected)
                usifs += (',' + usifselect.options[x].value);
    }*/
    var comma=""; 	
    $("#usif option:selected").each(function() {
                usifs += (comma + $(this).val());
		comma=",";
    });

    /*var values = $.map($('#usif option'), function(ele) {
        if (ele.prop('selected')) {
            usifs += (',' + ele.val());
        }
    });*/


    if (usifs != '')
        reqArray.push({usifs: usifs});
    if (current_action != 'update' && !iad) {
        reqArray.push({bGeneral: true});
    }
    if (iad) {
        reqArray.push({iad: true});
    }
    current_view = view;
    reqArray.push({view: current_view});
    if (current_reloader != null) {
        clearTimeout(current_reloader);
    }
    if (referer_view != "") {
        reqArray.push({referer_view: referer_view});
    }
    var parameter_string = ""
    var join = "";
    $.each(reqArray, function(index, obj) {
        for (var key in obj) {
            retString = key + "=" + obj[key].toString();
            parameter_string += join + retString.toString();
            join = '&';
        }
    });
    return parameter_string;
}

function pulsatePanther() {
    var pl = $('#pantherlogo');
    if (pl.css('opacity') <= 0.6)
        prate = 0.005;
    if (pl.css('opacity') >= 0.8)
        prate = -0.005;
    popacity += prate;
    pl.css('opacity', popacity);
    setTimeout('pulsatePanther();', 50);
}
function alignGradient() {
//    var left = 400;
    var width=$( window ).width();
    var left=width-100;
    $("#gradhist").css("top", "100px");
    $("#gradhist").css("left", left+"px");

}
function showDetails(data) {
    result = data;
    var details = eval('(' + result + ')');
    infoWindow.setContent('<font face=verdana size=1>' + details + '</font>');
    infoWindow.open(map, currentmarker);
}


function postChanges2(){
    appendColhist();
    appendGradient();
    if(timerhandler!=null)
        clearTimeout(timerhandler);
    timerhandler = setTimeout('doPostChanges2();', 1000);
}


function doPostChanges2() {
    init_gmap();
    var paramArray = [];
    paramArray['function'] = "getall";
    paramArray['view'] = "filter";

    if (referer_view != "") {
        paramArray["referer_view"] = referer_view;
    }
    $.ajax({
        url: callUrl,
        data: getParamString(paramArray),
        type: "POST",
        success: function(data) {
            console.log("doPostChanges2 sucess");
            mapdata = eval('(' + data + ')');
            if (markers != null)
                for (var i = 0; i < markers.length; i++)
                    markers[i].setMap(null);
            markers = Array();

            var iimage = new Array();
            selectedIndex = $("#gradient").prop('selectedIndex');
            var circle_color = "";
            for (i = 0; i < mapdata.length; i++) {
                if (selectedIndex > 0) {
                    circle_color = mapdata[i][3];
                }
                else {
                    circle_color = "#7CFC00";
                }
                var latlng = new google.maps.LatLng(mapdata[i][1], mapdata[i][2]);

                if (!donecentering && i === 0) {
                    map.panTo(latlng);
                    var step = 100;
                    for (var x = 1; x < 8; x++) {
                        setTimeout('map.setZoom(' + (7 + x) + ');', step * x);
                    }

                }
                donecentering = true;
            }
            current_reloader = setTimeout('xreloadMap()', 1000);
        }/*,
         error: function(xhr, textStatus, errorThrown) {
         console.log( textStatus);
         }*/
    });

    //makePOSTRequestGeneral(callUrl, loadContents, 'function=getall&view=' + current_view + tail);
}

function loadContents(data) {
    if($(".of-contentstation div.of-content:visible")>0){
        alert("open");
    }    
    result = data;
    //alert(result);
    mapdata = eval('(' + result + ')');
    if (markers != null)
        for (var i = 0; i < markers.length; i++)
            markers[i].setMap(null);
    markers = Array();

    var iimage = new Array();
    selectedIndex = $("#gradient").prop('selectedIndex');
    for (i = 0; i < mapdata.length; i++) {
        if (selectedIndex > 0) {
            circle_color = mapdata[i][3];
        }
        else {
            circle_color = "#7CFC00";
        }
        var latlng = new google.maps.LatLng(mapdata[i][1], mapdata[i][2]);
        if (!donecentering && i == 0) {
            map.panTo(latlng);
            var step = 200;
            for (var x = 1; x < 8; x++) {
                setTimeout('map.setZoom(' + (7 + x) + ');', step * x);
                console.log("zooming");
            }

        }
        donecentering = true;
        if (circle_color == "lightblue") {
            circle_color = "#add8e6";
        }
        if (circle_color == "lightgreen") {
            circle_color = "#98ff98";
        }
        if (circle_color == "orange") {
            circle_color = "#ff8040";
            console.log(circle_color);
        }


        icon = new google.maps.MarkerImage('/img/dots/a' + (i + 1) + '.png');
        var marker = new google.maps.Marker({
            position: latlng,
            flat: true,
            title: '' + mapdata[i][0],
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                fillColor: circle_color,
                fillOpacity: 1,
                strokeColor: 'black',
                strokeOpacity: 1,
                strokeWeight: 1,
                scale: 10
            },
            /*icon:icon,*/
            map: map
        });



        txt = mapdata[i][0];
        markers[i] = marker;
        google.maps.event.addListener(marker, "click", new Function("openInfoWindow(" + i + ");"));



    }
    current_reloader = setTimeout('xreloadMap()', 60000);
}
function xreloadMap() {
    var paramArray = [];
    paramArray['function'] = "getall";
    paramArray['view'] = "filter";
    if (referer_view != "") {
        paramArray["referer_view"] = referer_view;
    }
    $.ajax({
        url: callUrl,
        data: getParamString(paramArray),
        type: "POST",
        success: function(data) {
            console.log("xreloadMap success");
            loadContents(data);
        }

    });



}
var infoWindow;
function openInfoWindow(i) {
    var marker = markers[i];
    var md = mapdata[i];
    if (typeof infoWindow == "undefined") {
        infoWindow = new google.maps.InfoWindow();
    }
    //infoWindow.setContent('Henter...');
    currentmarker = marker;
    $.ajax({
        url: '/SNMP3/snmpmap.php',
        data: {"function": "getdetails", switchport: mapdata[i][4]},
        type: "POST",
        success: function(data) {
            showDetails(data);
        }
    });
}
function closeInfoWindow() {
    if (infoWindow) {
        infoWindow.close();
    }

}

function init_gmap() {
    var myLatlng = new google.maps.LatLng(latitudedegree, longitudedegree);
    var myOptions = {
        zoom: 5,
        center: myLatlng,
        mapTypeId: google.maps.MapTypeId.HYBRID
    }
    if (typeof map === "undefined") {
        map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
        google.maps.event.addListener(map, 'click', closeInfoWindow);
    }

}

function saveFilters(name) {
    var filters = Object();
    for (var i in tbs) {
        filters[tbs[i]["id"] + '_lt'] = $("#" + tbs[i]["id"] + '_lt').val();
        filters[tbs[i]["id"] + '_gt'] = $("#" + tbs[i]["id"] + '_gt').val();
    }
    filters['chn'] = $('#chn').val();
    filters['gradient'] = $("#gradient").val();
    filters['status'] = $("#status").val();
    var usifs = '';
    var usifselect = $("#usif");
    if (usifselect.selectedIndex > 0) {
        for (var x = 0; x < usifselect.options.length; x++)
            if (usifselect.options[x].selected)
                usifs += (',' + usifselect.options[x].value);
    }
    filters['usifs'] = usifs;
    //postSaveFilter(name, filters);
    //makePOSTRequestGeneral('/SNMP2/snmpmap.php', saveFilter, 'function=savefilter&name='+name+'&filter='+JSON.stringify(filter));    


    $.ajax({
        url: '/SNMP2/snmpmap.php',
        data: {"function": "savefilter", "name": name, "filter": JSON.stringify(filters)},
        type: "POST",
        success: function(data) {

            $.ajax({
                url: '/SNMP2/snmpmap.php',
                data: {"function": "getfilters"},
                type: "POST",
                success: function(data) {
                    getFilters(data);
                }
            });
        }
    });
}
function getFilters(data) {
    filterprofilelist = eval('(' + data + ')');
    var html = '';
    var oe = 0;
    for (var n in filterprofilelist) {
	html += '<span class=grid_2>';
        html += '<button onClick="retrieveFilter(\'' + n + '\'); return false;">' + n + '</button>';
	html += '</span>';
        if (oe == 1)
            //html += '<br>';
        if (oe == 0)
            oe = 1;
        else
            oe = 0;
    }
    $('#filterholder').innerHTML = html;
    if (!iad && init_phase && referer_view == "snmpmap") {
        init_phase = false;
        retrieveFilter('Default');
    }
    //alignPanels();

}

function retrieveFilter(name) {
    var filters = filterprofilelist[name];
    if (!filters) {
        postChanges2();
        return;
    }
    for (var i in tbs) {
        document.getElementById(tbs[i]["id"] + '_lt').value = filters[tbs[i]["id"] + '_lt'];
        document.getElementById(tbs[i]["id"] + '_gt').value = filters[tbs[i]["id"] + '_gt'];
        dimEQValue(tbs[i]["id"]);
    }
    for (var i = 0; i < document.getElementById('chn').options.length; i++)
        if (document.getElementById('chn').options[i].value == filters['chn'])
            document.getElementById('chn').options[i].selected = true;

    for (var i = 0; i < document.getElementById('gradient').options.length; i++)
        if (document.getElementById('gradient').options[i].value == filters['gradient'])
            document.getElementById('gradient').options[i].selected = true;

    for (var i = 0; i < document.getElementById('status').options.length; i++)
        if (document.getElementById('status').options[i].value == filters['status'])
            document.getElementById('status').options[i].selected = true;
    var iflist = filters['usifs'].trimcomma().split(',');

    for (var i = 0; i < document.getElementById('usif').options.length; i++)
        document.getElementById('usif').options[i].selected = false;

    for (a = 0; a < iflist.length; a++)
        for (var i = 0; i < document.getElementById('usif').options.length; i++)
            if (document.getElementById('usif').options[i].value == iflist[a])
                document.getElementById('usif').options[i].selected = true;
            postChanges2();
}

function resetAllFilters(){
    document.getElementById('status').selectedIndex = 0;
    document.getElementById('gradient').selectedIndex = 0;
    document.getElementById('chn').selectedIndex = 0;
    document.getElementById('usif').selectedIndex = 0;
    for(var i in tbs){
        document.getElementById(tbs[i]["id"]+'_gt').value = '';
        document.getElementById(tbs[i]["id"]+'_lt').value = '';
        dimEQValue(tbs[i]['id']);
    }
    //return false;
}
var openfooterflag;
$(function() {
    $("#time").val("00:00"); 	
    $('.openfooter').openfooter({
        barBg: 'solid-black'
    });
    openfooter=false;
    $(document)
            .ajaxStart(function() {
                jQuery("#ajaxSpinnerImage").css({
                    "position": "absolute",
                    //"z-index":100,    
                    "top": $("#map_canvas").offset().top + $("#map_canvas").height() / 2 + "px",
                    "left": $("#map_canvas").offset().left + $("#map_canvas").width() / 2 + "px"
                });

                $("#ajaxSpinnerImage").show();
            })
            .ajaxStop(function() {
                //alert("ajaxStop");
                $("#ajaxSpinnerImage").hide();
            });

    $(document).ajaxError(function() {
        window.location.href = '/';
    });
    setTimeout('pulsatePanther();', 2000);
    for (var i in tbs) {
        dimEQValue(tbs[i]['id']);
    }

    /*$('#gobutton').click(function() {
        current_action = 'update';
        appendColhist();
        appendGradient();
        appendClock();
        initialize_timemout(doPostChanges2, 1000);
        $("#test_slide").hide("slide", {direction: "down"}, 1000);
        return false;
    });*/

$('#gobutton').live( "click", function( event ) {
	event.preventDefault();
	current_action = 'update';
	appendColhist();
	appendGradient();
	appendClock();
	initialize_timemout(doPostChanges2, 1000);
	$("#test_slide").hide("slide", {direction: "down"}, 1000);
	return false;

});













    init_phase = true;
    $("#map_canvas").css("height", "800px");

    $(".draggable").draggable({
        drag: function(e, ui) {
            console.log(ui.position.left, ui.position.top);
            transdiv = $("#" + ui.helper.attr("id") + "trans");
            transdiv.css("top", ui.position.top);
            transdiv.css("left", ui.position.left);

        }
    });

    divPos('gradhist', -20, -225);
    divPos('histcol', -20, -225);
    divPos('histcoltrans', -20, -225);
    if (!iad) {
        for (key in diagsheetFilters) {
            $("#" + key).val(diagsheetFilters[key]);
        }
        appendColhist();
        appendGradient();
        appendClock();
        doPostChanges2();


        $.ajax({
            url: callUrl,
            data: {"function": "getfilters"},
            type: "POST",
            success: function(data) {
                //result = http_request.responseText;
                //filterprofilelist = eval('('+result+')');
                filterprofilelist = [];
                if (data !== "" || data != "[]") {
                    filterprofilelist = eval('(' + data + ')');
                }

                var html = '';
                var oe = 0;
                for (var n in filterprofilelist) {
                    html += '<span class=grid_2><button onClick="retrieveFilter(\'' + n + '\'); return false;">' + n + '</button></span>';
                    if (oe == 1)
                        //html += '<br>';
                    if (oe == 0)
                        oe = 1;
                    else
                        oe = 0;
                }
                $('#filterholder').html(html);
                if (!iad && init_phase && referer_view == "snmpmap") {
                    init_phase = false;
                    var filters = filterprofilelist["Default"];
                    if (!filters) {
                        appendColhist();
                        appendGradient();
                        appendClock();
                        //initialize_timemout(doPostChanges2, 1000);
                        doPostChanges2();

                        return;
                    }
                    for (var i in tbs) {
                        $("#" + tbs[i]["id"] + '_lt').val(filters[tbs[i]["id"] + '_lt']);
                        $("#" + tbs[i]["id"] + '_gt').val(filters[tbs[i]["id"] + '_gt']);
                        dimEQValue(tbs[i]["id"]);
                    }
                    $("#chn").options.each(function(index) {
                        if ($(this).val() == filters['chn']) {
                            $(this).prop("selected", true);
                        }
                    });


                    $("#gradient").options.each(function() {
                        if ($(this).val() == filters['gradient']) {
                            $(this).prop("selected", true);
                        }
                    });



                    $("#status").options.each(function() {
                        if ($(this).val() == filters['status']) {
                            $(this).prop("selected", true);
                        }
                    });
                    var iflist = filters['usifs'].trimcomma().split(',');
                    $("#usif").options.each(function(index) {
                        if ($(this).val() == iflist[index]) {
                            $(this).prop("selected", true);
                        }
                    });

                    appendColhist();
                    appendGradient();
                    appendClock();
                    //initialize_timemout(doPostChanges2, 1000);
                    doPostChanges2();
                }
                alignPanels();


            }

        });
        return;
    }
    $("#ustx_gt").val(0);




    $("#gradient").val(graphcol);
    $.ajax({
        url: callUrl,
        data: {"function": getall},
        type: "POST",
        success: function(data) {
            loadContents1();
        }
    });

});
