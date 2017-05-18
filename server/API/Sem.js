require('dotenv').config();
var key = process.env.SEM3_KEY;
var secret = process.env.SEM3_SECRET;
var sem3 = require('semantics3-node')(key, secret);


sem3.products.products_field('upc', '012000161155');
// 786162338006 - Smart Water
// 181493000910 - shakerbottle
// 323900038462 - Nyquil
// 052800488267 - lotion
// 012000161155 - lifewater

sem3.products.get_products(
  (err, res) => {
    if (err) {
      console.log(err);
      return;
    }
    res = JSON.parse(res);
    var options = res.results[0].sitedetails; //array of objs
    var currentSite = res.results[0].sitedetails[0].url;
    var currentPrice = res.results[0].price;

    for (var i = 0; i < options.length; i++){
      for (var j = 0; j < options[i].latestoffers.length; j++){
        if (options[i].latestoffers[j].price === currentPrice && options[i].latestoffers[j].isactive === 1){
          currentSite = options[i].url;
        }
      }
    }

    var result = {
      title: res.results[0].name,
      image: res.results[0].images[0],
      price: res.results[0].price,
      site: currentSite,
    }

    console.log(result)
  }
);


