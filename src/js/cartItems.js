import { getLocalStorage } from "./utils.mjs";

// This function updates the cart icon to show the number of items in the cart
export function numberOfCartItems() {
  const cartItems = getLocalStorage("so-cart");

  // Find the element that should display the cart count
  const cartCountElement = document.querySelector(".numOfCartItems");

  // If the element exists and cart has items, update its content
  if (cartCountElement && cartItems) {
    cartCountElement.innerHTML = cartItems.length;
  }
}

// Run the function only after the DOM is fully loaded
document.addEventListener("DOMContentLoaded", numberOfCartItems);
