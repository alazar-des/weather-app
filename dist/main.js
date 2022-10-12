/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/api.js":
/*!********************!*\
  !*** ./src/api.js ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "currentWeather": () => (/* binding */ currentWeather),
/* harmony export */   "forecast": () => (/* binding */ forecast)
/* harmony export */ });
async function currentWeather(city) {
  let unit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "metric";
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
      time: data.dt
    };
  } catch {
    throw new Error("Unable to fetch.");
  }
}
async function forecast(city) {
  let unit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "metric";

  try {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=727d62d57b1c10396543afe7cd9e4739&units=${unit}`;
    const resp = await fetch(url);
    const data = await resp.json();
    return {
      city: data.city.name,
      days: data.list.map(hourly => {
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
          rain: hourly.rain
        };
      })
    };
  } catch (err) {
    throw new Error(err);
  }
}

/***/ }),

/***/ "./src/dom.js":
/*!********************!*\
  !*** ./src/dom.js ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "setCurrentWeather": () => (/* binding */ setCurrentWeather)
/* harmony export */ });
/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./api */ "./src/api.js");


(function () {
  const forecastCardContainer = document.querySelector(".forecast .card-container");
  let cards = forecastCardContainer.querySelectorAll(".card");
  forecastCardContainer.setAttribute("style", `height:${cards[0].clientHeight}px`); //position cards of position absolute using left attribute

  for (let i = 0; i < cards.length; i++) {
    cards[i].setAttribute("style", `left:${(cards[i].clientWidth + 5) * i}px`);
  }

  const hourlyCardContainer = document.querySelector(".hourly-forecast .card-container");
  cards = hourlyCardContainer.querySelectorAll(".card");
  hourlyCardContainer.setAttribute("style", `height:${cards[0].clientHeight}px`); //position cards of position absolute using left attribute

  for (let i = 0; i < cards.length; i++) {
    cards[i].setAttribute("style", `left:${(cards[i].clientWidth + 5) * i}px`);
  }

  const prevBtns = document.querySelectorAll(".prev");
  const nextBtns = document.querySelectorAll(".next"); //check add next and prev buttons if overflow

  prevBtns.forEach(controlLeftSliderBtns);
  nextBtns.forEach(controlRightSliderBtns); //add event listener for prev and next slide buttons

  prevBtns.forEach(prev => prev.addEventListener("click", slideLeft));
  nextBtns.forEach(next => next.addEventListener("click", slideRight)); //hide or show card next btns if overflow on window resize

  addEventListener("resize", () => {
    nextBtns.forEach(controlRightSliderBtns);
  }); //show more info when card clicked

  const hourlycards = document.querySelectorAll(".hourly-forecast .card");
  hourlycards.forEach((card, index) => {
    card.addEventListener("click", () => showOrHideMoreInfo(index));
  });
})();

function setCurrentWeather(currentWeather, unit) {
  const cityName = document.querySelector(".location h3");
  cityName.textContent = `${currentWeather.city}, ${currentWeather.country}`;
  const tempUnit = unit == "metric" ? "°C" : "°F";
  const time = document.querySelector(".time");
  const date = new Date(currentWeather.time * 1000);
  let hr = date.getHours();
  const ampm = hr > 12 ? "PM" : "AM";
  hr = hr <= 12 ? hr : hr - 12;
  let min = date.getMinutes();
  min = min > 9 ? min : "0" + min;
  time.textContent = `${hr}:${min} ${ampm}`;
  const img = document.querySelector(".weather-img");
  img.src = currentWeather.icon;
  const temp = document.querySelector(".current-temprature");
  temp.textContent = currentWeather.temp.toFixed(1);
  const unitIcon = document.querySelector(".unit");
  unitIcon.textContent = tempUnit;
  const desc = document.querySelector(".condition");
  desc.textContent = currentWeather.description;
  const feelsLike = document.querySelector(".feels");
  feelsLike.textContent = `feels like ${currentWeather.feelsLike.toFixed(1)}${tempUnit}`;
  const description = document.querySelector(".description");
  description.textContent = `The high will be ${currentWeather.tempMax.toFixed(1)}${tempUnit}.`;
  const wind = document.querySelector(".wind .value");
  wind.textContent = `${currentWeather.windSpeed} m/s`;
  const humidity = document.querySelector(".humidity .value");
  humidity.textContent = `${currentWeather.humidity}%`;
  const pressure = document.querySelector(".pressure .value");
  pressure.textContent = `${currentWeather.pressure} hPa`;
  const visibility = document.querySelector(".visibility .value");
  visibility.textContent = `${currentWeather.visibility} Km`; //set display colors

  setColorClass(currentWeather.id, currentWeather.dayNight);
}

function setColorClass(id, time) {
  const body = document.body;
  body.removeAttribute("class");

  switch (true) {
    case id >= 200 && id < 300:
      body.classList.add("thunderstorm");
      break;

    case id >= 300 && id < 600:
      body.classList.add("rain");
      break;

    case id >= 600 && id < 700:
      body.classList.add("snow");
      break;

    case id >= 700 && id < 800:
      body.classList.add("haze");
      break;

    case id == 800 && time == "d":
      body.classList.add("sunny");
      break;

    case id == 800 && time == "n":
      body.classList.add("clear-night");
      break;

    case id > 800:
      body.classList.add("sunny");
      break;
  }
}

function controlLeftSliderBtns(btn) {
  const slideContainer = btn.parentElement;
  const cards = slideContainer.children[2].children;
  const firstCard = cards[0];
  const firstCardLeftOffset = parseInt(firstCard.style.left.split("px")[0]);

  if (firstCardLeftOffset < 0) {
    slideContainer.querySelector(".prev").classList.add("show");
  } else {
    slideContainer.querySelector(".prev").classList.remove("show");
  }
}

function controlRightSliderBtns(btn) {
  const slideContainer = btn.parentElement;
  const cards = slideContainer.children[2].children;
  const lastCard = cards[cards.length - 1];
  const lastCardRightOffset = parseInt(lastCard.style.left.split("px")[0]) + lastCard.clientWidth;

  if (lastCardRightOffset > slideContainer.clientWidth) {
    slideContainer.querySelector(".next").classList.add("show");
  } else {
    slideContainer.querySelector(".next").classList.remove("show");
  }
}

function slideLeft(e) {
  const cards = Array.from(e.target.parentElement.children[2].children);
  const index = cards.findIndex(card => card.style.left == "0px");
  let slideWidth = cards[index - 1].clientWidth;
  cards.forEach(card => {
    card.setAttribute("style", `left:${card.offsetLeft + (slideWidth + 5)}px`);
  });
  controlLeftSliderBtns(e.target);
  controlRightSliderBtns(e.target);
}

function slideRight(e) {
  const cards = Array.from(e.target.parentElement.children[2].children);
  let slideWidth = cards.filter(card => card.style.left == "0px")[0].clientWidth;
  cards.forEach(card => {
    card.setAttribute("style", `left:${card.offsetLeft - (slideWidth + 5)}px`);
  });
  controlRightSliderBtns(e.target);
  controlLeftSliderBtns(e.target);
}

function showOrHideMoreInfo(index) {
  const cards = document.querySelectorAll(".hourly-forecast .card");
  const cardMoreInfo = cards[index].querySelector(".more-hourly-info-container");

  if (cardMoreInfo.classList.contains("show")) {
    hideMoreInfo(cardMoreInfo, index);
  } else {
    for (let i = 0; i < cards.length; i++) {
      let moreInfo = cards[i].querySelector(".more-hourly-info-container");

      if (moreInfo.classList.contains("show")) {
        hideMoreInfo(moreInfo, i);
        break;
      }
    }

    showMoreInfo(cardMoreInfo, index);
  }
}

function showMoreInfo(cardMoreInfo, index) {
  const cards = document.querySelectorAll(".hourly-forecast .card");
  const moreInfoCardWidth = 220;

  for (let i = index + 1; i < cards.length; i++) {
    const cardLeftOffset = parseInt(cards[i].style.left.split("px")[0]);
    cards[i].style.left = cardLeftOffset + moreInfoCardWidth + "px";
  }

  cardMoreInfo.classList.add("show");
  controlRightSliderBtns(document.querySelector(".hourly-forecast .nav-btns.next"));
}

function hideMoreInfo(cardMoreInfo, index) {
  const cards = Array.from(document.querySelectorAll(".hourly-forecast .card"));
  const moreInfoCardWidth = 220;
  let IndexCardAtZeroOffset = cards.findIndex(card => card.style.left == "0px");
  cardMoreInfo.classList.remove("show");

  for (let i = 0; i < cards.length; i++) {
    cards[i].style.left = (i - IndexCardAtZeroOffset) * (cards[i].clientWidth + 5) + "px";
  }

  controlRightSliderBtns(document.querySelector(".hourly-forecast .nav-btns.next"));
}

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/style.css":
/*!*************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/style.css ***!
  \*************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, "*, *::before, *::after {\n  box-sizing: border-box;\n  margin: 0;\n  padding: 0;\n}\n\nbody.cloudy,\nbody.rain,\nbody.thunderstorm,\nbody.snow {\n  --body-bg-color: #475775;\n  --current-bg-color: #394968;\n  --nav-bg-color: #54617a;\n  --search-bar-color: #68748a;\n  --forecast-color: #4D5C7A;\n  --forecast-active-color: #51607c;\n  --hourly-color: #52607d;\n  --nav-button-color: #51607c60;\n}\n\nbody.haze {\n  --body-bg-color: #5b564f;\n  --current-bg-color: #58544a;\n  --nav-bg-color: #68645f;\n  --search-bar-color: #7a7672;\n  --forecast-color: #57544a;\n  --forecast-active-color: #636058;\n  --hourly-color: #534e43;\n  --nav-button-color: #63605860;\n}\n\nbody.sunny {\n  --body-bg-color: #224f90;\n  --current-bg-color: #174385;\n  --current-bg-img: \"https://assets.msn.com/weathermapdata/1/static/background/v2.0/compactads3/Sunny.png\";\n  --nav-bg-color: #325b8f;\n  --search-bar-color: #496e9d;\n  --forecast-color: #285695;\n  --forecast-active-color: #315e99;\n  --hourly-color: #305c97;\n  --nav-button-color: #315e9960;\n}\n\nbody.clear-night {\n  --body-bg-color: #233d64;\n  --current-bg-color: #00000050;\n  --nav-bg-color: #364e6f;\n  --search-bar-color: #4d6480;\n  --forecast-color: #263c5f;\n  --forecast-active-color: #32486c;\n  --hourly-color: #324869;\n  --nav-button-color: #32486c60;\n}\n\nbody {\n  font-family: Segoe UI, Segoe WP, Arial, Sans-Serif;\n  color: #fff;\n  background: var(--body-bg-color);\n}\n\nheader {\n  background-color: var(--nav-bg-color);\n  padding: 1vh 15vw;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n}\n\n.search-bar {\n  background-color: var(--search-bar-color);\n  width: 100%;\n  max-width: 300px;\n  border-radius: 60px;\n  padding: 5px 20px;\n  display: flex;\n  align-items: center;\n}\n\n.search-bar input {\n  flex: 1;\n  background-color: transparent;\n  outline: none;\n  border: 0;\n  color: #fff;\n}\n\n::placeholder {\n  /* Chrome, Firefox, Opera, Safari 10.1+ */\n  color: #dcdcdc;\n  opacity: 1; /* Firefox */\n}\n\n:-ms-input-placeholder {\n  /* Internet Explorer 10-11 */\n  color: #dcdcdc;\n}\n\n::-ms-input-placeholder {\n  /* Microsoft Edge */\n  color: #dcdcdc;\n}\n\nbutton[type=\"submit\"] {\n  border: 0;\n  background-color: transparent;\n}\n\n.search-icon {\n  font-size: 16px;\n  color: #fff;\n}\n\n#temp-unit {\n  padding: 5px;\n  background-color: var(--search-bar-color);\n  color: #ffffff;\n  outline: none;\n  border: 0;\n  border-radius: 5px;\n}\n\nmain {\n  padding: 3vh 15vw;\n}\n\n.current {\n  background-color: var(--current-bg-color);\n  background-image: url(https://assets.msn.com/weathermapdata/1/static/background/v2.0/compactads3/Sunny.png);\n  margin-top: 12px;\n  padding: 12px 48px 16px 24px;\n  display: grid;\n  gap: 20px;\n  border-radius: 8px;\n  background-size: cover;\n}\n\n.important-info {\n  display: flex;\n  align-items: center;\n  justify-content: flex-start;\n  gap: 48px;\n}\n\n.current-temp div {\n  font-size: 48px;\n  display: flex;\n  align-items: flex-start;\n  gap: 0;\n}\n\n.current-temp .unit {\n  font-size: 28px;\n}\n\n.condition {\n  font-size: 20px;\n  font-weight: 600;\n  text-transform: capitalize;\n}\n\n.feels {\n  font-size: 14px;\n  text-transform: uppercase;\n  font-weight: 400;\n}\n\n.description {\n  font-weight: 600;\n}\n\n.other-infos {\n  display: flex;\n  gap: 2rem;\n}\n\n.temp {\n  display: flex;\n  gap: 8px;\n}\n\n.temp p {\n  font-size: 32px;\n}\n\n.temp p span {\n  font-size: 22px;\n}\n\n.title h3 {\n  font-size: 16px;\n  font-weight: 600;\n  text-transform: uppercase;\n}\n\n.time {\n  font-size: 14px;\n}\n\n.element {\n  font-size: 12px;\n  text-transform: uppercase;\n}\n\n.info-item .value {\n  font-size: 16px;\n  font-weight: 600;\n}\n\n.forecast,\n.hourly-forecast {\n  margin-top: 16px;\n}\n\n.forecast h3 {\n  font-size: 16px;\n  text-transform: uppercase;\n  margin-bottom: 12px;\n}\n\n.slider {\n  position: relative;\n}\n\n.card-container {\n  position: relative;\n  overflow: hidden;\n}\n\n.card {\n  position: absolute;\n  padding: 0 0.5rem;\n  background-color: var(--forecast-color);\n  border-radius: 5px;\n  transition: left 250ms ease-out;\n}\n\n.forecast .card {\n  width: 120px;\n}\n\n.temp-forcast {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n\n.card:hover,\n.card:focus {\n  cursor: pointer;\n}\n\n.arrow {\n  position: absolute;\n  bottom: 0;\n  width: 0; \n  height: 0;\n  overflow: visible;\n  border-left: 5px solid transparent;\n  border-right: 5px solid transparent;\n  \n  border-top: 5px solid #fff;\n}\n\n.card .date {\n  text-transform: capitalize;\n}\n\n.temp-forcast img {\n  width: 4rem;\n  height: 4rem;\n}\n\n.temp-info {\n  display: flex;\n  flex-direction: column;\n  gap: 0.5rem;\n  font-size: 16px;\n}\n\n.nav-btns {\n  font-size: 1.2rem;\n  font-weight: 900;\n  background: var(--forecast-active-color);\n  border: 0;\n  width: 1.6rem;\n  height: 1.6rem;\n  border-radius: 50%;\n  color: #ffffff;\n  position: absolute;\n  z-index: 2;\n  top: calc(50% - 0.8rem);\n  box-shadow: 0 0 8px var(--forecast-active-color);\n  display: none;\n}\n\n.nav-btns.next.show,\n.nav-btns.prev.show {\n  display: block;\n}\n\n.nav-btns:hover {\n  outline: none;\n  border: 1px solid #ffffff70;\n  cursor: pointer;\n}\n\n.nav-btns.next {\n  right: -0.8rem;\n}\n\n.nav-btns.prev {\n  left: -0.8rem;\n}\n\n.hourly-forecast .card {\n  background-color: var(--forecast-active-color);\n  display: flex;\n}\n\n.hourly-forecast .title {\n  font-size: 12px;\n  text-transform: capitalize;\n  font-weight: 600;\n}\n\n.basic-hourly-info {\n  font-size: 12px;\n  font-weight: 300;\n}\n\n.basic-hourly-info {\n  padding: 0.5rem;\n  border-radius: 5px 0 0 5px;\n  display: flex;\n  flex-direction: column;\n  gap: 0.5rem;\n  padding: 0.5rem 1rem;\n  width: 6.5rem;\n  width: 110px;\n}\n\n.basic-hourly-info img {\n  width: 3rem;\n  height: 3rem;\n}\n\n.basic-hourly-info .wind-speed {\n  display: flex;\n  align-items: center;\n  gap: 4px;\n}\n\n.basic-hourly-info .wind-speed span {\n  font-size: 12px;\n  font-weight: 100;\n}\n\n.chance-of-rain {\n  margin-top: 2rem;\n}\n\n.more-hourly-info-container {\n  border-left: 1px dashed #ffffff80;\n  width: 220px;\n  display: none;\n}\n\n.more-hourly-info-container.show {\n  display: block;\n}\n\n.more-hourly-info {\n  width: 100%;\n  height: 100%;\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  align-items: center;\n  padding: 12px 10px;\n}\n\n.more-hourly-info p {\n  font-size: 10px;\n  font-weight: lighter;\n  text-transform: uppercase;\n}\n\n.more-hourly-info > div {\n  display: flex;\n  align-items: center;\n  gap: 5px;\n  font-weight: lighter;\n}\n\n.more-hourly-info span {\n  font-size: 14px;\n  font-weight: 100;\n}\n\n.more-hourly-info .value {\n  margin-top: 4px;\n  font-weight: 900;\n}", "",{"version":3,"sources":["webpack://./src/style.css"],"names":[],"mappings":"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","sourcesContent":["*, *::before, *::after {\n  box-sizing: border-box;\n  margin: 0;\n  padding: 0;\n}\n\nbody.cloudy,\nbody.rain,\nbody.thunderstorm,\nbody.snow {\n  --body-bg-color: #475775;\n  --current-bg-color: #394968;\n  --nav-bg-color: #54617a;\n  --search-bar-color: #68748a;\n  --forecast-color: #4D5C7A;\n  --forecast-active-color: #51607c;\n  --hourly-color: #52607d;\n  --nav-button-color: #51607c60;\n}\n\nbody.haze {\n  --body-bg-color: #5b564f;\n  --current-bg-color: #58544a;\n  --nav-bg-color: #68645f;\n  --search-bar-color: #7a7672;\n  --forecast-color: #57544a;\n  --forecast-active-color: #636058;\n  --hourly-color: #534e43;\n  --nav-button-color: #63605860;\n}\n\nbody.sunny {\n  --body-bg-color: #224f90;\n  --current-bg-color: #174385;\n  --current-bg-img: \"https://assets.msn.com/weathermapdata/1/static/background/v2.0/compactads3/Sunny.png\";\n  --nav-bg-color: #325b8f;\n  --search-bar-color: #496e9d;\n  --forecast-color: #285695;\n  --forecast-active-color: #315e99;\n  --hourly-color: #305c97;\n  --nav-button-color: #315e9960;\n}\n\nbody.clear-night {\n  --body-bg-color: #233d64;\n  --current-bg-color: #00000050;\n  --nav-bg-color: #364e6f;\n  --search-bar-color: #4d6480;\n  --forecast-color: #263c5f;\n  --forecast-active-color: #32486c;\n  --hourly-color: #324869;\n  --nav-button-color: #32486c60;\n}\n\nbody {\n  font-family: Segoe UI, Segoe WP, Arial, Sans-Serif;\n  color: #fff;\n  background: var(--body-bg-color);\n}\n\nheader {\n  background-color: var(--nav-bg-color);\n  padding: 1vh 15vw;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n}\n\n.search-bar {\n  background-color: var(--search-bar-color);\n  width: 100%;\n  max-width: 300px;\n  border-radius: 60px;\n  padding: 5px 20px;\n  display: flex;\n  align-items: center;\n}\n\n.search-bar input {\n  flex: 1;\n  background-color: transparent;\n  outline: none;\n  border: 0;\n  color: #fff;\n}\n\n::placeholder {\n  /* Chrome, Firefox, Opera, Safari 10.1+ */\n  color: #dcdcdc;\n  opacity: 1; /* Firefox */\n}\n\n:-ms-input-placeholder {\n  /* Internet Explorer 10-11 */\n  color: #dcdcdc;\n}\n\n::-ms-input-placeholder {\n  /* Microsoft Edge */\n  color: #dcdcdc;\n}\n\nbutton[type=\"submit\"] {\n  border: 0;\n  background-color: transparent;\n}\n\n.search-icon {\n  font-size: 16px;\n  color: #fff;\n}\n\n#temp-unit {\n  padding: 5px;\n  background-color: var(--search-bar-color);\n  color: #ffffff;\n  outline: none;\n  border: 0;\n  border-radius: 5px;\n}\n\nmain {\n  padding: 3vh 15vw;\n}\n\n.current {\n  background-color: var(--current-bg-color);\n  background-image: url(https://assets.msn.com/weathermapdata/1/static/background/v2.0/compactads3/Sunny.png);\n  margin-top: 12px;\n  padding: 12px 48px 16px 24px;\n  display: grid;\n  gap: 20px;\n  border-radius: 8px;\n  background-size: cover;\n}\n\n.important-info {\n  display: flex;\n  align-items: center;\n  justify-content: flex-start;\n  gap: 48px;\n}\n\n.current-temp div {\n  font-size: 48px;\n  display: flex;\n  align-items: flex-start;\n  gap: 0;\n}\n\n.current-temp .unit {\n  font-size: 28px;\n}\n\n.condition {\n  font-size: 20px;\n  font-weight: 600;\n  text-transform: capitalize;\n}\n\n.feels {\n  font-size: 14px;\n  text-transform: uppercase;\n  font-weight: 400;\n}\n\n.description {\n  font-weight: 600;\n}\n\n.other-infos {\n  display: flex;\n  gap: 2rem;\n}\n\n.temp {\n  display: flex;\n  gap: 8px;\n}\n\n.temp p {\n  font-size: 32px;\n}\n\n.temp p span {\n  font-size: 22px;\n}\n\n.title h3 {\n  font-size: 16px;\n  font-weight: 600;\n  text-transform: uppercase;\n}\n\n.time {\n  font-size: 14px;\n}\n\n.element {\n  font-size: 12px;\n  text-transform: uppercase;\n}\n\n.info-item .value {\n  font-size: 16px;\n  font-weight: 600;\n}\n\n.forecast,\n.hourly-forecast {\n  margin-top: 16px;\n}\n\n.forecast h3 {\n  font-size: 16px;\n  text-transform: uppercase;\n  margin-bottom: 12px;\n}\n\n.slider {\n  position: relative;\n}\n\n.card-container {\n  position: relative;\n  overflow: hidden;\n}\n\n.card {\n  position: absolute;\n  padding: 0 0.5rem;\n  background-color: var(--forecast-color);\n  border-radius: 5px;\n  transition: left 250ms ease-out;\n}\n\n.forecast .card {\n  width: 120px;\n}\n\n.temp-forcast {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n\n.card:hover,\n.card:focus {\n  cursor: pointer;\n}\n\n.arrow {\n  position: absolute;\n  bottom: 0;\n  width: 0; \n  height: 0;\n  overflow: visible;\n  border-left: 5px solid transparent;\n  border-right: 5px solid transparent;\n  \n  border-top: 5px solid #fff;\n}\n\n.card .date {\n  text-transform: capitalize;\n}\n\n.temp-forcast img {\n  width: 4rem;\n  height: 4rem;\n}\n\n.temp-info {\n  display: flex;\n  flex-direction: column;\n  gap: 0.5rem;\n  font-size: 16px;\n}\n\n.nav-btns {\n  font-size: 1.2rem;\n  font-weight: 900;\n  background: var(--forecast-active-color);\n  border: 0;\n  width: 1.6rem;\n  height: 1.6rem;\n  border-radius: 50%;\n  color: #ffffff;\n  position: absolute;\n  z-index: 2;\n  top: calc(50% - 0.8rem);\n  box-shadow: 0 0 8px var(--forecast-active-color);\n  display: none;\n}\n\n.nav-btns.next.show,\n.nav-btns.prev.show {\n  display: block;\n}\n\n.nav-btns:hover {\n  outline: none;\n  border: 1px solid #ffffff70;\n  cursor: pointer;\n}\n\n.nav-btns.next {\n  right: -0.8rem;\n}\n\n.nav-btns.prev {\n  left: -0.8rem;\n}\n\n.hourly-forecast .card {\n  background-color: var(--forecast-active-color);\n  display: flex;\n}\n\n.hourly-forecast .title {\n  font-size: 12px;\n  text-transform: capitalize;\n  font-weight: 600;\n}\n\n.basic-hourly-info {\n  font-size: 12px;\n  font-weight: 300;\n}\n\n.basic-hourly-info {\n  padding: 0.5rem;\n  border-radius: 5px 0 0 5px;\n  display: flex;\n  flex-direction: column;\n  gap: 0.5rem;\n  padding: 0.5rem 1rem;\n  width: 6.5rem;\n  width: 110px;\n}\n\n.basic-hourly-info img {\n  width: 3rem;\n  height: 3rem;\n}\n\n.basic-hourly-info .wind-speed {\n  display: flex;\n  align-items: center;\n  gap: 4px;\n}\n\n.basic-hourly-info .wind-speed span {\n  font-size: 12px;\n  font-weight: 100;\n}\n\n.chance-of-rain {\n  margin-top: 2rem;\n}\n\n.more-hourly-info-container {\n  border-left: 1px dashed #ffffff80;\n  width: 220px;\n  display: none;\n}\n\n.more-hourly-info-container.show {\n  display: block;\n}\n\n.more-hourly-info {\n  width: 100%;\n  height: 100%;\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  align-items: center;\n  padding: 12px 10px;\n}\n\n.more-hourly-info p {\n  font-size: 10px;\n  font-weight: lighter;\n  text-transform: uppercase;\n}\n\n.more-hourly-info > div {\n  display: flex;\n  align-items: center;\n  gap: 5px;\n  font-weight: lighter;\n}\n\n.more-hourly-info span {\n  font-size: 14px;\n  font-weight: 100;\n}\n\n.more-hourly-info .value {\n  margin-top: 4px;\n  font-weight: 900;\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";

      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }

      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }

      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }

      content += cssWithMappingToString(item);

      if (needLayer) {
        content += "}";
      }

      if (item[2]) {
        content += "}";
      }

      if (item[4]) {
        content += "}";
      }

      return content;
    }).join("");
  }; // import a list of modules into the list


  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }

      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }

      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }

      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }

      list.push(item);
    }
  };

  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/sourceMaps.js":
/*!************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \************************************************************/
/***/ ((module) => {



module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];

  if (!cssMapping) {
    return content;
  }

  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    var sourceURLs = cssMapping.sources.map(function (source) {
      return "/*# sourceURL=".concat(cssMapping.sourceRoot || "").concat(source, " */");
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join("\n");
  }

  return [content].join("\n");
};

/***/ }),

/***/ "./src/style.css":
/*!***********************!*\
  !*** ./src/style.css ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../node_modules/css-loader/dist/cjs.js!./style.css */ "./node_modules/css-loader/dist/cjs.js!./src/style.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module) => {



var stylesInDOM = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };

    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);

  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }

      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };

  return updater;
}

module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();

        stylesInDOM.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ ((module) => {



var memo = {};
/* istanbul ignore next  */

function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }

    memo[target] = styleTarget;
  }

  return memo[target];
}
/* istanbul ignore next  */


function insertBySelector(insert, style) {
  var target = getTarget(insert);

  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }

  target.appendChild(style);
}

module.exports = insertBySelector;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}

module.exports = insertStyleElement;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;

  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}

module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";

  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }

  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }

  var needLayer = typeof obj.layer !== "undefined";

  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }

  css += obj.css;

  if (needLayer) {
    css += "}";
  }

  if (obj.media) {
    css += "}";
  }

  if (obj.supports) {
    css += "}";
  }

  var sourceMap = obj.sourceMap;

  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  options.styleTagTransform(css, styleElement, options.options);
}

function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }

  styleElement.parentNode.removeChild(styleElement);
}
/* istanbul ignore next  */


function domAPI(options) {
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}

module.exports = domAPI;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }

    styleElement.appendChild(document.createTextNode(css));
  }
}

module.exports = styleTagTransform;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _style_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./style.css */ "./src/style.css");
/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./api */ "./src/api.js");
/* harmony import */ var _dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./dom */ "./src/dom.js");




(function () {
  const form = document.querySelector("form.search-bar");
  form.addEventListener("submit", handleSearchLocationWeather);
  const select = document.querySelector("#temp-unit");
  select.addEventListener("change", handleMeasurementUnit); //display current user location weather

  userLocationWeather();
})();

function userLocationWeather() {
  navigator.geolocation.getCurrentPosition(async position => {
    try {
      const current = await (0,_api__WEBPACK_IMPORTED_MODULE_1__.currentWeather)({
        lat: position.coords.latitude,
        lon: position.coords.longitude
      });
      (0,_dom__WEBPACK_IMPORTED_MODULE_2__.setCurrentWeather)(current, "metric");
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
    const current = await (0,_api__WEBPACK_IMPORTED_MODULE_1__.currentWeather)(city, tempUnit);
    (0,_dom__WEBPACK_IMPORTED_MODULE_2__.setCurrentWeather)(current, tempUnit);
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
    const current = await (0,_api__WEBPACK_IMPORTED_MODULE_1__.currentWeather)(city, tempUnit);
    (0,_dom__WEBPACK_IMPORTED_MODULE_2__.setCurrentWeather)(current, tempUnit);
  } catch (err) {
    console.error(err);
  }
}
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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V0FBVyxZQUFZLE9BQU8sS0FBSyxVQUFVLFlBQVksV0FBVyxVQUFVLFVBQVUsTUFBTSxLQUFLLFlBQVksV0FBVyxvQkFBb0IsT0FBTyxLQUFLLFlBQVksV0FBVyxPQUFPLEtBQUssWUFBWSxXQUFXLE9BQU8sS0FBSyxVQUFVLFlBQVksT0FBTyxLQUFLLFVBQVUsVUFBVSxNQUFNLEtBQUssVUFBVSxZQUFZLFdBQVcsVUFBVSxVQUFVLFlBQVksT0FBTyxLQUFLLFlBQVksT0FBTyxLQUFLLFlBQVksYUFBYSxhQUFhLGFBQWEsV0FBVyxVQUFVLFlBQVksYUFBYSxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsV0FBVyxNQUFNLEtBQUssVUFBVSxVQUFVLFlBQVksV0FBVyxNQUFNLEtBQUssVUFBVSxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsT0FBTyxLQUFLLFVBQVUsWUFBWSxhQUFhLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxVQUFVLFVBQVUsTUFBTSxLQUFLLFVBQVUsVUFBVSxNQUFNLEtBQUssVUFBVSxPQUFPLEtBQUssVUFBVSxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsT0FBTyxLQUFLLFVBQVUsT0FBTyxLQUFLLFVBQVUsWUFBWSxPQUFPLEtBQUssVUFBVSxZQUFZLE9BQU8sTUFBTSxZQUFZLE9BQU8sS0FBSyxVQUFVLFlBQVksYUFBYSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssWUFBWSxhQUFhLE9BQU8sS0FBSyxZQUFZLGFBQWEsYUFBYSxhQUFhLGFBQWEsT0FBTyxLQUFLLFVBQVUsTUFBTSxLQUFLLFVBQVUsWUFBWSxhQUFhLE9BQU8sTUFBTSxVQUFVLE9BQU8sS0FBSyxZQUFZLFdBQVcsVUFBVSxVQUFVLFlBQVksYUFBYSxjQUFjLGFBQWEsT0FBTyxLQUFLLFlBQVksT0FBTyxLQUFLLFVBQVUsVUFBVSxNQUFNLEtBQUssVUFBVSxZQUFZLFdBQVcsVUFBVSxPQUFPLEtBQUssWUFBWSxhQUFhLGFBQWEsV0FBVyxVQUFVLFVBQVUsWUFBWSxXQUFXLFlBQVksV0FBVyxZQUFZLGFBQWEsV0FB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RCxFQUFVeEQsUUFBVixDQUFqQjtFQUNELENBTkQsQ0FNRSxPQUFPN0IsR0FBUCxFQUFZO0lBQ1p5RixPQUFPLENBQUNDLEtBQVIsQ0FBYzFGLEdBQWQ7RUFDRDs7RUFDRDRFLElBQUksQ0FBQ21CLEtBQUw7QUFDRDs7QUFFRCxlQUFlaEIscUJBQWYsR0FBdUM7RUFDckMsSUFBSTtJQUNGLE1BQU05SCxJQUFJLEdBQUdpRCxRQUFRLENBQUNDLGFBQVQsQ0FBdUIsV0FBdkIsRUFBb0N5QixXQUFwQyxDQUFnRDRCLEtBQWhELENBQXNELEdBQXRELEVBQTJELENBQTNELENBQWI7SUFDQWlDLE9BQU8sQ0FBQ08sR0FBUixDQUFZL0ksSUFBWjtJQUNBLE1BQU02SCxNQUFNLEdBQUc1RSxRQUFRLENBQUNDLGFBQVQsQ0FBdUIsWUFBdkIsQ0FBZjtJQUNBLE1BQU0wQixRQUFRLEdBQUdpRCxNQUFNLENBQUNlLE9BQVAsQ0FBZWYsTUFBTSxDQUFDZ0IsYUFBdEIsRUFBcUNGLEtBQXREO0lBQ0EsTUFBTVAsT0FBTyxHQUFHLE1BQU1ySSxvREFBYyxDQUFDQyxJQUFELEVBQU80RSxRQUFQLENBQXBDO0lBQ0FILHVEQUFpQixDQUFDMkQsT0FBRCxFQUFVeEQsUUFBVixDQUFqQjtFQUNELENBUEQsQ0FPRSxPQUFPN0IsR0FBUCxFQUFZO0lBQ1p5RixPQUFPLENBQUNDLEtBQVIsQ0FBYzFGLEdBQWQ7RUFDRDtBQUNGLEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL3NyYy9hcGkuanMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9zcmMvZG9tLmpzIiwid2VicGFjazovL3dlYXRoZXItYXBwLy4vc3JjL3N0eWxlLmNzcyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qcyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL3NyYy9zdHlsZS5jc3M/NzE2MyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qcyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qcyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzIiwid2VicGFjazovL3dlYXRoZXItYXBwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3dlYXRoZXItYXBwL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL3dlYXRoZXItYXBwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3dlYXRoZXItYXBwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvd2VicGFjay9ydW50aW1lL25vbmNlIiwid2VicGFjazovL3dlYXRoZXItYXBwLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBhc3luYyBmdW5jdGlvbiBjdXJyZW50V2VhdGhlcihjaXR5LCB1bml0PVwibWV0cmljXCIpIHtcbiAgbGV0IHVybCA9IGBodHRwczovL2FwaS5vcGVud2VhdGhlcm1hcC5vcmcvZGF0YS8yLjUvd2VhdGhlcj9xPSR7Y2l0eX0mYXBwaWQ9NzI3ZDYyZDU3YjFjMTAzOTY1NDNhZmU3Y2Q5ZTQ3MzkmdW5pdHM9JHt1bml0fWA7XG4gIGlmICh0eXBlb2YgY2l0eSAhPSBcInN0cmluZ1wiKSB7XG4gICAgdXJsID0gYGh0dHBzOi8vYXBpLm9wZW53ZWF0aGVybWFwLm9yZy9kYXRhLzIuNS93ZWF0aGVyP2xhdD0ke2NpdHkubGF0fSZsb249JHtjaXR5Lmxvbn0mYXBwaWQ9NzI3ZDYyZDU3YjFjMTAzOTY1NDNhZmU3Y2Q5ZTQ3MzkmdW5pdHM9JHt1bml0fWA7XG4gIH1cbiAgdHJ5IHtcbiAgICBjb25zdCByZXNwID0gYXdhaXQgZmV0Y2godXJsKTtcbiAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzcC5qc29uKCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlkOiBkYXRhLndlYXRoZXJbMF0uaWQsXG4gICAgICBjaXR5OiBkYXRhLm5hbWUsXG4gICAgICBjb3VudHJ5OiBkYXRhLnN5cy5jb3VudHJ5LFxuICAgICAgZmVlbHNMaWtlOiBkYXRhLm1haW4uZmVlbHNfbGlrZSxcbiAgICAgIGh1bWlkaXR5OiBkYXRhLm1haW4uaHVtaWRpdHksXG4gICAgICBwcmVzc3VyZTogZGF0YS5tYWluLnByZXNzdXJlLFxuICAgICAgdGVtcDogZGF0YS5tYWluLnRlbXAsXG4gICAgICB0ZW1wTWF4OiBkYXRhLm1haW4udGVtcF9tYXgsXG4gICAgICB0ZW1wTWluOiBkYXRhLm1haW4udGVtcF9taW4sXG4gICAgICB2aXNpYmlsaXR5OiBkYXRhLnZpc2liaWxpdHkgLyAxMDAwLFxuICAgICAgZGVzY3JpcHRpb246IGRhdGEud2VhdGhlclswXS5kZXNjcmlwdGlvbixcbiAgICAgIGljb246IGBodHRwczovL29wZW53ZWF0aGVybWFwLm9yZy9pbWcvd24vJHtkYXRhLndlYXRoZXJbMF0uaWNvbn1AMngucG5nYCxcbiAgICAgIGRheU5pZ2h0OiBkYXRhLndlYXRoZXJbMF0uaWNvblsyXSxcbiAgICAgIHdpbmRTcGVlZDogZGF0YS53aW5kLnNwZWVkLFxuICAgICAgd2luZERlZzogZGF0YS53aW5kLmRlZyxcbiAgICAgIHRpbWU6IGRhdGEuZHQsXG4gICAgfTtcbiAgfSBjYXRjaCB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiVW5hYmxlIHRvIGZldGNoLlwiKTtcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZm9yZWNhc3QoY2l0eSwgdW5pdD1cIm1ldHJpY1wiKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgdXJsID0gYGh0dHBzOi8vYXBpLm9wZW53ZWF0aGVybWFwLm9yZy9kYXRhLzIuNS9mb3JlY2FzdD9xPSR7Y2l0eX0mYXBwaWQ9NzI3ZDYyZDU3YjFjMTAzOTY1NDNhZmU3Y2Q5ZTQ3MzkmdW5pdHM9JHt1bml0fWA7XG4gICAgY29uc3QgcmVzcCA9IGF3YWl0IGZldGNoKHVybCk7XG4gICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlc3AuanNvbigpO1xuICAgIHJldHVybiB7XG4gICAgICBjaXR5OiBkYXRhLmNpdHkubmFtZSxcbiAgICAgIGRheXM6IGRhdGEubGlzdC5tYXAoKGhvdXJseSkgPT4ge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGZlZWxzTGlrZTogaG91cmx5Lm1haW4uZmVlbHNfbGlrZSxcbiAgICAgICAgICBodW1pZGl0eTogaG91cmx5Lm1haW4uaHVtaWRpdHksXG4gICAgICAgICAgcHJlc3N1cmU6IGhvdXJseS5tYWluLnByZXNzdXJlLFxuICAgICAgICAgIHRlbXA6IGhvdXJseS5tYWluLnRlbXAsXG4gICAgICAgICAgdGVtcE1heDogaG91cmx5Lm1haW4udGVtcF9tYXgsXG4gICAgICAgICAgdGVtcE1pbjogaG91cmx5Lm1haW4udGVtcF9taW4sXG4gICAgICAgICAgdmlzaWJpbGl0eTogaG91cmx5LnZpc2liaWxpdHkgLyAxMDAwLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiBob3VybHkud2VhdGhlclswXS5kZXNjcmlwdGlvbixcbiAgICAgICAgICBpY29uOiBgaHR0cHM6Ly9vcGVud2VhdGhlcm1hcC5vcmcvaW1nL3duLyR7aG91cmx5LndlYXRoZXJbMF0uaWNvbn1AMngucG5nYCxcbiAgICAgICAgICB3aW5kU3BlZWQ6IGhvdXJseS53aW5kLnNwZWVkLFxuICAgICAgICAgIHdpbmREZWc6IGhvdXJseS53aW5kLmRlZyxcbiAgICAgICAgICB0aW1lOiBob3VybHkuZHQgLSBkYXRhLmNpdHkudGltZXpvbmUsXG4gICAgICAgICAgcGVyY2lwaXRhdGlvbjogTWF0aC5yb3VuZChob3VybHkucG9wICogMTAwKSxcbiAgICAgICAgICByYWluOiBob3VybHkucmFpbixcbiAgICAgICAgfTtcbiAgICAgIH0pLFxuICAgIH07XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIHRocm93IG5ldyBFcnJvcihlcnIpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBjdXJyZW50V2VhdGhlciB9IGZyb20gXCIuL2FwaVwiO1xuXG4oZnVuY3Rpb24gKCkge1xuICBjb25zdCBmb3JlY2FzdENhcmRDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuICAgIFwiLmZvcmVjYXN0IC5jYXJkLWNvbnRhaW5lclwiXG4gICk7XG4gIGxldCBjYXJkcyA9IGZvcmVjYXN0Q2FyZENvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKFwiLmNhcmRcIik7XG4gIGZvcmVjYXN0Q2FyZENvbnRhaW5lci5zZXRBdHRyaWJ1dGUoXG4gICAgXCJzdHlsZVwiLFxuICAgIGBoZWlnaHQ6JHtjYXJkc1swXS5jbGllbnRIZWlnaHR9cHhgXG4gICk7XG4gIC8vcG9zaXRpb24gY2FyZHMgb2YgcG9zaXRpb24gYWJzb2x1dGUgdXNpbmcgbGVmdCBhdHRyaWJ1dGVcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBjYXJkcy5sZW5ndGg7IGkrKykge1xuICAgIGNhcmRzW2ldLnNldEF0dHJpYnV0ZShcInN0eWxlXCIsIGBsZWZ0OiR7KGNhcmRzW2ldLmNsaWVudFdpZHRoICsgNSkgKiBpfXB4YCk7XG4gIH1cblxuICBjb25zdCBob3VybHlDYXJkQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICBcIi5ob3VybHktZm9yZWNhc3QgLmNhcmQtY29udGFpbmVyXCJcbiAgKTtcbiAgY2FyZHMgPSBob3VybHlDYXJkQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuY2FyZFwiKTtcbiAgaG91cmx5Q2FyZENvbnRhaW5lci5zZXRBdHRyaWJ1dGUoXG4gICAgXCJzdHlsZVwiLFxuICAgIGBoZWlnaHQ6JHtjYXJkc1swXS5jbGllbnRIZWlnaHR9cHhgXG4gICk7XG4gIC8vcG9zaXRpb24gY2FyZHMgb2YgcG9zaXRpb24gYWJzb2x1dGUgdXNpbmcgbGVmdCBhdHRyaWJ1dGVcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBjYXJkcy5sZW5ndGg7IGkrKykge1xuICAgIGNhcmRzW2ldLnNldEF0dHJpYnV0ZShcInN0eWxlXCIsIGBsZWZ0OiR7KGNhcmRzW2ldLmNsaWVudFdpZHRoICsgNSkgKiBpfXB4YCk7XG4gIH1cblxuICBjb25zdCBwcmV2QnRucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIucHJldlwiKTtcbiAgY29uc3QgbmV4dEJ0bnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLm5leHRcIik7XG4gIC8vY2hlY2sgYWRkIG5leHQgYW5kIHByZXYgYnV0dG9ucyBpZiBvdmVyZmxvd1xuICBwcmV2QnRucy5mb3JFYWNoKGNvbnRyb2xMZWZ0U2xpZGVyQnRucyk7XG4gIG5leHRCdG5zLmZvckVhY2goY29udHJvbFJpZ2h0U2xpZGVyQnRucyk7XG4gIC8vYWRkIGV2ZW50IGxpc3RlbmVyIGZvciBwcmV2IGFuZCBuZXh0IHNsaWRlIGJ1dHRvbnNcbiAgcHJldkJ0bnMuZm9yRWFjaCgocHJldikgPT4gcHJldi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgc2xpZGVMZWZ0KSk7XG4gIG5leHRCdG5zLmZvckVhY2goKG5leHQpID0+IG5leHQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHNsaWRlUmlnaHQpKTtcblxuICAvL2hpZGUgb3Igc2hvdyBjYXJkIG5leHQgYnRucyBpZiBvdmVyZmxvdyBvbiB3aW5kb3cgcmVzaXplXG4gIGFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgKCkgPT4ge1xuICAgIG5leHRCdG5zLmZvckVhY2goY29udHJvbFJpZ2h0U2xpZGVyQnRucyk7XG4gIH0pO1xuXG4gIC8vc2hvdyBtb3JlIGluZm8gd2hlbiBjYXJkIGNsaWNrZWRcbiAgY29uc3QgaG91cmx5Y2FyZHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmhvdXJseS1mb3JlY2FzdCAuY2FyZFwiKTtcbiAgaG91cmx5Y2FyZHMuZm9yRWFjaCgoY2FyZCwgaW5kZXgpID0+IHtcbiAgICBjYXJkLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiBzaG93T3JIaWRlTW9yZUluZm8oaW5kZXgpKTtcbiAgfSk7XG59KSgpO1xuXG5leHBvcnQgZnVuY3Rpb24gc2V0Q3VycmVudFdlYXRoZXIoY3VycmVudFdlYXRoZXIsIHVuaXQpIHtcbiAgY29uc3QgY2l0eU5hbWUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmxvY2F0aW9uIGgzXCIpO1xuICBjaXR5TmFtZS50ZXh0Q29udGVudCA9IGAke2N1cnJlbnRXZWF0aGVyLmNpdHl9LCAke2N1cnJlbnRXZWF0aGVyLmNvdW50cnl9YDtcblxuICBjb25zdCB0ZW1wVW5pdCA9IHVuaXQgPT0gXCJtZXRyaWNcIiA/IFwiwrBDXCIgOiBcIsKwRlwiO1xuXG4gIGNvbnN0IHRpbWUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnRpbWVcIik7XG4gIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZShjdXJyZW50V2VhdGhlci50aW1lICogMTAwMCk7XG4gIGxldCBociA9IGRhdGUuZ2V0SG91cnMoKTtcbiAgY29uc3QgYW1wbSA9IGhyID4gMTIgPyBcIlBNXCIgOiBcIkFNXCI7XG4gIGhyID0gaHIgPD0gMTIgPyBociA6IGhyIC0gMTI7XG4gIGxldCBtaW4gPSBkYXRlLmdldE1pbnV0ZXMoKTtcbiAgbWluID0gbWluID4gOSA/IG1pbiA6IFwiMFwiICsgbWluO1xuICB0aW1lLnRleHRDb250ZW50ID0gYCR7aHJ9OiR7bWlufSAke2FtcG19YDtcblxuICBjb25zdCBpbWcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLndlYXRoZXItaW1nXCIpO1xuICBpbWcuc3JjID0gY3VycmVudFdlYXRoZXIuaWNvbjtcblxuICBjb25zdCB0ZW1wID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jdXJyZW50LXRlbXByYXR1cmVcIik7XG4gIHRlbXAudGV4dENvbnRlbnQgPSBjdXJyZW50V2VhdGhlci50ZW1wLnRvRml4ZWQoMSk7XG4gIGNvbnN0IHVuaXRJY29uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi51bml0XCIpO1xuICB1bml0SWNvbi50ZXh0Q29udGVudCA9IHRlbXBVbml0O1xuXG4gIGNvbnN0IGRlc2MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNvbmRpdGlvblwiKTtcbiAgZGVzYy50ZXh0Q29udGVudCA9IGN1cnJlbnRXZWF0aGVyLmRlc2NyaXB0aW9uO1xuXG4gIGNvbnN0IGZlZWxzTGlrZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZmVlbHNcIik7XG4gIGZlZWxzTGlrZS50ZXh0Q29udGVudCA9IGBmZWVscyBsaWtlICR7Y3VycmVudFdlYXRoZXIuZmVlbHNMaWtlLnRvRml4ZWQoXG4gICAgMVxuICApfSR7dGVtcFVuaXR9YDtcblxuICBjb25zdCBkZXNjcmlwdGlvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZGVzY3JpcHRpb25cIik7XG4gIGRlc2NyaXB0aW9uLnRleHRDb250ZW50ID0gYFRoZSBoaWdoIHdpbGwgYmUgJHtjdXJyZW50V2VhdGhlci50ZW1wTWF4LnRvRml4ZWQoXG4gICAgMVxuICApfSR7dGVtcFVuaXR9LmA7XG5cbiAgY29uc3Qgd2luZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIud2luZCAudmFsdWVcIik7XG4gIHdpbmQudGV4dENvbnRlbnQgPSBgJHtjdXJyZW50V2VhdGhlci53aW5kU3BlZWR9IG0vc2A7XG5cbiAgY29uc3QgaHVtaWRpdHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmh1bWlkaXR5IC52YWx1ZVwiKTtcbiAgaHVtaWRpdHkudGV4dENvbnRlbnQgPSBgJHtjdXJyZW50V2VhdGhlci5odW1pZGl0eX0lYDtcblxuICBjb25zdCBwcmVzc3VyZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucHJlc3N1cmUgLnZhbHVlXCIpO1xuICBwcmVzc3VyZS50ZXh0Q29udGVudCA9IGAke2N1cnJlbnRXZWF0aGVyLnByZXNzdXJlfSBoUGFgO1xuXG4gIGNvbnN0IHZpc2liaWxpdHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnZpc2liaWxpdHkgLnZhbHVlXCIpO1xuICB2aXNpYmlsaXR5LnRleHRDb250ZW50ID0gYCR7Y3VycmVudFdlYXRoZXIudmlzaWJpbGl0eX0gS21gO1xuXG4gIC8vc2V0IGRpc3BsYXkgY29sb3JzXG4gIHNldENvbG9yQ2xhc3MoY3VycmVudFdlYXRoZXIuaWQsIGN1cnJlbnRXZWF0aGVyLmRheU5pZ2h0KTtcbn1cblxuZnVuY3Rpb24gc2V0Q29sb3JDbGFzcyhpZCwgdGltZSkge1xuICBjb25zdCBib2R5ID0gZG9jdW1lbnQuYm9keTtcbiAgYm9keS5yZW1vdmVBdHRyaWJ1dGUoXCJjbGFzc1wiKTtcbiAgc3dpdGNoICh0cnVlKSB7XG4gICAgY2FzZSBpZCA+PSAyMDAgJiYgaWQgPCAzMDA6XG4gICAgICBib2R5LmNsYXNzTGlzdC5hZGQoXCJ0aHVuZGVyc3Rvcm1cIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIGlkID49IDMwMCAmJiBpZCA8IDYwMDpcbiAgICAgIGJvZHkuY2xhc3NMaXN0LmFkZChcInJhaW5cIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIGlkID49IDYwMCAmJiBpZCA8IDcwMDpcbiAgICAgIGJvZHkuY2xhc3NMaXN0LmFkZChcInNub3dcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIGlkID49IDcwMCAmJiBpZCA8IDgwMDpcbiAgICAgIGJvZHkuY2xhc3NMaXN0LmFkZChcImhhemVcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIGlkID09IDgwMCAmJiB0aW1lID09IFwiZFwiOlxuICAgICAgYm9keS5jbGFzc0xpc3QuYWRkKFwic3VubnlcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIGlkID09IDgwMCAmJiB0aW1lID09IFwiblwiOlxuICAgICAgYm9keS5jbGFzc0xpc3QuYWRkKFwiY2xlYXItbmlnaHRcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIGlkID4gODAwOlxuICAgICAgYm9keS5jbGFzc0xpc3QuYWRkKFwic3VubnlcIik7XG4gICAgICBicmVhaztcbiAgfVxufVxuXG5mdW5jdGlvbiBjb250cm9sTGVmdFNsaWRlckJ0bnMoYnRuKSB7XG4gIGNvbnN0IHNsaWRlQ29udGFpbmVyID0gYnRuLnBhcmVudEVsZW1lbnQ7XG4gIGNvbnN0IGNhcmRzID0gc2xpZGVDb250YWluZXIuY2hpbGRyZW5bMl0uY2hpbGRyZW47XG4gIGNvbnN0IGZpcnN0Q2FyZCA9IGNhcmRzWzBdO1xuICBjb25zdCBmaXJzdENhcmRMZWZ0T2Zmc2V0ID0gcGFyc2VJbnQoZmlyc3RDYXJkLnN0eWxlLmxlZnQuc3BsaXQoXCJweFwiKVswXSk7XG4gIGlmIChmaXJzdENhcmRMZWZ0T2Zmc2V0IDwgMCkge1xuICAgIHNsaWRlQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoXCIucHJldlwiKS5jbGFzc0xpc3QuYWRkKFwic2hvd1wiKTtcbiAgfSBlbHNlIHtcbiAgICBzbGlkZUNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKFwiLnByZXZcIikuY2xhc3NMaXN0LnJlbW92ZShcInNob3dcIik7XG4gIH1cbn1cblxuZnVuY3Rpb24gY29udHJvbFJpZ2h0U2xpZGVyQnRucyhidG4pIHtcbiAgY29uc3Qgc2xpZGVDb250YWluZXIgPSBidG4ucGFyZW50RWxlbWVudDtcbiAgY29uc3QgY2FyZHMgPSBzbGlkZUNvbnRhaW5lci5jaGlsZHJlblsyXS5jaGlsZHJlbjtcbiAgY29uc3QgbGFzdENhcmQgPSBjYXJkc1tjYXJkcy5sZW5ndGggLSAxXTtcbiAgY29uc3QgbGFzdENhcmRSaWdodE9mZnNldCA9XG4gICAgcGFyc2VJbnQobGFzdENhcmQuc3R5bGUubGVmdC5zcGxpdChcInB4XCIpWzBdKSArIGxhc3RDYXJkLmNsaWVudFdpZHRoO1xuICBpZiAobGFzdENhcmRSaWdodE9mZnNldCA+IHNsaWRlQ29udGFpbmVyLmNsaWVudFdpZHRoKSB7XG4gICAgc2xpZGVDb250YWluZXIucXVlcnlTZWxlY3RvcihcIi5uZXh0XCIpLmNsYXNzTGlzdC5hZGQoXCJzaG93XCIpO1xuICB9IGVsc2Uge1xuICAgIHNsaWRlQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoXCIubmV4dFwiKS5jbGFzc0xpc3QucmVtb3ZlKFwic2hvd1wiKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBzbGlkZUxlZnQoZSkge1xuICBjb25zdCBjYXJkcyA9IEFycmF5LmZyb20oZS50YXJnZXQucGFyZW50RWxlbWVudC5jaGlsZHJlblsyXS5jaGlsZHJlbik7XG4gIGNvbnN0IGluZGV4ID0gY2FyZHMuZmluZEluZGV4KChjYXJkKSA9PiBjYXJkLnN0eWxlLmxlZnQgPT0gXCIwcHhcIik7XG4gIGxldCBzbGlkZVdpZHRoID0gY2FyZHNbaW5kZXggLSAxXS5jbGllbnRXaWR0aDtcbiAgY2FyZHMuZm9yRWFjaCgoY2FyZCkgPT4ge1xuICAgIGNhcmQuc2V0QXR0cmlidXRlKFwic3R5bGVcIiwgYGxlZnQ6JHtjYXJkLm9mZnNldExlZnQgKyAoc2xpZGVXaWR0aCArIDUpfXB4YCk7XG4gIH0pO1xuICBjb250cm9sTGVmdFNsaWRlckJ0bnMoZS50YXJnZXQpO1xuICBjb250cm9sUmlnaHRTbGlkZXJCdG5zKGUudGFyZ2V0KTtcbn1cblxuZnVuY3Rpb24gc2xpZGVSaWdodChlKSB7XG4gIGNvbnN0IGNhcmRzID0gQXJyYXkuZnJvbShlLnRhcmdldC5wYXJlbnRFbGVtZW50LmNoaWxkcmVuWzJdLmNoaWxkcmVuKTtcbiAgbGV0IHNsaWRlV2lkdGggPSBjYXJkcy5maWx0ZXIoKGNhcmQpID0+IGNhcmQuc3R5bGUubGVmdCA9PSBcIjBweFwiKVswXVxuICAgIC5jbGllbnRXaWR0aDtcbiAgY2FyZHMuZm9yRWFjaCgoY2FyZCkgPT4ge1xuICAgIGNhcmQuc2V0QXR0cmlidXRlKFwic3R5bGVcIiwgYGxlZnQ6JHtjYXJkLm9mZnNldExlZnQgLSAoc2xpZGVXaWR0aCArIDUpfXB4YCk7XG4gIH0pO1xuICBjb250cm9sUmlnaHRTbGlkZXJCdG5zKGUudGFyZ2V0KTtcbiAgY29udHJvbExlZnRTbGlkZXJCdG5zKGUudGFyZ2V0KTtcbn1cblxuZnVuY3Rpb24gc2hvd09ySGlkZU1vcmVJbmZvKGluZGV4KSB7XG4gIGNvbnN0IGNhcmRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5ob3VybHktZm9yZWNhc3QgLmNhcmRcIik7XG4gIGNvbnN0IGNhcmRNb3JlSW5mbyA9IGNhcmRzW2luZGV4XS5xdWVyeVNlbGVjdG9yKFxuICAgIFwiLm1vcmUtaG91cmx5LWluZm8tY29udGFpbmVyXCJcbiAgKTtcbiAgaWYgKGNhcmRNb3JlSW5mby5jbGFzc0xpc3QuY29udGFpbnMoXCJzaG93XCIpKSB7XG4gICAgaGlkZU1vcmVJbmZvKGNhcmRNb3JlSW5mbywgaW5kZXgpO1xuICB9IGVsc2Uge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2FyZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBtb3JlSW5mbyA9IGNhcmRzW2ldLnF1ZXJ5U2VsZWN0b3IoXCIubW9yZS1ob3VybHktaW5mby1jb250YWluZXJcIik7XG4gICAgICBpZiAobW9yZUluZm8uY2xhc3NMaXN0LmNvbnRhaW5zKFwic2hvd1wiKSkge1xuICAgICAgICBoaWRlTW9yZUluZm8obW9yZUluZm8sIGkpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgc2hvd01vcmVJbmZvKGNhcmRNb3JlSW5mbywgaW5kZXgpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHNob3dNb3JlSW5mbyhjYXJkTW9yZUluZm8sIGluZGV4KSB7XG4gIGNvbnN0IGNhcmRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5ob3VybHktZm9yZWNhc3QgLmNhcmRcIik7XG4gIGNvbnN0IG1vcmVJbmZvQ2FyZFdpZHRoID0gMjIwO1xuICBmb3IgKGxldCBpID0gaW5kZXggKyAxOyBpIDwgY2FyZHMubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBjYXJkTGVmdE9mZnNldCA9IHBhcnNlSW50KGNhcmRzW2ldLnN0eWxlLmxlZnQuc3BsaXQoXCJweFwiKVswXSk7XG4gICAgY2FyZHNbaV0uc3R5bGUubGVmdCA9IGNhcmRMZWZ0T2Zmc2V0ICsgbW9yZUluZm9DYXJkV2lkdGggKyBcInB4XCI7XG4gIH1cbiAgY2FyZE1vcmVJbmZvLmNsYXNzTGlzdC5hZGQoXCJzaG93XCIpO1xuICBjb250cm9sUmlnaHRTbGlkZXJCdG5zKFxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuaG91cmx5LWZvcmVjYXN0IC5uYXYtYnRucy5uZXh0XCIpXG4gICk7XG59XG5cbmZ1bmN0aW9uIGhpZGVNb3JlSW5mbyhjYXJkTW9yZUluZm8sIGluZGV4KSB7XG4gIGNvbnN0IGNhcmRzID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmhvdXJseS1mb3JlY2FzdCAuY2FyZFwiKSk7XG4gIGNvbnN0IG1vcmVJbmZvQ2FyZFdpZHRoID0gMjIwO1xuXG4gIGxldCBJbmRleENhcmRBdFplcm9PZmZzZXQgPSBjYXJkcy5maW5kSW5kZXgoXG4gICAgKGNhcmQpID0+IGNhcmQuc3R5bGUubGVmdCA9PSBcIjBweFwiXG4gICk7XG5cbiAgY2FyZE1vcmVJbmZvLmNsYXNzTGlzdC5yZW1vdmUoXCJzaG93XCIpO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgY2FyZHMubGVuZ3RoOyBpKyspIHtcbiAgICBjYXJkc1tpXS5zdHlsZS5sZWZ0ID1cbiAgICAgIChpIC0gSW5kZXhDYXJkQXRaZXJvT2Zmc2V0KSAqIChjYXJkc1tpXS5jbGllbnRXaWR0aCArIDUpICsgXCJweFwiO1xuICB9XG4gIGNvbnRyb2xSaWdodFNsaWRlckJ0bnMoXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5ob3VybHktZm9yZWNhc3QgLm5hdi1idG5zLm5leHRcIilcbiAgKTtcbn1cbiIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIFwiKiwgKjo6YmVmb3JlLCAqOjphZnRlciB7XFxuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcbiAgbWFyZ2luOiAwO1xcbiAgcGFkZGluZzogMDtcXG59XFxuXFxuYm9keS5jbG91ZHksXFxuYm9keS5yYWluLFxcbmJvZHkudGh1bmRlcnN0b3JtLFxcbmJvZHkuc25vdyB7XFxuICAtLWJvZHktYmctY29sb3I6ICM0NzU3NzU7XFxuICAtLWN1cnJlbnQtYmctY29sb3I6ICMzOTQ5Njg7XFxuICAtLW5hdi1iZy1jb2xvcjogIzU0NjE3YTtcXG4gIC0tc2VhcmNoLWJhci1jb2xvcjogIzY4NzQ4YTtcXG4gIC0tZm9yZWNhc3QtY29sb3I6ICM0RDVDN0E7XFxuICAtLWZvcmVjYXN0LWFjdGl2ZS1jb2xvcjogIzUxNjA3YztcXG4gIC0taG91cmx5LWNvbG9yOiAjNTI2MDdkO1xcbiAgLS1uYXYtYnV0dG9uLWNvbG9yOiAjNTE2MDdjNjA7XFxufVxcblxcbmJvZHkuaGF6ZSB7XFxuICAtLWJvZHktYmctY29sb3I6ICM1YjU2NGY7XFxuICAtLWN1cnJlbnQtYmctY29sb3I6ICM1ODU0NGE7XFxuICAtLW5hdi1iZy1jb2xvcjogIzY4NjQ1ZjtcXG4gIC0tc2VhcmNoLWJhci1jb2xvcjogIzdhNzY3MjtcXG4gIC0tZm9yZWNhc3QtY29sb3I6ICM1NzU0NGE7XFxuICAtLWZvcmVjYXN0LWFjdGl2ZS1jb2xvcjogIzYzNjA1ODtcXG4gIC0taG91cmx5LWNvbG9yOiAjNTM0ZTQzO1xcbiAgLS1uYXYtYnV0dG9uLWNvbG9yOiAjNjM2MDU4NjA7XFxufVxcblxcbmJvZHkuc3Vubnkge1xcbiAgLS1ib2R5LWJnLWNvbG9yOiAjMjI0ZjkwO1xcbiAgLS1jdXJyZW50LWJnLWNvbG9yOiAjMTc0Mzg1O1xcbiAgLS1jdXJyZW50LWJnLWltZzogXFxcImh0dHBzOi8vYXNzZXRzLm1zbi5jb20vd2VhdGhlcm1hcGRhdGEvMS9zdGF0aWMvYmFja2dyb3VuZC92Mi4wL2NvbXBhY3RhZHMzL1N1bm55LnBuZ1xcXCI7XFxuICAtLW5hdi1iZy1jb2xvcjogIzMyNWI4ZjtcXG4gIC0tc2VhcmNoLWJhci1jb2xvcjogIzQ5NmU5ZDtcXG4gIC0tZm9yZWNhc3QtY29sb3I6ICMyODU2OTU7XFxuICAtLWZvcmVjYXN0LWFjdGl2ZS1jb2xvcjogIzMxNWU5OTtcXG4gIC0taG91cmx5LWNvbG9yOiAjMzA1Yzk3O1xcbiAgLS1uYXYtYnV0dG9uLWNvbG9yOiAjMzE1ZTk5NjA7XFxufVxcblxcbmJvZHkuY2xlYXItbmlnaHQge1xcbiAgLS1ib2R5LWJnLWNvbG9yOiAjMjMzZDY0O1xcbiAgLS1jdXJyZW50LWJnLWNvbG9yOiAjMDAwMDAwNTA7XFxuICAtLW5hdi1iZy1jb2xvcjogIzM2NGU2ZjtcXG4gIC0tc2VhcmNoLWJhci1jb2xvcjogIzRkNjQ4MDtcXG4gIC0tZm9yZWNhc3QtY29sb3I6ICMyNjNjNWY7XFxuICAtLWZvcmVjYXN0LWFjdGl2ZS1jb2xvcjogIzMyNDg2YztcXG4gIC0taG91cmx5LWNvbG9yOiAjMzI0ODY5O1xcbiAgLS1uYXYtYnV0dG9uLWNvbG9yOiAjMzI0ODZjNjA7XFxufVxcblxcbmJvZHkge1xcbiAgZm9udC1mYW1pbHk6IFNlZ29lIFVJLCBTZWdvZSBXUCwgQXJpYWwsIFNhbnMtU2VyaWY7XFxuICBjb2xvcjogI2ZmZjtcXG4gIGJhY2tncm91bmQ6IHZhcigtLWJvZHktYmctY29sb3IpO1xcbn1cXG5cXG5oZWFkZXIge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tbmF2LWJnLWNvbG9yKTtcXG4gIHBhZGRpbmc6IDF2aCAxNXZ3O1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XFxufVxcblxcbi5zZWFyY2gtYmFyIHtcXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLXNlYXJjaC1iYXItY29sb3IpO1xcbiAgd2lkdGg6IDEwMCU7XFxuICBtYXgtd2lkdGg6IDMwMHB4O1xcbiAgYm9yZGVyLXJhZGl1czogNjBweDtcXG4gIHBhZGRpbmc6IDVweCAyMHB4O1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxufVxcblxcbi5zZWFyY2gtYmFyIGlucHV0IHtcXG4gIGZsZXg6IDE7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcXG4gIG91dGxpbmU6IG5vbmU7XFxuICBib3JkZXI6IDA7XFxuICBjb2xvcjogI2ZmZjtcXG59XFxuXFxuOjpwbGFjZWhvbGRlciB7XFxuICAvKiBDaHJvbWUsIEZpcmVmb3gsIE9wZXJhLCBTYWZhcmkgMTAuMSsgKi9cXG4gIGNvbG9yOiAjZGNkY2RjO1xcbiAgb3BhY2l0eTogMTsgLyogRmlyZWZveCAqL1xcbn1cXG5cXG46LW1zLWlucHV0LXBsYWNlaG9sZGVyIHtcXG4gIC8qIEludGVybmV0IEV4cGxvcmVyIDEwLTExICovXFxuICBjb2xvcjogI2RjZGNkYztcXG59XFxuXFxuOjotbXMtaW5wdXQtcGxhY2Vob2xkZXIge1xcbiAgLyogTWljcm9zb2Z0IEVkZ2UgKi9cXG4gIGNvbG9yOiAjZGNkY2RjO1xcbn1cXG5cXG5idXR0b25bdHlwZT1cXFwic3VibWl0XFxcIl0ge1xcbiAgYm9yZGVyOiAwO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XFxufVxcblxcbi5zZWFyY2gtaWNvbiB7XFxuICBmb250LXNpemU6IDE2cHg7XFxuICBjb2xvcjogI2ZmZjtcXG59XFxuXFxuI3RlbXAtdW5pdCB7XFxuICBwYWRkaW5nOiA1cHg7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1zZWFyY2gtYmFyLWNvbG9yKTtcXG4gIGNvbG9yOiAjZmZmZmZmO1xcbiAgb3V0bGluZTogbm9uZTtcXG4gIGJvcmRlcjogMDtcXG4gIGJvcmRlci1yYWRpdXM6IDVweDtcXG59XFxuXFxubWFpbiB7XFxuICBwYWRkaW5nOiAzdmggMTV2dztcXG59XFxuXFxuLmN1cnJlbnQge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tY3VycmVudC1iZy1jb2xvcik7XFxuICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoaHR0cHM6Ly9hc3NldHMubXNuLmNvbS93ZWF0aGVybWFwZGF0YS8xL3N0YXRpYy9iYWNrZ3JvdW5kL3YyLjAvY29tcGFjdGFkczMvU3VubnkucG5nKTtcXG4gIG1hcmdpbi10b3A6IDEycHg7XFxuICBwYWRkaW5nOiAxMnB4IDQ4cHggMTZweCAyNHB4O1xcbiAgZGlzcGxheTogZ3JpZDtcXG4gIGdhcDogMjBweDtcXG4gIGJvcmRlci1yYWRpdXM6IDhweDtcXG4gIGJhY2tncm91bmQtc2l6ZTogY292ZXI7XFxufVxcblxcbi5pbXBvcnRhbnQtaW5mbyB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGp1c3RpZnktY29udGVudDogZmxleC1zdGFydDtcXG4gIGdhcDogNDhweDtcXG59XFxuXFxuLmN1cnJlbnQtdGVtcCBkaXYge1xcbiAgZm9udC1zaXplOiA0OHB4O1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGFsaWduLWl0ZW1zOiBmbGV4LXN0YXJ0O1xcbiAgZ2FwOiAwO1xcbn1cXG5cXG4uY3VycmVudC10ZW1wIC51bml0IHtcXG4gIGZvbnQtc2l6ZTogMjhweDtcXG59XFxuXFxuLmNvbmRpdGlvbiB7XFxuICBmb250LXNpemU6IDIwcHg7XFxuICBmb250LXdlaWdodDogNjAwO1xcbiAgdGV4dC10cmFuc2Zvcm06IGNhcGl0YWxpemU7XFxufVxcblxcbi5mZWVscyB7XFxuICBmb250LXNpemU6IDE0cHg7XFxuICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xcbiAgZm9udC13ZWlnaHQ6IDQwMDtcXG59XFxuXFxuLmRlc2NyaXB0aW9uIHtcXG4gIGZvbnQtd2VpZ2h0OiA2MDA7XFxufVxcblxcbi5vdGhlci1pbmZvcyB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZ2FwOiAycmVtO1xcbn1cXG5cXG4udGVtcCB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZ2FwOiA4cHg7XFxufVxcblxcbi50ZW1wIHAge1xcbiAgZm9udC1zaXplOiAzMnB4O1xcbn1cXG5cXG4udGVtcCBwIHNwYW4ge1xcbiAgZm9udC1zaXplOiAyMnB4O1xcbn1cXG5cXG4udGl0bGUgaDMge1xcbiAgZm9udC1zaXplOiAxNnB4O1xcbiAgZm9udC13ZWlnaHQ6IDYwMDtcXG4gIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XFxufVxcblxcbi50aW1lIHtcXG4gIGZvbnQtc2l6ZTogMTRweDtcXG59XFxuXFxuLmVsZW1lbnQge1xcbiAgZm9udC1zaXplOiAxMnB4O1xcbiAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcXG59XFxuXFxuLmluZm8taXRlbSAudmFsdWUge1xcbiAgZm9udC1zaXplOiAxNnB4O1xcbiAgZm9udC13ZWlnaHQ6IDYwMDtcXG59XFxuXFxuLmZvcmVjYXN0LFxcbi5ob3VybHktZm9yZWNhc3Qge1xcbiAgbWFyZ2luLXRvcDogMTZweDtcXG59XFxuXFxuLmZvcmVjYXN0IGgzIHtcXG4gIGZvbnQtc2l6ZTogMTZweDtcXG4gIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XFxuICBtYXJnaW4tYm90dG9tOiAxMnB4O1xcbn1cXG5cXG4uc2xpZGVyIHtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG59XFxuXFxuLmNhcmQtY29udGFpbmVyIHtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIG92ZXJmbG93OiBoaWRkZW47XFxufVxcblxcbi5jYXJkIHtcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIHBhZGRpbmc6IDAgMC41cmVtO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tZm9yZWNhc3QtY29sb3IpO1xcbiAgYm9yZGVyLXJhZGl1czogNXB4O1xcbiAgdHJhbnNpdGlvbjogbGVmdCAyNTBtcyBlYXNlLW91dDtcXG59XFxuXFxuLmZvcmVjYXN0IC5jYXJkIHtcXG4gIHdpZHRoOiAxMjBweDtcXG59XFxuXFxuLnRlbXAtZm9yY2FzdCB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbn1cXG5cXG4uY2FyZDpob3ZlcixcXG4uY2FyZDpmb2N1cyB7XFxuICBjdXJzb3I6IHBvaW50ZXI7XFxufVxcblxcbi5hcnJvdyB7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICBib3R0b206IDA7XFxuICB3aWR0aDogMDsgXFxuICBoZWlnaHQ6IDA7XFxuICBvdmVyZmxvdzogdmlzaWJsZTtcXG4gIGJvcmRlci1sZWZ0OiA1cHggc29saWQgdHJhbnNwYXJlbnQ7XFxuICBib3JkZXItcmlnaHQ6IDVweCBzb2xpZCB0cmFuc3BhcmVudDtcXG4gIFxcbiAgYm9yZGVyLXRvcDogNXB4IHNvbGlkICNmZmY7XFxufVxcblxcbi5jYXJkIC5kYXRlIHtcXG4gIHRleHQtdHJhbnNmb3JtOiBjYXBpdGFsaXplO1xcbn1cXG5cXG4udGVtcC1mb3JjYXN0IGltZyB7XFxuICB3aWR0aDogNHJlbTtcXG4gIGhlaWdodDogNHJlbTtcXG59XFxuXFxuLnRlbXAtaW5mbyB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gIGdhcDogMC41cmVtO1xcbiAgZm9udC1zaXplOiAxNnB4O1xcbn1cXG5cXG4ubmF2LWJ0bnMge1xcbiAgZm9udC1zaXplOiAxLjJyZW07XFxuICBmb250LXdlaWdodDogOTAwO1xcbiAgYmFja2dyb3VuZDogdmFyKC0tZm9yZWNhc3QtYWN0aXZlLWNvbG9yKTtcXG4gIGJvcmRlcjogMDtcXG4gIHdpZHRoOiAxLjZyZW07XFxuICBoZWlnaHQ6IDEuNnJlbTtcXG4gIGJvcmRlci1yYWRpdXM6IDUwJTtcXG4gIGNvbG9yOiAjZmZmZmZmO1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgei1pbmRleDogMjtcXG4gIHRvcDogY2FsYyg1MCUgLSAwLjhyZW0pO1xcbiAgYm94LXNoYWRvdzogMCAwIDhweCB2YXIoLS1mb3JlY2FzdC1hY3RpdmUtY29sb3IpO1xcbiAgZGlzcGxheTogbm9uZTtcXG59XFxuXFxuLm5hdi1idG5zLm5leHQuc2hvdyxcXG4ubmF2LWJ0bnMucHJldi5zaG93IHtcXG4gIGRpc3BsYXk6IGJsb2NrO1xcbn1cXG5cXG4ubmF2LWJ0bnM6aG92ZXIge1xcbiAgb3V0bGluZTogbm9uZTtcXG4gIGJvcmRlcjogMXB4IHNvbGlkICNmZmZmZmY3MDtcXG4gIGN1cnNvcjogcG9pbnRlcjtcXG59XFxuXFxuLm5hdi1idG5zLm5leHQge1xcbiAgcmlnaHQ6IC0wLjhyZW07XFxufVxcblxcbi5uYXYtYnRucy5wcmV2IHtcXG4gIGxlZnQ6IC0wLjhyZW07XFxufVxcblxcbi5ob3VybHktZm9yZWNhc3QgLmNhcmQge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tZm9yZWNhc3QtYWN0aXZlLWNvbG9yKTtcXG4gIGRpc3BsYXk6IGZsZXg7XFxufVxcblxcbi5ob3VybHktZm9yZWNhc3QgLnRpdGxlIHtcXG4gIGZvbnQtc2l6ZTogMTJweDtcXG4gIHRleHQtdHJhbnNmb3JtOiBjYXBpdGFsaXplO1xcbiAgZm9udC13ZWlnaHQ6IDYwMDtcXG59XFxuXFxuLmJhc2ljLWhvdXJseS1pbmZvIHtcXG4gIGZvbnQtc2l6ZTogMTJweDtcXG4gIGZvbnQtd2VpZ2h0OiAzMDA7XFxufVxcblxcbi5iYXNpYy1ob3VybHktaW5mbyB7XFxuICBwYWRkaW5nOiAwLjVyZW07XFxuICBib3JkZXItcmFkaXVzOiA1cHggMCAwIDVweDtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgZ2FwOiAwLjVyZW07XFxuICBwYWRkaW5nOiAwLjVyZW0gMXJlbTtcXG4gIHdpZHRoOiA2LjVyZW07XFxuICB3aWR0aDogMTEwcHg7XFxufVxcblxcbi5iYXNpYy1ob3VybHktaW5mbyBpbWcge1xcbiAgd2lkdGg6IDNyZW07XFxuICBoZWlnaHQ6IDNyZW07XFxufVxcblxcbi5iYXNpYy1ob3VybHktaW5mbyAud2luZC1zcGVlZCB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGdhcDogNHB4O1xcbn1cXG5cXG4uYmFzaWMtaG91cmx5LWluZm8gLndpbmQtc3BlZWQgc3BhbiB7XFxuICBmb250LXNpemU6IDEycHg7XFxuICBmb250LXdlaWdodDogMTAwO1xcbn1cXG5cXG4uY2hhbmNlLW9mLXJhaW4ge1xcbiAgbWFyZ2luLXRvcDogMnJlbTtcXG59XFxuXFxuLm1vcmUtaG91cmx5LWluZm8tY29udGFpbmVyIHtcXG4gIGJvcmRlci1sZWZ0OiAxcHggZGFzaGVkICNmZmZmZmY4MDtcXG4gIHdpZHRoOiAyMjBweDtcXG4gIGRpc3BsYXk6IG5vbmU7XFxufVxcblxcbi5tb3JlLWhvdXJseS1pbmZvLWNvbnRhaW5lci5zaG93IHtcXG4gIGRpc3BsYXk6IGJsb2NrO1xcbn1cXG5cXG4ubW9yZS1ob3VybHktaW5mbyB7XFxuICB3aWR0aDogMTAwJTtcXG4gIGhlaWdodDogMTAwJTtcXG4gIGRpc3BsYXk6IGdyaWQ7XFxuICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmciAxZnI7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgcGFkZGluZzogMTJweCAxMHB4O1xcbn1cXG5cXG4ubW9yZS1ob3VybHktaW5mbyBwIHtcXG4gIGZvbnQtc2l6ZTogMTBweDtcXG4gIGZvbnQtd2VpZ2h0OiBsaWdodGVyO1xcbiAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcXG59XFxuXFxuLm1vcmUtaG91cmx5LWluZm8gPiBkaXYge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBnYXA6IDVweDtcXG4gIGZvbnQtd2VpZ2h0OiBsaWdodGVyO1xcbn1cXG5cXG4ubW9yZS1ob3VybHktaW5mbyBzcGFuIHtcXG4gIGZvbnQtc2l6ZTogMTRweDtcXG4gIGZvbnQtd2VpZ2h0OiAxMDA7XFxufVxcblxcbi5tb3JlLWhvdXJseS1pbmZvIC52YWx1ZSB7XFxuICBtYXJnaW4tdG9wOiA0cHg7XFxuICBmb250LXdlaWdodDogOTAwO1xcbn1cIiwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9zcmMvc3R5bGUuY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBO0VBQ0Usc0JBQXNCO0VB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WUFBWTtBQUNkOztBQUVBO0VBQ0UsYUFBYTtFQUNiLG1CQUFtQjtFQUNuQixRQUFRO0FBQ1Y7O0FBRUE7RUFDRSxlQUFlO0VBQ2YsZ0JBQWdCO0FBQ2xCOztBQUVBO0VBQ0UsZ0JBQWdCO0FBQ2xCOztBQUVBO0VBQ0UsaUNBQWlDO0VBQ2pDLFlBQVk7RUFDWixhQUFhO0FBQ2Y7O0FBRUE7RUFDRSxjQUFjO0FBQ2hCOztBQUVBO0VBQ0UsV0FBVztFQUNYLFlBQVk7RUFDWixhQUFhO0VBQ2IsOEJBQThCO0VBQzlCLG1CQUFtQjtFQUNuQixrQkFBa0I7QUFDcEI7O0FBRUE7RUFDRSxlQUFlO0VBQ2Ysb0JBQW9CO0VBQ3BCLHlCQUF5QjtBQUMzQjs7QUFFQTtFQUNFLGFBQWE7RUFDYixtQkFBbUI7RUFDbkIsUUFBUTtFQUNSLG9CQUFvQjtBQUN0Qjs7QUFFQTtFQUNFLGVBQWU7RUFDZixnQkFBZ0I7QUFDbEI7O0FBRUE7RUFDRSxlQUFlO0VBQ2YsZ0JBQWdCO0FBQ2xCXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIiosICo6OmJlZm9yZSwgKjo6YWZ0ZXIge1xcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXG4gIG1hcmdpbjogMDtcXG4gIHBhZGRpbmc6IDA7XFxufVxcblxcbmJvZHkuY2xvdWR5LFxcbmJvZHkucmFpbixcXG5ib2R5LnRodW5kZXJzdG9ybSxcXG5ib2R5LnNub3cge1xcbiAgLS1ib2R5LWJnLWNvbG9yOiAjNDc1Nzc1O1xcbiAgLS1jdXJyZW50LWJnLWNvbG9yOiAjMzk0OTY4O1xcbiAgLS1uYXYtYmctY29sb3I6ICM1NDYxN2E7XFxuICAtLXNlYXJjaC1iYXItY29sb3I6ICM2ODc0OGE7XFxuICAtLWZvcmVjYXN0LWNvbG9yOiAjNEQ1QzdBO1xcbiAgLS1mb3JlY2FzdC1hY3RpdmUtY29sb3I6ICM1MTYwN2M7XFxuICAtLWhvdXJseS1jb2xvcjogIzUyNjA3ZDtcXG4gIC0tbmF2LWJ1dHRvbi1jb2xvcjogIzUxNjA3YzYwO1xcbn1cXG5cXG5ib2R5LmhhemUge1xcbiAgLS1ib2R5LWJnLWNvbG9yOiAjNWI1NjRmO1xcbiAgLS1jdXJyZW50LWJnLWNvbG9yOiAjNTg1NDRhO1xcbiAgLS1uYXYtYmctY29sb3I6ICM2ODY0NWY7XFxuICAtLXNlYXJjaC1iYXItY29sb3I6ICM3YTc2NzI7XFxuICAtLWZvcmVjYXN0LWNvbG9yOiAjNTc1NDRhO1xcbiAgLS1mb3JlY2FzdC1hY3RpdmUtY29sb3I6ICM2MzYwNTg7XFxuICAtLWhvdXJseS1jb2xvcjogIzUzNGU0MztcXG4gIC0tbmF2LWJ1dHRvbi1jb2xvcjogIzYzNjA1ODYwO1xcbn1cXG5cXG5ib2R5LnN1bm55IHtcXG4gIC0tYm9keS1iZy1jb2xvcjogIzIyNGY5MDtcXG4gIC0tY3VycmVudC1iZy1jb2xvcjogIzE3NDM4NTtcXG4gIC0tY3VycmVudC1iZy1pbWc6IFxcXCJodHRwczovL2Fzc2V0cy5tc24uY29tL3dlYXRoZXJtYXBkYXRhLzEvc3RhdGljL2JhY2tncm91bmQvdjIuMC9jb21wYWN0YWRzMy9TdW5ueS5wbmdcXFwiO1xcbiAgLS1uYXYtYmctY29sb3I6ICMzMjViOGY7XFxuICAtLXNlYXJjaC1iYXItY29sb3I6ICM0OTZlOWQ7XFxuICAtLWZvcmVjYXN0LWNvbG9yOiAjMjg1Njk1O1xcbiAgLS1mb3JlY2FzdC1hY3RpdmUtY29sb3I6ICMzMTVlOTk7XFxuICAtLWhvdXJseS1jb2xvcjogIzMwNWM5NztcXG4gIC0tbmF2LWJ1dHRvbi1jb2xvcjogIzMxNWU5OTYwO1xcbn1cXG5cXG5ib2R5LmNsZWFyLW5pZ2h0IHtcXG4gIC0tYm9keS1iZy1jb2xvcjogIzIzM2Q2NDtcXG4gIC0tY3VycmVudC1iZy1jb2xvcjogIzAwMDAwMDUwO1xcbiAgLS1uYXYtYmctY29sb3I6ICMzNjRlNmY7XFxuICAtLXNlYXJjaC1iYXItY29sb3I6ICM0ZDY0ODA7XFxuICAtLWZvcmVjYXN0LWNvbG9yOiAjMjYzYzVmO1xcbiAgLS1mb3JlY2FzdC1hY3RpdmUtY29sb3I6ICMzMjQ4NmM7XFxuICAtLWhvdXJseS1jb2xvcjogIzMyNDg2OTtcXG4gIC0tbmF2LWJ1dHRvbi1jb2xvcjogIzMyNDg2YzYwO1xcbn1cXG5cXG5ib2R5IHtcXG4gIGZvbnQtZmFtaWx5OiBTZWdvZSBVSSwgU2Vnb2UgV1AsIEFyaWFsLCBTYW5zLVNlcmlmO1xcbiAgY29sb3I6ICNmZmY7XFxuICBiYWNrZ3JvdW5kOiB2YXIoLS1ib2R5LWJnLWNvbG9yKTtcXG59XFxuXFxuaGVhZGVyIHtcXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLW5hdi1iZy1jb2xvcik7XFxuICBwYWRkaW5nOiAxdmggMTV2dztcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xcbn1cXG5cXG4uc2VhcmNoLWJhciB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1zZWFyY2gtYmFyLWNvbG9yKTtcXG4gIHdpZHRoOiAxMDAlO1xcbiAgbWF4LXdpZHRoOiAzMDBweDtcXG4gIGJvcmRlci1yYWRpdXM6IDYwcHg7XFxuICBwYWRkaW5nOiA1cHggMjBweDtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbn1cXG5cXG4uc2VhcmNoLWJhciBpbnB1dCB7XFxuICBmbGV4OiAxO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XFxuICBvdXRsaW5lOiBub25lO1xcbiAgYm9yZGVyOiAwO1xcbiAgY29sb3I6ICNmZmY7XFxufVxcblxcbjo6cGxhY2Vob2xkZXIge1xcbiAgLyogQ2hyb21lLCBGaXJlZm94LCBPcGVyYSwgU2FmYXJpIDEwLjErICovXFxuICBjb2xvcjogI2RjZGNkYztcXG4gIG9wYWNpdHk6IDE7IC8qIEZpcmVmb3ggKi9cXG59XFxuXFxuOi1tcy1pbnB1dC1wbGFjZWhvbGRlciB7XFxuICAvKiBJbnRlcm5ldCBFeHBsb3JlciAxMC0xMSAqL1xcbiAgY29sb3I6ICNkY2RjZGM7XFxufVxcblxcbjo6LW1zLWlucHV0LXBsYWNlaG9sZGVyIHtcXG4gIC8qIE1pY3Jvc29mdCBFZGdlICovXFxuICBjb2xvcjogI2RjZGNkYztcXG59XFxuXFxuYnV0dG9uW3R5cGU9XFxcInN1Ym1pdFxcXCJdIHtcXG4gIGJvcmRlcjogMDtcXG4gIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xcbn1cXG5cXG4uc2VhcmNoLWljb24ge1xcbiAgZm9udC1zaXplOiAxNnB4O1xcbiAgY29sb3I6ICNmZmY7XFxufVxcblxcbiN0ZW1wLXVuaXQge1xcbiAgcGFkZGluZzogNXB4O1xcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tc2VhcmNoLWJhci1jb2xvcik7XFxuICBjb2xvcjogI2ZmZmZmZjtcXG4gIG91dGxpbmU6IG5vbmU7XFxuICBib3JkZXI6IDA7XFxuICBib3JkZXItcmFkaXVzOiA1cHg7XFxufVxcblxcbm1haW4ge1xcbiAgcGFkZGluZzogM3ZoIDE1dnc7XFxufVxcblxcbi5jdXJyZW50IHtcXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWN1cnJlbnQtYmctY29sb3IpO1xcbiAgYmFja2dyb3VuZC1pbWFnZTogdXJsKGh0dHBzOi8vYXNzZXRzLm1zbi5jb20vd2VhdGhlcm1hcGRhdGEvMS9zdGF0aWMvYmFja2dyb3VuZC92Mi4wL2NvbXBhY3RhZHMzL1N1bm55LnBuZyk7XFxuICBtYXJnaW4tdG9wOiAxMnB4O1xcbiAgcGFkZGluZzogMTJweCA0OHB4IDE2cHggMjRweDtcXG4gIGRpc3BsYXk6IGdyaWQ7XFxuICBnYXA6IDIwcHg7XFxuICBib3JkZXItcmFkaXVzOiA4cHg7XFxuICBiYWNrZ3JvdW5kLXNpemU6IGNvdmVyO1xcbn1cXG5cXG4uaW1wb3J0YW50LWluZm8ge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtc3RhcnQ7XFxuICBnYXA6IDQ4cHg7XFxufVxcblxcbi5jdXJyZW50LXRlbXAgZGl2IHtcXG4gIGZvbnQtc2l6ZTogNDhweDtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBhbGlnbi1pdGVtczogZmxleC1zdGFydDtcXG4gIGdhcDogMDtcXG59XFxuXFxuLmN1cnJlbnQtdGVtcCAudW5pdCB7XFxuICBmb250LXNpemU6IDI4cHg7XFxufVxcblxcbi5jb25kaXRpb24ge1xcbiAgZm9udC1zaXplOiAyMHB4O1xcbiAgZm9udC13ZWlnaHQ6IDYwMDtcXG4gIHRleHQtdHJhbnNmb3JtOiBjYXBpdGFsaXplO1xcbn1cXG5cXG4uZmVlbHMge1xcbiAgZm9udC1zaXplOiAxNHB4O1xcbiAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcXG4gIGZvbnQtd2VpZ2h0OiA0MDA7XFxufVxcblxcbi5kZXNjcmlwdGlvbiB7XFxuICBmb250LXdlaWdodDogNjAwO1xcbn1cXG5cXG4ub3RoZXItaW5mb3Mge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGdhcDogMnJlbTtcXG59XFxuXFxuLnRlbXAge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGdhcDogOHB4O1xcbn1cXG5cXG4udGVtcCBwIHtcXG4gIGZvbnQtc2l6ZTogMzJweDtcXG59XFxuXFxuLnRlbXAgcCBzcGFuIHtcXG4gIGZvbnQtc2l6ZTogMjJweDtcXG59XFxuXFxuLnRpdGxlIGgzIHtcXG4gIGZvbnQtc2l6ZTogMTZweDtcXG4gIGZvbnQtd2VpZ2h0OiA2MDA7XFxuICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xcbn1cXG5cXG4udGltZSB7XFxuICBmb250LXNpemU6IDE0cHg7XFxufVxcblxcbi5lbGVtZW50IHtcXG4gIGZvbnQtc2l6ZTogMTJweDtcXG4gIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XFxufVxcblxcbi5pbmZvLWl0ZW0gLnZhbHVlIHtcXG4gIGZvbnQtc2l6ZTogMTZweDtcXG4gIGZvbnQtd2VpZ2h0OiA2MDA7XFxufVxcblxcbi5mb3JlY2FzdCxcXG4uaG91cmx5LWZvcmVjYXN0IHtcXG4gIG1hcmdpbi10b3A6IDE2cHg7XFxufVxcblxcbi5mb3JlY2FzdCBoMyB7XFxuICBmb250LXNpemU6IDE2cHg7XFxuICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xcbiAgbWFyZ2luLWJvdHRvbTogMTJweDtcXG59XFxuXFxuLnNsaWRlciB7XFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XFxufVxcblxcbi5jYXJkLWNvbnRhaW5lciB7XFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuICBvdmVyZmxvdzogaGlkZGVuO1xcbn1cXG5cXG4uY2FyZCB7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICBwYWRkaW5nOiAwIDAuNXJlbTtcXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWZvcmVjYXN0LWNvbG9yKTtcXG4gIGJvcmRlci1yYWRpdXM6IDVweDtcXG4gIHRyYW5zaXRpb246IGxlZnQgMjUwbXMgZWFzZS1vdXQ7XFxufVxcblxcbi5mb3JlY2FzdCAuY2FyZCB7XFxuICB3aWR0aDogMTIwcHg7XFxufVxcblxcbi50ZW1wLWZvcmNhc3Qge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG59XFxuXFxuLmNhcmQ6aG92ZXIsXFxuLmNhcmQ6Zm9jdXMge1xcbiAgY3Vyc29yOiBwb2ludGVyO1xcbn1cXG5cXG4uYXJyb3cge1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgYm90dG9tOiAwO1xcbiAgd2lkdGg6IDA7IFxcbiAgaGVpZ2h0OiAwO1xcbiAgb3ZlcmZsb3c6IHZpc2libGU7XFxuICBib3JkZXItbGVmdDogNXB4IHNvbGlkIHRyYW5zcGFyZW50O1xcbiAgYm9yZGVyLXJpZ2h0OiA1cHggc29saWQgdHJhbnNwYXJlbnQ7XFxuICBcXG4gIGJvcmRlci10b3A6IDVweCBzb2xpZCAjZmZmO1xcbn1cXG5cXG4uY2FyZCAuZGF0ZSB7XFxuICB0ZXh0LXRyYW5zZm9ybTogY2FwaXRhbGl6ZTtcXG59XFxuXFxuLnRlbXAtZm9yY2FzdCBpbWcge1xcbiAgd2lkdGg6IDRyZW07XFxuICBoZWlnaHQ6IDRyZW07XFxufVxcblxcbi50ZW1wLWluZm8ge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICBnYXA6IDAuNXJlbTtcXG4gIGZvbnQtc2l6ZTogMTZweDtcXG59XFxuXFxuLm5hdi1idG5zIHtcXG4gIGZvbnQtc2l6ZTogMS4ycmVtO1xcbiAgZm9udC13ZWlnaHQ6IDkwMDtcXG4gIGJhY2tncm91bmQ6IHZhcigtLWZvcmVjYXN0LWFjdGl2ZS1jb2xvcik7XFxuICBib3JkZXI6IDA7XFxuICB3aWR0aDogMS42cmVtO1xcbiAgaGVpZ2h0OiAxLjZyZW07XFxuICBib3JkZXItcmFkaXVzOiA1MCU7XFxuICBjb2xvcjogI2ZmZmZmZjtcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIHotaW5kZXg6IDI7XFxuICB0b3A6IGNhbGMoNTAlIC0gMC44cmVtKTtcXG4gIGJveC1zaGFkb3c6IDAgMCA4cHggdmFyKC0tZm9yZWNhc3QtYWN0aXZlLWNvbG9yKTtcXG4gIGRpc3BsYXk6IG5vbmU7XFxufVxcblxcbi5uYXYtYnRucy5uZXh0LnNob3csXFxuLm5hdi1idG5zLnByZXYuc2hvdyB7XFxuICBkaXNwbGF5OiBibG9jaztcXG59XFxuXFxuLm5hdi1idG5zOmhvdmVyIHtcXG4gIG91dGxpbmU6IG5vbmU7XFxuICBib3JkZXI6IDFweCBzb2xpZCAjZmZmZmZmNzA7XFxuICBjdXJzb3I6IHBvaW50ZXI7XFxufVxcblxcbi5uYXYtYnRucy5uZXh0IHtcXG4gIHJpZ2h0OiAtMC44cmVtO1xcbn1cXG5cXG4ubmF2LWJ0bnMucHJldiB7XFxuICBsZWZ0OiAtMC44cmVtO1xcbn1cXG5cXG4uaG91cmx5LWZvcmVjYXN0IC5jYXJkIHtcXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWZvcmVjYXN0LWFjdGl2ZS1jb2xvcik7XFxuICBkaXNwbGF5OiBmbGV4O1xcbn1cXG5cXG4uaG91cmx5LWZvcmVjYXN0IC50aXRsZSB7XFxuICBmb250LXNpemU6IDEycHg7XFxuICB0ZXh0LXRyYW5zZm9ybTogY2FwaXRhbGl6ZTtcXG4gIGZvbnQtd2VpZ2h0OiA2MDA7XFxufVxcblxcbi5iYXNpYy1ob3VybHktaW5mbyB7XFxuICBmb250LXNpemU6IDEycHg7XFxuICBmb250LXdlaWdodDogMzAwO1xcbn1cXG5cXG4uYmFzaWMtaG91cmx5LWluZm8ge1xcbiAgcGFkZGluZzogMC41cmVtO1xcbiAgYm9yZGVyLXJhZGl1czogNXB4IDAgMCA1cHg7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gIGdhcDogMC41cmVtO1xcbiAgcGFkZGluZzogMC41cmVtIDFyZW07XFxuICB3aWR0aDogNi41cmVtO1xcbiAgd2lkdGg6IDExMHB4O1xcbn1cXG5cXG4uYmFzaWMtaG91cmx5LWluZm8gaW1nIHtcXG4gIHdpZHRoOiAzcmVtO1xcbiAgaGVpZ2h0OiAzcmVtO1xcbn1cXG5cXG4uYmFzaWMtaG91cmx5LWluZm8gLndpbmQtc3BlZWQge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBnYXA6IDRweDtcXG59XFxuXFxuLmJhc2ljLWhvdXJseS1pbmZvIC53aW5kLXNwZWVkIHNwYW4ge1xcbiAgZm9udC1zaXplOiAxMnB4O1xcbiAgZm9udC13ZWlnaHQ6IDEwMDtcXG59XFxuXFxuLmNoYW5jZS1vZi1yYWluIHtcXG4gIG1hcmdpbi10b3A6IDJyZW07XFxufVxcblxcbi5tb3JlLWhvdXJseS1pbmZvLWNvbnRhaW5lciB7XFxuICBib3JkZXItbGVmdDogMXB4IGRhc2hlZCAjZmZmZmZmODA7XFxuICB3aWR0aDogMjIwcHg7XFxuICBkaXNwbGF5OiBub25lO1xcbn1cXG5cXG4ubW9yZS1ob3VybHktaW5mby1jb250YWluZXIuc2hvdyB7XFxuICBkaXNwbGF5OiBibG9jaztcXG59XFxuXFxuLm1vcmUtaG91cmx5LWluZm8ge1xcbiAgd2lkdGg6IDEwMCU7XFxuICBoZWlnaHQ6IDEwMCU7XFxuICBkaXNwbGF5OiBncmlkO1xcbiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnIgMWZyO1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIHBhZGRpbmc6IDEycHggMTBweDtcXG59XFxuXFxuLm1vcmUtaG91cmx5LWluZm8gcCB7XFxuICBmb250LXNpemU6IDEwcHg7XFxuICBmb250LXdlaWdodDogbGlnaHRlcjtcXG4gIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XFxufVxcblxcbi5tb3JlLWhvdXJseS1pbmZvID4gZGl2IHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgZ2FwOiA1cHg7XFxuICBmb250LXdlaWdodDogbGlnaHRlcjtcXG59XFxuXFxuLm1vcmUtaG91cmx5LWluZm8gc3BhbiB7XFxuICBmb250LXNpemU6IDE0cHg7XFxuICBmb250LXdlaWdodDogMTAwO1xcbn1cXG5cXG4ubW9yZS1ob3VybHktaW5mbyAudmFsdWUge1xcbiAgbWFyZ2luLXRvcDogNHB4O1xcbiAgZm9udC13ZWlnaHQ6IDkwMDtcXG59XCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKlxuICBNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuICBBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY3NzV2l0aE1hcHBpbmdUb1N0cmluZykge1xuICB2YXIgbGlzdCA9IFtdOyAvLyByZXR1cm4gdGhlIGxpc3Qgb2YgbW9kdWxlcyBhcyBjc3Mgc3RyaW5nXG5cbiAgbGlzdC50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiB0aGlzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgdmFyIGNvbnRlbnQgPSBcIlwiO1xuICAgICAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBpdGVtWzVdICE9PSBcInVuZGVmaW5lZFwiO1xuXG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQoaXRlbVs0XSwgXCIpIHtcIik7XG4gICAgICB9XG5cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIik7XG4gICAgICB9XG5cbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpO1xuICAgICAgfVxuXG4gICAgICBjb250ZW50ICs9IGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcoaXRlbSk7XG5cbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cblxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cblxuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgfSkuam9pbihcIlwiKTtcbiAgfTsgLy8gaW1wb3J0IGEgbGlzdCBvZiBtb2R1bGVzIGludG8gdGhlIGxpc3RcblxuXG4gIGxpc3QuaSA9IGZ1bmN0aW9uIGkobW9kdWxlcywgbWVkaWEsIGRlZHVwZSwgc3VwcG9ydHMsIGxheWVyKSB7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGVzID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCB1bmRlZmluZWRdXTtcbiAgICB9XG5cbiAgICB2YXIgYWxyZWFkeUltcG9ydGVkTW9kdWxlcyA9IHt9O1xuXG4gICAgaWYgKGRlZHVwZSkge1xuICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCB0aGlzLmxlbmd0aDsgaysrKSB7XG4gICAgICAgIHZhciBpZCA9IHRoaXNba11bMF07XG5cbiAgICAgICAgaWYgKGlkICE9IG51bGwpIHtcbiAgICAgICAgICBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKHZhciBfayA9IDA7IF9rIDwgbW9kdWxlcy5sZW5ndGg7IF9rKyspIHtcbiAgICAgIHZhciBpdGVtID0gW10uY29uY2F0KG1vZHVsZXNbX2tdKTtcblxuICAgICAgaWYgKGRlZHVwZSAmJiBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2l0ZW1bMF1dKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIGxheWVyICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgaXRlbVs1XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAobWVkaWEpIHtcbiAgICAgICAgaWYgKCFpdGVtWzJdKSB7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoc3VwcG9ydHMpIHtcbiAgICAgICAgaWYgKCFpdGVtWzRdKSB7XG4gICAgICAgICAgaXRlbVs0XSA9IFwiXCIuY29uY2F0KHN1cHBvcnRzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNF0gPSBzdXBwb3J0cztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBsaXN0LnB1c2goaXRlbSk7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBsaXN0O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXRlbSkge1xuICB2YXIgY29udGVudCA9IGl0ZW1bMV07XG4gIHZhciBjc3NNYXBwaW5nID0gaXRlbVszXTtcblxuICBpZiAoIWNzc01hcHBpbmcpIHtcbiAgICByZXR1cm4gY29udGVudDtcbiAgfVxuXG4gIGlmICh0eXBlb2YgYnRvYSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgdmFyIGJhc2U2NCA9IGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KGNzc01hcHBpbmcpKSkpO1xuICAgIHZhciBkYXRhID0gXCJzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxcIi5jb25jYXQoYmFzZTY0KTtcbiAgICB2YXIgc291cmNlTWFwcGluZyA9IFwiLyojIFwiLmNvbmNhdChkYXRhLCBcIiAqL1wiKTtcbiAgICB2YXIgc291cmNlVVJMcyA9IGNzc01hcHBpbmcuc291cmNlcy5tYXAoZnVuY3Rpb24gKHNvdXJjZSkge1xuICAgICAgcmV0dXJuIFwiLyojIHNvdXJjZVVSTD1cIi5jb25jYXQoY3NzTWFwcGluZy5zb3VyY2VSb290IHx8IFwiXCIpLmNvbmNhdChzb3VyY2UsIFwiICovXCIpO1xuICAgIH0pO1xuICAgIHJldHVybiBbY29udGVudF0uY29uY2F0KHNvdXJjZVVSTHMpLmNvbmNhdChbc291cmNlTWFwcGluZ10pLmpvaW4oXCJcXG5cIik7XG4gIH1cblxuICByZXR1cm4gW2NvbnRlbnRdLmpvaW4oXCJcXG5cIik7XG59OyIsIlxuICAgICAgaW1wb3J0IEFQSSBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0Rm4gZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzXCI7XG4gICAgICBpbXBvcnQgc2V0QXR0cmlidXRlcyBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qc1wiO1xuICAgICAgaW1wb3J0IHN0eWxlVGFnVHJhbnNmb3JtRm4gZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qc1wiO1xuICAgICAgaW1wb3J0IGNvbnRlbnQsICogYXMgbmFtZWRFeHBvcnQgZnJvbSBcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9zdHlsZS5jc3NcIjtcbiAgICAgIFxuICAgICAgXG5cbnZhciBvcHRpb25zID0ge307XG5cbm9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0gPSBzdHlsZVRhZ1RyYW5zZm9ybUZuO1xub3B0aW9ucy5zZXRBdHRyaWJ1dGVzID0gc2V0QXR0cmlidXRlcztcblxuICAgICAgb3B0aW9ucy5pbnNlcnQgPSBpbnNlcnRGbi5iaW5kKG51bGwsIFwiaGVhZFwiKTtcbiAgICBcbm9wdGlvbnMuZG9tQVBJID0gZG9tQVBJO1xub3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7XG5cbnZhciB1cGRhdGUgPSBBUEkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5leHBvcnQgKiBmcm9tIFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3N0eWxlLmNzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgc3R5bGVzSW5ET00gPSBbXTtcblxuZnVuY3Rpb24gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcikge1xuICB2YXIgcmVzdWx0ID0gLTE7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHlsZXNJbkRPTS5sZW5ndGg7IGkrKykge1xuICAgIGlmIChzdHlsZXNJbkRPTVtpXS5pZGVudGlmaWVyID09PSBpZGVudGlmaWVyKSB7XG4gICAgICByZXN1bHQgPSBpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpIHtcbiAgdmFyIGlkQ291bnRNYXAgPSB7fTtcbiAgdmFyIGlkZW50aWZpZXJzID0gW107XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGl0ZW0gPSBsaXN0W2ldO1xuICAgIHZhciBpZCA9IG9wdGlvbnMuYmFzZSA/IGl0ZW1bMF0gKyBvcHRpb25zLmJhc2UgOiBpdGVtWzBdO1xuICAgIHZhciBjb3VudCA9IGlkQ291bnRNYXBbaWRdIHx8IDA7XG4gICAgdmFyIGlkZW50aWZpZXIgPSBcIlwiLmNvbmNhdChpZCwgXCIgXCIpLmNvbmNhdChjb3VudCk7XG4gICAgaWRDb3VudE1hcFtpZF0gPSBjb3VudCArIDE7XG4gICAgdmFyIGluZGV4QnlJZGVudGlmaWVyID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgdmFyIG9iaiA9IHtcbiAgICAgIGNzczogaXRlbVsxXSxcbiAgICAgIG1lZGlhOiBpdGVtWzJdLFxuICAgICAgc291cmNlTWFwOiBpdGVtWzNdLFxuICAgICAgc3VwcG9ydHM6IGl0ZW1bNF0sXG4gICAgICBsYXllcjogaXRlbVs1XVxuICAgIH07XG5cbiAgICBpZiAoaW5kZXhCeUlkZW50aWZpZXIgIT09IC0xKSB7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0ucmVmZXJlbmNlcysrO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnVwZGF0ZXIob2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHVwZGF0ZXIgPSBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKTtcbiAgICAgIG9wdGlvbnMuYnlJbmRleCA9IGk7XG4gICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoaSwgMCwge1xuICAgICAgICBpZGVudGlmaWVyOiBpZGVudGlmaWVyLFxuICAgICAgICB1cGRhdGVyOiB1cGRhdGVyLFxuICAgICAgICByZWZlcmVuY2VzOiAxXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZGVudGlmaWVycy5wdXNoKGlkZW50aWZpZXIpO1xuICB9XG5cbiAgcmV0dXJuIGlkZW50aWZpZXJzO1xufVxuXG5mdW5jdGlvbiBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKSB7XG4gIHZhciBhcGkgPSBvcHRpb25zLmRvbUFQSShvcHRpb25zKTtcbiAgYXBpLnVwZGF0ZShvYmopO1xuXG4gIHZhciB1cGRhdGVyID0gZnVuY3Rpb24gdXBkYXRlcihuZXdPYmopIHtcbiAgICBpZiAobmV3T2JqKSB7XG4gICAgICBpZiAobmV3T2JqLmNzcyA9PT0gb2JqLmNzcyAmJiBuZXdPYmoubWVkaWEgPT09IG9iai5tZWRpYSAmJiBuZXdPYmouc291cmNlTWFwID09PSBvYmouc291cmNlTWFwICYmIG5ld09iai5zdXBwb3J0cyA9PT0gb2JqLnN1cHBvcnRzICYmIG5ld09iai5sYXllciA9PT0gb2JqLmxheWVyKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgYXBpLnVwZGF0ZShvYmogPSBuZXdPYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICBhcGkucmVtb3ZlKCk7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiB1cGRhdGVyO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChsaXN0LCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBsaXN0ID0gbGlzdCB8fCBbXTtcbiAgdmFyIGxhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKTtcbiAgcmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZShuZXdMaXN0KSB7XG4gICAgbmV3TGlzdCA9IG5ld0xpc3QgfHwgW107XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGlkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbaV07XG4gICAgICB2YXIgaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4XS5yZWZlcmVuY2VzLS07XG4gICAgfVxuXG4gICAgdmFyIG5ld0xhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShuZXdMaXN0LCBvcHRpb25zKTtcblxuICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICB2YXIgX2lkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbX2ldO1xuXG4gICAgICB2YXIgX2luZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoX2lkZW50aWZpZXIpO1xuXG4gICAgICBpZiAoc3R5bGVzSW5ET01bX2luZGV4XS5yZWZlcmVuY2VzID09PSAwKSB7XG4gICAgICAgIHN0eWxlc0luRE9NW19pbmRleF0udXBkYXRlcigpO1xuXG4gICAgICAgIHN0eWxlc0luRE9NLnNwbGljZShfaW5kZXgsIDEpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGxhc3RJZGVudGlmaWVycyA9IG5ld0xhc3RJZGVudGlmaWVycztcbiAgfTtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBtZW1vID0ge307XG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cblxuZnVuY3Rpb24gZ2V0VGFyZ2V0KHRhcmdldCkge1xuICBpZiAodHlwZW9mIG1lbW9bdGFyZ2V0XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHZhciBzdHlsZVRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGFyZ2V0KTsgLy8gU3BlY2lhbCBjYXNlIHRvIHJldHVybiBoZWFkIG9mIGlmcmFtZSBpbnN0ZWFkIG9mIGlmcmFtZSBpdHNlbGZcblxuICAgIGlmICh3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQgJiYgc3R5bGVUYXJnZXQgaW5zdGFuY2VvZiB3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIFRoaXMgd2lsbCB0aHJvdyBhbiBleGNlcHRpb24gaWYgYWNjZXNzIHRvIGlmcmFtZSBpcyBibG9ja2VkXG4gICAgICAgIC8vIGR1ZSB0byBjcm9zcy1vcmlnaW4gcmVzdHJpY3Rpb25zXG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gc3R5bGVUYXJnZXQuY29udGVudERvY3VtZW50LmhlYWQ7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIGlzdGFuYnVsIGlnbm9yZSBuZXh0XG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBtZW1vW3RhcmdldF0gPSBzdHlsZVRhcmdldDtcbiAgfVxuXG4gIHJldHVybiBtZW1vW3RhcmdldF07XG59XG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cblxuXG5mdW5jdGlvbiBpbnNlcnRCeVNlbGVjdG9yKGluc2VydCwgc3R5bGUpIHtcbiAgdmFyIHRhcmdldCA9IGdldFRhcmdldChpbnNlcnQpO1xuXG4gIGlmICghdGFyZ2V0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQ291bGRuJ3QgZmluZCBhIHN0eWxlIHRhcmdldC4gVGhpcyBwcm9iYWJseSBtZWFucyB0aGF0IHRoZSB2YWx1ZSBmb3IgdGhlICdpbnNlcnQnIHBhcmFtZXRlciBpcyBpbnZhbGlkLlwiKTtcbiAgfVxuXG4gIHRhcmdldC5hcHBlbmRDaGlsZChzdHlsZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0QnlTZWxlY3RvcjsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucykge1xuICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcbiAgb3B0aW9ucy5zZXRBdHRyaWJ1dGVzKGVsZW1lbnQsIG9wdGlvbnMuYXR0cmlidXRlcyk7XG4gIG9wdGlvbnMuaW5zZXJ0KGVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG4gIHJldHVybiBlbGVtZW50O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydFN0eWxlRWxlbWVudDsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMoc3R5bGVFbGVtZW50KSB7XG4gIHZhciBub25jZSA9IHR5cGVvZiBfX3dlYnBhY2tfbm9uY2VfXyAhPT0gXCJ1bmRlZmluZWRcIiA/IF9fd2VicGFja19ub25jZV9fIDogbnVsbDtcblxuICBpZiAobm9uY2UpIHtcbiAgICBzdHlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKFwibm9uY2VcIiwgbm9uY2UpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKSB7XG4gIHZhciBjc3MgPSBcIlwiO1xuXG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChvYmouc3VwcG9ydHMsIFwiKSB7XCIpO1xuICB9XG5cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIkBtZWRpYSBcIi5jb25jYXQob2JqLm1lZGlhLCBcIiB7XCIpO1xuICB9XG5cbiAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBvYmoubGF5ZXIgIT09IFwidW5kZWZpbmVkXCI7XG5cbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIkBsYXllclwiLmNvbmNhdChvYmoubGF5ZXIubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChvYmoubGF5ZXIpIDogXCJcIiwgXCIge1wiKTtcbiAgfVxuXG4gIGNzcyArPSBvYmouY3NzO1xuXG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cblxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG5cbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuXG4gIHZhciBzb3VyY2VNYXAgPSBvYmouc291cmNlTWFwO1xuXG4gIGlmIChzb3VyY2VNYXAgJiYgdHlwZW9mIGJ0b2EgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBjc3MgKz0gXCJcXG4vKiMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LFwiLmNvbmNhdChidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpLCBcIiAqL1wiKTtcbiAgfSAvLyBGb3Igb2xkIElFXG5cbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICAqL1xuXG5cbiAgb3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCkge1xuICAvLyBpc3RhbmJ1bCBpZ25vcmUgaWZcbiAgaWYgKHN0eWxlRWxlbWVudC5wYXJlbnROb2RlID09PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgc3R5bGVFbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50KTtcbn1cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuXG5cbmZ1bmN0aW9uIGRvbUFQSShvcHRpb25zKSB7XG4gIHZhciBzdHlsZUVsZW1lbnQgPSBvcHRpb25zLmluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKTtcbiAgcmV0dXJuIHtcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShvYmopIHtcbiAgICAgIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKTtcbiAgICB9LFxuICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge1xuICAgICAgcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCk7XG4gICAgfVxuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRvbUFQSTsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCkge1xuICBpZiAoc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQpIHtcbiAgICBzdHlsZUVsZW1lbnQuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuICB9IGVsc2Uge1xuICAgIHdoaWxlIChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCkge1xuICAgICAgc3R5bGVFbGVtZW50LnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKTtcbiAgICB9XG5cbiAgICBzdHlsZUVsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdHlsZVRhZ1RyYW5zZm9ybTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdGlkOiBtb2R1bGVJZCxcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5uYyA9IHVuZGVmaW5lZDsiLCJpbXBvcnQgXCIuL3N0eWxlLmNzc1wiO1xuaW1wb3J0IHsgY3VycmVudFdlYXRoZXIsIGZvcmVjYXN0IH0gZnJvbSBcIi4vYXBpXCI7XG5pbXBvcnQgeyBzZXRDdXJyZW50V2VhdGhlciB9IGZyb20gXCIuL2RvbVwiO1xuXG4oZnVuY3Rpb24gKCkge1xuICBjb25zdCBmb3JtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImZvcm0uc2VhcmNoLWJhclwiKTtcbiAgZm9ybS5hZGRFdmVudExpc3RlbmVyKFwic3VibWl0XCIsIGhhbmRsZVNlYXJjaExvY2F0aW9uV2VhdGhlcik7XG5cbiAgY29uc3Qgc2VsZWN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiN0ZW1wLXVuaXRcIik7XG4gIHNlbGVjdC5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIGhhbmRsZU1lYXN1cmVtZW50VW5pdCk7XG5cbiAgLy9kaXNwbGF5IGN1cnJlbnQgdXNlciBsb2NhdGlvbiB3ZWF0aGVyXG4gIHVzZXJMb2NhdGlvbldlYXRoZXIoKTtcbn0pKCk7XG5cbmZ1bmN0aW9uIHVzZXJMb2NhdGlvbldlYXRoZXIoKSB7XG4gIG5hdmlnYXRvci5nZW9sb2NhdGlvbi5nZXRDdXJyZW50UG9zaXRpb24oYXN5bmMgKHBvc2l0aW9uKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGN1cnJlbnQgPSBhd2FpdCBjdXJyZW50V2VhdGhlcih7XG4gICAgICAgIGxhdDogcG9zaXRpb24uY29vcmRzLmxhdGl0dWRlLFxuICAgICAgICBsb246IHBvc2l0aW9uLmNvb3Jkcy5sb25naXR1ZGUsXG4gICAgICB9KTtcbiAgICAgIHNldEN1cnJlbnRXZWF0aGVyKGN1cnJlbnQsIFwibWV0cmljXCIpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgIH1cbiAgfSk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGhhbmRsZVNlYXJjaExvY2F0aW9uV2VhdGhlcihlKSB7XG4gIGUucHJldmVudERlZmF1bHQoKTtcbiAgY29uc3QgZm9ybSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJmb3JtLnNlYXJjaC1iYXJcIik7XG4gIHRyeSB7XG4gICAgY29uc3QgY2l0eSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc2VhcmNoLWJhciBpbnB1dFwiKS52YWx1ZTtcbiAgICBjb25zdCBzZWxlY3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3RlbXAtdW5pdFwiKTtcbiAgICBjb25zdCB0ZW1wVW5pdCA9IHNlbGVjdC5vcHRpb25zW3NlbGVjdC5zZWxlY3RlZEluZGV4XS52YWx1ZTtcbiAgICBjb25zdCBjdXJyZW50ID0gYXdhaXQgY3VycmVudFdlYXRoZXIoY2l0eSwgdGVtcFVuaXQpO1xuICAgIHNldEN1cnJlbnRXZWF0aGVyKGN1cnJlbnQsIHRlbXBVbml0KTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgY29uc29sZS5lcnJvcihlcnIpO1xuICB9XG4gIGZvcm0ucmVzZXQoKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gaGFuZGxlTWVhc3VyZW1lbnRVbml0KCkge1xuICB0cnkge1xuICAgIGNvbnN0IGNpdHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmxvY2F0aW9uXCIpLnRleHRDb250ZW50LnNwbGl0KFwiLFwiKVswXTtcbiAgICBjb25zb2xlLmxvZyhjaXR5KTtcbiAgICBjb25zdCBzZWxlY3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3RlbXAtdW5pdFwiKTtcbiAgICBjb25zdCB0ZW1wVW5pdCA9IHNlbGVjdC5vcHRpb25zW3NlbGVjdC5zZWxlY3RlZEluZGV4XS52YWx1ZTtcbiAgICBjb25zdCBjdXJyZW50ID0gYXdhaXQgY3VycmVudFdlYXRoZXIoY2l0eSwgdGVtcFVuaXQpO1xuICAgIHNldEN1cnJlbnRXZWF0aGVyKGN1cnJlbnQsIHRlbXBVbml0KTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgY29uc29sZS5lcnJvcihlcnIpO1xuICB9XG59XG4iXSwibmFtZXMiOlsiY3VycmVudFdlYXRoZXIiLCJjaXR5IiwidW5pdCIsInVybCIsImxhdCIsImxvbiIsInJlc3AiLCJmZXRjaCIsImRhdGEiLCJqc29uIiwiaWQiLCJ3ZWF0aGVyIiwibmFtZSIsImNvdW50cnkiLCJzeXMiLCJmZWVsc0xpa2UiLCJtYWluIiwiZmVlbHNfbGlrZSIsImh1bWlkaXR5IiwicHJlc3N1cmUiLCJ0ZW1wIiwidGVtcE1heCIsInRlbXBfbWF4IiwidGVtcE1pbiIsInRlbXBfbWluIiwidmlzaWJpbGl0eSIsImRlc2NyaXB0aW9uIiwiaWNvbiIsImRheU5pZ2h0Iiwid2luZFNwZWVkIiwid2luZCIsInNwZWVkIiwid2luZERlZyIsImRlZyIsInRpbWUiLCJkdCIsIkVycm9yIiwiZm9yZWNhc3QiLCJkYXlzIiwibGlzdCIsIm1hcCIsImhvdXJseSIsInRpbWV6b25lIiwicGVyY2lwaXRhdGlvbiIsIk1hdGgiLCJyb3VuZCIsInBvcCIsInJhaW4iLCJlcnIiLCJmb3JlY2FzdENhcmRDb250YWluZXIiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJjYXJkcyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJzZXRBdHRyaWJ1dGUiLCJjbGllbnRIZWlnaHQiLCJpIiwibGVuZ3RoIiwiY2xpZW50V2lkdGgiLCJob3VybHlDYXJkQ29udGFpbmVyIiwicHJldkJ0bnMiLCJuZXh0QnRucyIsImZvckVhY2giLCJjb250cm9sTGVmdFNsaWRlckJ0bnMiLCJjb250cm9sUmlnaHRTbGlkZXJCdG5zIiwicHJldiIsImFkZEV2ZW50TGlzdGVuZXIiLCJzbGlkZUxlZnQiLCJuZXh0Iiwic2xpZGVSaWdodCIsImhvdXJseWNhcmRzIiwiY2FyZCIsImluZGV4Iiwic2hvd09ySGlkZU1vcmVJbmZvIiwic2V0Q3VycmVudFdlYXRoZXIiLCJjaXR5TmFtZSIsInRleHRDb250ZW50IiwidGVtcFVuaXQiLCJkYXRlIiwiRGF0ZSIsImhyIiwiZ2V0SG91cnMiLCJhbXBtIiwibWluIiwiZ2V0TWludXRlcyIsImltZyIsInNyYyIsInRvRml4ZWQiLCJ1bml0SWNvbiIsImRlc2MiLCJzZXRDb2xvckNsYXNzIiwiYm9keSIsInJlbW92ZUF0dHJpYnV0ZSIsImNsYXNzTGlzdCIsImFkZCIsImJ0biIsInNsaWRlQ29udGFpbmVyIiwicGFyZW50RWxlbWVudCIsImNoaWxkcmVuIiwiZmlyc3RDYXJkIiwiZmlyc3RDYXJkTGVmdE9mZnNldCIsInBhcnNlSW50Iiwic3R5bGUiLCJsZWZ0Iiwic3BsaXQiLCJyZW1vdmUiLCJsYXN0Q2FyZCIsImxhc3RDYXJkUmlnaHRPZmZzZXQiLCJlIiwiQXJyYXkiLCJmcm9tIiwidGFyZ2V0IiwiZmluZEluZGV4Iiwic2xpZGVXaWR0aCIsIm9mZnNldExlZnQiLCJmaWx0ZXIiLCJjYXJkTW9yZUluZm8iLCJjb250YWlucyIsImhpZGVNb3JlSW5mbyIsIm1vcmVJbmZvIiwic2hvd01vcmVJbmZvIiwibW9yZUluZm9DYXJkV2lkdGgiLCJjYXJkTGVmdE9mZnNldCIsIkluZGV4Q2FyZEF0WmVyb09mZnNldCIsImZvcm0iLCJoYW5kbGVTZWFyY2hMb2NhdGlvbldlYXRoZXIiLCJzZWxlY3QiLCJoYW5kbGVNZWFzdXJlbWVudFVuaXQiLCJ1c2VyTG9jYXRpb25XZWF0aGVyIiwibmF2aWdhdG9yIiwiZ2VvbG9jYXRpb24iLCJnZXRDdXJyZW50UG9zaXRpb24iLCJwb3NpdGlvbiIsImN1cnJlbnQiLCJjb29yZHMiLCJsYXRpdHVkZSIsImxvbmdpdHVkZSIsImNvbnNvbGUiLCJlcnJvciIsInByZXZlbnREZWZhdWx0IiwidmFsdWUiLCJvcHRpb25zIiwic2VsZWN0ZWRJbmRleCIsInJlc2V0IiwibG9nIl0sInNvdXJjZVJvb3QiOiIifQ==