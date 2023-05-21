import cors from 'cors';
import express from 'express';
import path from 'path';
import { IResizeInfo } from './types';
import axios from 'axios';
import sharp from 'sharp';
import { tCacheImage, getStoredImage } from './sqlite';

async function resizeUrl(size: IResizeInfo, url: string) {
	try {
		const imageResponse = await axios.get<ArrayBuffer>(url, {
			responseType: 'arraybuffer',
		});
		const buffer = Buffer.from(imageResponse.data);
		const result = await sharp(buffer)
			.resize({
				width: size.width,
				height: size.height,
			})
			.png()
			.toBuffer();
		tCacheImage({
			id: size.toString() + '|' + url,
			data: result,
		});
		return result;
	} catch (error) {
		null;
	}
}

async function getResized(size: IResizeInfo, url: string) {
	const storedThumb = getStoredImage(size.toString() + '|' + url);
	if (storedThumb) return storedThumb;
	return resizeUrl(size, url);
}

const app = express();

app.use(cors());

app.get('/', async (req, res) => {
	res.sendFile(path.join(__dirname, 'index.html'));
});

app.get(/([0-9]+)x([0-9]+)\/(https:|http:)(\/\/|\/)(.*)/, async (req, res) => {
	try {
		const size: IResizeInfo = {
			width: parseInt(req.params[0]),
			height: parseInt(req.params[1]),
			toString: () => {
				return req.params[0] + 'x' + req.params[1];
			},
		};

		const url = req.params[2] + '//' + req.params[4];
		const generatedThumb = await getResized(size, url);

		if (generatedThumb) {
			res.contentType('image/png');
			res.send(generatedThumb);
		} else {
			res.sendStatus(404);
		}
	} catch (error) {
		console.log(error);
		res.send(error.message);
	}
});

app.listen(process.argv.includes('debug') ? 3006 : 8090, async () => {
	console.log(
		`http://localhost:${process.argv.includes('debug') ? 3006 : 8090}/`
	);
});
