const express = require('express');
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

// middleware
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
      'https://assignment-12-2d5b0.web.app',
      'https://assignment-12-2d5b0.firebaseapp.com',
    ],
  })
);
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.scvnlgi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const ProductCollection = client.db('ProductDb').collection('Products');

    ProductCollection.createIndex({ productName: 1, category: 1, email: 1 })
      .then(() => console.log('Index created on name field'))
      .catch(err => console.error('Failed to create index:', err));
  } finally {
    // Ensure the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('task is sitting');
});

app.listen(port, () => {
  console.log(`task is sitting on port ${port}`);
});
