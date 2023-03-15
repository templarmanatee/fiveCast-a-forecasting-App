const cityBtn = document.querySelector("#city-btn");
const searchFormEl = document.querySelector("#search-form");

if (!localStorage.getItem("history")) {
  localStorage.setItem("history", JSON.stringify({ cities: [] }));
}

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Search OpenWeather API for a given city string 
const searchApi = async (city) => {
  const weatherQueryUrl = "https://api.openweathermap.org/data/2.5/forecast";
  const apiKey = "26ba3a7e283acb9cd1e8665c6c3b319a";

  const weatherQuery = `${weatherQueryUrl}?&q=${city}&appid=${apiKey}&units=imperial`;
  console.log(weatherQuery);
  const response = await fetch(weatherQuery);

  if (!response.ok) {
    console.log("R.I.P.");
    return;
  }
  const weatherData = await response.json();
  console.log(weatherData);
  const fiveDayForeCast = [weatherData.list[2],
  weatherData.list[10],
  weatherData.list[18],
  weatherData.list[26],
  weatherData.list[34]];
  console.log(fiveDayForeCast);
  return fiveDayForeCast;
};

// Search OpenWeather API for a given city string 
const searchApiToday = async (city) => {
  const weatherQueryUrl = "https://api.openweathermap.org/data/2.5/weather";
  const apiKey = "26ba3a7e283acb9cd1e8665c6c3b319a";

  const weatherQuery = `${weatherQueryUrl}?&q=${city}&appid=${apiKey}&units=imperial`;
  console.log(weatherQuery);
  const response = await fetch(weatherQuery);

  if (!response.ok) {
    console.log("R.I.P.");
    return;
  }
  const weatherData = await response.json();
  return weatherData;
};

// Save the history to localStorage after being updated
const saveHistory = (city) => {
  let historyData = JSON.parse(localStorage.getItem("history")).cities;
  historyData.push(city);
  historyData = historyData.slice(Math.max(historyData.length - 5, 1))
  localStorage.setItem("history", JSON.stringify({ cities: historyData }));
};

// Load the buttons on website open and after a new city is searched for.
const loadButtons = async () => {
  const buttonBlock = document.querySelector("#history");
  // Remove all current elements in the recent searches 
  while (buttonBlock.firstChild) {
    buttonBlock.removeChild(buttonBlock.lastChild);
  }
  // Get all current items from localStorage 
  const historyData = await (JSON.parse(localStorage.getItem("history")).cities) || [];
  historyData.forEach((city) => {
    const button = document.createElement('button');
    button.classList.add('btn');
    button.classList.add('btn-primary');
    button.classList.add('btn-block')
    button.classList.add('historyButton');
    button.innerText = capitalizeFirstLetter(city);
    button.setAttribute('id', city);
    button.onclick = (e) => historyButtonClick(city, e); 
    buttonBlock.appendChild(button);
  });
};

const createTodayCard = (weatherData, inputCity) => {
  const weatherCard = document.createElement('div'); 
  weatherCard.classList.add('card'); 
  weatherCard.classList.add('text-center'); 

  const cardHeader = document.createElement('div');
  cardHeader.classList.add('card-header'); 

  const cardBody = document.createElement('div');
  cardHeader.classList.add('card-body'); 
  const cardTemperature = document.createElement('h5');
  cardHeader.classList.add('card-title'); 
  const cardHumidity = document.createElement('div');
  cardHeader.classList.add('card-text'); 
  const cardWind = document.createElement('div');
  cardHeader.classList.add('card-text'); 
  const imageHolder = document.createElement('div'); 
  imageHolder.classList.add('weather-icon'); 
  imageHolder.classList.add('float-right'); 
  
  const cardImage = document.createElement('img');
  cardImage.classList.add('img-fluid')

  cardHeader.innerText = capitalizeFirstLetter(inputCity); 
  console.log(weatherData)
  cardTemperature.innerText = `Temperature: ${Math.round(weatherData.main.temp)}`; 
  cardHumidity.innerText = `Humidity: ${weatherData.main.humidity}`; 
  cardWind.innerText = `Wind: ${Math.round(weatherData.wind.speed)}`; 

  const icon = weatherData.weather[0].icon;
  cardImage.setAttribute('src', `assets/icons/${icon}.png`);
  imageHolder.appendChild(cardImage);

  cardBody.appendChild(cardTemperature); 
  cardBody.appendChild(cardHumidity); 
  cardBody.appendChild(cardWind); 
  cardBody.appendChild(cardImage);

  weatherCard.appendChild(cardHeader); 
  weatherCard.appendChild(cardBody); 

  return weatherCard; 
}

const timeConverter = (dt) => {
  var a = new Date(dt * 1000);
  var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  var month = months[a.getMonth()];
  var date = a.getDate();
  var time = date + ' ' + month;
  return time;
}

const createForecastCard = (forecastData) => {
  const weatherCard = document.createElement('div'); 
  weatherCard.classList.add('col'); 
  weatherCard.classList.add('card'); 
  weatherCard.classList.add('text-center'); 
  
  const cardHeader = document.createElement('div');
  cardHeader.classList.add('card-header'); 

  const cardBody = document.createElement('div');
  cardHeader.classList.add('card-body'); 
  const cardTemperature = document.createElement('h5');
  cardHeader.classList.add('card-title'); 
  const cardHumidity = document.createElement('div');
  cardHeader.classList.add('card-text'); 
  const cardWind = document.createElement('div');
  cardHeader.classList.add('card-text'); 
  const imageHolder = document.createElement('div'); 
  imageHolder.classList.add('weather-icon'); 
  const cardImage = document.createElement('img');

  cardHeader.innerText = `${timeConverter(forecastData.dt)}`; 
  cardTemperature.innerText = `Temperature: ${Math.round(forecastData.main.temp)}`; 
  cardHumidity.innerText = `Humidity: ${forecastData.main.humidity}`; 
  cardWind.innerText = `Wind: ${Math.round(forecastData.wind.speed)}`; 

  const icon = forecastData.weather[0].icon;
  cardImage.setAttribute('src', `assets/icons/${icon}.png`);
  imageHolder.appendChild(cardImage);

  cardBody.appendChild(cardTemperature); 
  cardBody.appendChild(cardHumidity); 
  cardBody.appendChild(cardWind); 
  cardBody.appendChild(cardImage);

  weatherCard.appendChild(cardHeader); 
  weatherCard.appendChild(cardBody); 

  return weatherCard; 
};

const createAllWeatherCards = (weatherData, forecastData, inputCity) => {
  const weatherContainer = document.querySelector('#weather-block'); 
  weatherContainer.innerHTML = '';

  const forecastContainer = document.createElement('div'); 
  forecastContainer.classList.add('container');
  forecastContainer.classList.add('card-group');

  const todayCard = createTodayCard(weatherData, inputCity);
  console.log(forecastData)
  let forecastCards = forecastData.map((dayForecast) => createForecastCard(dayForecast));

  weatherContainer.appendChild(todayCard); 
  forecastCards.forEach((card) => forecastContainer.appendChild(card)); 
  weatherContainer.appendChild(forecastContainer);
}

// Handles user input for the search bar 
async function handleInput(event) {
  event.preventDefault();

  const citySearchBar = document.querySelector("#city-search-bar");

  // Searches openWeather API for 5 day forecast with given city 
  const inputCity = citySearchBar.value;
  const forecastData = await searchApi(inputCity);
  const weatherData = await searchApiToday(inputCity);
  console.log(forecastData);
  console.log(weatherData);
  createAllWeatherCards(weatherData, forecastData, inputCity);
  // Checks to see if there are already previously saved cities for the localStorage history 
  saveHistory(inputCity);
  loadButtons();
}

async function historyButtonClick(buttonId, e) {
  e.preventDefault();
  const inputCity = buttonId;
  const forecastData = await searchApi(inputCity);
  const weatherData = await searchApiToday(inputCity);

  console.log(forecastData);
  console.log(weatherData);
  createAllWeatherCards(weatherData, forecastData, inputCity);
}

const loadWeatherOnStart = async () => {
  const lastSearch = JSON.parse(localStorage.getItem("history"));
  const lastString = lastSearch.cities[lastSearch.cities.length-1];
  const forecastData = await searchApi(lastString);
  const weatherData = await searchApiToday(lastString);
  createAllWeatherCards(weatherData, forecastData, lastString);
}

if (localStorage.getItem("history") != JSON.stringify({ cities: [] })) {
  loadWeatherOnStart();
}
searchFormEl.addEventListener("submit", handleInput);

loadButtons();