<?php
require_once '../config/database.php';

$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
if ($conn->connect_error) {
    die(json_encode(['error' => 'Database connection failed: ' . $conn->connect_error]));
}

$stmt = $conn->prepare("SELECT city_name, country_name, search_time FROM searches ORDER BY search_time DESC LIMIT 10");
$stmt->execute();
$result = $stmt->get_result();

$history = [];
while ($row = $result->fetch_assoc()) {
    $history[] = [
        'city' => $row['city_name'],
        'country' => $row['country_name'],
        'time' => $row['search_time']
    ];
}

echo json_encode($history);
$stmt->close();
$conn->close();
?>
