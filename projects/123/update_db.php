<?php
$_GET = array_map('strip_tags', $_GET);
$_GET = array_map('htmlspecialchars', $_GET);
$pid=$_GET['pid'];

$db = new SQLite3("db.sqlite");

$table = "table1";
$rows = $db->query("SELECT COUNT(*) as count FROM $table WHERE pid='$pid'");
$row = $rows->fetchArray();
$numRows = $row['count'];
if($numRows > 0){
  print "updating...";
}else{
  $sql="insert into $table (pid) values ('$pid');";
  $query = $db->exec($sql);
}

foreach($_GET as $key => $value) {
  echo 'Current value in $_GET["' . $key . '"] is : ' . $value . '<br>';
  $sql="UPDATE $table SET $key='$value' WHERE pid='$pid'";
  $query = $db->exec($sql);
}
?>

