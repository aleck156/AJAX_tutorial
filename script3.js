'use strict';

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

const getPosition = function () {
  return new Promise(function (resolve, reject) {
    // navigator.geolocation.getCurrentPosition(
    //   position => resolve(position),
    //   err => reject(err)
    // );
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

getPosition().then(res => {
  console.log(res);
});
