const express = require('express');
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('task is sitting');
});

app.listen(port, () => {
  console.log(`task is sitting on port ${port}`);
});
