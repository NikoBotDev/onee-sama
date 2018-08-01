const Oneesama = require('../index');
const parser = new Oneesama();
parser.get('1639629', [95, 97, 100]).then(data => {
    // You will also need to download the C++ version from here https://github.com/Francesco149/oppai-ng
    /*
    { version: 'For Victory',
      title: 'Upon My Honor',
      stars: 5.417534676043834,
      artist: 'Whispered',
      creator: 'Faputa',
      maxCombo: 3535,
      numCircles: 3535,
      numSliders: 8,
      numSpinners: 14,
      aimPp: 0,
      speedPp: 143.169681355677,
      accPp: 145.9120243677375,
      pp: 298.57186759157696,
      cs: 2,
      od: 6.3,
      ar: 10,
      hp: 3.7
    }
    */
   // eslint-disable-next-line no-console
	console.log(data);
});
