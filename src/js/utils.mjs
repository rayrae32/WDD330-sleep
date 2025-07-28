export function getLocalStorage(key) {
  const data = localStorage.getItem(key);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch (error) {
    console.error("Error parsing localStorage data:", error);
    return [];
  }
}

export function setLocalStorage(key, data) {
  // data should be the full array, not a single item
  localStorage.setItem(key, JSON.stringify(data));
}

export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

export function renderListWithTemplate(templateFn, parentElement, list, position = 'afterbegin', clear = false) {
  if (!parentElement) {
    console.error("Parent element is null or undefined");
    return;
  }
  if (clear) parentElement.innerHTML = '';
  const htmlStrings = list.map(templateFn);
  parentElement.insertAdjacentHTML(position, htmlStrings.join(''));
}

// This function puts some HTML (the template) into a part of the page (parentElement)
// If there's a callback function, it runs that too after rendering
export function renderWithTemplate(template, parentElement, data, callback) {
  if (!parentElement) {
    console.error("Parent element is null or undefined");
    return;
  }

  // Put the HTML into the page
  parentElement.innerHTML = template;

  // If a callback is given, run it
  if (callback) {
    callback(data);
  }
}

// This function loads an HTML file from the given path
// and returns it as a string
export async function loadTemplate(path) {
  const response = await fetch(path);     // get the file
  const template = await response.text(); // turn it into text
  return template;                        // send it back
}

// This function loads the header and footer templates
// and puts them into the right spots in the page
export async function loadHeaderFooter(callback) {
  // Load the HTML from the partials folder
  const headerTemplate = await loadTemplate('/partials/header.html');
  const footerTemplate = await loadTemplate('/partials/footer.html');

  // Find where to put the header and footer in the page
  const headerElement = document.querySelector('#main-header');
  const footerElement = document.querySelector('#main-footer');

  // Add the templates to the page
  renderWithTemplate(headerTemplate, headerElement);
  renderWithTemplate(footerTemplate, footerElement);

  
  //Run callback AFTER header and footer are inserted
  if (callback) {
    callback();
  }
}

export function alertMessage(message, scroll = true) {
  const alert = document.createElement('div');
  alert.classList.add('alert');
  alert.innerHTML = `
    <span>${message}</span>
    <button class="alert-close" aria-label="Close">&times;</button>
  `;
  alert.querySelector('.alert-close').addEventListener('click', function() {
    alert.remove();
  });
  const main = document.querySelector('main');
  main.prepend(alert);
  if (scroll) window.scrollTo(0, 0);
}