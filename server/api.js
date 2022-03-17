const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const db = require('./db')
// const {MongoClient,ObjectId} = require('mongodb');

const PORT = 8092;

const app = express();


app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());

app.options('*', cors());

app.get('/', (request, response) => {
  response.send({'ack': true});
});

app.listen(PORT);

console.log(`📡 Running on port ${PORT}`);


app.get('/products/name/:name', async (request, response) => {
  const name = request.params.name;
  const product = await db.find({'name': name});
  response.status(200).json(product);
});

app.get('/products/search', async (request, response) => {
  console.log(request.query)

  let limit = parseInt(request.query.limit);
  const brand = request.query.brand;
  const price = parseInt(request.query.price);

  if(!limit){
    limit = 12
  }
  let query = {};
  if(brand){
    query["brand"] = brand;
  }
  if(price){
    query["price"] = {$lte: price};
  }
  console.log("query :");
  console.log(query);
  const products = await db.find(query, limit, price);
  response.status(200).json(products);
});

app.get('/products/:id', async (request, response) => {
  const id = request.params.id;
  const product = await db.findbyid(id);
  // console.log(product);
  response.status(200).json(product);
});

module.exports = app;