require('dotenv').config();
const axios = require('axios');

module.exports = {
  getFoodItems: (foodString, res) => {
    axios.get('https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/food/products/search', {
      params: {
        number: 10,
        offset: 0,
        query: foodString,
      },
      headers: { 'X-Mashape-Key': process.env.SPOON_KEY, 'Accept': 'application/json' },
    })
    .then(result => {
      console.log('GOT SOMETHING', result.data);
      const gcseurl = `https://www.googleapis.com/customsearch/v1?key=${process.env.GCSE_API_KEY}&cx=${process.env.GCSE_ID}&searchType=image&imgType=photo&num=1&q=${foodString}`
      const spoonUrlArray = result.data.products;

      axios.get(gcseurl).then(result => {
        console.log('result = ', result);
        console.log('foodString = ', foodString);
        spoonUrlArray.unshift({ title: foodString, image: result.data.items[0]['link'] });
        console.log('spoonUrlArray = ', spoonUrlArray);

        res.json(spoonUrlArray);
      });
      // {title: foodString, imgURL: GoogleIMGURL}
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
    });
  },
};
