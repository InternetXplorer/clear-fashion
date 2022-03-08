const { existsOne } = require('domutils');
const {MongoClient} = require('mongodb');
const MONGODB_URI = 'mongodb+srv://PaulM:pm2803@clearfashioncluster.fpthi.mongodb.net/clearfashion?retryWrites=true&writeConcern=majority';
const MONGODB_DB_NAME = 'clearfashion';


async function insert(collection, products_filename){
    const products = require(products_filename);
    console.log(products);
    
    const result = await collection.insertMany(products);

    console.log(result);
}

async function delete_all_docs(collection){
    const result = await collection.deleteMany({price: {$gte:0}});

    console.log(result);
}

async function brand_all_products(collection, brand){
    const products = await collection.find({brand}).toArray();
    console.log(`Products of brand ${brand} :`)
    console.log(products);
}

async function price_lte(collection, price){
    const products = await collection.find({price: {$lte:price}}).toArray();
    console.log(`Products which price is less than or equal to ${price} :`)
    console.log(products);
}

async function price_gte(collection, price){
    const products = await collection.find({price: {$gte:price}}).toArray();
    console.log(`Products which price is greater than or equal to ${price} :`)
    console.log(products);
}

async function sorted_by_price(collection, ascending){
    sort_param = -1;
    if(ascending){
        sort_param = 1
    }
    const products = await collection.find({}).sort({price: sort_param}).toArray();
    console.log(`All products sorted by price :`)
    console.log(products);
}

async function sorted_by_scraping_date(collection, ascending){
    sort_param = -1;
    if(ascending){
        sort_param = 1
    }
    const products = await collection.find({}).sort({scraping_datetime: sort_param}).toArray();
    console.log(`All products sorted by scraping date :`)
    console.log(products);
}

// async function scraping_date_lte(collection, date){
//     const products = await collection.find({scraping_date: {$lte:date}}).toArray();
//     console.log(`Products which scraping_date is less than or equal to ${date} :`)
//     console.log(products);
// }

// MAIN
async function main(){
    const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
    const db =  client.db(MONGODB_DB_NAME);
    const collection = db.collection('products');

    // const products_filename = "./products/_products.json";
    // await insert(collection, products_filename); // inserts products' info from the given json file

    // delete_all_docs(collection);

    // await brand_all_products(collection, 'montlimart');

    // await price_lte(collection, 40);
    // await price_gte(collection, 40);

    // await sorted_by_price(collection, true);

    // await sorted_by_scraping_date(collection, false);




    process.exit(0);
}

main()