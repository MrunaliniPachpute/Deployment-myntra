const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require("dotenv");

dotenv.config();
const { getStoredItems, storeItems } = require('./data/items');

const app = express();
const cors = require('cors');


const allowedOrigins = ['https://react-frontend-zeta-blue.vercel.app'];


app.use(bodyParser.json());
app.use(cors());

// CORS middleware configuration
const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true); // Allow requests from the allowed origins
    } else {
      callback(new Error('Not allowed by CORS')); // Block requests from non-allowed origins
    }
  },
  methods: ['GET', 'POST'], // Allowed methods
  allowedHeaders: ['Content-Type'], // Allowed headers
};

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// app.get('/', (req, res) =>{
//   res.send('Welcome')
// })

app.get('/items', async (req, res) => {
  const storedItems = await getStoredItems();
   await new Promise((resolve, reject) => setTimeout(() => resolve(), 2000));
  res.json({ items: storedItems });
});

app.get('/items/:id', async (req, res) => {
  const storedItems = await getStoredItems();
  const item = storedItems.find((item) => item.id === req.params.id);
  res.json({ item });
});

app.post('/items', async (req, res) => {
  const existingItems = await getStoredItems();
  const itemData = req.body;
  const newItem = {
    ...itemData,
    id: Math.random().toString(),
  };
  const updatedItems = [newItem, ...existingItems];
  await storeItems(updatedItems);
  res.status(201).json({ message: 'Stored new item.', item: newItem });
});



const port = process.env.PORT || 8080;
app.listen(port, ()=>console.log(`port started at: ${port}`));
