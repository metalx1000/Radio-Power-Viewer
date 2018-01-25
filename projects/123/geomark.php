<!DOCTYPE HTML>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css" crossorigin="anonymous">
  <script src="https://code.jquery.com/jquery-3.1.1.min.js" crossorigin="anonymous"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/tether/1.4.0/js/tether.min.js" crossorigin="anonymous"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/js/bootstrap.min.js" crossorigin="anonymous"></script>

  <script type="text/javascript">
    var watchID;
    var geoLoc;
    var latitude,longitude;

    getLocationUpdate();
    //sendGPS();
    setInterval(getLocationUpdate,1000);

    function showLocation(position) {
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
      var output=document.getElementById("output");
      output.innerHTML="Latitude : " + latitude + " Longitude: " + longitude;
      //$.get('update_db.php?pid='+latitude+","+longitude,function(data){
      $.get('gps_log.php?gps='+latitude+","+longitude,function(data){
        $("#output2").html(data);
      });
    }

    function errorHandler(err) {
      if(err.code == 1) {
        alert("Error: Access is denied!");
      }else if( err.code == 2) {
        alert("Error: Position is unavailable!");
      }
    }
    function getLocationUpdate(){

      if(navigator.geolocation){
        var options = {enableHighAccuracy:true,maximumAge:30000,timeout:27000};
        geoLoc = navigator.geolocation;
        watchID = geoLoc.watchPosition(showLocation, errorHandler, options);
      }else{
        alert("Sorry, browser does not support geolocation!");
      }
    }

    function sendGPS(){
      $.get('gps_log.php?gps='+latitude+","+longitude,function(data){
        $("#output2").html(data);
      }).done(sendGPS);
    }
  </script>
</head>
<html>
  <body>
    <input type="button" onclick="getLocationUpdate();" value="START"/>
    <div id="output"></div>
    <div id="output2"></div>
  </body>
</html>

