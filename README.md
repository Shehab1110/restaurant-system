<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Process flow

NOTE: I have already included a `config.env` file with my test-database connection string. The database contains some sample-products.<br>
NOTE: For any API endpoint usage, refer to the [documentation](https://documenter.getpostman.com/view/25502580/2sA3QqhD9K)
1- Run `npm install` to install dependencies.<br>
2- Run `npm run start` to start the application.<br>
3- Signup with the following endpoint: `POST http://127.0.0.1:3000/auth/signup`<br>
3.1- Or you can just signin using the following credentials: `Shehab:01120099205` with the following endpoint: `POST http://127.0.0.1:3000/auth/signin`<br>
4- Search products with the following endpoint: `GET http://127.0.0.1:3000/products`<br>
5- Add a product to cart with the following endpoint: `POST http://127.0.0.1:3000/carts/add-to-cart`<br>
5.1- You can get the existing cart, update cart item qty, delete a cart item, delete the whole cart.<br>
5.2- Refer to the Carts directory in the API documentation.
6- Make an order based on the existing cart with the following endpoint: `POST http://http://127.0.0.1:3000/orders/make-order`<br>
6.1- You can get your orders, cancel an order, update order item qty, update order address.<br>
6.2- Refer to the Orders directory in the API documentation.<br>
For Admin:
1- Signin using the following credentials: `Admin:01120099205` with the following endpoint: `POST http://127.0.0.1:3000/auth/signin`.<br>
2- You can create a product with the following endpoint: `POST http://127.0.0.1:3000/products/create-product`.<br>
3- You can get orders with the following endpoint: `GET http://127.0.0.1:3000/admin/orders`.<br>
4- You can update an order with the following endpoint: `PATCH http://127.0.0.1:3000/admin/update-order`.<br>
5- You can get the daily sales report with the following endpoint: `GET http://127.0.0.1:3000/admin/sales-report?date=2024-05-26`.<br>
