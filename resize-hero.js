const sharp = require('sharp');
const fs = require('fs');

const SRC = 'imgs/food';
const OUT = 'imgs/food-sm';
fs.mkdirSync(OUT, { recursive: true });

(async () => {
  for (let i = 1; i <= 10; i++) {
    const name = `product-${String(i).padStart(2, '0')}.webp`;
    await sharp(`${SRC}/${name}`)
      .resize(320, 320)
      .webp({ quality: 80 })
      .toFile(`${OUT}/${name}`);
    console.log('done', name);
  }
})();