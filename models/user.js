const { Schema, model } = require("mongoose");

const Product = require("./product");

const { DEFAULT_CART } = require("../utils/constants");

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
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

// remove all products from cart
userSchema.methods.clearCart = async function () {
  this.cart = DEFAULT_CART;
  return this.save();
};

module.exports = model("User", userSchema);
