import weatherIconMap from "./icon.js";
const apiKey = "0f51612556542bafa04f02fbbfee8458";

const button = document.querySelector(".search button");
const searchValue = document.querySelector(".search input");
const todayInfo = document.querySelector(".today-info");
const todayWeatherIcon = document.querySelector(".weather-type i");
const todayTemp = document.querySelector(".weather-temp");

const dayInfo = document.querySelectorAll(".day-info .value");
const daysList = document.querySelector(".days-list");
const timelistIcon = document.querySelectorAll(".time-list li i");
const timelistTemp = document.querySelectorAll(".time-temp");

const day = document.querySelector(".day-info");
const weatherTime = document.querySelector(".weather-time");
const weatherDays = document.querySelector(".weather-4days");

function fadeRemove(){
    day.classList.remove("fade");
    weatherTime.classList.remove("fade");
    weatherDays.classList.remove("fade");
}

function fadeAdd(){
    day.classList.add("fade");
    weatherTime.classList.add("fade");
    weatherDays.classList.add("fade");
}


todayInfo.querySelector(".today-date").textContent =
  new Date().toLocaleDateString("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

function fetchCurrentWeather(location) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&exclude=current&appid=${apiKey}`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      const todayWeather = data.weather[0].main;
      const todayWeatherIconCode = data.weather[0].icon;
      const todayTemperature = `${Math.round(data.main.temp)}`;
      const todayFeelsLike = `${Math.round(data.main.feels_like)}`;

      // Today Info
      const locationElement = todayInfo.querySelector(".city");
      const weatherDescriptionElement =
        todayInfo.querySelector(".weather-type > p");

      locationElement.textContent = `${data.name}`;
      weatherDescriptionElement.textContent = `${todayWeather}`;
      todayWeatherIcon.className = `bx bx-${weatherIconMap[todayWeatherIconCode]}`;
      todayTemp.textContent = `${todayTemperature}°`;
      dayInfo[0].textContent = `${todayFeelsLike}°`;
      dayInfo[1].textContent = `${data.main.humidity}%`;
      dayInfo[2].textContent = `${data.wind.speed.toFixed(1)} m/s`;
    }).catch(error => {
        console.log(error);
    })
}

function fetchForecastWeather(location) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&exclude=current&appid=${apiKey}`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      const today = new Date();
      const threeHourForecast = data.list.slice(1, 5);

      let index = 0;
      for (const t of threeHourForecast) {
        timelistIcon[index].className = `bx bx-${
          weatherIconMap[t.weather[0].icon]
        }`;
        timelistTemp[index].textContent = `${Math.round(t.main.temp)}°C`;
        index++;
      }

      const nextDaysData = data.list.slice(4);
      const uniqueDays = new Set();
      let count = 0;
      daysList.innerHTML = "";
      for (const dayData of nextDaysData) {
        const forecastDate = new Date(dayData.dt_txt);
        const day = forecastDate.toLocaleDateString("en", {
          weekday: "long",
        });
        const dayTemp = `${Math.round(dayData.main.temp)}`;
        const iconCode = dayData.weather[0].icon;

        if (
          !uniqueDays.has(day) &&
          forecastDate.getDate() !== today.getDate()
        ) {
          uniqueDays.add(day);
          daysList.innerHTML += `
                <li>
                <div>
                  <span> <i class="bx bx-${weatherIconMap[iconCode]}"></i></span>
                  <span>${day}</span>
                </div>
                <span class="day-temp">${dayTemp}°C</span>
              </li>
                `;
          count++;
        }
        if (count === 4) break;
      }
      fadeRemove();
    }).catch(error => {
        console.log(error);
    });
}

document.addEventListener("DOMContentLoaded", () => {
  const defaultLocation = "Seoul";
  fetchCurrentWeather(defaultLocation);
  fetchForecastWeather(defaultLocation);
});

button.addEventListener("click", () => {
  const location = document.getElementById("location").value;
  fadeAdd();
  fetchCurrentWeather(location);
  fetchForecastWeather(location);
});

window.addEventListener("keydown", (e) => {
  let location = searchValue.value;

  if (e.code === "Enter") {
    fadeAdd();
    fetchCurrentWeather(location);
    fetchForecastWeather(location);
  }
});
