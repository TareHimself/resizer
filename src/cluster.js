const cors = require("cors");
const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const cors = require('cors');
const { getThumb } = require('./api');

app.use(cors());

app.get('/', async (req, res) => {
  res.send("HI");
});

app.get('/thumb/:size/*', async (req, res) => {
  try {
    const size = req.params.size;
    const url = req.params[0];

    res.contentType('image/png');
    res.send(await getThumb(size, url));
  } catch (error) {
    console.log(error)
    res.send(error.message)
  }

});

app.listen(process.argv.includes('debug') ? 3006 : 8080, async () => {
  console.log(`http://localhost:${process.argv.includes('debug') ? 3006 : 8080}/`);
});
