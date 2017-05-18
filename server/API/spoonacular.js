const axios = require('axios');

module.exports = {
  getFoodItems: (foodString, res) => {
    axios.get('https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/food/products/search', {
      params: {
        number: 10,
        offset: 0,
        query: foodString,
      },
      headers: { 'X-Mashape-Key': 'O6RCwy9tVvmshDcUvPVYufROm1DZp16qheXjsnseE4hVZ3ZAaC', 'Accept': 'application/json' },
    })
    .then(result => {
      console.log('GOT SOMETHING', result.data);
      res.json(result.data.products);
    })
    .catch(error => {
      console.log('Something went wrong: ', error);
    });
  },
  getJokes: (res) => {
    axios.get('https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/food/jokes/random', {
      headers: { 'X-Mashape-Key': 'O6RCwy9tVvmshDcUvPVYufROm1DZp16qheXjsnseE4hVZ3ZAaC', 'Accept': 'application/json' },
    })
    .then(result => {
      res.json(result.data);
    })
  },
};
