<?php

$db = new SQLite3("db.sqlite");
$table = "table1";

$results = $db->query("SELECT PID FROM $table ORDER BY id DESC LIMIT 1");

$rows = array();
while($row = $results->fetchArray()) {
  //$rows[] = $row;
  print $row['pid'];
}
//print json_encode($rows);


?>
