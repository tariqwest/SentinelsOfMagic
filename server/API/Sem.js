require('dotenv').config();
const key = process.env.SEM3_KEY;
const secret = process.env.SEM3_SECRET;
const sem3 = require('semantics3-node')(key, secret);

module.exports = {
  setUpc: (upcCode, callback) => {
    sem3.products.products_field('upc', upcCode); // set up UPC
      // 786162338006 - Smart Water
      // 181493000910 - shakerbottle
      // 323900038462 - Nyquil
      // 052800488267 - lotion
      // 012000161155 - lifewater

      // API request
    sem3.products.get_products(
      (err, response) => {
        if (err) {
          console.log(err);
          return;
        }
      
      response = JSON.parse(response);
      
      if (response.results_count === 0){
        callback.end('NO RESULTS')
      } else {
        var options = response.results[0].sitedetails; //array of objs
      var currentSite = response.results[0].sitedetails[0].url;
      var currentPrice = response.results[0].price;


          for (let i = 0; i < options.length; i++) {
            for (let j = 0; j < options[i].latestoffers.length; j++) {
              if (options[i].latestoffers[j].price === currentPrice && options[i].latestoffers[j].isactive === 1) {
                currentSite = options[i].url;
              }
            }
          }
          const result = {
            title: response.results[0].name,
            image: response.results[0].images[0],
            price: response.results[0].price,
            site: currentSite,
          };
          callback.json(result);
        }
      });
  },

};
