class WeatherApp {
    constructor() {
        this.API_BASE_URL = 'http://localhost:8000/api';
        this.cacheDuration = 5 * 60 * 1000; 
        this.init();
    }

    init() {
        this.cache = this.loadCache();
        this.setupEventListeners();
        this.loadSearchHistory();
        this.setupSkeletonLoading();
    }

    setupEventListeners() {
        document.getElementById('search-btn').addEventListener('click', () => this.searchWeather());
        
        document.getElementById('city-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.searchWeather();
        });
        
        document.getElementById('clear-btn').addEventListener('click', () => this.clearInput());
        
        document.getElementById('city-input').addEventListener('input', (e) => {
            this.toggleClearButton(e.target.value);
        });
                document.querySelectorAll('.city-chip').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const city = e.target.dataset.city;
                document.getElementById('city-input').value = city;
                this.searchWeather();
            });
        });
        
        document.getElementById('retry-btn').addEventListener('click', () => {
            const city = document.getElementById('city-input').value;
            if (city) this.searchWeather();
        });
        
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

   async searchWeather() {
    const city = document.getElementById('city-input').value.trim();
    if (!city) return;

    this.showLoading();

    try {
        const response = await fetch(
            `${this.API_BASE_URL}/weather.php?city=${encodeURIComponent(city)}`
        );

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error);
        }

        this.displayWeather(data);
        this.saveToCache(city, data);
        this.saveToHistory(data.city, data.country);

        this.showToast(`Weather loaded for ${data.city}`);

    } catch (err) {
        this.showError(err.message);
    } finally {
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

    displayWeather(data) {
        this.hideLoading();
        this.hideError();
                const weatherCard = document.getElementById('weather-card');
        weatherCard.classList.remove('hidden');
                document.getElementById('city-name').textContent = data.city;
        document.getElementById('country-name').textContent = data.country;
        document.getElementById('coordinates').textContent = 
            `${data.latitude?.toFixed(4) || '--'}, ${data.longitude?.toFixed(4) || '--'}`;
        document.getElementById('update-time').textContent = 
            new Date(data.timestamp).toLocaleTimeString();
        
        document.getElementById('temperature').textContent = 
            data.temperature?.toFixed(1) || '--';
        document.getElementById('weather-icon').textContent = 
            data.weather_icon || '☀️';
        document.getElementById('weather-description').textContent = 
            data.weather_description || '--';
        document.getElementById('weather-code').textContent = 
            data.weather_code || '--';
                document.getElementById('feels-like').textContent = 
            data.temperature ? `${data.temperature.toFixed(1)} °C` : '-- °C';
        document.getElementById('wind-speed').textContent = 
            data.windspeed ? `${data.windspeed.toFixed(1)} km/h` : '-- km/h';
        document.getElementById('humidity').textContent = 
            data.humidity ? `${data.humidity}%` : '-- %';
        document.getElementById('pressure').textContent = '1013 hPa'; 
        document.getElementById('visibility').textContent = '10 km';
        
        if (data.sunrise !== 'N/A') {
            const sunriseTime = new Date(data.sunrise).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            document.getElementById('sunrise').textContent = sunriseTime;
        }
        
        if (data.sunset !== 'N/A') {
            const sunsetTime = new Date(data.sunset).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            document.getElementById('sunset').textContent = sunsetTime;
        }
        
        this.animateValue('temperature', 0, data.temperature, 1000);
    }

    loadCache() {
        const cache = localStorage.getItem('weatherCache');
        return cache ? JSON.parse(cache) : {};
    }

    saveCache() {
        localStorage.setItem('weatherCache', JSON.stringify(this.cache));
    }

    getFromCache(city) {
        const cached = this.cache[city.toLowerCase()];
        if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
            return cached.data;
        }
        return null;
    }

    saveToCache(city, data) {
        this.cache[city.toLowerCase()] = {
            data: data,
            timestamp: Date.now()
        };
        this.saveCache();
    }

    clearCache() {
        this.cache = {};
        this.saveCache();
    }

    saveToHistory(city, country) {
        let history = JSON.parse(localStorage.getItem('weatherHistory') || '[]');
        
        history = history.filter(item => item.city.toLowerCase() !== city.toLowerCase());
        
        history.unshift({
            city: city,
            country: country,
            time: new Date().toISOString(),
            timestamp: Date.now()
        });
        
        history = history.slice(0, 10);
        
        localStorage.setItem('weatherHistory', JSON.stringify(history));
        this.displayHistory(history);
    }

    loadSearchHistory() {
        const history = JSON.parse(localStorage.getItem('weatherHistory') || '[]');
        this.displayHistory(history);
    }

    displayHistory(history) {
        const container = document.getElementById('history-container');
        
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
        
        const historyHTML = history.map(item => `
            <div class="history-item" onclick="app.searchFromHistory('${item.city}')">
                <div class="history-item-content">
                    <div class="history-city">${item.city}, ${item.country}</div>
                    <div class="history-time">${new Date(item.time).toLocaleString()}</div>
                </div>
                <div class="history-actions">
                    <button onclick="app.deleteHistoryItem('${item.city}', event)">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `).join('');
        
        container.innerHTML = `<div class="history-list">${historyHTML}</div>`;
    }

    searchFromHistory(city) {
        document.getElementById('city-input').value = city;
        this.searchWeather();
    }

    deleteHistoryItem(city, event) {
        event.stopPropagation();
        
        let history = JSON.parse(localStorage.getItem('weatherHistory') || '[]');
        history = history.filter(item => item.city !== city);
        localStorage.setItem('weatherHistory', JSON.stringify(history));
        this.displayHistory(history);
        
        this.showToast('Search removed from history');
    }

    clearHistory() {
        if (confirm('Are you sure you want to clear all search history?')) {
            localStorage.removeItem('weatherHistory');
            this.displayHistory([]);
            this.showToast('Search history cleared');
        }
    }

    showLoading() {
        document.getElementById('weather-card').classList.add('hidden');
        document.getElementById('error-state').classList.add('hidden');
        document.getElementById('loading-state').classList.remove('hidden');
        
        const searchBtn = document.getElementById('search-btn');
        searchBtn.disabled = true;
        searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Loading...</span>';
    }

    hideLoading() {
        document.getElementById('loading-state').classList.add('hidden');
        
        const searchBtn = document.getElementById('search-btn');
        searchBtn.disabled = false;
        searchBtn.innerHTML = '<i class="fas fa-search"></i><span>Get Weather</span>';
    }

    showError(message) {
        this.hideLoading();
        
        document.getElementById('weather-card').classList.add('hidden');
        document.getElementById('loading-state').classList.add('hidden');
        
        const errorState = document.getElementById('error-state');
        document.getElementById('error-message').textContent = message;
        errorState.classList.remove('hidden');
    }

    hideError() {
        document.getElementById('error-state').classList.add('hidden');
    }

    toggleClearButton(value) {
        const clearBtn = document.getElementById('clear-btn');
        if (value) {
            clearBtn.classList.remove('hidden');
        } else {
            clearBtn.classList.add('hidden');
        }
    }

    clearInput() {
        document.getElementById('city-input').value = '';
        this.toggleClearButton('');
        document.getElementById('city-input').focus();
    }

    showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `toast ${type}`;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    getWeatherIcon(code) {
        const icons = {
            0: '☀️',  
            1: '🌤️',  
            2: '⛅',  
            3: '☁️',  
            45: '🌫️', 
            48: '🌫️', 
            51: '🌦️', 
            53: '🌦️',
            55: '🌦️', 
            61: '🌧️',
            63: '🌧️', 
            65: '🌧️', 
            71: '❄️', 
            73: '❄️', 
            75: '❄️', 
            77: '🌨️', 
            80: '🌦️', 
            81: '🌧️', 
            82: '🌧️', 
            85: '🌨️', 
            86: '🌨️', 
            95: '⛈️', 
            96: '⛈️', 
            99: '⛈️'  
        };
        return icons[code] || '☀️';
    }

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
        return descriptions[code] || 'Unknown';
    }

    animateValue(elementId, start, end, duration) {
        if (typeof start === 'string' || typeof end === 'string') return;
        
        const element = document.getElementById(elementId);
        if (!element) return;
        
        const range = end - start;
        const increment = range / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            element.textContent = current.toFixed(1);
            
            if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
                element.textContent = end.toFixed(1);
                clearInterval(timer);
            }
        }, 16);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.app = new WeatherApp();
});
