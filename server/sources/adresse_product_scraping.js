const fetch = require('node-fetch');
const cheerio = require('cheerio');


/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parse = data => {
  const $ = cheerio.load(data);

  return $('.right-block')
    .map((i, element) => {
      const name = $(element)
        .find('.product-name')
        .text()
        .trim()
        .replace(/\s/g, ' ')
        .replace(/\s\s+/g, ';')
        .split(";")[0];

      const price = parseInt(
        $(element)
          .find('.product-price')
          .text()
      );
      
      const brand = "adresse"
      var scraping_dateTime = new Date();
      // var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
      // var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      // var scraping_dateTime = date+' '+time;
      return {brand, name, price, scraping_dateTime};
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

      return parsed_products;
    }

    console.error(response);

    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};
