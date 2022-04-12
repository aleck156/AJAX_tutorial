'use strict';

const images = document.querySelector('.images');
const imgArr = ['img/img-1.jpg', 'img/img-2.jpg', 'img/img-3.jpg'];

/////////////////////////////////////////////

const createImage = async function (imgPath) {
  return new Promise(function (resolve, reject) {
    const newImage = document.createElement('img');
    newImage.src = imgPath;
    // newImage.style.display = 'block';

    newImage.addEventListener('error', function () {
      reject(new Error(`Image not found: ${imgPath}`));
    });
    newImage.addEventListener('load', () => {
      images.append(newImage);
      resolve(newImage);
    });
  });
};

// createImage('./img/img-1.jpg')
//   .then(res => {
//     return wait(2);
//   })
//   .then(() => {
//     newImage.style.display = 'none';
//     return wait(2);
//   })
//   .then(() => {
//     newImage.style.display = 'flex';
//     return createImage('./img/img-2.jpg');
//   })
//   .catch(err => console.error(`erorr: ${err}`));

const wait = function (seconds) {
  return new Promise((resolve, reject) => setTimeout(resolve, seconds * 1000));
};

const loadNPause = async function () {
  try {
    let img = await createImage(`./img/img-1.jpg`);
    console.log(img);
    await wait(2);
    img.style.display = 'none';

    img = await createImage(`./img/img-2.jpg`);
    console.log(img);
    await wait(2);
    img.style.display = 'none';

    img = await createImage(`./img/img-3.jpg`);
    console.log(img);
    await wait(2);
    img.style.display = 'none';
  } catch (error) {
    console.error(error);
  }
};

// loadNPause();

const loadAll = async function (imgArr) {
  try {
    const imgs = imgArr.map(async image => createImage(image));
    const imgsEl = await Promise.all(imgs);

    imgsEl.forEach(img => img.classList.add('parallel'));

    console.log(imgsEl);
  } catch (error) {
    console.error(error);
  }
};

loadAll(imgArr);

// const loadAll = async function (imgArr) {
//   console.log(imgArr);
//   const imgs = imgArr.map(img => loadNPause(img));

//   console.log(await Promise.all(imgs));
// };

// loadAll(imgArr);
