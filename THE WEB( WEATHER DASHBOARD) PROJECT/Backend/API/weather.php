<?php
ob_start(); 
require_once '../config/database.php';

error_reporting(E_ALL);
ini_set('display_errors', 0);

header('Content-Type: application/json; charset=utf-8');

$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
if ($conn->connect_error) {
    ob_clean(); 
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}

$city = isset($_GET['city']) ? trim($_GET['city']) : '';

if (empty($city)) {
    ob_clean();
    echo json_encode(['error' => 'City name is required']);
    exit;
}

try {
    $geocoding_url = GEOCODING_API_URL . '?name=' . urlencode($city) . '&count=10&format=json';
    $geocoding_response = @file_get_contents($geocoding_url);
    
    if ($geocoding_response === FALSE) {
        ob_clean();
        echo json_encode(['error' => 'Cannot connect to geocoding service']);
        exit;
    }
    
    $geocoding_data = json_decode($geocoding_response, true);
    
    if (!isset($geocoding_data['results']) || empty($geocoding_data['results'])) {
        ob_clean();
        echo json_encode(['error' => 'City not found']);
        exit;
    }
    
    $best_match = null;
    foreach ($geocoding_data['results'] as $location) {
        if (isset($location['admin1'])) {
            $best_match = $location;
            break;
        }
        
        if ($best_match === null) {
            $best_match = $location;
        }
    }
    
    if ($best_match === null) {
        $best_match = $geocoding_data['results'][0];
    }
    
    $latitude = $best_match['latitude'];
    $longitude = $best_match['longitude'];
    $city_name = $best_match['name'];
    $country = $best_match['country'];
    $admin1 = isset($best_match['admin1']) ? $best_match['admin1'] : '';
    
    $weather_url = WEATHER_API_URL . '?latitude=' . $latitude . '&longitude=' . $longitude . 
                   '&current_weather=true&timezone=auto&windspeed_unit=kmh';
    
    $weather_response = @file_get_contents($weather_url);
    
    if ($weather_response === FALSE) {
        ob_clean();
        echo json_encode(['error' => 'Cannot connect to weather service']);
        exit;
    }
    
    $weather_data = json_decode($weather_response, true);
    
    if (!isset($weather_data['current_weather'])) {
        ob_clean();
        echo json_encode(['error' => 'Weather data not available']);
        exit;
    }
    
    $stmt = $conn->prepare("INSERT INTO searches (city_name, country_name) VALUES (?, ?)");
    $stmt->bind_param("ss", $city_name, $country);
    $stmt->execute();
    $stmt->close();
    $conn->close();
    
    $weather_code = $weather_data['current_weather']['weathercode'];
    $weather_icon = getWeatherIcon($weather_code);
    $weather_description = getWeatherDescription($weather_code);
    
    $response = [
        'success' => true,
        'city' => $city_name,
        'country' => $country,
        'admin1' => $admin1,
        'latitude' => $latitude,
        'longitude' => $longitude,
        'temperature' => round($weather_data['current_weather']['temperature'], 1),
        'windspeed' => round($weather_data['current_weather']['windspeed'], 1),
        'weather_code' => $weather_code,
        'weather_icon' => $weather_icon,
        'weather_description' => $weather_description,
        'time' => $weather_data['current_weather']['time'],
        'timestamp' => date('Y-m-d H:i:s')
    ];
    
    ob_clean(); 
    echo json_encode($response);
    
} catch (Exception $e) {
    ob_clean();
    echo json_encode(['error' => 'An error occurred: ' . $e->getMessage()]);
}

ob_end_flush(); 
?>
