<?php
define('DB_HOST', 'localhost');
define('DB_USER', 'root'); 
define('DB_PASS', ''); 
define('DB_NAME', 'weather_app');

define('GEOCODING_API_URL', 'https://geocoding-api.open-meteo.com/v1/search');
define('WEATHER_API_URL', 'https://api.open-meteo.com/v1/forecast');

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}
function getWeatherIcon($code) {
    if ($code === 0) return '☀️';
    
    if ($code >= 1 && $code <= 3) return '⛅';
        if ($code >= 45 && $code <= 48) return '🌫️';
        if ($code >= 51 && $code <= 56) return '🌦️';
        if ($code >= 57 && $code <= 58) return '🌨️';
        if ($code >= 61 && $code <= 67) return '🌧️';
        if ($code >= 68 && $code <= 69) return '🌨️';
        if ($code >= 71 && $code <= 77) return '❄️';
        if ($code >= 80) return '🌨️';
        if ($code >= 81 && $code <= 84) return '🌦️';
        if ($code >= 85 && $code <= 86) return '❄️';
        if ($code >= 95 && $code <= 99) return '⛈️';
        return '☁️';
}

function getWeatherDescription($code) {
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
        if (isset($descriptions[$code])) {
        return $descriptions[$code];
    }
        foreach ($descriptions as $key => $desc) {
        if ($code <= $key) {
            return $desc;
        }
    }
    
    return 'Unknown weather condition';
}
?>
