const axios = require('axios');

module.exports = {
  getFoodItem: (foodString) => {
    axios.get('https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/food/products/search', {
      params: {
        number: 10,
        offset: 0,
        query: 'snickers',
      },
      headers: { 'X-Mashape-Key': 'O6RCwy9tVvmshDcUvPVYufROm1DZp16qheXjsnseE4hVZ3ZAaC', 'Accept': 'application/json' }
    })
    .then(res => {
      console.log('GOT SOMETHING', res.data);
    })
    .catch(err => {
      console.log('Something went wrong: ', err);
    });
  },
};
