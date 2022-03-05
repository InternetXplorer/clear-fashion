const fetch = require('node-fetch');
const cheerio = require('cheerio');


/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parse = data => {
  const $ = cheerio.load(data);

  return $('.product-info')
    .map((i, element) => {
      const name = $(element)
        .find('.product-name')
        .text()
        // .attr("title")
        .trim()
        .replace(/\s/g, ' ');

      const price = parseInt(
        $(element)
          .find('.price')
          .text()
      );
      
      // const match = $(element).find('.product-name')
      // console.log(match)
      
      return {name, price};
    })
    .get();
};


/**
 * Scrape all the products for a given url page
 * @param  {[type]}  url
 * @return {Array|null}
 */
module.exports.scrape = async url => {
  try {
    const response = await fetch(url);

    if (response.ok) {
      const body = await response.text();
      var parsed_products = parse(body);
      var string_parsed_products = JSON.stringify(parsed_products, null, 1);
      // console.log(string_parsed_products);
      
      // fs.writeFileSync("montlimart_products.json", string_parsed_products, error => {
      //   if(error) throw error
      //   console.log("Write complete");
      // });

      return parsed_products;
    }

    console.error(response);

    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};
