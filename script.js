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

function fadeRemove() {
  day.classList.remove("fade");
  weatherTime.classList.remove("fade");
  weatherDays.classList.remove("fade");
}

function fadeAdd() {
  day.classList.add("fade");
  weatherTime.classList.add("fade");
  weatherDays.classList.add("fade");
}

// today's date
todayInfo.querySelector(".today-date").textContent =
  new Date().toLocaleDateString("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

// fetch apis
const getCurrnetWeather = async (location) => {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&exclude=current&appid=${apiKey}`
  );
  if (response.status === 200) {
    const currnetWeather = await response.json();
    return currnetWeather;
  } else {
    throw new Error("error");
  }
};

const getHourlyForecast = async (location) => {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&exclude=current&appid=${apiKey}`
  );
  if (response.status === 200) {
    const forecastWeather = await response.json();
    return forecastWeather;
  } else {
    throw new Error("error");
  }
};

const getRegion = async () => {
  const response = await fetch(
    "https://ipinfo.io/121.131.244.170/json?token=66e5612b15274c"
  );
  if (response.status === 200) {
    const location = await response.json();
    return location.region;
  } else {
    throw new Error("error");
  }
};

// parallel processing
const fetchAllWeatherData = async (location) => {
  return Promise.all([getCurrnetWeather(location), getHourlyForecast(location)]);
};

const fixElements = (location) => {
  fetchAllWeatherData(location).then((data) => {
    const current = data[0];
    const hourly = data[1];

    // Today Info
    const todayWeather = current.weather[0].main;
    const todayWeatherIconCode = current.weather[0].icon;
    const todayTemperature = `${Math.round(current.main.temp)}`;
    const todayFeelsLike = `${Math.round(current.main.feels_like)}`;

    const locationElement = todayInfo.querySelector(".city");
    const weatherDescriptionElement = todayInfo.querySelector(".weather-type > p");

    locationElement.textContent = `${current.name}`;
    weatherDescriptionElement.textContent = `${todayWeather}`;
    todayWeatherIcon.className = `bx bx-${weatherIconMap[todayWeatherIconCode]}`;
    todayTemp.textContent = `${todayTemperature}°`;
    dayInfo[0].textContent = `${todayFeelsLike}°`;
    dayInfo[1].textContent = `${current.main.humidity}%`;
    dayInfo[2].textContent = `${current.wind.speed.toFixed(1)} m/s`;

    // hourly
    const today = new Date();
    const hourlyForecast = hourly.list.slice(1, 5);

    let index = 0;
    for (const t of hourlyForecast) {
      timelistIcon[index].className = `bx bx-${
        weatherIconMap[t.weather[0].icon]
      }`;
      timelistTemp[index].textContent = `${Math.round(t.main.temp)}°C`;
      index++;
    }

    // 4days
    const nextDaysData = hourly.list.slice(4);
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

      if (!uniqueDays.has(day) && forecastDate.getDate() !== today.getDate()) {
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
  });
};

document.addEventListener("DOMContentLoaded", () => {
  getRegion().then((data) => {
    fixElements(data);
  });
});

button.addEventListener("click", () => {
  const location = document.getElementById("location").value;
  fadeAdd();
  fixElements(location);
});

window.addEventListener("keydown", (e) => {
  let location = searchValue.value;
  if (e.code === "Enter") {
    fadeAdd();
    fixElements(location);
  }
});
