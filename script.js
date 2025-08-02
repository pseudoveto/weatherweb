const cities = {
  Delhi: { lat: 28.61, lon: 77.23 },
  Mumbai: { lat: 19.07, lon: 72.87 },
  Chennai: { lat: 13.08, lon: 80.27 },
  Bengaluru: { lat: 12.97, lon: 77.59 },
  Pune: { lat: 18.52, lon: 73.85 },
  Kolkata: { lat: 22.57, lon: 88.36 },
};

const weatherQuotes = [
  "Every cloud has a silver lining.",
  "Sunshine is the best medicine.",
  "The sky speaks in a thousand colors.",
  "Let it rain. Let it cleanse.",
  "Even the darkest night will end and the sun will rise.",
  "Feel the weather, don't just check it.",
];

async function selectCity(city) {
  // Highlight clicked button
  const buttons = document.querySelectorAll("button");
  buttons.forEach(btn => btn.classList.remove("selected"));
  const clickedButton = Array.from(buttons).find(btn => btn.textContent === city.toUpperCase());
  clickedButton.classList.add("selected");

  // Update placeholders
  document.getElementById("city-name").textContent = city;
  document.getElementById("weather-icon").textContent = "🌤️";
  document.getElementById("temperature").textContent = "Loading...";
  document.getElementById("humidity").textContent = "";
  document.getElementById("sunrise").textContent = "🌅 Sunrise: --";
  document.getElementById("sunset").textContent = "🌇 Sunset: --";
  document.getElementById("uv").textContent = "🔆 UV Index: --";
  document.getElementById("quote").textContent = getRandomQuote();

  const { lat, lon } = cities[city];

  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m&daily=sunrise,sunset,uv_index_max&timezone=auto`
    );
    const data = await response.json();

    // Current data
    const temp = data.current.temperature_2m;
    const humidity = data.current.relative_humidity_2m;

    // Daily data
    const sunrise = data.daily.sunrise[0];
    const sunset = data.daily.sunset[0];
    const uvIndex = data.daily.uv_index_max[0];

    // Update DOM
    document.getElementById("temperature").textContent = `${temp} °C`;
    document.getElementById("humidity").textContent = `💧 ${humidity}% humidity`;
    document.getElementById("sunrise").textContent = `🌅 Sunrise: ${formatTime(sunrise)}`;
    document.getElementById("sunset").textContent = `🌇 Sunset: ${formatTime(sunset)}`;
    document.getElementById("uv").textContent = `🔆 UV Index: ${uvIndex}`;
  } 
  catch (error) {
    console.error("Error fetching data:", error);
  }
}

function getRandomQuote() {
  const i = Math.floor(Math.random() * weatherQuotes.length);
  return `"${weatherQuotes[i]}"`;
}

function formatTime(isoString) {
  // Format to HH:MM from ISO time
  const time = new Date(isoString);
  return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
