const apiUrl = "https://api.binance.com/api/v3/ticker/24hr";

const symbols = {
    btc: "BTCUSDT",
    eth: "ETHUSDT",
    ltc: "LTCUSDT"
};

async function fetchData(symbol) {
    const response = await fetch(`${apiUrl}?symbol=${symbol}`);
    const data = await response.json();
    return data.lastPrice;
}

async function updatePrices() {
    for (const coin in symbols) {
        const price = await fetchData(symbols[coin]);
        document.getElementById(coin).querySelector('.price').textContent = `$ ${price}`;
    }
}

updatePrices();
setInterval(updatePrices, 60000); 

const metApiUrl = "https://api.met.no/weatherapi/locationforecast/2.0/compact";

const locations = {
    oslo: {
        lat: 59.9139,
        lon: 10.7522
    },
    sarpsborg: {
        lat: 59.2831,
        lon: 11.1097
    },
    nice: {
        lat: 43.7102,
        lon: 7.2620
    },
    monaco: {
        lat: 43.7384,
        lon: 7.4246 
    }
};

async function fetchWeatherData(lat, lon) {
    const response = await fetch(`${metApiUrl}?lat=${lat}&lon=${lon}`, {
        headers: {
            'User-Agent': 'YourAppName/1.0 yourname@example.com'
        }
    });
    const data = await response.json();
    const temp = data.properties.timeseries[0].data.instant.details.air_temperature;
    const symbolCode = data.properties.timeseries[0].data.next_1_hours.summary.symbol_code;
    return { temperature: temp, symbolCode: symbolCode };
}


async function updateWeather() {
    for (const location in locations) {
      const { temperature, symbolCode } = await fetchWeatherData(locations[location].lat, locations[location].lon);
      const iconClass = getWeatherIconClass(symbolCode);
      const locationElement = document.getElementById(location);
      locationElement.querySelector('.temperature').textContent = `${temperature.toFixed(1)}°C`;
      locationElement.querySelector('.weather-icon').className = `wi ${iconClass}`;
    }
  }
  

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getWeatherIconClass(symbolCode) {
    switch (symbolCode) {
        case 'clearsky_day':
            return 'wi-day-sunny';
        case 'clearsky_night':
            return 'wi-night-clear';
        case 'cloudy':
            return 'wi-cloudy';
        case 'fair_day':
            return 'wi-day-cloudy';
        case 'fair_night':
            return 'wi-night-alt-cloudy';
        case 'fog':
            return 'wi-fog';
        case 'heavyrain':
            return 'wi-rain';
        case 'heavyrainandthunder':
            return 'wi-thunderstorm';
        case 'heavyrainshowers_day':
            return 'wi-day-showers';
        case 'heavyrainshowers_night':
            return 'wi-night-alt-showers';
        case 'lightrain':
            return 'wi-sprinkle';
        case 'lightrainandthunder':
            return 'wi-storm-showers';
        case 'lightrainshowers_day':
            return 'wi-day-sprinkle';
        case 'lightrainshowers_night':
            return 'wi-night-alt-sprinkle';
        case 'partlycloudy_day':
            return 'wi-day-cloudy-high';
            case 'partlycloudy_night':
                return 'wi-night-alt-cloudy-high';
            case 'rain':
                return 'wi-rain';
            case 'rainandthunder':
                return 'wi-thunderstorm';
            case 'rainshowers_day':
                return 'wi-day-showers';
            case 'rainshowers_night':
                return 'wi-night-alt-showers';
            case 'sleet':
                return 'wi-sleet';
            case 'sleetandthunder':
                return 'wi-storm-showers';
            case 'sleetshowers_day':
                return 'wi-day-sleet-storm';
            case 'sleetshowers_night':
                return 'wi-night-alt-sleet-storm';
            case 'snow':
                return 'wi-snow';
            case 'snowandthunder':
                return 'wi-snow-thunderstorm';
            case 'snowshowers_day':
                return 'wi-day-snow';
            case 'snowshowers_night':
                return 'wi-night-alt-snow';
            default:
                return 'wi-na';
        }
    }


updateWeather();
setInterval(updateWeather, 600000);

setInterval(function() {
    location.reload();
  }, 1800000);