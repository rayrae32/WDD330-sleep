const baseURL = import.meta.env.VITE_SERVER_URL

async function convertToJson(res) {
  const jsonResponse = await res.json();
  if (res.ok) {
    return jsonResponse;
  } else {
    throw { name: 'servicesError', message: jsonResponse };
  }
}

export default class ExternalServices {
  constructor(category) {
    this.category = category;
    this.path = `/json/${this.category}.json`;
  }
    async getData(category) {
    // If no category, fetch all products
    let url;
    if (category) {
      url = `${baseURL}products/search/${category}`;
    } else {
      url = `${baseURL}products/search/tents`;
    }
    const response = await fetch(url);
    const data = await convertToJson(response);
    return data.Result;
  }
    async findProductById(id) {
    const products = await this.getData();
    // If products is an array of arrays, flatten it first:
    const flatProducts = products.flat ? products.flat(Infinity) : products;
    const product = flatProducts.find(item => item.Id === id);
    return product || null;
  }

  async checkout(order) {
    const url = `${baseURL}checkout`;
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(order)
    };
    const response = await fetch(url, options);
    return convertToJson(response);
  }
}
