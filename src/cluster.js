const cors = require("cors");
const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const { getThumb } = require('./api');
const { getStoredImages } = require('./sqlite');
app.use(cors());

app.get('/', async (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get(/([0-9]+)x([0-9]+)\/(https:|http:)(\/\/|\/)(.*)/, async (req, res) => {
  try {
    const size = { width: parseInt(req.params[0]), height: parseInt(req.params[1]), toString: () => { return req.params[0] + 'x' + req.params[1] } };
    const url = req.params[2] + '//' + req.params[4];
    const generatedThumb = await getThumb(size, url);

    if (generatedThumb) {
      res.contentType('image/png');
      res.send(generatedThumb);
    }
    else {
      res.send('Invalid Url');
    }
  } catch (error) {
    console.log(error)
    res.send(error.message)
  }
});

app.listen(process.argv.includes('debug') ? 3006 : 8080, async () => {
  console.log(`http://localhost:${process.argv.includes('debug') ? 3006 : 8080}/`);
});
