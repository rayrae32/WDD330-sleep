import { loadHeaderFooter } from "./utils.mjs";
import { numberOfCartItems } from "./cartItems.js";

loadHeaderFooter(numberOfCartItems);

/*=========================
NEWSLETTER MODAL 
==========================*/
const form = document.getElementById("newsletter-form");
const dialog = document.getElementById("newsletter-dialog");
const thankYouMsg = document.getElementById("thank-you-message");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  // Simulate signup (e.g., save email)
  thankYouMsg.style.display = "block";

  // Optionally clear email input
  document.getElementById("email-input").value = "";

  // Auto-close after 2 seconds
  setTimeout(() => {
    dialog.close();
    thankYouMsg.style.display = "none";
  }, 2000);
});

window.closeNewsletterModal = function () {
  document.getElementById("newsletter-dialog").close();
  document.getElementById("thank-you-message").style.display = "none";
};
