const apiKey = '3992213506d6ec4bc4442328b9940a72';

const searchForm = document.querySelector('#search-form');
const cityInput = document.querySelector('#city-input');
const currentWeather = document.querySelector('#current-weather');
const dailyForecast = document.querySelector('#forecast');
const searchHistoryList = document.querySelector('#search-history');

// Define an array to store the search history
let searchHistory = [];

// Add an event listener to the search form
searchForm.addEventListener('submit', event => {
  // Prevent the default form submission behavior
  event.preventDefault();

  // Get the city name from the input field
  const city = cityInput.value.trim();

  // Call the function to fetch the weather data for the city
  getWeatherData(city);
});

// Function to fetch the weather data for a city
function getWeatherData(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  fetch(url)
    .then(response => response.json())
    .then(data => {
     
      displayCurrentWeather(data);
      getForecastData(data.coord.lat, data.coord.lon);
      
    })
    .catch(error => console.log(error));

    function getForecastData(lat, lon) {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly&appid=${apiKey}&units=metric`;
      fetch(url)
        .then(response => response.json())
        .then(data => {
          displayDailyForecast(data.daily);
          getForecastData(data.coord.lat, data.coord.lon);
        })
        .catch(error => console.log(error));
    
      }
    function displayCurrentWeather(data) {
      currentWeather.innerHTML = `
        <h2>${data.name}, ${data.sys.country}</h2>
        <p>${new Date().toLocaleDateString()}</p>
        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="${data.weather[0].description}">
        <p>Temperature: ${data.main.temp}&deg;C</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
      `;
    }
  
  // Use an API to fetch the weather data for the city
  // and update the current weather and forecast sections
  // with the data for the city

  // Update the search history with the city name
  addToSearchHistory(city);
}

// Function to update the search history
function addToSearchHistory(city) {
  // Add the city name to the search history array
  searchHistory.unshift(city);

  // Limit the search history to the 10 most recent searches
  if (searchHistory.length > 10) {
    searchHistory.pop();
  }

  // Update the search history list on the page
  updateSearchHistoryList();
}

// Function to update the search history list on the page
function updateSearchHistoryList() {
  // Clear the current contents of the search history list
  searchHistoryList.innerHTML = '';

  // Loop through the search history array and create a new list item
  // for each city in the array
  searchHistory.forEach(city => {
    const li = document.createElement('li');
    li.textContent = city;
    li.addEventListener('click', () => {
      // When a search history item is clicked, fetch the weather data
      // for the city and update the page with the new data
      getWeatherData(city);
    });
    searchHistoryList.appendChild(li);
  });
}