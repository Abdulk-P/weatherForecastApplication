
const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentWeatherItemsEl = document.getElementById('current-weather-items');
const timezone = document.getElementById('time-zone');

const days = ['Sunday', 'Monday', 'Tuesday', 'Wensday', 'Thursday', 'Friday', 'Saturday'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const API_KEY = "440de0c1e31248629cd171227252604";


//----------------time and Date setup-------------------

setInterval(() =>{
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hoursIn12HrFormat = hour >= 13? hour%12: hour;
    let minutes = time.getMinutes();
    const ampm = hour >= 12? 'PM' : 'AM';

    if(minutes<10){
        minutes = '0' + minutes;
    }
    
    timeEl.innerHTML =  hoursIn12HrFormat + ':' + minutes + ' ' + `<span id="am-pm">${ampm}</span>`
    
    dateEl.innerHTML = days[day] + ', ' + date + ' ' + months[month];
}, 1000);



//----------------input city, button event-----------
document.getElementById('search-button').addEventListener('click', function () {
  const cityInput = document.getElementById('city-input');
  const city = cityInput.value.trim();
  console.log('City:', city);

  if (city === "") {
      alert("Please enter a city name!");
      return; // Stop further execution if the input is empty
  }

  const cityRegex = /^[a-zA-Z\s]+$/; // Allow only letters and spaces
  if (!cityRegex.test(city)) {
      alert("Please enter a valid city name (letters and spaces only)!");
      return; // Stop if the city name contains invalid characters
  }

  if (city.length < 2) {
      alert("Please enter a city name with at least two letters.");
      return; // Stop if the city name is too short
  }

  getWeatherData(city);
  getForecastWeather(city);

  let cities = JSON.parse(localStorage.getItem('cities')) || [];
  // Avoid adding duplicate cities
  if (!cities.includes(city)) {
      cities.push(city);
      // Keep only the last few searched cities (e.g., 5)
      if (cities.length > 5) {
          cities = cities.slice(-5);
      }
      localStorage.setItem('cities', JSON.stringify(cities));
  }

  updateDropdown(); 

  cityInput.value = ""; // Clear the input field after search
});


function updateDropdown() {
  const cities = JSON.parse(localStorage.getItem('cities')) || [];
  const dropdown = document.getElementById('city-dropdown');
  dropdown.innerHTML = '<option value="">Select recently searched city</option>'; // Clear existing options

  cities.forEach(city => {
      const option = document.createElement('option');
      option.value = city;
      option.textContent = city;
      dropdown.appendChild(option);
  });

  // Show the dropdown if there are cities
  if (cities.length > 0) {
      dropdown.classList.remove('hidden');
  } else {
      dropdown.classList.add('hidden');
  }
}

// Handle city selection from dropdown
document.getElementById('city-dropdown').addEventListener('change', function() {
  const selectedCity = this.value;
  if (selectedCity) {
      getWeatherData(selectedCity);
  }
});


//------------- Fetch weather data using WeatherAPI-----------
function getWeatherData(city) {
    fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}&aqi=yes`)
        .then(response => response.json())
        .then(data => {
            // console.log(data.current); // 🔥 View fetched data
            displayWeather(data);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            document.getElementById('weather-output').innerHTML = `<p>Error fetching weather data. Please try again.</p>`;
        });
}

//-------Fetching 5 days  Forecast Data-------------

function getForecastWeather(city){
  fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=7`)
  .then(response => response.json())
  .then(data => {
    console.log(data.forecast.forecastday);
    displayForecast(data);
  })
  .catch(error => {
    console.error('Error fetching Forecast data:', error);
    document.getElementById('weather-output').innerHTML = `<p>Error fetching ForeCast data. Please try again.</p>`;
});
}

//-----------current location api------------
document.getElementById('current-location-button').addEventListener('click', function() {
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          const currentWeatherApiUrl = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${latitude},${longitude}&aqi=yes`;

          fetch(currentWeatherApiUrl)
              .then(response => {
                  if (!response.ok) {
                      throw new Error(`HTTP error! status: ${response.status}`);
                  }
                  return response.json();
              })
              .then(currentWeatherData => {
                  const cityName = currentWeatherData.location.name;
                  fetchWeatherByLocation(latitude, longitude);
                  getForecastWeather(cityName); // Call  forecast function with the city name
              })
              .catch(error => {
                  console.error("Error fetching current weather by location:", error);
                  alert('Could not retrieve weather data for your location.');
              });

      }, function(error) {
          alert('Unable to retrieve your location. Please enable location services.');
      });
  } else {
      alert('Geolocation is not supported by your browser.');
  }
});


function fetchWeatherByLocation(latitude, longitude) {
    const url = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${latitude},${longitude}&aqi=yes`;
  
    fetch(url)
      .then(response => response.json())
      .then(data => {
        // Call a function to display the fetched weather data
        displayWeather(data);
      })
      .catch(error => {
        console.error('Error fetching weather data:', error);
        alert('Error fetching weather data. Please try again later.');
      });
}
  

//----update the UI------
function displayWeather(data) {

  document.getElementById('time-zone').innerText = data.location.name;
  document.getElementById('country').innerText = data.location.country;

  let {humidity, pressure_mb, wind_kph} = data.current;

    currentWeatherItemsEl.innerHTML = 
        `<div class="weather-item">
            <div>Humidity</div>
            <div>${humidity}%</div>
        </div>
        <div class="weather-item">
            <div>Pressure</div>
            <div>${pressure_mb} mb</div>
        </div>
        <div class="weather-item">
            <div>Wind Speed</div>
            <div>${wind_kph} kph</div>
        </div>`;  
}

//----------7days Forecast Setup-------------

const weatherForecastEl = document.getElementById('weather-forecast');

function displayForecast(data) {
    const forecastDays = data.forecast.forecastday;

    let forecastHTML = '';

    forecastDays.forEach(day => {
        const date = new Date(day.date);
        const options = { weekday: 'short' }; // 'Mon', 'Tue', etc.
        const dayName = date.toLocaleDateString('en-US', options);

        const icon = day.day.condition.icon;
        const maxTemp = day.day.maxtemp_c;
        const minTemp = day.day.mintemp_c;

        forecastHTML += `
            <div class="weather-forecast-item">
                <div class="day">${dayName}</div>
                <img src="https:${icon}" alt="weather icon" class="w-icon">
                <div class="temp">Night - ${minTemp}&#176; C</div>
                <div class="temp">Day - ${maxTemp}&#176; C</div>
            </div>
        `;
    });

    weatherForecastEl.innerHTML = forecastHTML;
}
