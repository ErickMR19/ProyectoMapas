
/*global google*/
/*global $*/
/*global console*/
/*global prompt*/


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
var marcadores = [], marcadoresDistritos = [ [], [], [], [], [], [], [] ], marcadoresCategorias = [ [], [], [], [], [], [], [], [] ];
var i;

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
        var nombre = prompt("Ingrese el nombre"), distrito = prompt("Ingrese el distrito"), categoria = prompt("Ingrese el categoria");
        
        /*array('X'=>9.930048,
        'Y'=>-84.179911,
        '' => 'Gimnasio Municipal',
        
        ''=>1,
        'categoria' => 1
       ) ,*/
        console.log();
        console.log("\n  array('X'=>" + e.latLng.lat().toFixed(6) + "," +
                    "\n        'Y'=>" + e.latLng.lng().toFixed(6) + "," +
                    "\n        'nombre'=> '" + nombre + "'," +
                    "\n        'telefono' => '2282-8888'," +
                    "\n        'distrito'=> " + distrito + "," +
                    "\n        'categoria'=> " + categoria + "," +
                    "\n       ) ,"
                   );
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
    $.ajax("http://localhost:8000/ubicaciones/json")
        .done(function (data) {
            var imageMarker = [ "img/markers/markercultura.png",
                                "img/markers/markerdeporte.png",
                                "img/markers/markereducacion.png",
                                "img/markers/markersalud.png",
                                "img/markers/markerbancos.png",
                                "img/markers/markerrestaurantes.png",
                                "img/markers/markerspublicos.png",
                                "img/markers/markerautomotriz.png" ];
            $(data).each(function (index) {
                var html, point, marker, label;
                html = "<b>" + this.nombre + "</b> <br/>" + this.telefono + "<br />" + this.categoria;
                point = new google.maps.LatLng(this.X, this.Y);

                marker = new google.maps.Marker({
                    map: map,
                    position: point,
                    title: this.nombre,
                    icon: imageMarker[this.categoria]
                });
                marcadores[index] = {
                    cont: 1,
                    ref: marker
                };
                marcadoresDistritos[this.distrito].push(marcadores[index]);
                marcadoresCategorias[this.categoria].push(marcadores[index]);
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
var valorFiltro = 1;
function disminuiryOcultar(element, index, array) {
    "use strict";
    element.cont -= 1;
    element.ref.setVisible(false);
}
function aumentaryMostrar(element, index, array) {
    "use strict";
    element.cont += 1;
    var mostar = (element.cont === valorFiltro) ? true : false;
    element.ref.setVisible(mostar);
}
function mostrarTodo(element, index, array) {
    "use strict";
    if (element.cont === valorFiltro) {
        element.ref.setVisible(true);
    }
}
function ocultarTodo(element, index, array) {
    "use strict";
    element.ref.setVisible(false);
}

$(document).ready(
    function () {
        "use strict";
        // inicializa el mapa
        google.maps.event.addDomListener(window, 'load', initialize);
        var opcionesSector = $("#dropdown-menu-distrito li"),
            opcionesCategorias = $("#dropdown-menu-categoria li > input[type=radio]"),
            botonSatelite = $("#btn-satellite"),
            botonRoadmap = $("#btn-roadmap"),
            sectorActual = 0,
            distritos;

        /*
            CONTROLES PARA EL MAPA
        */
        // BOTON PARA ACTIVAR VISTA DE SATELITE
        google.maps.event.addDomListener(botonSatelite[0], 'click', function () {
            map.setMapTypeId('hybrid');
            $(this).addClass('active');
            botonRoadmap.removeClass('active');
        });
        // BOTON PARA ACTIVAR VISTA DE MAPA
        google.maps.event.addDomListener(botonRoadmap[0], 'click', function () {
            map.setMapTypeId('roadmap');
            $(this).addClass('active');
            botonSatelite.removeClass('active');
        });
        // EVITE QUE SE CIERRE EL MENU DE CATEGORIAS AL SELECCIONAR ALGUNA
        $('#dropdown-menu-categoria').click(function (event) {
            event.stopPropagation();
        });

        google.maps.event.addDomListener(opcionesSector[0], 'click', function () {
            if (sectorActual !== 0) {
                var sectorAnterior = sectorActual + 1;
                sectorActual = 0;
                
                $(opcionesSector[sectorAnterior]).removeClass("selected");
                $(this).addClass("selected");
                map.panTo(new google.maps.LatLng($(this).data("centerx"), $(this).data("centery")));
                mascaraDistrito.setMap(null);
                
                

                // TODO: DISMINUIR LOS CONTADORES DEL SECTOR ANTERIOR
                marcadoresDistritos[sectorAnterior - 1].forEach(disminuiryOcultar);
                
                // TODO: DISMINUIR EL CIRTERIO DE FILTRADO
                valorFiltro = 1;
                
                // TODO: VERIFICAR CUALES DEBEN MOSTRARSE
                marcadores.forEach(mostrarTodo);
            }

        });
        // selecciona las opciones que corresponden unicamente a distritos
        distritos = opcionesSector.slice(2);

        distritos.each(function (index) {

            google.maps.event.addDomListener(this, 'click', function () {
                if (sectorActual !== index + 1) {
                    
                    var sectorAnterior = (sectorActual) ? sectorActual + 1 : 0;
                    sectorActual = index + 1;
                    
                    $(this).addClass("selected");
                    $(opcionesSector[sectorAnterior]).removeClass("selected");
                    map.panTo(new google.maps.LatLng($(this).data("centerx"), $(this).data("centery")));
                    mascaraDistrito.setMap(null);
                    
                    mascaraDistrito = new google.maps.Data();
                    mascaraDistrito.loadGeoJson('geometry/' + $(this).data("distrito") + '.geojson');
                    mascaraDistrito.setMap(map);

                    infoWindow.close();
                    if (sectorAnterior === 0) {
                        marcadores.forEach(ocultarTodo);
                        valorFiltro = 2;
                    } else {
                        marcadoresDistritos[sectorAnterior - 1].forEach(disminuiryOcultar);
                    }
                    // TODO: AUMENTAR LOS CONTADORES DEL SECTOR Y VERIFICAR SI DEBEN MOSTRARSE
                    marcadoresDistritos[sectorActual].forEach(aumentaryMostrar);

                }

            });

        });
        var categoriaActual = -1, ulcategorias = $("ul#dropdown-menu-categoria") 
        
        opcionesCategorias.each(function (index) {

            google.maps.event.addDomListener(this, 'change', function () {
                var categoriaSeleccionada = index - 1;
                if (categoriaActual === -1) {
                    marcadores.forEach(disminuiryOcultar);
                } else {
                    marcadoresCategorias[categoriaActual].forEach(disminuiryOcultar);
                }
                    
                if (categoriaSeleccionada === -1) {
                    marcadores.forEach(aumentaryMostrar);
                    ulcategorias.addClass('allactive');
                } else {
                    marcadoresCategorias[categoriaSeleccionada].forEach(aumentaryMostrar);
                    ulcategorias.removeClass('allactive');
                }
                categoriaActual = categoriaSeleccionada;
            });

        });

    }
);