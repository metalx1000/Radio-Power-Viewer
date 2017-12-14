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
        checkStatus();
        setInterval(checkStatus,3000);

        //start logging
        $("#start").click(function(){
          $.get('change_status.php?status=true',function(data){
            $("#start").hide();
          });
        });

        //stop logging
        $("#stop").click(function(){
          $.get('change_status.php?status=false',function(data){
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
    </script>
  </head>
  <body>

    <br><br>
    <div id="main" class="container">
      <div class="row">
        <div class="col-md-12 form-group">
          <label for="feet">Height in Feet:</label>
          <input type="number" class="form-control" id="feet" value="100">
        </div>
        <button id="start" type="button" class="btn btn-primary btn-block">start</button>
        <button id="stop" type="button" class="btn btn-primary btn-block">stop</button>

      </div>
    </div>

  </body>
</html>

