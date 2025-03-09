
let grantcontainer = document.getElementById("grant-container");
let searchcontainer = document.getElementById("search-container");

let Userweatherbtn = document.getElementById("userweatherbtn");
let searchweatherbtn = document.getElementById("searchweatherbtn");
let loader = document.querySelector(".loader");
let API_KEY = "f9d220cbb82f5076600c4ac477469c2f";
let SearchForm = document.querySelector(".searchForm");
let weatherinformation = document.querySelector(".weatherinformation");
let Grantaccessbtn = document.querySelector(".Grantaccessbtn");

let storedWeatherData = null;  // Global variable to store last weather data

async function fetchuserweather(usercords) {
    let { lat, lon } = usercords;
    loader.classList.remove("hidden");

    try {
        let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        let data = await response.json();
        
        loader.classList.add("hidden");
                                    
        if (data.cod !== 200) {
            alert(`Error: ${data.message}`);
            return;
        }  

        storedWeatherData = data;  // Store data globally
        displayWeatherInfo(data);

        weatherinformation.classList.remove("hidden");
        grantcontainer.classList.add("hidden");
        searchcontainer.classList.add("hidden");

    } catch (error) {
        console.error("Error fetching weather data:", error);
        loader.classList.add("hidden");
        alert("Failed to fetch weather data. Please try again.");
    }
}

async function showposition(position) {
    let usercords = {
        lat: position.coords.latitude,
        lon: position.coords.longitude
    };
    console.log(usercords);
    fetchuserweather(usercords);
}

function getlocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showposition, (error) => {
            alert("Location access denied. Please allow access to use this feature.");
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

if (Grantaccessbtn) {
    Grantaccessbtn.addEventListener("click", function () {
        getlocation();
    });
}

Userweatherbtn.addEventListener("click", function () {
    grantcontainer.classList.add("hidden");
    searchcontainer.classList.add("hidden");

    if (storedWeatherData) {
        displayWeatherInfo(storedWeatherData); // Restore previous weather data
    } else {
        weatherinformation.classList.add("hidden");
    }
});

searchweatherbtn.addEventListener("click", function () {
    grantcontainer.classList.add("hidden");
    searchcontainer.classList.remove("hidden");
    weatherinformation.classList.add("hidden");
});

SearchForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    let city = SearchForm.querySelector("#searchInput").value.trim();

    if (!city) {
        alert("Please enter a city name.");
        return;
    }

    loader.classList.remove("hidden");

    try {
        let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        let data = await response.json();
        
        loader.classList.add("hidden");

        if (data.cod !== 200) {
            alert(`Error: ${data.message}`);
            return;
        }

        displayWeatherInfo(data);
        weatherinformation.classList.remove("hidden");
        grantcontainer.classList.add("hidden");
        searchcontainer.classList.add("hidden");

    } catch (error) {
        console.error("Error fetching weather data:", error);
        loader.classList.add("hidden");
        alert("Failed to fetch weather data. Please try again.");
    }
});

function displayWeatherInfo(data) {
    if (!data || !data.sys) {
        alert("Weather data is not available.");
        return;
    }

    let flagimage = document.querySelector(".flagimage");
    let description = document.querySelector(".description");
    let weatherimage = document.querySelector(".weatherimage");
    let temp_min = document.querySelector(".temp_min");
    let windspeedtemp = document.querySelector(".windspeedtemp");
    let Humiditytemp = document.querySelector(".Humiditytemp");
    let cloudtemp = document.querySelector(".cloudtemp");
    let countryname = document.querySelector(".countryname");

    if (flagimage) flagimage.src = `https://flagcdn.com/144x108/${data.sys.country.toLowerCase()}.png`;
    if (description) description.innerText = data.weather?.[0]?.description || "No description available";
    if (countryname) countryname.innerText = data.name || "Unknown location";
    if (weatherimage) weatherimage.src = `https://openweathermap.org/img/w/${data.weather?.[0]?.icon}.png`;
    if (temp_min) temp_min.innerText = `${data.main?.temp}°C` || "N/A";
    if (windspeedtemp) windspeedtemp.innerText = `${data.wind?.speed.toFixed(2)} m/s` || "N/A";
    if (Humiditytemp) Humiditytemp.innerText = `${data.main?.humidity}%` || "N/A";
    if (cloudtemp) cloudtemp.innerText = `${data.clouds?.all}%` || "N/A";

    weatherinformation.classList.remove("hidden");  // Ensure weather is always displayed
}
