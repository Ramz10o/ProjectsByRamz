<?php
$host = 'localhost';
$user = "Your Mysql Db Username";
$password = "Your Mysql Db Password";
$database = "Your Mysql database";

$conn = new mysqli($host, $user, $password, $database);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>