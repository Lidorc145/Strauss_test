'use strict';

const GOOGLE_MAPS_TOKEN = 'AIzaSyBvyJanVKCRfxT_j4VHnNGuur5tJ7TvSYM';
let temp = '',
  city = '';

const ApiWeatherSrc = (latitude, longitude) => {
  return `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&daily=weathercode&timezone=auto`;
};

const ApiGoogleMapsSrc = (latitude, longitude) => {
  return `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_TOKEN}&language=en-US`;
};

const updateWeatherData = () => {
  const weatherDiv = document.getElementsByClassName('weather')[0];
  weatherDiv.innerHTML = `<div>${city}<br>${temp}</div>`;
};

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition((position) => {

    // fetching temperature data
    fetch(ApiWeatherSrc(position.coords.latitude, position.coords.longitude))
      .then(res => res.json())
      .then(({ hourly: { temperature_2m } }) => {
        temp = temperature_2m[new Date().getHours()];
        temp = temp && `Temperature: ${temp} ℃`;
        updateWeatherData();
      })
      .catch((e) => {
        console.error('WEATHER API ERROR: ', e);
      });

    // fetching city data
    fetch(ApiGoogleMapsSrc(position.coords.latitude, position.coords.longitude))
      .then(res => res.json())
      .then(({ results }) => {
        city = results[0]?.address_components.filter(item => item.types[0] === 'locality')[0]?.long_name;
        city = city && `Location: ${city}`;
        updateWeatherData();
      })
      .catch((e) => {
        console.error('GOOGLE MAPS API ERROR: ', e);
      });
  });
} else {
  console.error('Geolocation is not supported by this browser.');
}

document.getElementsByClassName('menu')[0].addEventListener('click', (event) => {
  event.preventDefault();
});
