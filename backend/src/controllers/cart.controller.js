import { Cart } from '../models/Cart.js';
import { Product } from '../models/Product.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { AppError } from '../utils/appError.js';

export const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');
    if (!cart) {
      cart = await Cart.create({ userId: req.user._id, items: [] });
    }
    return sendSuccess(res, cart, 'User cart retrieved');
  } catch (error) {
    next(error);
  }
};

export const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product || product.status !== 'active') {
      throw new AppError('Product is not available for purchase', 404);
    }

    if (product.stock < quantity) {
      throw new AppError(`Only ${product.stock} items available in stock`, 400);
    }

    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      cart = new Cart({ userId: req.user._id, items: [] });
    }

    const existingIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (existingIndex > -1) {
      const newQty = cart.items[existingIndex].quantity + quantity;
      if (product.stock < newQty) {
        throw new AppError(`Cannot add more than available stock (${product.stock})`, 400);
      }
      cart.items[existingIndex].quantity = newQty;
      cart.items[existingIndex].price = product.price;
    } else {
      cart.items.push({
        productId: product._id,
        quantity,
        price: product.price,
      });
    }

    await cart.save();
    await cart.populate('items.productId');

    return sendSuccess(res, cart, 'Item added to cart');
  } catch (error) {
    next(error);
  }
};

export const updateCartItem = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) throw new AppError('Cart not found', 404);

    const product = await Product.findById(productId);
    if (product && product.stock < quantity) {
      throw new AppError(`Only ${product.stock} items available in stock`, 400);
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex === -1) throw new AppError('Item not in cart', 404);

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();
    await cart.populate('items.productId');

    return sendSuccess(res, cart, 'Cart updated');
  } catch (error) {
    next(error);
  }
};

export const removeCartItem = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) throw new AppError('Cart not found', 404);

    cart.items = cart.items.filter((item) => item.productId.toString() !== productId);
    await cart.save();
    await cart.populate('items.productId');

    return sendSuccess(res, cart, 'Item removed from cart');
  } catch (error) {
    next(error);
  }
};

export const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    return sendSuccess(res, null, 'Cart cleared');
  } catch (error) {
    next(error);
  }
};

