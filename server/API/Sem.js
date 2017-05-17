require('dotenv').config();
var key = process.env.SEM3_KEY;
var secret = process.env.SEM3_SECRET;
var sem3 = require('semantics3-node')(key, secret);

sem3.products.products_field('upc', '323900038462');

sem3.products.get_products(
  (err, res) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(JSON.parse(res));
  }
);

