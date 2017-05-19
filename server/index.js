require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const db = require('../database/index.js');
const request = require('request');
const pgp = require('pg-promise')();
const path = require('path');
const cookieParser = require('cookie-parser');
const utils = require('./lib/inventoryUtils.js');

const assignCookie = require('./middleware/assignCookie');
const checkAuth = require('./middleware/authorizedRequest.js');

// APIs
const upc = require('./API/Sem.js');
const spoon = require('./API/spoonacular.js');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(assignCookie);
app.use(express.static(__dirname + '/../client/dist'));

// routes
const routeHandlers = require('./lib/route-handlers');
const authRoutes = require('./lib/auth.js');
app.use('/auth', authRoutes);

app.post('/inventory', (req, res) => {
  db.query('SELECT houses_items.id AS id, houses_items.need_to_restock AS needToRestock, houses_items.image AS image, houses_items.price AS price, houses_items.url AS url, users.username AS username, users.id AS userid, items.itemname AS name FROM houses_items LEFT JOIN users ON houses_items.user_id = users.id LEFT JOIN items ON houses_items.item_id = items.id WHERE houses_items.house_id = ${houseId#};',
    { houseId: req.body.houseId })
    .then(data => {
      console.log(`Successful HOUSES_ITEMS table query for houseId = ${req.body.houseId}`);
      res.send(data);
    })
    .catch(err => console.log(`Bad HOUSES_ITEMS table query for houseId = ${req.body.houseId}: `, err));
});

app.post('/housename', (req, res) => {
  db.query('SELECT housename FROM houses WHERE id = ${houseId#}', { houseId: req.body.houseId })
    .then(data => {
      console.log(`Successful HOUSES table query for houseId = ${req.body.houseId}`);
      res.send(data[0]);
    })
    .catch(err => console.log(`Bad HOUSES table query for houseId = ${req.body.houseId}: `, err));
});

app.post('/username', (req, res) => {
  db.query('SELECT username FROM users WHERE id = ${userId#}', { userId: req.body.userId })
    .then(data => {
      console.log(`Successful USERS table query for userId = ${req.body.userId}`);
      res.send(data[0]);
    })
    .catch(err => console.log(`Bad USERS table query for userId = ${req.body.userId}: `, err));
});

app.post('/restock', (req, res) => {
  db.query('UPDATE houses_items SET need_to_restock = TRUE WHERE id = ${itemId#}',
    { itemId: req.body.itemId })
    .then(() => {
      console.log(`Item, item_id = ${req.body.itemId}, successfully updated to need_to_restock = TRUE in HOUSES_ITEMS table`);
      res.sendStatus(201);
    })
    .catch(err => console.log(`Item, item_id = ${req.body.itemId}, need_to_restock value unable to be updated in HOUSES_ITEMS: `, err));
});

app.post('/claim', (req, res) => {
  db.query('UPDATE houses_items SET user_id = ${userId#} WHERE id = ${itemId#}',
    { itemId: req.body.itemId, userId: req.body.userId })
    .then(() => {
      console.log(`Item, item_id = ${req.body.itemId}, successfully updated to user_id = ${req.body.userId} in HOUSES_ITEMS table`);
    })
    .catch(err => console.log(`Unable to update item, item_id = ${req.body.itemId}, to user_id = ${req.body.userId} in HOUSES_ITEMS: `, err));

  db.query('INSERT INTO users_house_items (user_id, houses_items_id) VALUES (${userId#}, ${itemId#})',
    { itemId: req.body.itemId, userId: req.body.userId })
    .then(() => {
      console.log(`Item, item_id = ${req.body.itemId}, and user, user_id = ${req.body.userId}, successfully inserted item into USERS_HOUSE_ITEMS table`);
    })
    .catch(err => console.log(`Item, item_id = ${req.body.itemId}, and user, user_id = ${req.body.userId}, unable to be inserted in USERS_HOUSE_ITEMS: `, err));

  db.query('SELECT username FROM users WHERE id = ${userId#}',
    { userId: req.body.userId })
  .then(data => {
    console.log(`Successful USERS table query for username with user_id = ${req.body.userId}`);
    res.send(data[0]);
  })
  .catch(err => console.log(`Unable to retrieve username from USERS table for user_id = ${req.body.userId}: `, err));
});

app.post('/delete', (req, res) => {
  db.query('DELETE FROM houses_items WHERE id = ${itemId#}',
    { itemId: req.body.itemId })
    .then(() => {
      console.log(`Item, item_id = ${req.body.itemId}, successfully deleted from HOUSES_ITEMS table`);
      res.sendStatus(201);
    })
    .catch(err => console.log(`Item, item_id = ${req.body.itemId}, unable to be removed from HOUSES_ITEMS: `, err));
});

app.post('/unclaim', (req, res) => {
  db.query('UPDATE houses_items SET user_id = null WHERE id = ${itemId#}',
    { itemId: req.body.itemId })
    .then(() => {
      console.log('Successful update of HOUSES_ITEMS table setting user_id = NULL');
    })
    .catch(err => console.log(`Unable to update user_id = ${req.body.itemId} to NULL in HOUSES_ITEMS`));

  db.query('DELETE FROM users_house_items WHERE houses_items_id = ${itemId#}',
    { itemId: req.body.itemId })
    .then(() => {
      console.log(`Successful deletion of houses_items_id = ${req.body.itemId} in USERS_HOUSE_ITEMS`);
      res.sendStatus(201);
    })
    .catch(err => console.log(`Unable to delete houses_items_id = ${req.body.itemId} in USERS_HOUSE_ITEMS`));
});

app.post('/undo', (req, res) => {
  db.query('UPDATE houses_items SET need_to_restock = false WHERE id = ${itemId#}',
    { itemId: req.body.itemId })
    .then(() => {
      console.log(`Successful update of HOUSES_ITEMS table setting need_to_restock = false for item_id = ${req.body.itemId}`);
      res.sendStatus(201);
    })
    .catch(err => console.log(`Unable to update item_id = ${req.body.itemId} to need_to_restock = false in HOUSES_ITEMS: `, err));
});

app.post('/checkUsers', function (req, res) {
  db.query('SELECT * FROM users WHERE house_id=${houseId}', { houseId: req.body.houseId })
     .then((data) => {
       res.send(data);
     })
     .catch(err => console.log('unable to retrieve users'));
});

app.post('/createUser', function (req, res) {
  db.query('SELECT * FROM users WHERE username=${userName} and house_id=${houseId#}', { userName: req.body.userName, houseId: req.body.houseId })
    .then((data) => {
      if (data.length === 0) {
        console.log('shouldnt show up if array has stuff');
        db.query('INSERT INTO users (username, house_id) VALUES (${userName}, ${houseId#})', { userName: req.body.userName, houseId: req.body.houseId })
          .then(() => {
            res.send('Successfully created user');
          })
          .catch(err => console.log('unable to create user', err));
      } else {
        res.send('Username already taken. Please enter another.');
      }
    })
    .catch(err => console.log('unable '));
});

app.post('/settingCooks', function (req, res) {
  console.log('shooott...', req.body.userId);

  // update session with userId
  var currentSeshId = req.cookies.fridgrSesh.id;
  var sessionQuery = 'UPDATE sessions SET user_id = ${userId#} WHERE id = ${sessionId#}';
  db.query(sessionQuery, { userId: req.body.userId, sessionId: currentSeshId })
  .then((sessionData) => {
    console.log('Session updated with userId:', sessionData);

    // add userId to cookie
    var currentCookie = req.cookies.fridgrSesh;
    currentCookie['userId'] = parseInt(req.body.userId);
    res.cookie('fridgrSesh', currentCookie);
    res.status(200).end();
  })
  .catch((err) => {
    console.log('Error updating session with userId:', err);
  });

  // db.query('SELECT * FROM users WHERE id=${userId#}', { userId: req.body.userId})
  //   .then((data)=>{
  //     res.clearCookie('userId');
  //     res.cookie('userId', data[0].id);
  //     res.send('successful cookie passing');
  //   })
  //   .catch(err => console.log('unable to set cookies', err));
});

app.post('/cookUser', function (req, res) {
  db.query('SELECT * FROM users WHERE username=${userName} AND house_id=${houseId#}', { userName: req.body.userName, houseId: req.body.houseId })
  .then((data) => {
    // res.clearCookie('userId');
    // res.cookie('userId', data[0].id);
    // res.send(201);
    // update session with userId
    var currentSeshId = req.cookies.fridgrSesh.id;
    var sessionQuery = 'UPDATE sessions SET user_id = ${userId#} WHERE id = ${sessionId#}';
    db.query(sessionQuery, { userId: data[0].id, sessionId: currentSeshId })
    .then((sessionData) => {
      console.log('Session updated with userId:', data[0].id, sessionData);

      // add userId to cookie
      var currentCookie = req.cookies.fridgrSesh;
      currentCookie['userId'] = data[0].id;
      res.cookie('fridgrSesh', currentCookie);
      res.status(201).end();
    })
    .catch((err) => {
      console.log('Error updating session with userId:', data[0].id, err);
    });
  })
  .catch(err => console.log('unable to pass cookies', err));
});

app.post('/users', function (req, res) {
  db.query('SELECT * FROM users WHERE house_id=${houseId#}', { houseId: req.body.houseId })
    .then((data) => {
      console.log('getting all users from this house', data);
      res.send(data);
    })
    .catch(err => console.log('unable to get users', err));
});

app.get('/spoonacular', (req, res) => {
  spoon.getFoodItems(req.query.searchFood, res);
});

app.get('/jokes', (req, res) => {
  spoon.getJokes(res);
});

app.post('/add', (req, res) => {
  console.log('Adding item to inventory... ');

  var validate = utils.validateAddItemForm(req.body);

  if (!validate.success) {
    console.log('validate: ', validate.errors);
    return res.status(400).json(validate.errors);
  }

  db.query('SELECT id FROM items WHERE itemname = ${name}', { name: req.body.name })
    .then(body => {
      console.log(`Successful query of ITEMS table for ${req.body.name}`);
      if (body.length > 0) {
        db.query('INSERT INTO houses_items (house_id, item_id, need_to_restock, image, price, url) VALUES (${houseId#}, ${itemId#}, ${needToRestock^}, ${image}, ${price}, ${url})',
          { houseId: req.body.houseId, itemId: body[0].id, needToRestock: false, image: req.body.image, price: req.body.price, url: req.body.url })
          .then(() => {
            console.log(`Successful insert into HOUSES_ITEMS table:{ houseId: ${req.body.houseId}, itemId: ${body[0].id}, needToRestock: false, image: ${req.body.image}, price: ${req.body.price}, url: ${req.body.url} })
`);
            res.sendStatus(201);
          })
          .catch(err => console.log(`Unable to add item to HOUSES_ITEMS table: {houseId: ${req.body.houseId}, itemId: ${body[0].id}, needToRestock: false, image: ${req.body.image}, price: ${req.body.price}, url: ${req.body.url} } `, err));
        return;
      }
      db.query('INSERT INTO items (itemname) VALUES (${name})', { name: req.body.name })
        .then(() => {
          console.log(`Successfully inserted ${req.body.name} into ITEMS table`);
          db.query('SELECT id FROM items WHERE itemname = ${name}', { name: req.body.name })
          .then(body => {
            console.log(`Successful retrieve of item id = ${body[0].id} for itemname = ${req.body.name} from ITEMS`);
            db.query('INSERT INTO houses_items (house_id, item_id, need_to_restock, image, price, url) VALUES (${houseId#}, ${itemId#}, ${needToRestock^}, ${image}, ${price}, ${url})',
              { houseId: req.body.houseId, itemId: body[0].id, needToRestock: false, image: req.body.image, price: req.body.price, url: req.body.url })
              .then(() => {
                console.log(`Successful insert into HOUSES_ITEMS: {houseId: ${req.body.houseId}, itemId: ${body[0].id}, needToRestock: false, image: ${req.body.image}, price: ${req.body.price}, url: ${req.body.url}}`);
                res.sendStatus(201);
              })
              .catch(err => console.log(`Unable to add to HOUSES_ITEMS table: {houseId: ${req.body.houseId}, itemId: ${body[0].id}, needToRestock: false, image: ${req.body.image}, price: ${req.body.price}, url: ${req.body.url}}} `, err));
          })
          .catch(err => console.log(`Error retrieving the item id = ${body[0].id} for itemname = ${req.body.name} from ITEMS: `, err));
        })
        .catch(err => console.log(`Error inserting ${req.body.name} into ITEMS: `, err));
      return;
    })
    .catch(err => console.log(`Error querying ITEMS table for ${req.body.name}: `, err));
});

app.get('/api/shop', checkAuth.APICall, routeHandlers.getShoppingList);
app.post('/api/shop', checkAuth.pageRequest, routeHandlers.updateWithPurchases);

// app.post('/find-product', (req, res)=>{
//   const clientResponse = {
//     title: 'Tyson\'s Cage Raised Miserable Chicken',
//     image: 'http://pixel.nymag.com/imgs/daily/grub/2017/02/07/07-tyson-chicken.w1200.h630.jpg',
//     price: '$9.99',
//     url: 'https://www.walmart.com/ip/Tyson-All-Natural-Boneless-Skinless-Chicken-Breasts/50067993'
//   }
//   res.send(clientResponse);
// });


app.get('*', function (req, res) {
  res.sendFile(path.resolve(__dirname + '/../client/dist/index.html'));
});

app.listen(process.env.PORT || 1337, function () {
  console.log('Listening on 1337...');
});

app.post('/find-product', (req, res) => {
  var barcode = req.body.barcode;
  var result = upc.setUpc(barcode, res);
<<<<<<< HEAD
})
=======
});
>>>>>>> Clean up code
