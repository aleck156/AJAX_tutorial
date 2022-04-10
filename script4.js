'use strict';

const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////

const getPosition = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

const whereAmI = async function (country) {
  const pos = await getPosition();
  const res = await fetch(`https://restcountries.com/v3.1/name/${country}`);
  const [resJSON] = await res.json();
  console.log(resJSON);
  renderCountry(resJSON);
  /*
  this is exactly the same code underneath as ...

  fetch(`https://restcountries.com/v3.1/name/${country}`)
      .then(res => console.log(res));

  */
};
whereAmI('poland');

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
