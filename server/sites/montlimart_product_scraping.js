const fetch = require('node-fetch');
const cheerio = require('cheerio');


/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parse = data => {
  const $ = cheerio.load(data);

  return $('.item')
    .map((i, element) => {
      let name = $(element)
        .find('.product-name')
        .text()
        // .attr("title")
        .trim()
        .replace(/\s/g, ' ');
      
      const color = $(element)
        .find('.product-info span')
        .text()
        .trim()
        .replace(/\s/g, ' ')
        .replace(/\s\s+/g, ';')
        .split(";")[0];
      
      const price = parseInt(
        $(element)
          .find('.price')
          .text()
      );

      const product_link = $(element).find('.product-name a').attr('href');

      const image_link = $(element).find('.product-image img').attr('src');

      name = name + ' ' + color
      const brand = "montlimart"
      let scraping_dateTime = new Date();
      // var today_isostring = today.toISOString();
      // var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
      // var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      // var scraping_dateTime = date+' '+time;
      return {brand, name, price, product_link,image_link, scraping_dateTime};
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
      let parsed_products = parse(body);
      let string_parsed_products = JSON.stringify(parsed_products, null, 1);

      return parsed_products;
    }

    console.error(response);

    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};
