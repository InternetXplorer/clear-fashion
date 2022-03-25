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

app.listen(PORT);

console.log(`📡 Running on port ${PORT}`);


async function structure_api_response(data, params, addMetaData=true){
  let res = {"success": true, data};
  if(addMetaData){
    res.data["meta"] = {}
    if(params.page){
      res.data.meta["currentPage"] = params.page;
    }
    else{
      res.data.meta["currentPage"] = 1;
    }
    const count = await db.countDocuments(build_query_from_params(params));
    res.data.meta["count"] = count;
    
    if(params.size){
      res.data.meta["pageSize"] = params.size;
      res.data.meta["pageCount"] = Math.ceil(count/params.size);
    }
    else{
      res.data.meta["pageSize"] = data.length;
      res.data.meta["pageCount"] = Math.ceil(count/data.length);
    }
  }
  
  return res
}

function build_query_from_params(params){
  let query = {};
  if(params.brand){
    query["brand"] = params.brand;
  }
  if(params.name){
    query["name"] = params.name;
  }
  if(params.price){
    if(params.sort && params.sort == "price-asc"){
      query["price"] = {$lte: params.price};
    }
    else if(params.sort && params.sort == "price-desc"){
      query["price"] = {$gte: params.price};
    }
    else{
      query["price"] = {$lte: params.price};
    }
  }
  return query;
}

function parse_types_params(params){
  if(params.size){
    params.size = parseInt(params.size);
  }
  if(params.limit){
    params.limit = parseInt(params.limit);
  }
  if(params.page){
    params.page = parseInt(params.page);
  }
  if(params.price){
    params.price = parseInt(params.price);
  }
  return params;
}

function keep_only_products_of_right_page(products, page, size){
  let index_start = (page-1)*size;
  console.log(index_start);
  console.log(index_start+size)
  // console.log(products);
  const new_prods = products.slice(index_start, index_start+size);

  // console.log(new_prods);
  return new_prods;
}


// endpoint principal qui renvoie une liste de produits. possibilité de demander un size different, de choisir la page, de filtrer par marque, de trier par prix asc ou desc, ou de specifier un prix min ou max (selon le sort)
app.get('/products', async (request, response) => {

  // let size = parseInt(request.query.size);
  // let page = parseInt(request.query.size);
  // const brand = request.query.brand;
  // const price = parseInt(request.query.price);
  let params = parse_types_params(request.query);
  console.log(params);
  const query = build_query_from_params(params);

  if(!params.size){
    params.size = 12
  }
  let price_sort_order = 1;
  if(params.sort && params.sort == "price-desc"){
    price_sort_order = -1;
  }

  let products = {"products": []};
  if(params.page && params.page > 1){
    products.products = await db.find(query, params.size*params.page, price_sort_order);
    products.products = keep_only_products_of_right_page(products.products, params.page, params.size)
  }
  else{
    products.products = await db.find(query, params.size, price_sort_order);
  }


  const res = await structure_api_response(products, params);
  response.status(200).json(res);
});

//recherche d'un produit par name
app.get('/products/name/:name', async (request, response) => {
  let params = parse_types_params(request.params);
  // const name = params.name;
  
  const query = build_query_from_params(params)
  console.log(params);
  // console.log(query)
  const product = {"product": await db.find(query)};
  const res = await structure_api_response(product, {}, false);
  response.status(200).json(res);
});


// app.get('/products/search', async (request, response) => { //   /!\ cet endpoint fait en fait la meme chose que l'endpoint principal /products/ donc je l'enleve il sert à rien de plus
//   console.log(request.query)
//   let params = parse_types_params(request.query);

//   if(!params.limit){
//     params.limit = 12
//   }
//   let query = build_query_from_params(params);
//   console.log("query :");
//   console.log(query);
//   const products = await db.find(query, params.limit);
//   response.status(200).json(products);
// });

//renvoie la liste des differentes marques presentent dans la BDD
app.get('/brandslist', async (request, response) => {
  const brands = {"brands": await db.distinct("brand")};
  const res = await structure_api_response(brands, {}, false);
  response.status(200).json(res);
});


// app.get('/products/:id', async (request, response) => { // je n'arrive toujours pas à faire de requete recherche par id malheureusement donc j'enleve cet endpoint
//   const id = request.params.id;
//   const product = await db.findbyid(id);
//   // console.log(product);
//   response.status(200).json(product);
// });

module.exports = app;