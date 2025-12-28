
class WeatherApp {
    /**
     * Constructor - Initialize app settings
     */
    constructor() {
        this.API_BASE_URL = 'http://localhost:8000/backend/api'; // Backend API base URL
        this.cacheDuration = 5 * 60 * 1000; // Cache duration: 5 minutes in milliseconds
        this.init();
    }

    /**
     * Initialize the application
     * - Load cached data
     * - Setup event listeners
     * - Load search history from database
     * - Setup loading animations
     */
    init() {
        this.cache = this.loadCache();
        this.setupEventListeners();
        this.loadSearchHistory();
        this.setupSkeletonLoading();
    }

    /**
     * ========================================
     * EVENT LISTENERS SETUP
     * ========================================
     * Setup all event listeners for user interactions
     */
    setupEventListeners() {
        // Search button click
        document.getElementById('search-btn').addEventListener('click', () => this.searchWeather());

        // Enter key press in search input
        document.getElementById('city-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.searchWeather();
        });

        // Clear input button
        document.getElementById('clear-btn').addEventListener('click', () => this.clearInput());

        // Show/hide clear button based on input
        document.getElementById('city-input').addEventListener('input', (e) => {
            this.toggleClearButton(e.target.value);
        });

        // Quick search city chips (Cairo, London, Tokyo, etc.)
        document.querySelectorAll('.city-chip').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const city = e.target.dataset.city;
                document.getElementById('city-input').value = city;
                this.searchWeather();
            });
        });

        // Retry button in error state
        document.getElementById('retry-btn').addEventListener('click', () => {
            const city = document.getElementById('city-input').value;
            if (city) this.searchWeather();
        });

        // Clear all history button
        document.getElementById('clear-history').addEventListener('click', () => {
            this.clearHistory();
        });
    }

    setupSkeletonLoading() {
        const skeleton = `
            <div class="skeleton-loading">
                <div class="skeleton-header"></div>
                <div class="skeleton-details">
                    ${Array(6).fill('<div class="skeleton-card"></div>').join('')}
                </div>
            </div>
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            .skeleton-loading {
                padding: 32px;
            }
            
            .skeleton-header {
                height: 80px;
                background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                background-size: 200% 100%;
                animation: loading 1.5s infinite;
                border-radius: 12px;
                margin-bottom: 32px;
            }
            
            .skeleton-details {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                gap: 16px;
            }
            
            .skeleton-card {
                height: 100px;
                background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                background-size: 200% 100%;
                animation: loading 1.5s infinite;
                border-radius: 8px;
            }
            
            @keyframes loading {
                0% { background-position: 200% 0; }
                100% { background-position: -200% 0; }
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * ========================================
     * SEARCH WEATHER - MAIN FUNCTION
     * ========================================
     * Fetches weather data for the entered city
     *
     * Process:
     * 1. Get city name from input
     * 2. Call backend API
     * 3. Display weather data
     * 4. Save to cache and history
     */
   async searchWeather() {
    const city = document.getElementById('city-input').value.trim();
    if (!city) return; // Exit if input is empty

    this.showLoading(); // Show skeleton loader

    try {
        // Call backend API to get weather data
        const response = await fetch(
            `${this.API_BASE_URL}/weather.php?city=${encodeURIComponent(city)}`
        );

        const data = await response.json();

        // Check for API errors
        if (data.error) {
            throw new Error(data.error);
        }

        // Display weather data on screen
        this.displayWeather(data);

        // Save to localStorage cache (5 min)
        this.saveToCache(city, data);

        // Save to database history
        this.saveToHistory(data.city, data.country);

        // Show success notification
        this.showToast(`Weather loaded for ${data.city}`);

    } catch (err) {
        // Show error message to user
        this.showError(err.message);
    } finally {
        // Hide loader in all cases
        this.hideLoading();
    }
}



    async getCoordinates(city) {
        const url = `${this.API_BASE_URL}/weather.php?city=${encodeURIComponent(city)}`;
        
        try {
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error);
            }
            
            return {
                city: data.city || 'Unknown',
                country: data.country || 'Unknown',
                latitude: data.latitude,
                longitude: data.longitude,
                display_name: data.display_name || `${data.city}, ${data.country}`
            };
            
        } catch (error) {
            console.error('Coordinates error:', error);
            throw new Error('Unable to find location. Please check the city name and try again.');
        }
    }

    async getWeatherData(coordinates) {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}&current_weather=true&hourly=temperature_2m,relativehumidity_2m,windspeed_10m&daily=sunrise,sunset&timezone=auto`;
        
        try {
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Weather API Error: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (!data.current_weather) {
                throw new Error('Weather data not available');
            }
            
            return {
                temperature: data.current_weather.temperature,
                windspeed: data.current_weather.windspeed,
                weather_code: data.current_weather.weathercode,
                weather_icon: this.getWeatherIcon(data.current_weather.weathercode),
                weather_description: this.getWeatherDescription(data.current_weather.weathercode),
                humidity: data.hourly?.relativehumidity_2m?.[0] || 'N/A',
                sunrise: data.daily?.sunrise?.[0] || 'N/A',
                sunset: data.daily?.sunset?.[0] || 'N/A',
                time: data.current_weather.time
            };
            
        } catch (error) {
            console.error('Weather data error:', error);
            throw new Error('Unable to fetch weather data. Please try again.');
        }
    }

    /**
     * ========================================
     * DISPLAY WEATHER DATA
     * ========================================
     * Shows weather information on the screen
     *
     * @param {Object} data - Weather data from API
     */
    displayWeather(data) {
        this.hideLoading();  // Hide skeleton loader
        this.hideError();    // Hide any previous errors

        // Show weather card
        const weatherCard = document.getElementById('weather-card');
        weatherCard.classList.remove('hidden');

        // ========================================
        // Update UI Elements with Weather Data
        // ========================================

        // Display city and country names
        document.getElementById('city-name').textContent = data.city;
        document.getElementById('country-name').textContent = data.country;

        // Display coordinates (latitude, longitude) - rounded to 4 decimal places
        document.getElementById('coordinates').textContent =
            `${data.latitude?.toFixed(4) || '--'}, ${data.longitude?.toFixed(4) || '--'}`;

        // Display last update time (formatted as local time)
        document.getElementById('update-time').textContent =
            new Date(data.timestamp).toLocaleTimeString();

        // Display temperature (rounded to 1 decimal place)
        document.getElementById('temperature').textContent =
            data.temperature?.toFixed(1) || '--';

        // Display weather icon (emoji)
        document.getElementById('weather-icon').textContent =
            data.weather_icon || '☀️';

        // Display weather description (e.g., "Clear sky")
        document.getElementById('weather-description').textContent =
            data.weather_description || '--';

        // Display weather code (numeric code from API)
        document.getElementById('weather-code').textContent =
            data.weather_code || '--';

        // Display "feels like" temperature
        document.getElementById('feels-like').textContent =
            data.temperature ? `${data.temperature.toFixed(1)} °C` : '-- °C';

        // Display wind speed (km/h)
        document.getElementById('wind-speed').textContent =
            data.windspeed ? `${data.windspeed.toFixed(1)} km/h` : '-- km/h';

        // Display humidity percentage
        document.getElementById('humidity').textContent =
            data.humidity ? `${data.humidity}%` : '-- %';

        // Display pressure (static value - not from API)
        document.getElementById('pressure').textContent = '1013 hPa';

        // Display visibility (static value - not from API)
        document.getElementById('visibility').textContent = '10 km';

        // Display sunrise time (if available)
        if (data.sunrise !== 'N/A') {
            const sunriseTime = new Date(data.sunrise).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            document.getElementById('sunrise').textContent = sunriseTime;
        }

        // Display sunset time (if available)
        if (data.sunset !== 'N/A') {
            const sunsetTime = new Date(data.sunset).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            document.getElementById('sunset').textContent = sunsetTime;
        }

        // Animate temperature value from 0 to actual value (smooth transition)
        this.animateValue('temperature', 0, data.temperature, 1000);
    }

    /**
     * ========================================
     * CACHE MANAGEMENT - LOCALSTORAGE
     * ========================================
     * Cache weather data for 5 minutes to reduce API calls
     */

    /**
     * Load cache from localStorage
     * @returns {Object} Cache object with city data
     */
    loadCache() {
        const cache = localStorage.getItem('weatherCache');
        return cache ? JSON.parse(cache) : {};
    }

    /**
     * Save cache to localStorage
     */
    saveCache() {
        localStorage.setItem('weatherCache', JSON.stringify(this.cache));
    }

    /**
     * Get cached weather data for a city (if still valid)
     * @param {string} city - City name
     * @returns {Object|null} Cached data or null if expired/not found
     */
    getFromCache(city) {
        const cached = this.cache[city.toLowerCase()];
        // Check if cache exists and is still valid (within 5 minutes)
        if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
            return cached.data;
        }
        return null; // Cache expired or doesn't exist
    }

    /**
     * Save weather data to cache
     * @param {string} city - City name
     * @param {Object} data - Weather data to cache
     */
    saveToCache(city, data) {
        this.cache[city.toLowerCase()] = {
            data: data,
            timestamp: Date.now() // Current timestamp for expiration check
        };
        this.saveCache();
    }

    /**
     * Clear all cached data
     */
    clearCache() {
        this.cache = {};
        this.saveCache();
    }

    /**
     * ========================================
     * SAVE TO HISTORY
     * ========================================
     * Save search to localStorage (backup) and trigger database reload
     *
     * @param {string} city - City name
     * @param {string} country - Country name
     */
    saveToHistory(city, country) {
        // Keep localStorage as backup (in case database fails)
        // Load existing history from localStorage
        let history = JSON.parse(localStorage.getItem('weatherHistory') || '[]');

        // Remove duplicate entry if city already exists
        history = history.filter(item => item.city.toLowerCase() !== city.toLowerCase());

        // Add new search to the beginning of array
        history.unshift({
            city: city,
            country: country,
            time: new Date().toISOString(),
            timestamp: Date.now()
        });

        // Keep only last 10 searches
        history = history.slice(0, 10);

        // Save updated history to localStorage
        localStorage.setItem('weatherHistory', JSON.stringify(history));

        // Reload history from database to show updated data
        // (Database save happens in backend after weather API call)
        this.loadSearchHistory();
    }

    /**
     * ========================================
     * LOAD SEARCH HISTORY FROM DATABASE
     * ========================================
     * Fetches recent searches from backend API
     * Falls back to localStorage if database fails
     */
    async loadSearchHistory() {
        try {
            // Fetch history from database via API
            const response = await fetch(`${this.API_BASE_URL}/history.php`);
            const dbHistory = await response.json();

            // Format database history to match localStorage format
            const formattedHistory = dbHistory.map(item => ({
                city: item.city,
                country: item.country,
                time: item.time,
                timestamp: new Date(item.time).getTime()
            }));

            // Display formatted history
            this.displayHistory(formattedHistory);
        } catch (error) {
            console.error('Error loading history from database:', error);
            // Fallback to localStorage if database fails
            const history = JSON.parse(localStorage.getItem('weatherHistory') || '[]');
            this.displayHistory(history);
        }
    }

    /**
     * ========================================
     * DISPLAY HISTORY
     * ========================================
     * Renders history items in the UI
     *
     * @param {Array} history - Array of history items
     */
    displayHistory(history) {
        const container = document.getElementById('history-container');

        // Show empty state if no history
        if (!history || history.length === 0) {
            container.innerHTML = `
                <div class="empty-history">
                    <i class="fas fa-search"></i>
                    <p>No recent searches</p>
                    <small>Search for a city to see it here</small>
                </div>
            `;
            return;
        }

        // Generate HTML for each history item
        const historyHTML = history.map(item => `
            <div class="history-item" onclick="app.searchFromHistory('${item.city}')">
                <div class="history-item-content">
                    <!-- City and country name -->
                    <div class="history-city">${item.city}, ${item.country}</div>
                    <!-- Search timestamp (formatted as local date/time) -->
                    <div class="history-time">${new Date(item.time).toLocaleString()}</div>
                </div>
                <div class="history-actions">
                    <!-- Delete button for individual item -->
                    <button onclick="app.deleteHistoryItem('${item.city}', event)">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `).join(''); // Join all items into single HTML string

        // Insert generated HTML into container
        container.innerHTML = `<div class="history-list">${historyHTML}</div>`;
    }

    /**
     * ========================================
     * SEARCH FROM HISTORY
     * ========================================
     * Triggered when user clicks on a history item
     *
     * @param {string} city - City name from history
     */
    searchFromHistory(city) {
        // Fill input with city name
        document.getElementById('city-input').value = city;
        // Trigger search
        this.searchWeather();
    }

    /**
     * ========================================
     * DELETE HISTORY ITEM
     * ========================================
     * Remove a single item from history
     *
     * @param {string} city - City name to remove
     * @param {Event} event - Click event (to stop propagation)
     */
    deleteHistoryItem(city, event) {
        event.stopPropagation(); // Prevent triggering searchFromHistory

        // Load history from localStorage
        let history = JSON.parse(localStorage.getItem('weatherHistory') || '[]');
        // Filter out the selected city
        history = history.filter(item => item.city !== city);
        // Save updated history
        localStorage.setItem('weatherHistory', JSON.stringify(history));
        // Refresh display
        this.displayHistory(history);

        // Show confirmation toast
        this.showToast('Search removed from history');
    }

    /**
     * ========================================
     * CLEAR ALL HISTORY
     * ========================================
     * Remove all history items (with confirmation)
     */
    clearHistory() {
        // Ask for confirmation
        if (confirm('Are you sure you want to clear all search history?')) {
            // Remove from localStorage
            localStorage.removeItem('weatherHistory');
            // Show empty state
            this.displayHistory([]);
            // Show confirmation toast
            this.showToast('Search history cleared');
        }
    }

    /**
     * ========================================
     * UI STATE MANAGEMENT
     * ========================================
     */

    /**
     * Show loading state
     * - Hide weather card and error state
     * - Show loading spinner
     * - Disable search button
     */
    showLoading() {
        document.getElementById('weather-card').classList.add('hidden');
        document.getElementById('error-state').classList.add('hidden');
        document.getElementById('loading-state').classList.remove('hidden');

        // Update search button to show loading state
        const searchBtn = document.getElementById('search-btn');
        searchBtn.disabled = true;
        searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Loading...</span>';
    }

    /**
     * Hide loading state
     * - Hide loading spinner
     * - Re-enable search button
     */
    hideLoading() {
        document.getElementById('loading-state').classList.add('hidden');

        // Restore search button to normal state
        const searchBtn = document.getElementById('search-btn');
        searchBtn.disabled = false;
        searchBtn.innerHTML = '<i class="fas fa-search"></i><span>Get Weather</span>';
    }

    /**
     * Show error state
     * @param {string} message - Error message to display
     */
    showError(message) {
        this.hideLoading(); // Hide loading first

        // Hide other states
        document.getElementById('weather-card').classList.add('hidden');
        document.getElementById('loading-state').classList.add('hidden');

        // Show error state with message
        const errorState = document.getElementById('error-state');
        document.getElementById('error-message').textContent = message;
        errorState.classList.remove('hidden');
    }

    /**
     * Hide error state
     */
    hideError() {
        document.getElementById('error-state').classList.add('hidden');
    }

    /**
     * ========================================
     * TOGGLE CLEAR BUTTON
     * ========================================
     * Show/hide the clear (X) button in search input
     *
     * @param {string} value - Input value
     */
    toggleClearButton(value) {
        const clearBtn = document.getElementById('clear-btn');
        if (value) {
            clearBtn.classList.remove('hidden'); // Show if input has value
        } else {
            clearBtn.classList.add('hidden'); // Hide if input is empty
        }
    }

    /**
     * ========================================
     * CLEAR INPUT
     * ========================================
     * Clear search input and focus it
     */
    clearInput() {
        document.getElementById('city-input').value = '';
        this.toggleClearButton('');
        document.getElementById('city-input').focus(); // Focus input for better UX
    }

    /**
     * ========================================
     * SHOW TOAST NOTIFICATION
     * ========================================
     * Display a temporary notification message
     *
     * @param {string} message - Message to display
     * @param {string} type - Toast type (info, success, error)
     */
    showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `toast ${type}`; // Apply type class for styling
        toast.classList.add('show'); // Show toast

        // Auto-hide after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    /**
     * ========================================
     * GET WEATHER ICON
     * ========================================
     * Convert weather code to emoji icon
     *
     * @param {number} code - Weather code from API
     * @returns {string} Emoji icon
     */
    getWeatherIcon(code) {
        const icons = {
            0: '☀️',   // Clear sky
            1: '🌤️',   // Mainly clear
            2: '⛅',   // Partly cloudy
            3: '☁️',   // Overcast
            45: '🌫️',  // Fog
            48: '🌫️',  // Depositing rime fog
            51: '🌦️',  // Light drizzle
            53: '🌦️',  // Moderate drizzle
            55: '🌦️',  // Dense drizzle
            61: '🌧️',  // Slight rain
            63: '🌧️',  // Moderate rain
            65: '🌧️',  // Heavy rain
            71: '❄️',   // Slight snow
            73: '❄️',   // Moderate snow
            75: '❄️',   // Heavy snow
            77: '🌨️',  // Snow grains
            80: '🌦️',  // Slight rain showers
            81: '🌧️',  // Moderate rain showers
            82: '🌧️',  // Violent rain showers
            85: '🌨️',  // Slight snow showers
            86: '🌨️',  // Heavy snow showers
            95: '⛈️',   // Thunderstorm
            96: '⛈️',   // Thunderstorm with slight hail
            99: '⛈️'    // Thunderstorm with heavy hail
        };
        return icons[code] || '☀️'; // Default to sun icon
    }

    /**
     * ========================================
     * GET WEATHER DESCRIPTION
     * ========================================
     * Convert weather code to text description
     *
     * @param {number} code - Weather code from API
     * @returns {string} Weather description
     */
    getWeatherDescription(code) {
        const descriptions = {
            0: 'Clear sky',
            1: 'Mainly clear',
            2: 'Partly cloudy',
            3: 'Overcast',
            45: 'Foggy',
            48: 'Foggy',
            51: 'Light drizzle',
            53: 'Moderate drizzle',
            55: 'Heavy drizzle',
            61: 'Light rain',
            63: 'Moderate rain',
            65: 'Heavy rain',
            71: 'Light snow',
            73: 'Moderate snow',
            75: 'Heavy snow',
            77: 'Snow grains',
            80: 'Light rain showers',
            81: 'Moderate rain showers',
            82: 'Heavy rain showers',
            85: 'Light snow showers',
            86: 'Heavy snow showers',
            95: 'Thunderstorm',
            96: 'Thunderstorm with hail',
            99: 'Thunderstorm with heavy hail'
        };
        return descriptions[code] || 'Unknown'; // Default to "Unknown"
    }

    /**
     * ========================================
     * ANIMATE VALUE
     * ========================================
     * Smoothly animate a number from start to end value
     * Used for temperature animation
     *
     * @param {string} elementId - ID of element to animate
     * @param {number} start - Starting value
     * @param {number} end - Ending value
     * @param {number} duration - Animation duration in milliseconds
     */
    animateValue(elementId, start, end, duration) {
        // Validate inputs are numbers
        if (typeof start === 'string' || typeof end === 'string') return;

        // Get element
        const element = document.getElementById(elementId);
        if (!element) return; // Exit if element not found

        // Calculate animation parameters
        const range = end - start; // Total change
        const increment = range / (duration / 16); // Change per frame (60fps)
        let current = start; // Current value

        // Animation loop (runs every 16ms ≈ 60fps)
        const timer = setInterval(() => {
            current += increment; // Update current value
            element.textContent = current.toFixed(1); // Display with 1 decimal

            // Stop when target reached
            if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
                element.textContent = end.toFixed(1); // Set final value
                clearInterval(timer); // Stop animation
            }
        }, 16); // 16ms ≈ 60fps
    }
}

// ========================================
// INITIALIZE APP ON PAGE LOAD
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // Create global instance of WeatherApp
    window.app = new WeatherApp();
});
