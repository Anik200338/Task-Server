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

    app.post('/AddProduct', async (req, res) => {
      const item = req.body;
      const result = await ProductCollection.insertOne(item);
      res.send(result);
    });

    app.get('/products', async (req, res) => {
      const {
        search,
        category,
        minPrice,
        maxPrice,
        brand,
        sort,
        page = 1,
        limit = 10,
      } = req.query;

      const query = {};

      // Filtering logic
      if (search) query.productName = { $regex: search, $options: 'i' };
      if (category) query.category = category;
      if (brand) query.brand = brand;
      if (minPrice)
        query.price = { ...query.price, $gte: parseFloat(minPrice) };
      if (maxPrice)
        query.price = { ...query.price, $lte: parseFloat(maxPrice) };

      let sortOption = {};
      if (sort === 'priceAsc') sortOption.price = 1;
      else if (sort === 'priceDesc') sortOption.price = -1;
      else if (sort === 'dateDesc') sortOption.postTime = -1;

      try {
        const productsCount = await ProductCollection.countDocuments(query);
        const products = await ProductCollection.find(query)
          .sort(sortOption)
          .skip((page - 1) * limit) // Skip the documents for previous pages
          .limit(parseInt(limit)) // Limit the number of documents returned
          .toArray();

        res.json({
          products,
          totalPages: Math.ceil(productsCount / limit),
          currentPage: parseInt(page),
        });
      } catch (error) {
        res.status(500).send('Error fetching products');
      }
    });
  } finally {
    // Ensure the client will close when you finish/error
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('task is sitting');
});

app.listen(port, () => {
  console.log(`task is sitting on port ${port}`);
});
