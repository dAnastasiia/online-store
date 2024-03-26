const { ObjectId } = require("mongodb");

const { getDb } = require("../utils/database");

module.exports = class User {
  constructor(name, email, cart, id) {
    this.name = name;
    this.email = email;
    this.cart = cart;
    this._id = id ? new ObjectId(id) : null;
  }

  save() {
    const db = getDb();

    try {
      return db.collection("users").dbTable.insertOne(this);
    } catch (error) {
      console.error(error);
    }
  }

  addToCart(product) {
    const db = getDb();

    const { _id, cart } = this;

    const productIndexInCart = cart.products.findIndex(
      (products) => products?.productId.toString() === product._id.toString()
    );

    let totalPrice = cart.totalPrice;
    const updatedCartProducts = [...cart.products];

    if (productIndexInCart !== -1) {
      updatedCartProducts[productIndexInCart].quantity += 1;
    } else {
      updatedCartProducts.push({
        productId: product._id,
        quantity: 1,
      });
    }

    totalPrice += +product.price;

    const updatedCart = { products: updatedCartProducts, totalPrice };

    try {
      return db
        .collection("users")
        .updateOne({ _id }, { $set: { cart: updatedCart } });
    } catch (error) {
      console.error(error);
    }
  }

  removeFromCart(product) {
    const db = getDb();
    const { _id, cart } = this;

    const existingProductIndex = cart.products.findIndex(
      ({ productId }) => productId.toString() === product._id.toString()
    );

    if (existingProductIndex === -1) return;

    const { quantity } = cart.products[existingProductIndex];

    const updatedProductsFirstPart = cart.products.slice(
      0,
      existingProductIndex
    );
    const updatedProductsSecondPart = cart.products.slice(
      existingProductIndex + 1
    );
    const updatedProducts = [
      ...updatedProductsFirstPart,
      ...updatedProductsSecondPart,
    ];

    const updatedTotalPrice = cart.totalPrice - product.price * quantity;

    const updatedCart = {
      products: updatedProducts,
      totalPrice: updatedTotalPrice,
    };

    return db
      .collection("users")
      .updateOne({ _id }, { $set: { cart: updatedCart } });
  }

  async getCart() {
    const db = getDb();
    const { cart } = this;

    const productIds = cart.products.map(({ productId }) => productId);

    try {
      const products = await db
        .collection("products")
        .find({ _id: { $in: productIds } }) // $in as a filter for all passed values
        .toArray();

      const updatedProducts = products.map((product) => {
        return {
          ...product,
          quantity: cart.products.find(
            ({ productId }) => productId.toString() === product._id.toString()
          ).quantity,
        };
      });

      return updatedProducts;
    } catch (error) {
      console.error(error);
    }
  }

  static findById(id) {
    const db = getDb();

    try {
      return db.collection("users").findOne({ _id: new ObjectId(id) });
    } catch (error) {
      console.error(error);
    }
  }
};
