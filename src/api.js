const axios = require('axios');
const sharp = require('sharp');

const { storeImage, getStoredImage } = require('./sqlite');

async function generateThumb(size, url) {
	const [widthAsString, heightAsString] = size.split('x');
	const imageResponse = await axios.get(url, { responseType: 'arraybuffer' });
	const buffer = Buffer.from(imageResponse.data);
	const result = await sharp(buffer)
		.resize({
			width: parseInt(widthAsString),
			height: parseInt(heightAsString),
		})
		.png()
		.toBuffer()
	//storeImage(url, result);
	return result;
}

async function getThumb(size, url) {
	const storedThumb = getStoredImage(size + '|' + url);
	if (storedThumb) return storedThumb;
	return generateThumb(size, url);
}

module.exports = {
	getThumb
}