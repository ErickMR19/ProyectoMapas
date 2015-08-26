function ListaArrays(){

}
ListaArrays.prototype.insertar = function(objeto,type) {
    if( this[type] == undefined ){
      this[type] = new Array(objeto);
    }
    else{
      this[type].push(objeto);
    }
};
marcadores = new Array();
for(var i = 0; i <7; ++i){
  marcadores[i] = new Array();
}
distritoSeleccionado = 0;

function bindInfoWindow(marker, map, infoWindow, html) {
  google.maps.event.addListener(marker, 'click', function() {
    infoWindow.setContent(html);
    infoWindow.open(map, marker);
  });
}

function CenterControl(controlDiv, map, controlText, className, title) {
  // Set CSS for the control border
  var controlUI = document.createElement('div');
  controlUI.title = title;
  $(controlUI).addClass(className);
  controlDiv.appendChild(controlUI);

  // Set CSS for the control interior
  //var controlText =;
  controlUI.appendChild(controlText);
}

function initialize() {
        var mapOptions = {
          center: new google.maps.LatLng(9.932963,-84.180588),
          //zoom:22,
          zoom:13,
          minZoom:9,
          streetViewControl:false,
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

      var strictBounds = new google.maps.LatLngBounds(
          new google.maps.LatLng(8.19,-85.19),
          new google.maps.LatLng(11.19, -83.19)
       );
       var staAnaBounds = new google.maps.LatLngBounds(
           new google.maps.LatLng(9.862,-84.246),
           new google.maps.LatLng(9.975,-84.145)
        );
        google.maps.event.addListener(map, 'rightclick', function(e) {

          console.log(distritoSeleccionado);
          });
       // Listen for the dragend event
       google.maps.event.addListener(map, 'center_changed', function() {
         if (strictBounds.contains(map.getCenter())) return;

         // We're out of bounds - Move the map back within the bounds
         var c = map.getCenter(),
             x = c.lng(),
             y = c.lat(),
             maxX = strictBounds.getNorthEast().lng(),
             maxY = strictBounds.getNorthEast().lat(),
             minX = strictBounds.getSouthWest().lng(),
             minY = strictBounds.getSouthWest().lat();

         if (x < minX) x = minX;
         if (x > maxX) x = maxX;
         if (y < minY) y = minY;
         if (y > maxY) y = maxY;

         map.setCenter(new google.maps.LatLng(y, x));
       });

      var mascaraCanton = new google.maps.Data();
      //data1.loadGeoJson('santaAnaCompleto.geojson');
      mascaraCanton.loadGeoJson('canton.geojson');
      // do the same for data2, data3 or whatever
      // create some layer control logic for turning on data1
      mascaraCanton.setMap(map); // or restyle or whatever

      mascaraDistrito = new google.maps.Data();

      var centerControlDiv = document.createElement('div');
      var centerControl = new CenterControl(centerControlDiv, map, document.getElementById('map-selector-distrito'), 'leffBottom','Seleccionar un distrio');

      centerControlDiv.index = 1;
      map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(centerControlDiv);

      var centerControlDiv1 = document.createElement('div');
      var centerControl1 = new CenterControl(centerControlDiv1, map, document.getElementById('map-info'),'rightBottom','Obtener más información');

      centerControlDiv1.index = 1;
      map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(centerControlDiv1);


      var infoWindow = new google.maps.InfoWindow;

      $.ajax( "backend/datosmapa.php" )
     .done(function( data ) {
         $(data).each(function(){
           var html = "<b>" + this['nombre'] + "</b> <br/>" + this['telefono'];
           var point = new google.maps.LatLng(this['X'],this['Y']);
           var marker = new google.maps.Marker({
             map: map,
             position: point
           });
           marcadores[ this['distrito'] ].push(marker);
           bindInfoWindow(marker, map, infoWindow, html);

         });
         console.log(marcadores);
     })
     .fail(function() {
       alert( "error" );
     })
     .always(function() {
     });



        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
            initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
             if (staAnaBounds.contains(initialLocation)){
               alert("Estas en Santa Ana");
             }
             else{
               alert("Estás lejos de Santa Ana :( => "+position.coords.latitude+" : "+position.coords.longitude);
             }
            //map.setCenter(initialLocation);
        });
      }
  }
$(document).ready(
  function()
  {
    google.maps.event.addDomListener(window, 'load', initialize);
    var opciones = $("#map-selector-distrito li");

    google.maps.event.addDomListener(opciones[0], 'click', function() {
      //map.setCenter( new google.maps.LatLng(9.932963,-84.180588) );
      mascaraDistrito.setMap(null);
    //  map.setZoom(12);
      map.panTo( new google.maps.LatLng( $(opciones[0]).data("centerx"), $(this).data("centery") ) );
      //map.setZoom(13);
      //map.setZoom(zoomActual);
      if(distritoSeleccionado != 0){
        for (var type = 1; type < 7; ++type){
            for(var i = 0; i < marcadores[type].length; ++i){
              marcadores[type][i].setVisible(true);
            }
        }
        distritoSeleccionado = 0;
      }

    });

    opciones.splice(0,2);
    opciones.each( function(index){

            google.maps.event.addDomListener(this, 'click', function() {
              //map.setCenter( new google.maps.LatLng(9.932963,-84.180588) );
              var zoomActual = map.getZoom();
              mascaraDistrito.setMap(null);
              mascaraDistrito = new google.maps.Data();
              mascaraDistrito.loadGeoJson( $(this).data("distrito")+'.geojson' );
              mascaraDistrito.setMap(map);
            //  map.setZoom(12);
              map.panTo( new google.maps.LatLng( $(this).data("centerx"), $(this).data("centery") ) );
              //map.setZoom(13);
              if(distritoSeleccionado != index+1){
                if(distritoSeleccionado == 0){
                  for (var type = 1; type < 7; ++type)
                  {
                      console.log(marcadores);
                      if(type != index+1){
                        for(var i = 0; i < marcadores[type].length; ++i){
                          marcadores[type][i].setVisible(false);
                        }
                      }
                  }
                }
                else{
                  for(var i = 0; i < marcadores[distritoSeleccionado].length; ++i){
                    marcadores[distritoSeleccionado][i].setVisible(false);
                  }
                  for(var i = 0; i < marcadores[index+1].length; ++i){
                    marcadores[index+1][i].setVisible(true);
                  }
                }
                distritoSeleccionado = index+1;
              }
              //map.setZoom(zoomActual);


            });

    } );



  }
);
