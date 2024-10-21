<?php
include 'db_connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    // Get search query from request body
    $data = json_decode(file_get_contents("php://input"));
    
    if (!isset($data->query)) {
      echo json_encode(['message' => 'No query provided']);
      http_response_code(400);
      exit();
   }

   $queryString = '%' . mysqli_real_escape_string($conn, trim($data->query)) . '%';
   $stmt = $conn->prepare('SELECT * FROM Records WHERE name LIKE ? OR email LIKE ? OR phone LIKE ? OR dob LIKE ?');
   if ($stmt) {
       // Bind parameters and execute query
       if ($stmt->bind_param('ssss', ...array_fill(0, 4, "$queryString")) && !$stmt->execute()) {
           echo json_encode(['message' => 'No Records found']);
           http_response_code(404);
           exit();
       }

       echo json_encode(['records' => array_map('json_encode', mysqli_fetch_all($stmt->get_result(), MYSQLI_ASSOC)), 
                         'message' => "Found"]);
   } else {
       echo json_encode(['message' => "Error finding records"]);
       http_response_code(500);
   }
}
?>