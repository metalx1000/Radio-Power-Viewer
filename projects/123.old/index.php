<!DOCTYPE html>
<html lang="en">
  <head>
    <title></title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css" crossorigin="anonymous">
    <script src="https://code.jquery.com/jquery-3.1.1.min.js" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/tether/1.4.0/js/tether.min.js" crossorigin="anonymous"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/js/bootstrap.min.js" crossorigin="anonymous"></script>

    <script>
      $(document).ready(function(){
        $("#stop").hide();
        checkHeight();
        checkStatus();
        setInterval(checkStatus,3000);
        setInterval(checkLog,1000);

        //start logging
        $("#start").click(function(){
          $.get('change_status.php?status=true&height='+$("#height").val(),function(data){
            $("#start").hide();
          });
        });

        //stop logging
        $("#stop").click(function(){
          $.get('change_status.php?status=false&height='+$("#height").val(),function(data){
            $("#stop").hide();
          });
        });
      });

      function checkStatus(){
        $.get('status.php',function(data){
          var status = data.split("\n")[0];
          if(status == "true"){
            $("#start").hide();
            $("#stop").show();
            }else{
            $("#start").show();
            $("#stop").hide();
          }
        });

      }

      function checkHeight(){
        $.get('height.php',function(height){
          $("#height").val(height);
        });
      }

      function checkLog(){
        $.get('checkLog.php',function(data){
          console.log(data);
          var time = data.split("|")[0];
          var d = new Date(time * 1000);
          var time = d.toLocaleString();

          var GPS=data.split("|")[1].split(" ")[6];
          var strength=data.split("|")[2] + "|" + data.split("|")[3];
          var height=data.split("|")[4];
          $("#output").html("Height: " + height + " feet");
          $("#output").append("<br>GPS: " + GPS);
          $("#output").append("<br>Strength:" + strength);
          $("#output").append("<br>Time Stamp:" + time);
        });
      }

      //decode base64 string
      function b64D(str) {
        // Going backwards: from bytestream, to percent-encoding, to original string.
        return decodeURIComponent(atob(str).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
      }
    </script>
  </head>
  <body>

    <br><br>
    <div id="main" class="container">
      <div class="row">
        <div class="col-md-12 form-group">
          <label for="feet">Height in Feet:</label>
          <input type="number" class="form-control" id="height" value="100">
        </div>
        <div class="col-md-12 form-group">
          <button id="start" type="button" class="btn btn-primary btn-block">start</button>
          <button id="stop" type="button" class="btn btn-primary btn-block">stop</button>
        </div>

        <!--card start-->
        <div class="col-sm-12">
          <div class="card">
            <div class="card-header">
              Most Recent Log 
            </div>
            <div class="card-block">
              <p id="output" class="card-text"></p>
            </div>
          </div>
        </div>
        <!--card end-->

      </div>
    </div>

  </body>
</html>

