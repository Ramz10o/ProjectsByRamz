<?php
session_start();
$host = "localhost";
$user: "u739593535_host";
$password: "^3GqRLE8rW";
$database: "u739593535_personDatabase";
$conn = mysqli_connect($host, $username, $password, $database);
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}
if($_SERVER["REQUEST_METHOD"] == "POST"){
    $email = $_POST["email"];
    $password = $_POST["password"];
    $sql = "SELECT * FROM Login WHERE username = '$username' AND password = '$password'";
    $result = mysqli_query($conn, $sql);
    if (mysqli_num_rows($result) == 0) {
        echo "alert(Invalid Credentials)";
    }else{
        $_SESSION["username"] = $username;
        $_SESSION["isLoggedIn"] = true;
    }
}
?>