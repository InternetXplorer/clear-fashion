/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./sites/dedicatedbrand_product_scraping');
const montlimart_product_scraping = require('./sites/montlimart_product_scraping');
const adresse_product_scraping = require('./sites/adresse_product_scraping');
const loom_product_scraping = require('./sites/prof_loom');
const fs = require('fs');

async function sandbox (eshop = 'https://www.dedicatedbrand.com/en/men/news') {
  try {
    console.log(`🕵️‍♀️  browsing ${eshop} source`);

    const match = eshop.match(/([a-z]*)\.(com|paris)/);
    let brand = match[1];

    let products = null;
    if(brand == "dedicatedbrand"){
      products = await dedicatedbrand.scrape(eshop);
    }
    else if(brand == "montlimart"){
      products = await montlimart_product_scraping.scrape(eshop);
    }
    else if(brand == "adresse"){
      products = await adresse_product_scraping.scrape(eshop);
    }
    else if(brand == "loom"){
      products = await loom_product_scraping.scrape(eshop);
    }

    products = removeProductsMissingData(products);

    let string_parsed_products = JSON.stringify(products, null, 1);
    fs.writeFileSync(`products/${brand}_products.json`, string_parsed_products, error => {
      if(error) throw error
      console.log("Write complete");
    });

    console.log(products);
    console.log('done');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

function removeProductsMissingData(products){
  for(i in products){
    if(products[i].name.replace(/\s/g, '') === "" || products[i].name === "undefined" || products[i].name == null || products[i].price == NaN){
      console.log("Detected missing data in :");
      console.log(products[i]);
      console.log("Product is deleted.\n");
      products.splice(i, 1);
    }
  }
  return products;
}

const [,, eshop] = process.argv;

sandbox(eshop);
