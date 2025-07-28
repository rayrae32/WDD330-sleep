import { renderListWithTemplate } from './utils.mjs';

function productCardTemplate(product) {
  console.log('Rendering product card for:', product);
  return `
    <li class="product-card">
      <a href="/product_pages/index.html?product=${product.Id}">
        <img src="${product.Images.PrimaryMedium}" alt="Image of ${product.Name}">
        <h3 class="card__brand">${product.Brand.Name}</h3>
        <h2 class="card__name">${product.NameWithoutBrand}</h2>
        <p class="product-card__price">$${product.ListPrice}</p>
      </a>
    </li>
  `;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    // Fetch product data
    const list = await this.dataSource.getData(this.category);
    // Render the product list
    this.renderList(list);
    document.querySelector(".title").textContent = this.category;
  }

  renderList(list) {
    // Use the reusable utility function to render the list
    renderListWithTemplate(productCardTemplate, this.listElement, list);
  }
}