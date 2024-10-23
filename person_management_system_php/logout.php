<?php
session_start();
include 'db_connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    if ($conn->query('UPDATE Login SET isLoggedIn = false WHERE isLoggedIn = true')) {
        echo json_encode(['message' => 'Logout successful']);
        http_response_code(200);
    } else {
        echo json_encode(['message' => 'No login found']);
        http_response_code(400);
    }
}
?>