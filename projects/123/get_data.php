<?php
//check status
$f = fopen("status.php", 'r');
$status = fgets($f);
fclose($f);

//check height 
$f = fopen("height.php", 'r');
$height = fgets($f);
fclose($f);

//check GPS
$f = fopen("gps.log", 'r');
$gps = fgets($f);
fclose($f);
/*
$db = new SQLite3("db.sqlite");
$table = "table1";

$results = $db->query("SELECT PID FROM $table ORDER BY id DESC LIMIT 1");

$rows = array();
while($row = $results->fetchArray()) {
  //$rows[] = $row;
  $gps = $row['pid'];
}
*/
//print json_encode($rows);
if ($status == "true"){
  $data=$_GET['data'];
  $my_file = 'log.dat';
  $handle = fopen($my_file, 'a') or die('Cannot open file:  '.$my_file);
  fwrite($handle, "$data|$height|$gps\n");
  fclose($handle);
  echo "Logged";
  }else{
    echo "Status Off";
  }

?>

