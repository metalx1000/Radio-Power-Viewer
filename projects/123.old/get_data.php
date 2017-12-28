<?php
//check status
$f = fopen("status.php", 'r');
$status = fgets($f);
fclose($f);

//check height 
$f = fopen("height.php", 'r');
$height = fgets($f);
fclose($f);

if ($status == "true"){
  $data=$_GET['data'];
  $my_file = 'log.dat';
  $handle = fopen($my_file, 'a') or die('Cannot open file:  '.$my_file);
  fwrite($handle, "$data|$height\n");
  fclose($handle);
  echo "Logged";
  }else{
    echo "Status Off";
  }

?>

