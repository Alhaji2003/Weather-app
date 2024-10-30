const cityInput = document.querySelector('.city-input');
const searchBtn = document.querySelector('.search-btn');
const notFoundSection = document.querySelector('.not-found');
const searchCitySection = document.querySelector('.search-city ');
const weatherInfoSection = document.querySelector('.weather-info');
const countyTxt = document.querySelector('.country-txt');
const tempTxt = document.querySelector('.temp-txt');
const conditionTxt = document.querySelector('.condition-txt');
const humidityValueTxt = document.querySelector('.humidity-value-txt');
const windValueTxt = document.querySelector('.wind-value-txt');
const weatherSummaryImg = document.querySelector('.weather-summary-img');
const currentDataTxt = document.querySelector('.current-data-txt');
const forecastItemsContainer = document.querySelector('.forecast-items-container');

const bgImageChange = document.querySelector('body');

const apiKey = '97176f13364aebd3f8758ec10332a001';

searchBtn.addEventListener('click', () => {
    if (cityInput.value.trim() != '') {
        updateWeatherInfo(cityInput.value);
        cityInput.value = '';
        cityInput.blur();
    }
});

cityInput.addEventListener('keydown', (e) => {
    if (e.key == 'Enter' && cityInput.value.trim() != '') {
        updateWeatherInfo(cityInput.value);
        cityInput.value = '';
        cityInput.blur();
    }
});

// getFetchData Function
async function getFetchData(endPoint, city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`

    const response = await fetch(apiUrl);
    return response.json();
};
// END getFetchData Function

// getWeatherIcon Function
function getWeatherIcon(id) {
    if (id <= 232) return 'thunderstorm.svg'
    if (id <= 321) return 'drizzle.svg'
    if (id <= 531) return 'rain.svg'
    if (id <= 622) return 'snow.svg'
    if (id <= 781) return 'atmosphere.svg'
    if (id <= 800) return 'clear.svg'
    else return 'clouds.svg'
};
//END getWeatherIcon Function
function getbackgroundPicture(id) {
    if (id <= 232) return 'thunderstorm.jpg'
    if (id <= 321) return 'drizzle.jpg'
    if (id <= 531) return 'rain.jpg'
    if (id <= 622) return 'snow.jpg'
    if (id <= 781) return 'atmospher.jpg'
    if (id <= 800) return 'clear.jpg'
    else return 'cloud.jpg'
}
// getCurrentData Function
function getCurrentData() {
    const currentDate = new Date();
    const options = {
        weekday: 'short',
        day: '2-digit',
        month: 'short'
    }

    return currentDate.toLocaleDateString('en-GB', options)
}
//END getCurrentData Function

// updateWeatherInfo Function
async function updateWeatherInfo(city) {
    const weatherData = await getFetchData('weather', city);
    if (weatherData.cod != 200) {
        showDisplaySection(notFoundSection);
        return
    }

    const {
        name: country,
        main: { temp, humidity },
        weather: [{ id, main }],
        wind: { speed }
    } = weatherData

    countyTxt.textContent = country;
    tempTxt.textContent = Math.round(temp) + ' °C';
    conditionTxt.textContent = main;
    humidityValueTxt.textContent = humidity + '%';
    windValueTxt.textContent = speed + ' M/s';
    currentDataTxt.textContent = getCurrentData();
    weatherSummaryImg.src = `assets/weather/${getWeatherIcon(id)}`
    bgImageChange.style.background = `url(assets/weatherBg/${getbackgroundPicture(id)})`
    bgImageChange.style.width = '100%'
    bgImageChange.style.height = '100dvh'
    bgImageChange.style.backgroundSize = 'cover'
    bgImageChange.style.backgroundPosition = 'center'
    // bgImageChange.style.background = 

    await updateForecastsInfo(city);
    showDisplaySection(weatherInfoSection)
};
//END updateWeatherInfo Function

// updateForecastsInfo Function
async function updateForecastsInfo(city) {
    const forecastsData = await getFetchData('forecast', city)

    const timeTaken = '12:00:00';
    const todayDate = new Date().toISOString().split('T')[0];

    forecastItemsContainer.innerHTML = ''

    forecastsData.list.forEach(forecastWeather => {

        if (forecastWeather.dt_txt.includes(timeTaken) &&
            !forecastWeather.dt_txt.includes(todayDate)) {
            updateForecastItems(forecastWeather);
        }
    })
};
//END updateForecastsInfo Function

// updateForecastItems Function
function updateForecastItems(weatherData) {
    const {
        dt_txt: date,
        weather: [{ id }],
        main: { temp }
    } = weatherData

    const dateTaken = new Date(date);
    const dateOption = {
        day: '2-digit',
        month: 'short'
    }
    const dateResult = dateTaken.toLocaleDateString('en-US', dateOption);


    const forecastItem = `
        <div class="forecast-item">
          <h5 class="forecast-item-date regular-txt">${dateResult}</h5>
          <img
            src="assets/weather/${getWeatherIcon(id)}"
            class="forecast-item-img"
          />
          <h5 class="forecast-item-temp">${Math.round(temp)} °C</h5>
        </div>
  `

    forecastItemsContainer.insertAdjacentHTML('beforeend', forecastItem)
};
//END updateForecastItems Function

// showDisplaySection Function
function showDisplaySection(section) {
    [weatherInfoSection, searchCitySection, notFoundSection]
        .forEach(section => section.style.display = 'none');

    section.style.display = 'flex';
}
//END showDisplaySection Function


