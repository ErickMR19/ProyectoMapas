// Assign handlers immediately after making the request,
// and remember the jqXHR object for this request
var jqxhr = $.ajax( "backend/datosmapa.php" )
.done(function( data ) {
    $(data).each(function(){
      console.log(this);
      var html = "<b>" + this['nombre'] + "</b> <br/>" + this['telefono'];
      var point = new google.maps.LatLng(this['X'],this['Y']);
      var marker = new google.maps.Marker({
        map: map,
        position: point
      });
      bindInfoWindow(marker, map, infoWindow, html);
      console.log(html);
      console.log(point);

    });
})
.fail(function() {
  alert( "error" );
})
.always(function() {
  alert( "Listo" );
});
