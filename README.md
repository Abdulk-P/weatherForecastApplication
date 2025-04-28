# Weather Forecast Application

This is a simple web application that displays the current weather and a 7-day forecast for a specified city. It also allows users to get weather based on their current location and provides a dropdown menu for recently searched cities.

## Setup Instructions

1.  **Clone the repository** (if you have one).
2.  **Open `index.html`** in your web browser. There are no specific server-side requirements for this application as it fetches data directly from the WeatherAPI.com API using client-side JavaScript.

## API Keys

This application relies on the WeatherAPI.com API. You will need to obtain your own API key to make it work correctly.

1.  Go to the [WeatherAPI.com website](https://www.weatherapi.com/).
2.  Sign up for an account and obtain your API key.
3.  **Open `script.js`** and replace the placeholder values for `API_KEY` with your actual API key:

    ```javascript
    const API_KEY = 'YOUR_WEATHERAPI_KEY'; // Replace with your actual key
    ```

## Usage

1.  **Enter a city name:** Type the name of a city in the input field and click the "Search" button. The application will display the current weather information and the 7-day forecast for that city.
2.  **Use current location:** Click the "Current Location" button to fetch weather data based on your browser's geolocation. You might be prompted to grant location access.
3.  **Recently searched cities:** A dropdown menu labeled "Select recently searched city" will appear below the search bar. This menu will be populated with the last 5 unique cities you have searched. Clicking on a city in the dropdown will automatically update the weather data for that city.

## Codebase Structure

* `index.html`: The main HTML file containing the structure of the web page. It includes links to the CSS and JavaScript files.
* `style.css`: Contains custom CSS styles for the application.
* `script.js`: Contains the JavaScript code responsible for fetching weather data from the API, updating the UI, handling user interactions (search, location), and managing the recently searched cities dropdown.
* `README.md`: This file, providing setup instructions and usage information for the application.

## Notes

* The "Recently searched cities" functionality uses the browser's `localStorage` to store the city names. This data persists across browser sessions.
* Basic input trimming is implemented to avoid issues with leading/trailing spaces in city names. More advanced validation can be added in the `script.js` file.
* The application uses the WeatherAPI.com API for weather data. Please refer to their documentation for API usage limits and terms of service.

## Author

Abdulkhadar