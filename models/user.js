const { Schema, model } = require("mongoose");

const Product = require("./product");

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  cart: {
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
    totalPrice: Number,
  },
});

// add product to the cart
userSchema.methods.addToCart = async function (productId) {
  try {
    const product = await Product.findById(productId);

    if (!product) {
      return this.removeFromCart(productId);
    }

    const productIndexInCart = this.cart.products.findIndex(
      (product) => product.productId.toString() === productId.toString()
    );

    let totalPrice = this.cart.totalPrice;
    const updatedCartProducts = [...this.cart.products];

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
    this.cart = updatedCart;

    return this.save();
  } catch (error) {
    console.error(error);
  }
};

// get products, update cart if there is any changes
userSchema.methods.getCart = async function () {
  try {
    const extendedCart = await this.populate("cart.products.productId");
    const cart = extendedCart.cart;

    let updatedProducts = [];
    let updatedTotalPrice = 0;

    cart.products.forEach((product) => {
      const productId = product.productId;
      const price = productId?.price;
      const quantity = product.quantity;

      if (price) {
        updatedTotalPrice += +price * quantity;
        updatedProducts.push({
          productId,
          quantity,
        });
      }
    });

    const updatedCart = {
      products: updatedProducts,
      totalPrice: updatedTotalPrice,
    };

    this.cart = updatedCart;
    await this.save();

    return updatedProducts;
  } catch (error) {
    console.error(error);
  }
};

// remove product from cart
userSchema.methods.removeFromCart = async function (productId) {
  try {
    const extendedCart = await this.populate("cart.products.productId");
    const cart = extendedCart.cart;

    const existingProductIndex = cart.products.findIndex(
      ({ productId: product }) =>
        product?._id.toString() === productId.toString()
    );

    if (existingProductIndex === -1) return;

    let updatedProducts = [];
    let updatedTotalPrice = 0;

    cart.products.forEach((product) => {
      const id = product.productId;
      const price = productId?.price;
      const quantity = product.quantity;

      if (price && productId !== id) {
        updatedTotalPrice += +price * quantity;
        updatedProducts.push({
          productId: id,
          quantity,
        });
      }
    });

    const updatedCart = {
      products: updatedProducts,
      totalPrice: updatedTotalPrice,
    };

    this.cart = updatedCart;
    return this.save();
  } catch (error) {
    console.error(error);
  }
};

module.exports = model("User", userSchema);

// const DEFAULT_CART = { products: [], totalPrice: 0 };

// module.exports = class User {

//   async removeFromCart(productId) {
//     const db = getDb();
//     const { _id, cart } = this;

//     try {
//       const existingProductIndex = cart.products.findIndex(
//         (item) => item.productId.toString() === productId.toString()
//       );

//       if (existingProductIndex === -1) return;

//       const { quantity, price } = cart.products[existingProductIndex];

//       const updatedProductsFirstPart = cart.products.slice(
//         0,
//         existingProductIndex
//       );
//       const updatedProductsSecondPart = cart.products.slice(
//         existingProductIndex + 1
//       );
//       const updatedProducts = [
//         ...updatedProductsFirstPart,
//         ...updatedProductsSecondPart,
//       ];

//       const updatedTotalPrice = cart.totalPrice - price * quantity;

//       const updatedCart = {
//         products: updatedProducts,
//         totalPrice: updatedTotalPrice,
//       };

//       return db
//         .collection("users")
//         .updateOne({ _id }, { $set: { cart: updatedCart } });
//     } catch (error) {
//       console.error(error);
//     }
//   }

//   async getCart() {
//     const db = getDb();
//     const { _id, cart } = this;

//     const productIds = cart.products.map(({ productId }) => productId);

//     try {
//       const products = await db
//         .collection("products")
//         .find({ _id: { $in: productIds } }) // $in as a filter for all passed values
//         .toArray();

//       let updatedCartProducts = [];

//       const updatedProducts = products
//         .filter((product) => !!Product.findById(product._id))
//         .map((product) => {
//           const { _id: productId, price } = product;
//           const quantity = cart.products.find(
//             (cartProduct) =>
//               cartProduct.productId.toString() === product._id.toString()
//           ).quantity;

//           updatedCartProducts.push({ productId, quantity, price });

//           return {
//             ...product,
//             quantity,
//           };
//         });

//       const updatedTotalPrice = updatedProducts.reduce(
//         (result, { quantity, price }) => {
//           result += quantity * price;

//           return result;
//         },
//         0
//       );

//       const updatedCart = {
//         products: updatedCartProducts,
//         totalPrice: updatedTotalPrice,
//       };

//       await db
//         .collection("users")
//         .updateOne({ _id }, { $set: { cart: updatedCart } });

//       return updatedProducts;
//     } catch (error) {
//       console.error(error);
//     }
//   }

//   async addOrder() {
//     const db = getDb();
//     const { _id, name } = this;

//     try {
//       const products = await this.getCart();
//       const order = {
//         products,
//         user: { _id, name },
//       };

//       await db.collection("orders").insertOne(order);

//       this.cart = { ...DEFAULT_CART };

//       return db
//         .collection("users")
//         .updateOne({ _id }, { $set: { cart: this.cart } });
//     } catch (error) {
//       console.error(error);
//     }
//   }

//   deleteOrderById(id) {
//     const db = getDb();

//     try {
//       return db.collection("orders").deleteOne({ _id: new ObjectId(id) });
//     } catch (error) {
//       console.error(error);
//     }
//   }

//   getOrders() {
//     const db = getDb();

//     try {
//       return db.collection("orders").find({ "user._id": this._id }).toArray();
//     } catch (error) {
//       console.error(error);
//     }
//   }

//   static findById(id) {
//     const db = getDb();

//     try {
//       return db.collection("users").findOne({ _id: new ObjectId(id) });
//     } catch (error) {
//       console.error(error);
//     }
//   }
// };
