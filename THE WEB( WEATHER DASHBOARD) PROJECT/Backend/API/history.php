<?php
/**
 * ========================================
 * SEARCH HISTORY API ENDPOINT
 * ========================================
 *
 * Purpose: Retrieve recent search history from database
 *
 * Request:
 *   - Method: GET
 *   - No parameters required
 *   - Example: /history.php
 *
 * Response:
 *   - Array of recent searches (last 10)
 *   - Each item contains: city, country, time
 *
 * Example Response:
 *   [
 *     {"city": "Cairo", "country": "Egypt", "time": "2025-12-24 10:30:00"},
 *     {"city": "London", "country": "UK", "time": "2025-12-24 10:25:00"}
 *   ]
 */

// Load database configuration
require_once '../config/database.php';

// ========================================
// STEP 1: CONNECT TO DATABASE
// ========================================
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
if ($conn->connect_error) {
    die(json_encode(['error' => 'Database connection failed: ' . $conn->connect_error]));
}

// ========================================
// STEP 2: QUERY RECENT SEARCHES
// ========================================
// Get last 10 searches, ordered by most recent first
$stmt = $conn->prepare("SELECT city_name, country_name, search_time FROM searches ORDER BY search_time DESC LIMIT 10");
$stmt->execute();
$result = $stmt->get_result();

// ========================================
// STEP 3: FORMAT RESPONSE
// ========================================
$history = [];
while ($row = $result->fetch_assoc()) {
    $history[] = [
        'city' => $row['city_name'],
        'country' => $row['country_name'],
        'time' => $row['search_time']
    ];
}

// ========================================
// STEP 4: RETURN JSON RESPONSE
// ========================================
echo json_encode($history);

// Clean up
$stmt->close();
$conn->close();
?>
