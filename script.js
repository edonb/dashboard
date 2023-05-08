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
        const price = Number(await fetchData(symbols[coin]));
        document.getElementById(coin).querySelector('.price').textContent = `$ ${price.toFixed(2)}`;
        
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
    copenhagen: {
        lat: 55.6761,
        lon: 12.5683
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
  
      const weatherIcon = locationElement.querySelector('.weather-icon');
      weatherIcon.classList.remove(...weatherIcon.classList);
      weatherIcon.classList.add('wi', iconClass);
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



setInterval(function() {
    location.reload();
  }, 1800000);


  function setGreeting() {
    const hour = new Date().getHours();
    const greetingElem = document.querySelector('.greeting');
  
    if (hour >= 6 && hour < 12) {
      greetingElem.textContent = 'God morgen';
    } else if (hour >= 12 && hour < 18) {
      greetingElem.textContent = 'God ettermiddag';
    } else if (hour >= 18 && hour < 24) {
      greetingElem.textContent = 'God kveld';
    } else {
      greetingElem.textContent = 'God natt';
    }
  }
  
  setGreeting();
  window.onload = function() {
    setGreeting();
    updatePrices();
    updateWeather();
  };

  async function updateNewsFeed() {
    const rssUrl = 'https://www.nrk.no/nyheter/siste.rss';
    const proxyUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent(rssUrl);
    const parser = new RSSParser();
    const response = await fetch(proxyUrl);
    const data = await response.json();
    const feed = await parser.parseString(data.contents);
  
    const items = feed.items.slice(0, 3); // Limit to the first 3 items
    const container = document.querySelector('.container');
    const newsCards = document.createElement('div');
    newsCards.classList.add('news-cards');
  
    items.forEach(item => {
      const title = item.title;
      const description = item.content;
      const date = item.date;
      const link = item.link;
  
      const norwegianDate = new Intl.DateTimeFormat('no-NO', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: "2-digit"
      }).format(new Date(date));
  
      const card = document.createElement('div');
      card.classList.add('card-news');
  
      const h2Elem = document.createElement('h3');
      h2Elem.innerText = title;
      card.appendChild(h2Elem);


  
      const dateElem = document.createElement('small');
      dateElem.innerText = norwegianDate;
      card.appendChild(dateElem);
  
      const hr = document.createElement('hr');
      card.appendChild(hr);
  
      const pElem = document.createElement('p');
      pElem.innerText = description;
      card.appendChild(pElem);

      const linkElem = document.createElement('a');
      linkElem.href = link

      const imgElem = document.createElement('img');
      imgElem.src = "https://info.nrk.no/wp-content/uploads/2019/09/nrk_nyheter_rgb.png"; 
      imgElem.alt = "NRK nyheter - "+title;
      
      linkElem.appendChild(imgElem);
      card.appendChild(linkElem);
  
      newsCards.appendChild(card);
    });
  
    container.appendChild(newsCards);
  }
  
  updateNewsFeed();
  
  
  
  
  