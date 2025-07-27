import { getLocalStorage } from "./utils.mjs";
function renderCartContents() {
  const wishlistItems = getLocalStorage("so-wishlist");

  if (!wishlistItems || wishlistItems.length === 0) {
    document.querySelector(".product-list").innerHTML = `
      <li class="wishlist-empty">
        <p>Your wishlist is empty</p>
        <p>Continue shopping <a href="../product_listing/index.html">here</a></p>
      </li>
    `;
    document.querySelector(".wishlist-total").innerHTML = "";
    return;
  }

  const htmlItems = wishlistItems.map((item, index) => cartItemTemplate(item, index));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");

  displayCartTotal(wishlistItems);
  setupEventListeners(); // **Ensure event listeners reattach after rerender**
};

function displayCartTotal(wishlistItems) {
  const total = wishlistItems.reduce(
    (sum, item) => sum + parseFloat(item.FinalPrice) * (item.quantity || 1),
    0
  );
  document.getElementById("wishlist-total-amount").textContent = total.toFixed(2);
}

function setupEventListeners() {
  document.querySelectorAll(".wishlist-card__quantity__down").forEach((button) => {
    button.removeEventListener("click", updateQuantityHandler);
    button.addEventListener("click", updateQuantityHandler);
  });

  document.querySelectorAll(".wishlist-card__quantity__up").forEach((button) => {
    button.removeEventListener("click", updateQuantityHandler);
    button.addEventListener("click", updateQuantityHandler);
  });

  document.querySelectorAll(".wishlist-card__remove").forEach((button) => {
    button.removeEventListener("click", removeItemHandler);
    button.addEventListener("click", removeItemHandler);
  });

  document.querySelectorAll(".wishlist-card__cart").forEach((button) => {
    button.removeEventListener("click", moveToCartHandler);
    button.addEventListener("click", moveToCartHandler);
  });
}


function updateQuantityHandler(event) {
  const index = parseInt(event.target.dataset.index, 10);
  let change;
  if (event.target.classList.contains("wishlist-card__quantity__up")) {
    change = 1; // Increase quantity
  } else {
    change = -1; // Decrease quantity
  }
  updateQuantity(index, change);
};

function updateQuantity(index, change) {
  const cartItems = getLocalStorage("so-wishlist");

  if (cartItems[index]) {
    cartItems[index].quantity = Math.max(1, (cartItems[index].quantity || 1) + change);
    localStorage.setItem("so-wishlist", JSON.stringify(cartItems));
    renderCartContents();
    setupEventListeners(); // **Ensure listeners reattach after updating quantity**
  }
}

function moveToCartHandler(event) {
  const index = parseInt(event.target.dataset.index, 10);
  moveToCart(index);
}

function moveToCart(index) {
  const wishlistItems = getLocalStorage("so-wishlist");
  const cartItems = getLocalStorage("so-cart") || [];
  const item = wishlistItems[index];

  // Check if item already in cart
  
  const existing = cartItems.find(cartItem => cartItem.Id === item.Id);
  if (existing) {
    existing.quantity += item.quantity || 1;
  } else {
    cartItems.push(item);
  }

  // Remove from wishlist

  wishlistItems.splice(index, 1);

  localStorage.setItem("so-cart", JSON.stringify(cartItems));
  localStorage.setItem("so-wishlist", JSON.stringify(wishlistItems));
  renderCartContents();
  setupEventListeners();
}

function removeItemHandler(event) {
  const index = parseInt(event.target.dataset.index, 10);
  removeFromCart(index);
};

function removeFromCart(index) {
  const cartItems = getLocalStorage("so-wishlist");
  cartItems.splice(index, 1);
  localStorage.setItem("so-wishlist", JSON.stringify(cartItems));
  renderCartContents();
  setupEventListeners(); // **Reattach listeners after item removal**
}

function cartItemTemplate(item, index) {
  const colorName = item.Colors && item.Colors.length > 0 ? item.Colors[0].ColorName : '';
  const newItem = `<li class="wishlist-card divider">
    <a href="#" class="wishlist-card__image">
      <img src="${item.Image}" alt="${item.Name}" />
    </a>
    <div class="wishlist-card__details">
      <a href="#">
        <h2 class="card__name">${item.Name}</h2>
      </a>
      <p class="wishlist-card__color">${colorName}</p>
      <p class="wishlist-card__quantity">qty: ${item.quantity || 1}</p>
      <div class="wishlist-card__quantity__buttons">
        <button class="wishlist-card__quantity__down" data-index="${index}">-</button>
        <button class="wishlist-card__quantity__up" data-index="${index}">+</button>
      </div>
      <p class="wishlist-card__price">$${item.FinalPrice}</p>
      <button class="wishlist-card__remove" data-index="${index}">Remove</button>
      <button class="wishlist-card__cart" data-index="${index}">Move to Cart</button>
    </div>
  </li>`;

  return newItem;
};

// Initialize the cart display when the page loads and set up event listeners
document.addEventListener("DOMContentLoaded", () => {
  renderCartContents();
  setupEventListeners();
});