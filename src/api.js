const axios = require('axios');
const sharp = require('sharp');

const { storeImage, getStoredImage } = require('./sqlite');

async function generateThumb(size, url) {
	try {
		const imageResponse = await axios.get(url, { responseType: 'arraybuffer' });
		const buffer = Buffer.from(imageResponse.data);
		const result = await sharp(buffer)
			.resize({
				width: size.width,
				height: size.height,
			})
			.png()
			.toBuffer()
		storeImage(url, result);
		return result;
	} catch (error) {
		null
	}

}

async function getThumb(size, url) {
	const storedThumb = getStoredImage(size.toString() + '|' + url);
	if (storedThumb) return storedThumb;
	return generateThumb(size, url);
}

module.exports = {
	getThumb
}