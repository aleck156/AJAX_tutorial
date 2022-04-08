'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

const renderCountry = function (data, className = '') {
  const currencies = data.currencies[Object.keys(data.currencies)[0]].name;

  const html = ` 
  <article class="country ${className}">
  <img class="country__img" src="${data.flags.png}" />
  <div class="country__data">
        <h3 class="country__name">${data.name.common}</h3>
        <h4 class="country__region">${data.subregion}</h4>
        <p class="country__row"><span>👫</span>${(
          +data.population / 1_000_000
        ).toFixed(2)}M people</p>
          <p class="country__row"><span>🗣️</span>${Object.values(
            data.languages
          ).join(', ')}</p>
            <p class="country__row"><span>💰</span>${currencies}</p>
            </div>
            </article>`;

  countriesContainer.insertAdjacentHTML('beforeend', html);
};

// const request = fetch(`https://restcountries.com/v3.1/name/poland`);

// request.then(e => console.log(e));

const getNeighbourData = function (neighbours) {
  neighbours.forEach(elem =>
    fetch(`https://restcountries.com/v3.1/alpha/${elem}`)
      .then(res => res.json())
      .then(([neighbourCountry]) => {
        console.log(`${neighbourCountry.flag} ${neighbourCountry.name.common}`);
        // renderCountry(neighbourCountry, 'neighbour');
      })
  );
};

const renderError = function (msg) {
  countriesContainer.insertAdjacentText('beforeend', msg);
};

const getJSON = function (url, errorMsg = 'Something went Horribly wrong') {
  return fetch(url).then(res => {
    if (!res.ok) throw new Error(`${errorMsg} (${res.status})`);
    return res.json();
  });
};

const getCountryData = function (country) {
  getJSON(`https://restcountries.com/v3.1/name/${country}`, `Country not found`)
    .then(data => {
      renderCountry(data[0]);
      const neighbours = data[0].borders;
      if (!neighbours) throw new Error(`No neighbours found`);

      console.log(neighbours);
      getNeighbourData(neighbours);

      const neighbour = data[0].borders[0];
      console.log(neighbour);

      return getJSON(`https://restcountries.com/v3.1/alpha/${neighbour}`);
    })
    .then(data => renderCountry(data[0], 'neighbour'))
    .catch(err => {
      console.error(`Not enough! ${err}`);
      renderError(`Something went wrong`);
    })
    .finally(event => (countriesContainer.style.opacity = 1));
};

btn.addEventListener('click', () => {
  getCountryData('poland');
});

const whereAmI = function (lat, lng) {
  fetch(`https://geocode.xyz/${lat},${lng}?json=1`)
    .then(res => {
      if (!res.ok)
        throw new Error(`[${res.status}]: Houston, we have a problem`);
      return res.json();
    })
    .then(data => {
      console.log(data);
      console.log(`You are in ${data.city}, ${data.country}`);
      getCountryData(data.country);
    })
    .catch(err => console.error(`${err.message}`));
};

/*
Test data:
§ Coordinates 1: 52.508, 13.381 (Latitude, Longitude)
§ Coordinates 2: 19.037, 72.873
§ Coordinates 3: -33.933, 18.474
*/
const loc1 = [52.508, 13.381];
const loc2 = [19.037, 72.873];
const loc3 = [-33.933, 18.474];

whereAmI(...loc1);
whereAmI(...loc2);
whereAmI(...loc3);
