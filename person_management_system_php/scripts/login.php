<?php
session_start();
include 'db_connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try{
        $data = json_decode(file_get_contents("php://input"));
        $email = $data->email;
        $password = $data->password;

        $stmt = $conn->prepare('SELECT * FROM Login WHERE Email = ?');
        $stmt->bind_param('s', $email);
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();

        if (!$user || !password_verify($password, $user['password'])) {
            echo json_encode(['message' => 'Invalid credentials']);
            http_response_code(400);
            exit();
        }

        $conn->query('UPDATE Login SET isLoggedIn = true WHERE isLoggedIn = false');
        echo json_encode(['message' => 'Login Successful']);
        http_response_code(200);
    }
    catch(Exception $e){
        echo json_encode(['message' => 'Server Error: ']);
        http_response_code(500);
        exit();
    }
}
?>