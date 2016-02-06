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
/*global google*/
/*global $*/
/*global console*/
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

function centerControl(controlDiv, map, controlText, className, title) {
	"use strict";
	// Set CSS for the control border
	var controlUI = document.createElement('div');
	controlUI.title = title;
	$(controlUI).addClass(className);
	controlDiv.appendChild(controlUI);

	// Set CSS for the control interior
	//var controlText =;
	controlUI.appendChild(controlText);
}

var map, mascaraDistrito;
function initialize() {
	"use strict";
	var strictBounds, staAnaBounds, mapOptions, mascaraCanton, controlSelectorDistrito, controlSelectorCategoria, controlMostrarInformacion;
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
		//zoom:22,
		zoom: 13,
		minZoom: 9,
		streetViewControl: false,
		mapTypeControl: false,
		styles: [{
			featureType: "poi",
			elementType: "labels",
			stylers: [{
				visibility: "off"
      }]
    }]
	};

	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
	google.maps.event.addListener(map, 'rightclick', function (e) {

		console.log(distritoSeleccionado);
	});
	// Listen for the dragend event
	google.maps.event.addListener(map, 'center_changed', function () {
		if (strictBounds.contains(map.getCenter())) { return; }

		// We're out of bounds - Move the map back within the bounds
		var c = map.getCenter(),
			x = c.lng(),
			y = c.lat(),
			maxX = strictBounds.getNorthEast().lng(),
			maxY = strictBounds.getNorthEast().lat(),
			minX = strictBounds.getSouthWest().lng(),
			minY = strictBounds.getSouthWest().lat();

		if (x < minX) { x = minX; }
		if (x > maxX) { x = maxX; }
		if (y < minY) { y = minY; }
		if (y > maxY) { y = maxY; }

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
	centerControl(controlSelectorDistrito, map, document.getElementById('map-selector-distrito'), 'leffBottom', 'Seleccionar un distrio');
	controlSelectorDistrito.index = 1;
	map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(controlSelectorDistrito);

	controlSelectorCategoria = document.createElement('div');
	centerControl(controlSelectorCategoria, map, document.getElementById('map-selector-categoria'), 'leffBottom', 'Seleccionar un distrio');
	controlSelectorCategoria.index = 1;
	map.controls[google.maps.ControlPosition.RIGHT_CENTER].push(controlSelectorCategoria);


	controlMostrarInformacion = document.createElement('div');
	centerControl(controlMostrarInformacion, map, document.getElementById('map-info'), 'rightBottom', 'Obtener más información');
	controlMostrarInformacion.index = 1;
	map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(controlMostrarInformacion);


	infoWindow = new google.maps.InfoWindow();
	/*global alert*/
	$.ajax("backend/datosmapa.php")
		.done(function (data) {
			$(data).each(function () {
				var html, point, marker;
				html = "<b>" + this.nombre + "</b> <br/>" + this.telefono;
				point = new google.maps.LatLng(this.X, this.Y);
				marker = new google.maps.Marker({
					map: map,
					position: point
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
				alert("Estas en Santa Ana");
			} else {
				alert("Estás lejos de Santa Ana :( => " + position.coords.latitude + " : " + position.coords.longitude);
			}
			//map.setCenter(initialLocation);
		});
	}
}
$(document).ready(
	function () {
		"use strict";
		google.maps.event.addDomListener(window, 'load', initialize);
		var opciones = $("#map-selector-distrito li");

		google.maps.event.addDomListener(opciones[0], 'click', function () {
			//map.setCenter( new google.maps.LatLng(9.932963,-84.180588) );
			mascaraDistrito.setMap(null);
			//  map.setZoom(12);
			map.panTo(new google.maps.LatLng($(opciones[0]).data("centerx"), $(this).data("centery")));
			//map.setZoom(13);
			//map.setZoom(zoomActual);
			if (distritoSeleccionado !== 0) {
				var type, i;
				for (type = 1; type < 7; type += 1) {
					for (i = 0; i < marcadores[type].length; i += 1) {
						marcadores[type][i].setVisible(true);
					}
				}
				distritoSeleccionado = 0;
			}

		});

		opciones.splice(0, 2);
		opciones.each(function (index) {

			google.maps.event.addDomListener(this, 'click', function () {

				map.panTo(new google.maps.LatLng($(this).data("centerx"), $(this).data("centery")));
				if (distritoSeleccionado !== index + 1) {
					//map.setCenter( new google.maps.LatLng(9.932963,-84.180588) );
					var zoomActual = map.getZoom(), type, i;
					mascaraDistrito.setMap(null);
					mascaraDistrito = new google.maps.Data();
					mascaraDistrito.loadGeoJson('geometry/' + $(this).data("distrito") + '.geojson');
					mascaraDistrito.setMap(map);
					//  map.setZoom(12);
					//map.setZoom(13);


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
				}
				//map.setZoom(zoomActual);


			});

		});



	}
);