
//Variables declaration
const submitJS = document.querySelector("#citySubmit");
const cityNameJS = document.querySelector("#cityName");
const weatherErrorJS = document.querySelector("#weatherError");
const tempJS = document.querySelector("#temp");
const humidityJS = document.querySelector("#humidity");
const conditionJS = document.querySelector("#condition");
const loadingJS = document.querySelector("#loading");
const iconJS = document.querySelector("#icon");
const locationJS = document.querySelector("#location");
const timeJS = document.querySelector("#time");
document.body.style.backgroundImage = "url('./default.jpg')";

const savedCity = localStorage.getItem("city");
if (savedCity) {
    cityNameJS.value = savedCity;
    getWeather();
}

//Event listener
submitJS.addEventListener("click", function (event) {
    event.preventDefault();
    getWeather();
});

//=========================  Functions definition  ===============================================

//Fetching the data

async function getWeather() {
    clearDisplay();
    showLoading();
    const city = cityNameJS.value;
    localStorage.setItem("city", city);
    if (city === "") {
        weatherErrorJS.textContent = "Please enter a city name.";
        hideLoading();
        return;
    }
    const link = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
    try {
        const response = await fetch(link);
        if (response.ok) {
            const data = await new Promise((resolve) => {
                resolve(response.json());
            });
            tempJS.textContent = `Temperature: ${data.main.temp}°C`;
            humidityJS.textContent = `Humidity: ${data.main.humidity}%`;
            conditionJS.textContent = `Condition: ${data.weather[0].main}`;
            iconJS.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
            const mainCondition = data.weather[0].main.toLowerCase();
            if (mainCondition === "clear" || mainCondition === "clouds" || mainCondition === "rain") {
                document.body.style.backgroundImage = `url('./${mainCondition}.jpg')`;
            } else {
                document.body.style.backgroundImage = "url('./default.jpg')";
            }
            //Add time and location
            const cityName = data.name;
            const countryCode = data.sys.country;
            locationJS.textContent = `${cityName}, ${countryCode}`;
            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes();
            const timeString = `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
            timeJS.textContent = `Time: ${timeString}`;
        } else {
            throw new Error('Could not find the city you typed');
        }
    } catch (error) {
        clearDisplay();
        weatherErrorJS.textContent = error;
    } finally {
        hideLoading();
    }
}

//Clearing the display

function clearDisplay() {
    weatherErrorJS.textContent = "";
    tempJS.textContent = "";
    humidityJS.textContent = "";
    conditionJS.textContent = "";
    iconJS.src = "";
}

//Loading

function showLoading() {
    loadingJS.style.display = "block";
}

function hideLoading() {
    loadingJS.style.display = "none";
}
