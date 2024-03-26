const { ObjectId } = require("mongodb");

const { getDb } = require("../utils/database");

const Product = require("./product");

const DEFAULT_CART = { products: [], totalPrice: 0 };

module.exports = class User {
  constructor(name, email, cart, id) {
    this.name = name;
    this.email = email;
    this.cart = cart || { ...DEFAULT_CART };
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

  async addToCart(productId) {
    const db = getDb();

    const { _id, cart } = this;

    try {
      const product = await Product.findById(productId);

      if (!product) {
        return this.removeFromCart(productId);
      }

      const productIndexInCart = cart.products.findIndex(
        (product) => product.productId.toString() === productId.toString()
      );

      let totalPrice = cart.totalPrice;
      const updatedCartProducts = [...cart.products];

      if (productIndexInCart !== -1) {
        updatedCartProducts[productIndexInCart].quantity += 1;
      } else {
        updatedCartProducts.push({
          productId: product._id,
          quantity: 1,
          price: product.price,
        });
      }

      totalPrice += +product.price;

      const updatedCart = { products: updatedCartProducts, totalPrice };

      return db
        .collection("users")
        .updateOne({ _id }, { $set: { cart: updatedCart } });
    } catch (error) {
      console.error(error);
    }
  }

  async removeFromCart(productId) {
    const db = getDb();
    const { _id, cart } = this;

    try {
      const existingProductIndex = cart.products.findIndex(
        (item) => item.productId.toString() === productId.toString()
      );

      if (existingProductIndex === -1) return;

      const { quantity, price } = cart.products[existingProductIndex];

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

      const updatedTotalPrice = cart.totalPrice - price * quantity;

      const updatedCart = {
        products: updatedProducts,
        totalPrice: updatedTotalPrice,
      };

      return db
        .collection("users")
        .updateOne({ _id }, { $set: { cart: updatedCart } });
    } catch (error) {
      console.error(error);
    }
  }

  async getCart() {
    const db = getDb();
    const { _id, cart } = this;

    const productIds = cart.products.map(({ productId }) => productId);

    try {
      const products = await db
        .collection("products")
        .find({ _id: { $in: productIds } }) // $in as a filter for all passed values
        .toArray();

      let updatedCartProducts = [];

      const updatedProducts = products
        .filter((product) => !!Product.findById(product._id))
        .map((product) => {
          const { _id: productId, price } = product;
          const quantity = cart.products.find(
            (cartProduct) =>
              cartProduct.productId.toString() === product._id.toString()
          ).quantity;

          updatedCartProducts.push({ productId, quantity, price });

          return {
            ...product,
            quantity,
          };
        });

      const updatedTotalPrice = updatedProducts.reduce(
        (result, { quantity, price }) => {
          result += quantity * price;

          return result;
        },
        0
      );

      const updatedCart = {
        products: updatedCartProducts,
        totalPrice: updatedTotalPrice,
      };

      await db
        .collection("users")
        .updateOne({ _id }, { $set: { cart: updatedCart } });

      return updatedProducts;
    } catch (error) {
      console.error(error);
    }
  }

  async addOrder() {
    const db = getDb();
    const { _id, name } = this;

    try {
      const products = await this.getCart();
      const order = {
        products,
        user: { _id, name },
      };

      await db.collection("orders").insertOne(order);

      this.cart = { ...DEFAULT_CART };

      return db
        .collection("users")
        .updateOne({ _id }, { $set: { cart: this.cart } });
    } catch (error) {
      console.error(error);
    }
  }

  deleteOrderById(id) {
    const db = getDb();

    try {
      return db.collection("orders").deleteOne({ _id: new ObjectId(id) });
    } catch (error) {
      console.error(error);
    }
  }

  getOrders() {
    const db = getDb();

    try {
      return db.collection("orders").find({ "user._id": this._id }).toArray();
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
