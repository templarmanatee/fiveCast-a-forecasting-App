const cityBtn = document.querySelector("#city-btn");
const searchFormEl = document.querySelector("#search-form");
if (!localStorage.getItem("history")) {
  localStorage.setItem("history", JSON.stringify({ cities: [] }));
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
  const fiveDayForeCast = [weatherData.list[3],
  weatherData.list[11],
  weatherData.list[19],
  weatherData.list[27],
  weatherData.list[35]];
  console.log(fiveDayForeCast);
  return weatherData;
};

// Save the history to localStorage after being updated
const saveHistory = (city) => {
  let historyData = JSON.parse(localStorage.getItem("history")).cities;
  historyData.push(city);
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
  console.log(historyData)
  historyData.forEach((city) => {
    const button = document.createElement('button');
    button.classList.add('btn');
    button.classList.add('btn-primary');
    button.innerText = city;
    buttonBlock.appendChild(button);
  });
};

const writeWeatherData = (weatherData) => {
  for (let i = 0; i < children.length; i++) {
    children[i].innerText = '';

    // Do stuff
  }
};

const writeTodaysWeather = (weatherData) => {
  const todayCard = document.querySelector("#today-card");
  const children = todayCard.children;
  console.log(children);
}

const writeForeCast = (weatherData) => {

}

// Handles user input for the search bar 
async function handleInput(event) {
  event.preventDefault();

  const citySearchBar = document.querySelector("#city-search-bar");

  // Searches openWeather API for 5 day forecast with given city 
  const inputCity = citySearchBar.value;
  const weatherData = await searchApi(inputCity);
  writeWeatherData(weatherData);
  // Checks to see if there are already previously saved cities for the localStorage history 
  saveHistory(inputCity);
  loadButtons();
}

searchFormEl.addEventListener("submit", handleInput);
loadButtons();