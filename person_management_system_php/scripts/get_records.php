    <?php
    include 'db_connection.php';

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = json_decode(file_get_contents("php://input"));
        
        if (!in_array($data->field, ['name', 'dob', 'email', 'phone'])) {
            echo json_encode(['message' => 'Invalid field']);
            http_response_code(400);
            exit();
        }

        $stmt = $conn->prepare("SELECT * FROM Records ORDER BY " . mysqli_real_escape_string($conn, $data->field));
        if ($stmt->execute()) {
            echo json_encode(['records' => $stmt->get_result()->fetch_all(MYSQLI_ASSOC), 'message' => 'Found']);
            http_response_code(200);
        } else {
            echo json_encode(['message' => 'Error retrieving records']);
            http_response_code(500);
        }
    }
    ?>