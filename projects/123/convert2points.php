<?php
$key = $_GET['key'];
if($key != "kjfnbS43g"){
  header( 'Location: http://www.aerialradiodata.com/' );
}
echo "[";
system("./convert2points.sh");
echo "]";
?>
