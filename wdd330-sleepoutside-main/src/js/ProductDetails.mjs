import { setLocalStorage, getLocalStorage } from './utils.mjs';
import { numberOfCartItems } from './cartItems.js';

const baseURL = import.meta.env.VITE_SERVER_URL
const addToCartButton = document.getElementById('addToCart');

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    await new Promise(resolve => {
      if (document.readyState === 'complete' || document.readyState === 'interactive') {
        resolve();
      } else {
        document.addEventListener('DOMContentLoaded', resolve, { once: true });
      }
    });

    console.log('Initializing ProductDetails for productId:', this.productId);

    try {
      this.product = await this.dataSource.findProductById(this.productId);
      if (!this.product) {
        console.error('Product not found for ID:', this.productId);
        return;
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      return;
    }

    if (addToCartButton) {
      addToCartButton.addEventListener('click', this.addProductToCart.bind(this));
      console.log('Event listener attached to Add to Cart button');
    } else {
      console.error('Add to Cart button not found in the DOM');
    }

    // Add this for the wishlist button
    const addToWishlistButton = document.getElementById('addToWishlist');
    if (addToWishlistButton) {
      addToWishlistButton.addEventListener('click', this.addProductToWishlist.bind(this));
    }

    this.renderProductDetails();

  }

  addProductToCart() {
    console.log("this.product is array?", Array.isArray(this.product), this.product);
    if (!this.product || !this.product.Id) return;
  
    let cart = getLocalStorage('so-cart') || [];
    const existing = cart.find(item => item.Id === this.product.Id);
    if (existing) {
      existing.quantity += 1;
    } else {
      // Map to cart structure (not an array!)
      cart.push({
        Id: this.product.Id,
        Name: this.product.Name,
        Image: this.product.Images?.PrimaryLarge || '',
        Colors: this.product.Colors || [],
        FinalPrice: this.product.FinalPrice || this.product.ListPrice || 0,
        quantity: 1
      });
    }
    console.log("Cart before saving:", cart);
    setLocalStorage('so-cart', cart);
    numberOfCartItems();
    alert('Item added to cart!');
  }

  addProductToWishlist() {
    console.log("this.product is array?", Array.isArray(this.product), this.product);
    if (!this.product || !this.product.Id) return;
  
    let wishlist = getLocalStorage('so-wishlist') || [];
    const existing = wishlist.find(item => item.Id === this.product.Id);
    if (existing) {
      existing.quantity += 1;
    } else {
      // Map to cart structure (not an array!)
      wishlist.push({
        Id: this.product.Id,
        Name: this.product.Name,
        Image: this.product.Images?.PrimaryLarge || '',
        Colors: this.product.Colors || [],
        FinalPrice: this.product.FinalPrice || this.product.ListPrice || 0,
        quantity: 1
      });
    }
    console.log("Wishlist before saving:", wishlist);
    setLocalStorage('so-wishlist', wishlist);
    alert('Item added to wishlist!');
  }

  renderProductDetails() {
      document.querySelector('#card__brand').textContent = this.product.Brand?.Name || '';
      document.querySelector('#card__name').textContent = this.product.NameWithoutBrand || '';
      document.querySelector('#product-detail-img').src = this.product.Images?.PrimaryLarge || '';
      document.querySelector('#product-detail-img').alt = this.product.Name || '';
      document.querySelector('#product-card__price').textContent = `$${this.product.ListPrice || '0.00'}`;
      document.querySelector('#product__color').textContent = this.product.Colors?.[0]?.ColorName || '';
      document.querySelector('#product__description').textContent = this.product.DescriptionHtmlSimple?.replace(/<[^>]+>/g, '') || '';

    if (nameElement) nameElement.textContent = this.product.Name || 'Unknown Product';
    if (imageElement) imageElement.src = this.product.Images.PrimaryLarge || '';
    if (priceElement) priceElement.textContent = `$${this.product.ListPrice || '0.00'}`;
    if (descriptionElement) {
      // Strip HTML tags and set plain text
      const plainText = this.product.DescriptionHtmlSimple.replace(/<[^>]+>/g, '');
      descriptionElement.textContent = plainText || 'No description available';
    }
    if (colorElement) colorElement.textContent = this.product.Colors?.[0]?.ColorName || '';
  }
}