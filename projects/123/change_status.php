<?php

  //change status
  $height=$_GET['height'];
  $my_file = 'height.php';
  $handle = fopen($my_file, 'w') or die('Cannot open file:  '.$my_file);
  fwrite($handle, "$height");
  fclose($handle);

  //change status
  $status=$_GET['status'];
  $my_file = 'status.php';
  $handle = fopen($my_file, 'w') or die('Cannot open file:  '.$my_file);
  fwrite($handle, "$status");
  fclose($handle);
?>
