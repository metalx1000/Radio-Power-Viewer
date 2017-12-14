<?php
//check status
$f = fopen("status.php", 'r');
$status = fgets($f);
fclose($f);

if ($status){
  $data=$_GET['data'];
  $my_file = 'log.dat';
  $handle = fopen($my_file, 'a') or die('Cannot open file:  '.$my_file);
  fwrite($handle, "$data|$feet\n");
  fclose($handle);
  echo "Logged";
  }else{
    echo "Status Off";
  }

?>

