/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./sources/dedicatedbrand');
const montlimart_product_scraping = require('./sources/montlimart_product_scraping');
const adresse_product_scraping = require('./sources/adresse_product_scraping');
const fs = require('fs');

async function sandbox (eshop = 'https://www.dedicatedbrand.com/en/men/news') {
  try {
    console.log(`🕵️‍♀️  browsing ${eshop} source`);

    const match = eshop.match(/([a-z]*)\.(com|paris)/)
    var brand = match[1]

    var products = null;
    if(brand == "dedicatedbrand"){
      products = await dedicatedbrand.scrape(eshop);
    }
    else if(brand == "montlimart"){
      products = await montlimart_product_scraping.scrape(eshop);
    }
    else if(brand == "adresse"){
      products = await adresse_product_scraping.scrape(eshop);
    }


    var string_parsed_products = JSON.stringify(products, null, 1);
    fs.writeFileSync(`${brand}_products.json`, string_parsed_products, error => {
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

const [,, eshop] = process.argv;

sandbox(eshop);
