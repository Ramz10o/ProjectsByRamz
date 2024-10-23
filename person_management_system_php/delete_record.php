<?php
include 'db_connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    
    if (!isset($data->delid)) {
        echo json_encode(['message' => 'No ID provided']);
        http_response_code(400);
        exit();
    }

    $stmt = $conn->prepare('DELETE FROM Records WHERE email = ?');
    if ($stmt) {
        if ($stmt->bind_param('s', $data->delid) && !$stmt->execute()) {
            echo json_encode(['message' => 'Record not found']);
            http_response_code(404);
            exit();
        }
        
        echo json_encode(['message' => 'Record deleted successfully']);
        http_response_code(200);
    } else {
        echo json_encode(['message' => 'Error deleting record']);
        http_response_code(500);
    }
}
?>