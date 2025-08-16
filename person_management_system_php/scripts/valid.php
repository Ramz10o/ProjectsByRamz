<?php
session_start();
include 'db_connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

   if ($result = mysqli_query($conn, "SELECT * FROM Login WHERE isLoggedIn=true")) {
       if (mysqli_num_rows($result) == 0) {
           http_response_code(400); 
           exit();
       }
       echo json_encode([]);
       http_response_code(200);
   } else {
       echo json_encode(['message' => "Server error"]);
       http_response_code(500);
   }
}
?>