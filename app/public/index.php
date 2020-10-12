<?php 
$what = 'what';
echo "help {$what} me";

$db_connection = pg_connect("host=postgres dbname=testdb user=postgres password=password");

print_r($db_connection);
?>