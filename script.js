const apiUrl = "https://api.binance.com/api/v3/ticker/24hr";
const metApiUrl = "https://api.met.no/weatherapi/locationforecast/2.0/compact";
const cards = document.querySelectorAll('.card');
const weather = document.querySelectorAll('.weather-marquee');
const symbols = {
  btc: "BTCUSDT",
  eth: "ETHUSDT",
  ltc: "LTCUSDT"
};

const previousPrices = {
  btc: null,
  eth: null,
  ltc: null
};

async function fetchData(symbol) {
  const response = await fetch(`${apiUrl}?symbol=${symbol}`);
  const { lastPrice } = await response.json();
  return Number(lastPrice);
}

function showArrow(coin, direction) {
  const arrowElem = document.createElement("span");
  arrowElem.classList.add("arrow", direction);
  document.getElementById(coin).appendChild(arrowElem);

  setTimeout(() => {
    arrowElem.remove();
  }, 5000);
}

async function updatePrices() {
  for (const coin in symbols) {
    const price = Number(await fetchData(symbols[coin]));

    if (previousPrices[coin] !== null) {
      if (price > previousPrices[coin]) {
        showArrow(coin, "up");
      } else if (price < previousPrices[coin]) {
        showArrow(coin, "down");
      } else {
        showArrow(coin, "right");
      }
    }

    previousPrices[coin] = price;
    document.getElementById(coin).querySelector(".price").textContent = `$ ${price.toFixed(2)}`;


  }
  cards.forEach(card => {
    card.style.display = 'block';
  });
}

updatePrices();
setInterval(updatePrices, 60000);

const locations = {
  oslo: { lat: 59.9139, lon: 10.7522 },
  sarpsborg: { lat: 59.2831, lon: 11.1097 },
  copenhagen: { lat: 55.6761, lon: 12.5683 },
  nice: { lat: 43.7102, lon: 7.2620 },
  monaco: { lat: 43.7384, lon: 7.4246 }
};


function fetchPolyfill(url, options) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open(options.method || 'GET', url);
    if (options.headers) {
      Object.keys(options.headers).forEach(function(key) {
        xhr.setRequestHeader(key, options.headers[key]);
      });
    }
    xhr.onload = function() {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.response));
      } else {
        reject(new Error(xhr.statusText));
      }
    };
    xhr.onerror = function() {
      reject(new Error('Network Error'));
    };
    xhr.send(options.body);
  });
}

async function fetchWeatherData(lat, lon) {
    const data = await fetchPolyfill(`${metApiUrl}?lat=${lat}&lon=${lon}`, {
    });
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
    weather.forEach(weather => {
      weather.style.display = 'block';
    });
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
  
    const items = feed.items.slice(0, 5); 
    const container = document.querySelector('.container');
    const newsCards = document.createElement('div');
    newsCards.classList.add('news-cards');


    const dotContainer = document.createElement('div');
    dotContainer.classList.add('dot-container');
  
    items.forEach((item, index) => {
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

      if (index === 0) {
        card.classList.add('active');
      }
  
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
  
      newsCards.appendChild(card);
    });

    for (let i = 0; i < items.length; i++) {
      const dot = document.createElement('div');
      dot.classList.add('dot');
        
      if (i === 0) {
        dot.classList.add('active');
      }
    
      dotContainer.appendChild(dot);
    }
      
    container.appendChild(newsCards);
    container.appendChild(dotContainer);
}


function switchActiveNewsItem() {
  const cards = Array.from(document.querySelectorAll('.card-news'));
  const dots = Array.from(document.querySelectorAll('.dot'));
  let activeIndex = cards.findIndex(card => card.classList.contains('active'));


  cards[activeIndex].classList.remove('active');
  dots[activeIndex].classList.remove('active');


  activeIndex = (activeIndex + 1) % cards.length;
  cards[activeIndex].classList.add('active');
  dots[activeIndex].classList.add('active');
}
  

  setInterval(switchActiveNewsItem, 60000); 
  
  updateNewsFeed();

  
  document.addEventListener('DOMContentLoaded', function() {
    const nrkRadio = document.getElementById('nrkRadio');
    const playPauseBtn = document.getElementById('playPauseBtn');
  
    playPauseBtn.addEventListener('click', function() {
      if (nrkRadio.paused) {
        nrkRadio.play();
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
      } else {
        nrkRadio.pause();
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
      }
    });
  });
  
  
  async function getNokToUsdRate() {
    const response = await fetch(
      "https://api.exchangerate.host/latest?base=USD&symbols=NOK"
    );
    const data = await response.json();
    return data.rates.NOK;
  }
  async function calculateUSDValue() {
    const usdToNokRate = await getNokToUsdRate();
    const usdAmount = 1;
    const nokAmount = usdAmount * usdToNokRate;
    document.getElementById("usd-nok").querySelector(".price").textContent = `${nokAmount.toFixed(2)} NOK`;
  }
  
  calculateUSDValue();

  async function getEuroToNokRate() {
    const response = await fetch(
      "https://api.exchangerate.host/latest?base=EUR&symbols=NOK"
    );
    const data = await response.json();
    return data.rates.NOK;
  }
  
  async function calculateEURValue() {
    const euroToNokRate = await getEuroToNokRate();
    const euroAmount = 1;
    const nokAmount = euroAmount * euroToNokRate;
    document.getElementById("eur-nok").querySelector(".price").textContent = `${nokAmount.toFixed(2)} NOK`;
  }
  
  calculateEURValue();


  