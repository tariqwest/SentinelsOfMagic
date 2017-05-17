var api_key = 'SEM3942C3257593610034912C7C90584FACC';
var api_secret = '';
var sem3 = require('semantics3-node')(api_key,api_secret);

sem3.products.products_field('upc', '323900038462')

sem3.products.get_products(
  (err, res) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(JSON.parse(res))
  }
)


console.log('hello');
