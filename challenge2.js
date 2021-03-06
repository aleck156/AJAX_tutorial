'use strict';

const images = document.querySelector('.images');
const newImage = document.createElement('img');

///////////////////////////////////////

const createImage = function (imgPath) {
  return new Promise(function (resolve, reject) {
    newImage.src = imgPath;

    newImage.addEventListener('error', function () {
      reject(new Error(`Image not found: ${imgPath}`));
    });
    newImage.addEventListener('load', () => {
      images.insertAdjacentElement('afterbegin', newImage);
    });

    return resolve(newImage);
  });
};

const wait = function (seconds) {
  return new Promise((resolve, reject) => setTimeout(resolve, seconds * 1000));
};

createImage('./img/img-1.jpg')
  .then(res => {
    return wait(2);
  })
  .then(() => {
    newImage.style.display = 'none';
    return wait(2);
  })
  .then(() => {
    newImage.style.display = 'flex';
    return createImage('./img/img-2.jpg');
  })
  .catch(err => console.error(`erorr: ${err}`));
