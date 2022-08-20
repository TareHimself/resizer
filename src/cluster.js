const cors = require("cors");
const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const { getThumb } = require('./api');


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

app.listen(3006, async () => {
  console.log(`http://localhost:${3006}/`);
});
