# Oneesama

Promise wrapper for [oppai-ng](https://github.com/Francesco149/oppai-ng).

## Getting started

To install the package, just install it from this repository:

`npm i NikoBotDev/onee-sama`

## Testing 

Just clone this repository using:

`git clone https://github.com/NikoBotDev/onee-sama.git`

Then go to the folder using cmd and run the following:

`npm run test`

## Usage

### Get oppai data

```javascript
    const Oneesama = require('onee-sama');
    const parser = new Oneesama();

    parser.get('beatmapId').then(data => {
        console.log(data);
    }).catch(console.err);
    
```

## Contributing

1. Fork & clone the repository
2. Code your heart out!
3. Make a test just for sure.
4. [Submit a pull request](https://github.com/NikoBotDev/onee-sama/compare)

## License
This package is licensed under the MIT license (see the LICENSE file for more information). I have neither created or contributed to the development of oppai-ng, and this package is not affiliated with its developers in any way.

> GitHub [@EmptyException](https://github.com/NikoBotDev)