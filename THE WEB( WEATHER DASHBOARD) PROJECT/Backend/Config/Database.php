<?php

define('DB_HOST', '127.0.0.1');  // MySQL host (use 127.0.0.1 instead of localhost for better compatibility)
define('DB_USER', 'root');        // MySQL username (default for XAMPP)
define('DB_PASS', '');            // MySQL password (empty for XAMPP default)
define('DB_NAME', 'weather_app'); // Database name

// ========================================
// EXTERNAL API URLS
// ========================================
// Open-Meteo APIs (Free weather data service)
define('GEOCODING_API_URL', 'https://geocoding-api.open-meteo.com/v1/search'); // Convert city name to coordinates
define('WEATHER_API_URL', 'https://api.open-meteo.com/v1/forecast');           // Get weather data

// ========================================
// CORS HEADERS
// ========================================
// Allow frontend to access backend APIs from different origins
header("Access-Control-Allow-Origin: *");                    // Allow all origins
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");  // Allowed HTTP methods
header("Access-Control-Allow-Headers: Content-Type");        // Allowed headers

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}
/**
 * ========================================
 * HELPER FUNCTION: GET WEATHER ICON
 * ========================================
 *
 * Converts weather code to emoji icon
 *
 * @param int $code - Weather code from Open-Meteo API
 * @return string - Emoji icon (☀️, 🌧️, ❄️, etc.)
 *
 * Weather Codes:
 * - 0: Clear sky
 * - 1-3: Partly cloudy
 * - 45-48: Fog
 * - 51-67: Rain
 * - 71-77: Snow
 * - 95-99: Thunderstorm
 */
function getWeatherIcon($code) {
    if ($code === 0) return '☀️';                      // Clear sky

    if ($code >= 1 && $code <= 3) return '⛅';         // Partly cloudy
    if ($code >= 45 && $code <= 48) return '🌫️';      // Fog
    if ($code >= 51 && $code <= 56) return '🌦️';      // Drizzle
    if ($code >= 57 && $code <= 58) return '🌨️';      // Freezing drizzle
    if ($code >= 61 && $code <= 67) return '🌧️';      // Rain
    if ($code >= 68 && $code <= 69) return '🌨️';      // Freezing rain
    if ($code >= 71 && $code <= 77) return '❄️';       // Snow
    if ($code >= 80) return '🌨️';                     // Rain showers
    if ($code >= 81 && $code <= 84) return '🌦️';      // Rain showers
    if ($code >= 85 && $code <= 86) return '❄️';       // Snow showers
    if ($code >= 95 && $code <= 99) return '⛈️';       // Thunderstorm

    return '☁️'; // Default: Cloudy
}

/**
 * ========================================
 * HELPER FUNCTION: GET WEATHER DESCRIPTION
 * ========================================
 *
 * Converts weather code to human-readable text description
 *
 * @param int $code - Weather code from Open-Meteo API
 * @return string - Text description (e.g., "Clear sky", "Moderate rain")
 */
function getWeatherDescription($code) {
    // Map of weather codes to descriptions
    $descriptions = [
        0 => 'Clear sky',
        1 => 'Mainly clear',
        2 => 'Partly cloudy',
        3 => 'Overcast',
        45 => 'Fog',
        48 => 'Depositing rime fog',
        51 => 'Light drizzle',
        53 => 'Moderate drizzle',
        55 => 'Dense drizzle',
        56 => 'Light freezing drizzle',
        57 => 'Dense freezing drizzle',
        61 => 'Slight rain',
        63 => 'Moderate rain',
        65 => 'Heavy rain',
        66 => 'Light freezing rain',
        67 => 'Heavy freezing rain',
        71 => 'Slight snow fall',
        73 => 'Moderate snow fall',
        75 => 'Heavy snow fall',
        77 => 'Snow grains',
        80 => 'Slight rain showers',
        81 => 'Moderate rain showers',
        82 => 'Violent rain showers',
        85 => 'Slight snow showers',
        86 => 'Heavy snow showers',
        95 => 'Thunderstorm',
        96 => 'Thunderstorm with slight hail',
        99 => 'Thunderstorm with heavy hail'
    ];

    // Return exact match if exists
    if (isset($descriptions[$code])) {
        return $descriptions[$code];
    }

    // Find closest match
    foreach ($descriptions as $key => $desc) {
        if ($code <= $key) {
            return $desc;
        }
    }

    return 'Unknown weather condition';
}
?>
