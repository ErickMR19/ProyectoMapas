
/*global google*/
/*global $*/
/*global console*/


Array.prototype.insertar = function (objeto, indice) {
    "use strict";
    if (this[indice] === undefined) {
        this[indice] = [objeto];
    } else {
        this[indice].push(objeto);
    }
};
//Arreglo que contendra un arreglo en cada posicion correspondiente al distrito
//en cada uno de estos se guardaran los marcadores localizados en cada distrito
var marcadores = [];
var i;
for (i = 0; i < 7; i += 1) {
    marcadores[i] = [];
}
var distritoSeleccionado = 0;
var infoWindow;

//recibe un marcador (globito rojo), el mapa sobre el que se va a operar.
//infoWindow se refiere a la ventana en donde se desplagarà la informaciòn
//el html es el mensaje que va a mostrar
function bindInfoWindow(marker, map, infoWindow, html) {
    "use strict";
    google.maps.event.addListener(marker, 'click', function () { //Le decimos a google que cuando alguien haga clic sobre 
        //un marcador haga lo que sigue.
        infoWindow.setContent(html); //setea el texto
        infoWindow.open(map, marker);
    });
}

function centerControl(controlDiv, map, controlText, className) {
    "use strict";
    // Set CSS for the control border
    var controlUI = document.createElement('div');
    $(controlUI).addClass(className);
    controlDiv.appendChild(controlUI);

    // Set CSS for the control interior
    //var controlText =;
    controlUI.appendChild(controlText);
}

var map, mascaraDistrito;

function initialize() {
    "use strict";
    var strictBounds, staAnaBounds, mapOptions, mascaraCanton, controlSelectorDistrito, controlSelectorCategoria, controlMostrarInformacion, btnZoomMinus, btnZoomPlus;
    strictBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(8.19, -85.19),
        new google.maps.LatLng(11.19, -83.19)
    );
    staAnaBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(9.862, -84.246),
        new google.maps.LatLng(9.975, -84.145)
    );
    mapOptions = {
        center: new google.maps.LatLng(9.932963, -84.180588),
        zoom: 13,
        minZoom: 10,
        maxZoom: 18,
        disableDefaultUI: true,
        //streetViewControl: false,
        //mapTypeControl: false,
        styles: [{
            featureType: "poi",
            elementType: "labels",
            stylers: [{
                visibility: "off"
            }]
        }]
    };
    btnZoomMinus = $('#btn-zoom-minus');
    btnZoomPlus = $('#btn-zoom-plus');
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    google.maps.event.addListener(map, 'rightclick', function (e) {

        console.log(distritoSeleccionado);
    });
    google.maps.event.addListener(map, 'zoom_changed', function () {
        switch (map.getZoom()) {
        case 10:
            btnZoomMinus.addClass('disabled');
            break;
        case 18:
            btnZoomPlus.addClass('disabled');
            break;
        default:
            btnZoomMinus.removeClass('disabled');
            btnZoomPlus.removeClass('disabled');

        }
    });
    google.maps.event.addDomListener(btnZoomMinus[0], 'click', function () {
        map.setZoom(map.getZoom() - 1);
    });
    google.maps.event.addDomListener(btnZoomPlus[0], 'click', function () {
        map.setZoom(map.getZoom() + 1);
    });
    // Listen for the dragend event
    google.maps.event.addListener(map, 'center_changed', function () {
        if (strictBounds.contains(map.getCenter())) {
            return;
        }

        // We're out of bounds - Move the map back within the bounds
        var c = map.getCenter(),
            x = c.lng(),
            y = c.lat(),
            maxX = strictBounds.getNorthEast().lng(),
            maxY = strictBounds.getNorthEast().lat(),
            minX = strictBounds.getSouthWest().lng(),
            minY = strictBounds.getSouthWest().lat();

        if (x < minX) {
            x = minX;
        }
        if (x > maxX) {
            x = maxX;
        }
        if (y < minY) {
            y = minY;
        }
        if (y > maxY) {
            y = maxY;
        }

        map.setCenter(new google.maps.LatLng(y, x));
    });

    mascaraCanton = new google.maps.Data();
    //data1.loadGeoJson('santaAnaCompleto.geojson');
    mascaraCanton.loadGeoJson('geometry/canton.geojson');
    // do the same for data2, data3 or whatever
    // create some layer control logic for turning on data1
    mascaraCanton.setMap(map); // or restyle or whatever

    mascaraDistrito = new google.maps.Data();

    /**/
    controlSelectorDistrito = document.createElement('div');
    centerControl(controlSelectorDistrito, map, document.getElementById('map-main-toolbar'), 'leffBottom');
    controlSelectorDistrito.index = 1;
    map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(controlSelectorDistrito);


    controlMostrarInformacion = document.createElement('div');
    centerControl(controlMostrarInformacion, map, document.getElementById('map-info'), 'rightBottom');
    controlMostrarInformacion.index = 1;
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(controlMostrarInformacion);


    infoWindow = new google.maps.InfoWindow();
    /*global alert*/
    $.ajax("backend/datosmapa.php")
        .done(function (data) {
            $(data).each(function () {
                var html, point, marker;
                html = "<b>" + this.nombre + "</b> <br/>" + this.telefono + "<br />" + this.categoria;
                point = new google.maps.LatLng(this.X, this.Y);
                //var image = 'markerMoney-64.png';

                marker = new google.maps.Marker({
                    map: map,
                    position: point,
                    title: this.nombre
                    //icon: image
                });
                marcadores[this.distrito].push(marker);
                bindInfoWindow(marker, map, infoWindow, html);

            });
        })
        .fail(function () {
            alert("error");
        })
        .always(function () {});



    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            if (staAnaBounds.contains(initialLocation)) {
                console.log("Estas en Santa Ana");
            }
        });
    }
}
$(document).ready(
    function () {
        "use strict";
        google.maps.event.addDomListener(window, 'load', initialize);
        var opciones = $("#map-selector-distrito li"), botonSatelite = $("#btn-satellite"), botonRoadmap = $("#btn-roadmap"), opcionDistritoSeleccionada = 0, distritos;

        google.maps.event.addDomListener(opciones[0], 'click', function () {
            mascaraDistrito.setMap(null);
            map.panTo(new google.maps.LatLng($(opciones[0]).data("centerx"), $(this).data("centery")));
            if (distritoSeleccionado !== 0) {
                $(this).addClass("selected");
                $(opciones[opcionDistritoSeleccionada]).removeClass("selected");
                var type, i;
                for (type = 1; type < 7; type += 1) {
                    for (i = 0; i < marcadores[type].length; i += 1) {
                        marcadores[type][i].setVisible(true);
                    }
                }
                distritoSeleccionado = 0;
                opcionDistritoSeleccionada = 0;
            }

        });
        distritos = opciones.slice(2);

        distritos.each(function (index) {

            google.maps.event.addDomListener(this, 'click', function () {

                map.panTo(new google.maps.LatLng($(this).data("centerx"), $(this).data("centery")));
                $(this).addClass("selected");
                $(opciones[opcionDistritoSeleccionada]).removeClass("selected");
                if (distritoSeleccionado !== index + 1) {
                    var zoomActual = map.getZoom(),
                        type,
                        i;
                    mascaraDistrito.setMap(null);
                    mascaraDistrito = new google.maps.Data();
                    mascaraDistrito.loadGeoJson('geometry/' + $(this).data("distrito") + '.geojson');
                    mascaraDistrito.setMap(map);


                    infoWindow.close();
                    if (distritoSeleccionado === 0) {
                        for (type = 1; type < 7; type += 1) {
                            if (type !== index + 1) {
                                for (i = 0; i < marcadores[type].length; i += 1) {
                                    marcadores[type][i].setVisible(false);
                                }
                            }
                        }
                    } else {
                        for (i = 0; i < marcadores[distritoSeleccionado].length; i += 1) {
                            marcadores[distritoSeleccionado][i].setVisible(false);
                        }
                        for (i = 0; i < marcadores[index + 1].length; i += 1) {
                            marcadores[index + 1][i].setVisible(true);
                        }
                    }
                    distritoSeleccionado = index + 1;
                    opcionDistritoSeleccionada = index + 2;
                }
                //map.setZoom(zoomActual);
                

            });

        });

        google.maps.event.addDomListener(botonSatelite[0], 'click', function () {
            map.setMapTypeId('hybrid');
            $(this).addClass('active');
            botonRoadmap.removeClass('active');
        });
        google.maps.event.addDomListener(botonRoadmap[0], 'click', function () {
            map.setMapTypeId('roadmap');
            $(this).addClass('active');
            botonSatelite.removeClass('active');
        });
        $('#dropdown-menu-categorias').click(function (event) {
            event.stopPropagation();
        });

    }
);
