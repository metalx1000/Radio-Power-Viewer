<?php
$GPS=$_GET['gps'];

$my_file = 'gps.log';
$handle = fopen($my_file, 'w') or die('Cannot open file:  '.$my_file);
fwrite($handle, $GPS);

fclose($handle);
?>
