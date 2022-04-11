'use strict';

const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////

const getPosition = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

getPosition().then(res => console.log(res.coords));

const whereAmI = async function () {
  const pos = await getPosition();
  const { latitude: lat, longitude: lng } = pos.coords;

  const geocode = await fetch(`https://geocode.xyz/${lat},${lng}?json=1`);
  const geocodeJSON = await geocode.json();
  console.log(geocodeJSON);

  const res = await fetch(
    `https://restcountries.com/v3.1/name/${geocodeJSON.country}`
  );
  const [resJSON] = await res.json();
  console.log(resJSON);
  renderCountry(resJSON);
  /*
  this is exactly the same code underneath as ...

  fetch(`https://restcountries.com/v3.1/name/${country}`)
      .then(res => console.log(res));

  */

  return `You are in ${geocodeJSON.city}, ${geocodeJSON.country}`;
};
const myPlace = whereAmI();
// console.log(myPlace);
myPlace.then(res => console.log(res));

console.log(`async/await`);

// async/await is merely a syntactic sugar over .then() chaining of Promises
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

const get3Countries = async function (c1, c2, c3) {
  try {
    // const [data1] = await getJSON(`https://restcountries.com/v3.1/name/${c1}`);
    // const [data2] = await getJSON(`https://restcountries.com/v3.1/name/${c2}`);
    // const [data3] = await getJSON(`https://restcountries.com/v3.1/name/${c3}`);

    const data = await Promise.all([
      getJSON(`https://restcountries.com/v3.1/name/${c1}`),
      getJSON(`https://restcountries.com/v3.1/name/${c2}`),
      getJSON(`https://restcountries.com/v3.1/name/${c3}`),
    ]);

    console.log(data.map(d => d[0].capital));

    // console.log([data1.capital, data2.capital, data3.capital]);
  } catch (error) {
    console.error(error);
  }
};

const getJSON = function (url, errorMsg = 'Something went Horribly wrong') {
  return fetch(url).then(res => {
    if (!res.ok) throw new Error(`${errorMsg} (${res.status})`);
    return res.json();
  });
};

get3Countries('poland', 'france', 'italy');

// promise.race
// the first promise settled wins the race
// this includes the rejected ones
(async function () {
  const res = await Promise.race([
    getJSON(`https://restcountries.com/v3.1/name/italy`),
    getJSON(`https://restcountries.com/v3.1/name/spain`),
    getJSON(`https://restcountries.com/v3.1/name/portugal`),
  ]);
  console.log([res][0]);
})();

const timeout = function (seconds) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`request got rejected`));
    }, seconds * 1000);
  });
};

Promise.race([
  getJSON(`https://restcountries.com/v3.1/name/tanzania`),
  timeout(0.1),
])
  .then(res => console.log(res[0]))
  .catch(err => console.error(err));

// promise .allSettled
// only once all promises are settled
// .all() short-circuits when one is rejected
