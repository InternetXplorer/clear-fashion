// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

// current products on the page
let currentProducts = [];
let currentPagination = {};

// instantiate the selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const selectBrand = document.querySelector('#brand-select');
const selectSort = document.querySelector('#sort-select')
const sectionProducts = document.querySelector('#products');
const spanNbProducts = document.querySelector('#nbProducts');

const api_domain = "https://server-sooty-six.vercel.app";
// const api_domain = "http://localhost:8092";

/**
 * Set global value
 * @param {Array} products - products to display
 * @param {Object} meta - pagination meta info
 */
const setCurrentProducts = ({products, meta}) => {
  currentProducts = products;
  currentPagination = meta;
};

/**
 * Fetch products from api
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {Number}  [size=12] - size of the page
 * @return {Object}
 */
const fetchProducts = async (page = 1, size = 12, brand=null, sort=null) => {
  try {
    let url = `${api_domain}/products?size=${size}&page=${page}`;
    if(brand && brand != ""){
      url = url + "&brand=" + brand;
    }
    if(sort && sort != ""){
      url = url + "&sort=" + sort;
    }
    const response = await fetch(
      url
    );
    const body = await response.json();
    // console.log("body :")
    // console.log(body);

    if (body.success !== true) {
      console.error(body);
      return {currentProducts, currentPagination};
    }
    // console.log("body.data :");
    // console.log(body.data);
    return body.data;
  } catch (error) {
    console.error(error);
    return {currentProducts, currentPagination};
  }
};

const getBrandsList = async () => {
  try {
    const response = await fetch(
      `${api_domain}/brandslist`
    );
    const body = await response.json();
    // console.log(body);
    if (body.success !== true) {
      console.error(body);
      return {currentProducts, currentPagination};
    }
    // console.log("body.data :");
    // console.log(body.data);
    return body.data.brands;
  } catch (error) {
    console.error(error);
    return {currentProducts, currentPagination};
  }
};

/**
 * Render list of products
 * @param  {Array} products
 */
const renderProducts = products => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  const template = products
    // .map(product => {
    //   return `
    //   <div class="product" id=${product.uuid}>
    //     <span>${product.brand}</span>
    //     <a href="${product.link}">${product.name}</a>
    //     <span>${product.price}</span>
    //   </div>
    // `;
    // })
    // .join('');
    .map(product => {
      // console.log(product)
      return `
      <div class="product" id=${product._id}>
        <div class="product-image">
          <img src="${product.image_link}">
        </div>
        <div class="product-info">
          <span class="brand">${product.brand}</span>
          <a class="name" href="${product.product_link}"><span>${product.name}</span></a>
          <span class="price">${product.price} €</span>
        </div>
      </div>
    `;
    })
    .join('');


  div.innerHTML = template;
  fragment.appendChild(div);
  sectionProducts.innerHTML = '<h2>Products</h2>';
  sectionProducts.appendChild(fragment);
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderPagination = pagination => {
  const {currentPage, pageCount} = pagination;
  const options = Array.from(
    {'length': pageCount},
    (value, index) => `<option value="${index + 1}">${index + 1}</option>`
  ).join('');

  selectPage.innerHTML = options;
  selectPage.selectedIndex = currentPage - 1;
};

// async function countNbrNewProducts(){
//   const products = await fetchProducts(1, currentPagination.count);
  

// }

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderIndicators = pagination => {
  const {count} = pagination;
  

  spanNbProducts.innerHTML = count;
};

const render = (products, pagination) => {
  renderProducts(products);
  renderPagination(pagination);
  renderIndicators(pagination);
  console.log(currentPagination);
};

async function setBrandSelector() {
  const brand_names = await getBrandsList();

  for(const k in brand_names){
    selectBrand.options.add(new Option(brand_names[k], brand_names[k]))
  }
}


/**
 * Declaration of all Listeners
 */

 document.addEventListener('DOMContentLoaded', async () => {
  const products = await fetchProducts();
  // console.log("prods :");
  // console.log(products);
  setCurrentProducts(products);
  setBrandSelector()

  render(currentProducts, currentPagination);
});


/**
 * Select the number of products to display
 */
selectShow.addEventListener('change', async (event) => {
  const products = await fetchProducts(currentPagination.currentPage, parseInt(event.target.value), brand, sort);

  // a faire : regler le bug bizarre de pagination quand on change de show size.
  setCurrentProducts(products);
  // console.log("prods selectshow:");
  // console.log(products);
  render(currentProducts, currentPagination);
});


let brand = ""
selectBrand.addEventListener('change', async (event) => {
  brand = event.target.value;
  const products = await fetchProducts(1, currentPagination.pageSize, event.target.value, sort);
  // console.log(products);
  // var selectedBrandProducts = {result:[], meta: products.meta};
  // console.log(selectedBrandProducts);


  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

selectPage.addEventListener('change', async (event) => {
  const products = await fetchProducts(parseInt(event.target.value), currentPagination.pageSize, brand, sort);
  console.log("change page:")
  console.log(selectBrand.selectedOption);
  setCurrentProducts(products);

  // console.log("prods selectpage:");
  // console.log(products);
  render(currentProducts, currentPagination);
});

let sort = ""
selectSort.addEventListener('change', async (event) => {
  sort = event.target.value;
  console.log(sort);
  const products = await fetchProducts(1, currentPagination.pageSize, brand, sort);
  // console.log(products);
  // var selectedBrandProducts = {result:[], meta: products.meta};
  // console.log(selectedBrandProducts);


  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});