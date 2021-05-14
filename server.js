const express = require('express')
const redis = require('redis');
const bodyParser = require('body-parser');
require('dotenv').config();

const port = 3000;
const app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
const client = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT
});

client.on('error', (err) => {
  console.log("Error " + err)
});


app.get('/', (req, res) => {
  res.send('<h1>Hello World</h1><br><h1>LTQUAN</h1>');
})

app.post('/post', (req, res) => {
  let { post } = req.body;
  if (post) {
    let { key, data } = post;
    if (!key) return res.status(400).json({ msg: "Key is required" });
    if (!data) return res.status(400).json({ msg: "Data is required" });
    let jobs = [];
    client.setex(key, 3600, JSON.stringify(data));
    return res.json(data);
  }
});

app.get('/post/:key', (req, res) => {
  client.get(req.params.key, (error, data) => {
    if (error) res.status(400).send(err);
    if (data !== null) res.status(200).send(JSON.parse(data));
    else res.status(204).send();
  });
});

app.listen(port, () => {
  console.log(`Server is running on port: ${process.env.PORT || 3000}`)
})