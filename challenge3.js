'use strict';

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

const loadNPause = async function () {};
