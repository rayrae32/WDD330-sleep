import { getLocalStorage, alertMessage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
    this.services = new ExternalServices();
  }

  init() {
    this.list = getLocalStorage(this.key) || [];
    this.calculateItemSubTotal();
    this.calculateOrderTotal();
    // this.displayOrderTotals();
  }

  calculateItemSubTotal() {
    // Calculate subtotal and item count
    this.itemTotal = this.list.reduce((sum, item) => sum + item.FinalPrice * item.quantity, 0);
    // Display subtotal
    document.querySelector(`${this.outputSelector} #summary-subtotal`).innerText = `$${this.itemTotal.toFixed(2)}`;
  }

  calculateOrderTotal() {
    this.calculateItemSubTotal();      // <-- Add this line
    // Calculate tax and shipping
    this.tax = this.itemTotal * 0.06;
    const itemCount = this.list.reduce((sum, item) => sum + item.quantity, 0);
    this.shipping = itemCount > 0 ? 10 + (itemCount - 1) * 2 : 0;
    this.orderTotal = this.itemTotal + this.tax + this.shipping;
    this.displayOrderTotals();
  }

  displayOrderTotals() {
    document.querySelector(`${this.outputSelector} #summary-subtotal`).innerText = `$${this.itemTotal.toFixed(2)}`;
    document.querySelector(`${this.outputSelector} #summary-tax`).innerText = `$${this.tax.toFixed(2)}`;
    document.querySelector(`${this.outputSelector} #summary-shipping`).innerText = `$${this.shipping.toFixed(2)}`;
    document.querySelector(`${this.outputSelector} #summary-total`).innerText = `$${this.orderTotal.toFixed(2)}`;
  }

  // Prepare items for order submission
  packageItems(items) {
    return items.map(item => ({
      id: item.Id,
      name: item.Name,
      price: item.FinalPrice,
      quantity: item.quantity
    }));
  }

  // Convert form data to JSON object
  formDataToJSON(form) {
    const data = new FormData(form);
    const obj = {};
    for (const [key, value] of data.entries()) {
      obj[key] = value;
    }
    return obj;
  }

  // Handle checkout
    async checkout(form) {
    const order = this.formDataToJSON(form);
  
    // Map form fields to required keys
    order.fname = order.firstName;
    order.lname = order.lastName;
    order.cardNumber = order.ccnum;
    if (order.exp) {
      const [year, month] = order.exp.split("-");
      order.expiration = `${parseInt(month, 10)}/${year.slice(-2)}`;
    }
    order.code = order.cvv;
  
    // Remove extra fields
    delete order.firstName;
    delete order.lastName;
    delete order.ccnum;
    delete order.exp;
    delete order.cvv;
  
    // Add order details
    order.orderDate = new Date().toISOString();
    order.items = this.packageItems(this.list);
    order.orderTotal = this.orderTotal.toFixed(2);
    order.shipping = this.shipping;
    order.tax = this.tax.toFixed(2);
  
    // Remove any extra fields not required by the server
    Object.keys(order).forEach(key => {
      if (!['orderDate','fname','lname','street','city','state','zip','cardNumber','expiration','code','items','orderTotal','shipping','tax'].includes(key)) {
        delete order[key];
      }
    });
  
    // Debug: log the order object
    console.log("Order to send:", order);
  
    try {
      const response = await this.services.checkout(order);
      // Success: clear cart and redirect
      localStorage.removeItem('so-cart');
      window.location.href = '/checkout/success.html';
      return response;
    } catch (err) {
      // Show error message from server
      if (err.name === 'servicesError' && err.message.message) {
        alertMessage(err.message.message);
      } else {
        alertMessage('An unexpected error occurred. Please try again.');
      }
    }
  }
}