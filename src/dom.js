import { currentWeather } from "./api";

(function () {
  const forecastCardContainer = document.querySelector(
    ".forecast .card-container"
  );
  let cards = forecastCardContainer.querySelectorAll(".card");
  forecastCardContainer.setAttribute(
    "style",
    `height:${cards[0].clientHeight}px`
  );
  //position cards of position absolute using left attribute
  for (let i = 0; i < cards.length; i++) {
    cards[i].setAttribute("style", `left:${(cards[i].clientWidth + 5) * i}px`);
  }

  const hourlyCardContainer = document.querySelector(
    ".hourly-forecast .card-container"
  );
  cards = hourlyCardContainer.querySelectorAll(".card");
  hourlyCardContainer.setAttribute(
    "style",
    `height:${cards[0].clientHeight}px`
  );
  //position cards of position absolute using left attribute
  for (let i = 0; i < cards.length; i++) {
    cards[i].setAttribute("style", `left:${(cards[i].clientWidth + 5) * i}px`);
  }

  const prevBtns = document.querySelectorAll(".prev");
  const nextBtns = document.querySelectorAll(".next");
  //check add next and prev buttons if overflow
  prevBtns.forEach(controlLeftSliderBtns);
  nextBtns.forEach(controlRightSliderBtns);
  //add event listener for prev and next slide buttons
  prevBtns.forEach((prev) => prev.addEventListener("click", slideLeft));
  nextBtns.forEach((next) => next.addEventListener("click", slideRight));

  //hide or show card next btns if overflow on window resize
  addEventListener("resize", () => {
    nextBtns.forEach(controlRightSliderBtns);
  });

  //show more info when card clicked
  const hourlycards = document.querySelectorAll(".hourly-forecast .card");
  hourlycards.forEach((card, index) => {
    card.addEventListener("click", () => showOrHideMoreInfo(index));
  });
})();

export function setCurrentWeather(currentWeather, unit) {
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
  feelsLike.textContent = `feels like ${currentWeather.feelsLike.toFixed(
    1
  )}${tempUnit}`;

  const description = document.querySelector(".description");
  description.textContent = `The high will be ${currentWeather.tempMax.toFixed(
    1
  )}${tempUnit}.`;

  const wind = document.querySelector(".wind .value");
  wind.textContent = `${currentWeather.windSpeed} m/s`;

  const humidity = document.querySelector(".humidity .value");
  humidity.textContent = `${currentWeather.humidity}%`;

  const pressure = document.querySelector(".pressure .value");
  pressure.textContent = `${currentWeather.pressure} hPa`;

  const visibility = document.querySelector(".visibility .value");
  visibility.textContent = `${currentWeather.visibility} Km`;

  //set display colors
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
  const lastCardRightOffset =
    parseInt(lastCard.style.left.split("px")[0]) + lastCard.clientWidth;
  if (lastCardRightOffset > slideContainer.clientWidth) {
    slideContainer.querySelector(".next").classList.add("show");
  } else {
    slideContainer.querySelector(".next").classList.remove("show");
  }
}

function slideLeft(e) {
  const cards = Array.from(e.target.parentElement.children[2].children);
  const index = cards.findIndex((card) => card.style.left == "0px");
  let slideWidth = cards[index - 1].clientWidth;
  cards.forEach((card) => {
    card.setAttribute("style", `left:${card.offsetLeft + (slideWidth + 5)}px`);
  });
  controlLeftSliderBtns(e.target);
  controlRightSliderBtns(e.target);
}

function slideRight(e) {
  const cards = Array.from(e.target.parentElement.children[2].children);
  let slideWidth = cards.filter((card) => card.style.left == "0px")[0]
    .clientWidth;
  cards.forEach((card) => {
    card.setAttribute("style", `left:${card.offsetLeft - (slideWidth + 5)}px`);
  });
  controlRightSliderBtns(e.target);
  controlLeftSliderBtns(e.target);
}

function showOrHideMoreInfo(index) {
  const cards = document.querySelectorAll(".hourly-forecast .card");
  const cardMoreInfo = cards[index].querySelector(
    ".more-hourly-info-container"
  );
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
  controlRightSliderBtns(
    document.querySelector(".hourly-forecast .nav-btns.next")
  );
}

function hideMoreInfo(cardMoreInfo, index) {
  const cards = Array.from(document.querySelectorAll(".hourly-forecast .card"));
  const moreInfoCardWidth = 220;

  let IndexCardAtZeroOffset = cards.findIndex(
    (card) => card.style.left == "0px"
  );

  cardMoreInfo.classList.remove("show");

  for (let i = 0; i < cards.length; i++) {
    cards[i].style.left =
      (i - IndexCardAtZeroOffset) * (cards[i].clientWidth + 5) + "px";
  }
  controlRightSliderBtns(
    document.querySelector(".hourly-forecast .nav-btns.next")
  );
}
