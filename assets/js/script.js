const cityBtn = document.querySelector('#city-btn');
const searchFormEl = document.querySelector('#search-form');

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

async function handleInput(event) {
  event.preventDefault();

  const citySearchBar = document.querySelector('#city-search-bar');

  const inputCity = citySearchBar.value;
  const weatherData = await searchApi(inputCity);
  console.log(weatherData)
};

searchFormEl.addEventListener('submit', handleInput);