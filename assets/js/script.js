const cityBtn = document.querySelector("#city-btn");
const searchFormEl = document.querySelector("#search-form");

const searchApi = async (city) => {
  const weatherQueryUrl = "https://api.openweathermap.org/data/2.5/weather";
  const apiKey = "26ba3a7e283acb9cd1e8665c6c3b319a";

  const weatherQuery = `${weatherQueryUrl}?&q=${city}&appid=${apiKey}&units=imperial`;
  console.log(weatherQuery);
  const response = await fetch(weatherQuery);

  if (!response.ok) {
    console.log("R.I.P.");
    return;
  }
  const weatherData = response.json();
  return weatherData;
};

const saveHistory = (city) => {
  const savedList = localStorage.getItem("history");
  savedList.cities.push(city);
  localStorage.setItem("history", JSON.stringify(savedList));
  loadButtons();
};

const loadButtons = () => {
  const buttonBlock = document.querySelector("#history");
  const history = localStorage.getItem('history'); 
  if (!history) {
    localStorage.setItem("history", JSON.stringify({
        cities: []
    }));
  }

  for (city in history) {
    const button = document.createElement("button");
    button.classList.add("btn");
    button.classList.add("btn-primary");
    button.innerHTML = city;

    buttonBlock.appendChild(button);
  }
};

async function handleInput(event) {
  event.preventDefault();

  const citySearchBar = document.querySelector("#city-search-bar");

  const inputCity = citySearchBar.value;
  const weatherData = await searchApi(inputCity);
  console.log(weatherData);

  const history = JSON.parse(localStorage.getItem('history')); 
  const updatedHistory = history.cities;
  updatedHistory.push(inputCity);

  localStorage.setItem("history", JSON.stringify(updatedHistory));
  loadButtons();
}

searchFormEl.addEventListener("submit", handleInput);
loadButtons();

