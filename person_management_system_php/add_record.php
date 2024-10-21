<?php
include 'db_connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    $name = $data->name;
    $dob = $data->dob;
    $email = $data->email;
    $phone = $data->phone;

    if (isset($_FILES['pic']) && $_FILES['pic']['error'] == UPLOAD_ERR_OK) {
        if (!preg_match('/^image\//', $_FILES['pic']['type'])) {
            echo json_encode(['message' => 'Only image files are allowed']);
            http_response_code(400);
            exit();
        }

        if ($_FILES['pic']['size'] > 1024 * 1024) {
            echo json_encode(['message' => 'Image size should be less than 1 MB']);
            http_response_code(400);
            exit();
        }

        $stmt = $conn->prepare('SELECT * FROM Records WHERE email = ? OR phone = ?');
        $stmt->bind_param('ss', $email, $phone);
        $stmt->execute();
        if ($stmt->get_result()->num_rows > 0) {
            echo json_encode(['message' => 'Email or Phone already exists with different person']);
            http_response_code(400);
            exit();
        }

        $picData = base64_encode(file_get_contents($_FILES['pic']['tmp_name']));
        $picExtension = $_FILES['pic']['type'];

        $stmt = $conn->prepare('INSERT INTO Records (name, dob, email, phone, pic_data, pic_extension) VALUES (?, ?, ?, ?, ?, ?)');
        $stmt->bind_param('ssssss', $name, $dob, $email, $phone, $picData, $picExtension);
        
        if ($stmt->execute()) {
            echo json_encode(['message' => 'Insertion successful']);
        } else {
            echo json_encode(['message' => 'Error inserting record']);
            http_response_code(500);
        }
    } else {
        echo json_encode(['message' => 'No file uploaded']);
        http_response_code(400);
    }
}
?>