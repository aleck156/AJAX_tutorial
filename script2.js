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
  countriesContainer.style.opacity = 1;
};

// const request = fetch(`https://restcountries.com/v3.1/name/poland`);

// request.then(e => console.log(e));

const getCountryData = function (country) {
  fetch(`https://restcountries.com/v3.1/name/${country}`)
    .then(res => res.json())
    .then(data => {
      renderCountry(data[0]);
      const neighbours = data[0].borders;
      if (!neighbours) return;

      console.log(neighbours);

      // this is still a callback hell, needs to be restructured
      // neighbours.forEach(elem =>
      //   fetch(`https://restcountries.com/v3.1/alpha/${elem}`)
      //     .then(res => res.json())
      //     .then(([neighbourCountry]) =>
      //       console.log(
      //         `${neighbourCountry.flag} ${neighbourCountry.name.common}`
      //       )
      //     )
      // );

      const neighbour = data[0].borders[0];
      console.log(neighbour);

      return fetch(`https://restcountries.com/v3.1/alpha/${neighbour}`);
    })
    .then(res => res.json())
    .then(data => renderCountry(data[0], 'neighbour'));
};

getCountryData('poland');
