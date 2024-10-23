<?php
$host = 'localhost';
$user = "u739593535_host";
$password = "^3GqRLE8rW";
$database = "u739593535_personDatabase";

$conn = new mysqli($host, $user, $password, $database);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>