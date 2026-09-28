async function searchWeather() {

    let city = document.getElementById("cityInput").value.trim();
    let result = document.getElementById("weatherResult");

    if (city === "") {
        alert("Please enter a city name.");
        return;
    }

    result.innerHTML = "<p>Loading...</p>";

    try {

        let geoResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
        );

        let geoData = await geoResponse.json();

        if (!geoData.results) {
            throw new Error("City not found");
        }

        let location = geoData.results[0];

        let weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min&forecast_days=5&timezone=auto`
        );

        let weather = await weatherResponse.json();

        let forecastHTML = "";

        for (let i = 0; i < 5; i++) {

            forecastHTML += `
                <div class="forecast-card">
                    <b>${weather.daily.time[i]}</b>
                    <p>🌡️ ${weather.daily.temperature_2m_min[i]}°C</p>
                    <p>☀️ ${weather.daily.temperature_2m_max[i]}°C</p>
                </div>
            `;
        }

        result.innerHTML = `

            <div class="weather-card">

                <h2>${location.name}, ${location.country}</h2>

                <div class="temperature">
                    🌡️ ${weather.current.temperature_2m}°C
                </div>

                <div class="info">

                    <div>
                        💧
                        <b>Humidity</b>
                        <p>${weather.current.relative_humidity_2m}%</p>
                    </div>

                    <div>
                        💨
                        <b>Wind</b>
                        <p>${weather.current.wind_speed_10m} km/h</p>
                    </div>

                </div>

                <h3>5-Day Forecast</h3>

                <div class="forecast">
                    ${forecastHTML}
                </div>

            </div>
        `;

    } catch (error) {

        result.innerHTML = `
            <p style="color:red">
                ❌ ${error.message}
            </p>
        `;
    }
}