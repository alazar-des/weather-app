export async function currentWeather(city, unit="metric") {
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=727d62d57b1c10396543afe7cd9e4739&units=${unit}`;
  if (typeof city != "string") {
    url = `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&appid=727d62d57b1c10396543afe7cd9e4739&units=${unit}`;
  }
  try {
    const resp = await fetch(url);
    const data = await resp.json();
    return {
      id: data.weather[0].id,
      city: data.name,
      country: data.sys.country,
      feelsLike: data.main.feels_like,
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      temp: data.main.temp,
      tempMax: data.main.temp_max,
      tempMin: data.main.temp_min,
      visibility: data.visibility / 1000,
      description: data.weather[0].description,
      icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
      dayNight: data.weather[0].icon[2],
      windSpeed: data.wind.speed,
      windDeg: data.wind.deg,
      time: data.dt,
    };
  } catch {
    throw new Error("Unable to fetch.");
  }
}

export async function forecast(city, unit="metric") {
  try {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=727d62d57b1c10396543afe7cd9e4739&units=${unit}`;
    const resp = await fetch(url);
    const data = await resp.json();
    return {
      city: data.city.name,
      days: data.list.map((hourly) => {
        return {
          feelsLike: hourly.main.feels_like,
          humidity: hourly.main.humidity,
          pressure: hourly.main.pressure,
          temp: hourly.main.temp,
          tempMax: hourly.main.temp_max,
          tempMin: hourly.main.temp_min,
          visibility: hourly.visibility / 1000,
          description: hourly.weather[0].description,
          icon: `https://openweathermap.org/img/wn/${hourly.weather[0].icon}@2x.png`,
          windSpeed: hourly.wind.speed,
          windDeg: hourly.wind.deg,
          time: hourly.dt - data.city.timezone,
          percipitation: Math.round(hourly.pop * 100),
          rain: hourly.rain,
        };
      }),
    };
  } catch (err) {
    throw new Error(err);
  }
}
