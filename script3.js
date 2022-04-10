'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////
const lotteryPromise = new Promise(function (resolve, reject) {
  console.log(`Lottery draw is happening ...`);
  setTimeout(() => {
    if (Math.random() >= 0.5) {
      resolve(`you win`);
    } else {
      reject(new Error(`you lose`));
    }
  }, 2000);
});

lotteryPromise.then(res => console.log(res)).catch(e => console.error(e));

// Promisifying setTimeout
const wait = function (seconds) {
  return new Promise((resolve, reject) => setTimeout(resolve, seconds * 1000));
};

wait(2)
  .then(() => {
    console.log(`success!`);
    return wait(1);
  })
  .then(() => console.log(`and another 1 second has passed ...`));

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
  countriesContainer.style.opacity = 1;
};

const getPosition = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

getPosition().then(res => {
  console.log(res);
});

const whereAmI = function (lat, lng) {
  getPosition()
    .then(pos => {
      console.log(pos.coords);
      const { latitude: lat, longitude: lng } = pos.coords;
      return fetch(`https://geocode.xyz/${lat},${lng}?json=1`);
    })

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

const getJSON = function (url, errorMsg = 'Something went Horribly wrong') {
  return fetch(url).then(res => {
    if (!res.ok) throw new Error(`${errorMsg} (${res.status})`);
    return res.json();
  });
};

btn.addEventListener('click', whereAmI);
