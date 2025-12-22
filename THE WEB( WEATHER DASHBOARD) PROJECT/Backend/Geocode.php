<?php
require_once '../config/database.php';

$city = isset($_GET['city']) ? trim($_GET['city']) : '';

if (empty($city)) {
    echo json_encode(['error' => 'City name is required']);
    exit;
}

$api_url = GEOCODING_API_URL . '?name=' . urlencode($city) . '&count=10&language=en&format=json';
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $api_url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($http_code !== 200) {
    echo json_encode(['error' => 'Unable to fetch location data']);
    exit;
}

$geocoding_data = json_decode($response, true);

if (!isset($geocoding_data['results']) || empty($geocoding_data['results'])) {
    echo json_encode(['error' => 'City not found']);
    exit;
}

$formatted_results = [];
foreach ($geocoding_data['results'] as $location) {
    if (!isset($location['admin1']) && isset($location['population']) && $location['population'] < 1000000) {
        continue;
    }
    
    $formatted_results[] = [
        'name' => $location['name'],
        'latitude' => $location['latitude'],
        'longitude' => $location['longitude'],
        'country' => $location['country'],
        'admin1' => isset($location['admin1']) ? $location['admin1'] : '',
        'population' => isset($location['population']) ? $location['population'] : 0
    ];
}

usort($formatted_results, function($a, $b) {
    return $b['population'] - $a['population'];
});

echo json_encode(array_slice($formatted_results, 0, 5));
?>
