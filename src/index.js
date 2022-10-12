import "./style.css";
import { currentWeather, forecast } from "./api";
import { setCurrentWeather } from "./dom";

(function () {
  const form = document.querySelector("form.search-bar");
  form.addEventListener("submit", handleSearchLocationWeather);

  const select = document.querySelector("#temp-unit");
  select.addEventListener("change", handleMeasurementUnit);

  //display current user location weather
  userLocationWeather();
})();

function userLocationWeather() {
  navigator.geolocation.getCurrentPosition(async (position) => {
    try {
      const current = await currentWeather({
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      });
      setCurrentWeather(current, "metric");
    } catch (err) {
      console.error(err);
    }
  });
}

async function handleSearchLocationWeather(e) {
  e.preventDefault();
  const form = document.querySelector("form.search-bar");
  try {
    const city = document.querySelector(".search-bar input").value;
    const select = document.querySelector("#temp-unit");
    const tempUnit = select.options[select.selectedIndex].value;
    const current = await currentWeather(city, tempUnit);
    setCurrentWeather(current, tempUnit);
  } catch (err) {
    console.error(err);
  }
  form.reset();
}

async function handleMeasurementUnit() {
  try {
    const city = document.querySelector(".location").textContent.split(",")[0];
    console.log(city);
    const select = document.querySelector("#temp-unit");
    const tempUnit = select.options[select.selectedIndex].value;
    const current = await currentWeather(city, tempUnit);
    setCurrentWeather(current, tempUnit);
  } catch (err) {
    console.error(err);
  }
}
