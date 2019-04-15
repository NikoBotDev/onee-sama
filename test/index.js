const Oneesama = require('../index');
const parser = new Oneesama({
	oppaiDir: './oppai.exe',
	shell: 'C:\\Program Files\\Git\\bin\\bash.exe'
});
parser
	.get('1736173', [
		96,
		97,
		98,
		99,
		99.1,
		99.2,
		99.3,
		99.4,
		99.5,
		99.6,
		99.7,
		100
	])
	.then(data => {
		// You will also need to download the C version from here https://github.com/Francesco149/oppai-ng
		console.log(data);
	});
