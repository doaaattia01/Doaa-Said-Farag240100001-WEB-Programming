<?php
/**
 * ========================================
 * WEATHER API ENDPOINT
 * ========================================
 *
 * Purpose: Fetch weather data for a given city
 *
 * Request:
 *   - Method: GET
 *   - Parameter: city (required)
 *   - Example: /weather.php?city=Cairo
 *
 * Process:
 *   1. Validate city input
 *   2. Convert city name to coordinates (Geocoding API)
 *   3. Fetch weather data using coordinates (Weather API)
 *   4. Save search to database
 *   5. Return JSON response
 *
 * Response:
 *   - Success: Weather data (temp, wind, icon, etc.)
 *   - Error: Error message in JSON format
 */

// Start output buffering to prevent unwanted output
ob_start();

// Load database configuration and helper functions
require_once '../config/database.php';

// Error reporting settings (hide errors in production)
error_reporting(E_ALL);
ini_set('display_errors', 0);

// Set JSON response header
header('Content-Type: application/json; charset=utf-8');

// ========================================
// STEP 1: DATABASE CONNECTION
// ========================================
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
if ($conn->connect_error) {
    ob_clean();
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}

// ========================================
// STEP 2: VALIDATE INPUT
// ========================================
$city = isset($_GET['city']) ? trim($_GET['city']) : '';

if (empty($city)) {
    ob_clean();
    echo json_encode(['error' => 'City name is required']);
    exit;
}

try {
    // ========================================
    // STEP 3: GEOCODING - Convert city name to coordinates
    // ========================================
    // API: Open-Meteo Geocoding API
    // Input: City name
    // Output: Latitude, Longitude, Country

    $geocoding_url = GEOCODING_API_URL . '?name=' . urlencode($city) . '&count=10&format=json';
    $geocoding_response = @file_get_contents($geocoding_url); // @ suppresses warnings

    if ($geocoding_response === FALSE) {
        ob_clean();
        echo json_encode(['error' => 'Cannot connect to geocoding service']);
        exit;
    }

    $geocoding_data = json_decode($geocoding_response, true);

    // Check if city was found
    if (!isset($geocoding_data['results']) || empty($geocoding_data['results'])) {
        ob_clean();
        echo json_encode(['error' => 'City not found']);
        exit;
    }
    
    // ========================================
    // Select best matching location
    // Prefer locations with admin1 (state/province) for accuracy
    // ========================================
    $best_match = null;
    foreach ($geocoding_data['results'] as $location) {
        // Prefer locations with admin1 (state/province)
        if (isset($location['admin1'])) {
            $best_match = $location;
            break;
        }

        if ($best_match === null) {
            $best_match = $location;
        }
    }

    // Fallback to first result if no match found
    if ($best_match === null) {
        $best_match = $geocoding_data['results'][0];
    }

    // Extract location data
    $latitude = $best_match['latitude'];
    $longitude = $best_match['longitude'];
    $city_name = $best_match['name'];
    $country = $best_match['country'];
    $admin1 = isset($best_match['admin1']) ? $best_match['admin1'] : '';
    
    // ========================================
    // STEP 4: FETCH WEATHER DATA
    // ========================================
    // API: Open-Meteo Weather API
    // Input: Latitude, Longitude
    // Output: Temperature, Wind speed, Weather code, Time

    $weather_url = WEATHER_API_URL . '?latitude=' . $latitude . '&longitude=' . $longitude .
                   '&current_weather=true&timezone=auto&windspeed_unit=kmh';

    $weather_response = @file_get_contents($weather_url);

    if ($weather_response === FALSE) {
        ob_clean();
        echo json_encode(['error' => 'Cannot connect to weather service']);
        exit;
    }

    $weather_data = json_decode($weather_response, true);

    // Validate weather data
    if (!isset($weather_data['current_weather'])) {
        ob_clean();
        echo json_encode(['error' => 'Weather data not available']);
        exit;
    }
    
    // ========================================
    // STEP 5: SAVE TO DATABASE
    // ========================================
    // Save search history to MySQL database
    // Uses prepared statement to prevent SQL injection

    $stmt = $conn->prepare("INSERT INTO searches (city_name, country_name) VALUES (?, ?)");
    $stmt->bind_param("ss", $city_name, $country); // s = string type
    $stmt->execute();
    $stmt->close();
    $conn->close();

    // ========================================
    // STEP 6: PREPARE RESPONSE DATA
    // ========================================
    // Convert weather code to icon and description

    $weather_code = $weather_data['current_weather']['weathercode'];
    $weather_icon = getWeatherIcon($weather_code);           // Returns emoji (☀️, 🌧️, etc.)
    $weather_description = getWeatherDescription($weather_code); // Returns text description
    
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
