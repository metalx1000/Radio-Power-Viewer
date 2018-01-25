<?php
system("cp log.dat \"archive/$(date +%s).html\"");
system("echo '' > log.dat");
header('Location: archive');
?>
