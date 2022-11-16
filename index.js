let dayTimeElement = document.querySelector("#currentDayTime");
let now = new Date();
let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];
let nowDay = days[now.getDay()];
let nowHour = now.getHours();
let nowMinute = now.getMinutes();
dayTimeElement.innerHTML = `${nowDay} ${nowHour}:${nowMinute}`;




// Search City + Weather after the user submits the form.
function showWeather(response) { 
    temperatureCelsius = response.data.main.temp

    document.querySelector("#city").innerHTML = response.data.name;
    document.querySelector("#temperature").innerHTML = Math.round(response.data.main.temp);
    document.querySelector("#humidity").innerHTML = response.data.main.humidity;
    document.querySelector("#wind").innerHTML = response.data.wind.speed;
    document.querySelector("#description").innerHTML = response.data.weather[0].description;
    document.querySelector("#icon").setAttribute("src", `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`);

    getForecast(response.data.coord);
}

function getForecast(coordinates) {
    console.log(coordinates);
    let units = "metric";
    let apiKey = "be60748992fab0f5da8162563fb21245";
    let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=${units}`;
    axios.get(apiUrl).then(displayForecast);
}

function searchCity(city) {
    let units = "metric";
    let apiKey = "be60748992fab0f5da8162563fb21245";
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
    axios.get(apiUrl).then(showWeather);
}
function searchSubmit(event) {
    event.preventDefault();
    let city = document.querySelector("#searchCity-input").value;
    searchCity(city);
}
let searchForm = document.querySelector("#searchCity")
searchForm.addEventListener("submit", searchSubmit);

searchCity("Kyiv");



//Temperature CurrentLocation
function showLocation(position) {
    let currentLatitude = position.coords.latitude;
    let currentLongitude = position.coords.longitude;
    let units = "metric";
    let apiKey = "be60748992fab0f5da8162563fb21245";
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${currentLatitude}&lon=${currentLongitude}&appid=${apiKey}&units=${units}`;
    axios.get(apiUrl).then(showWeather);
}
function getCurrentLocation(event) {
    event.preventDefault();
    navigator.geolocation.getCurrentPosition(showLocation);
}
let currentLocationButton = document.querySelector("#currentLocationButton");
currentLocationButton.addEventListener("click", getCurrentLocation);




// temperature in Celsius and Fahrenheit
function convertToFahrenheit(event) {
    event.preventDefault();
    let temperatureElement = document.querySelector("#temperature");

    celsiusLink.classList.remove("active");
    fahrenheitLink.classList.add("active");

    let temperatureFarhrenheit = (temperatureCelsius * 9) / 5 + 32;
    temperatureElement.innerHTML = Math.round(temperatureFarhrenheit);
}
let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", convertToFahrenheit);

let temperatureCelsius = null;

function convertToCelsius(event) {
    event.preventDefault();
    celsiusLink.classList.add("active");
    fahrenheitLink.classList.remove("active");

    let temperatureElement = document.querySelector("#temperature");
    temperatureElement.innerHTML = Math.round(temperatureCelsius);
}
let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", convertToCelsius);

function dayFormat(timestamp) {
    let date = new Date(timestamp * 1000);
    let day = date.getDay();
    let days = [
        "Sun",
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat",
    ];
    return days[day];
}
function displayForecast(response) {
    // console.log(response.data.daily);
    let forecast = response.data.daily;
    let forecastElement = document.querySelector("#forecast");
    
    let forecastHTML = `<div class = "row">`;
    // let days = ["Today", "Day2", "Day3", "Day4", "Day5"];
    forecast.forEach(function (forecastDay, index) {
        if (index < 5) {
            forecastHTML = forecastHTML + `
                <div class = "col-2">
                    <div class = "forecast_date">${dayFormat(forecastDay.dt)}</div>
                    <img src = "http://openweathermap.org/img/wn/${forecastDay.weather[0].icon}@2x.png" alt = "clear" id = "icon"/>
                    <div class = "forecast_temperature">
                        <span class = "temperature_min">${Math.round(forecastDay.temp.min)}° </span>
                        <span class = "temperature_max">${Math.round(forecastDay.temp.max)}° </span>
                    </div>
                </div>`;
            };
    });
    forecastHTML = forecastHTML + `</div>`;
    forecastElement.innerHTML = forecastHTML;
};