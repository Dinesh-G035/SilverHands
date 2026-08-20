import { Product } from '../models/Product.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { AppError } from '../utils/appError.js';
import { serializeProductPublic } from '../utils/serializers.js';

export const createProduct = async (req, res, next) => {
  try {
    const { title, description, category, price, stock, images, deliveryOptions } = req.body;

    const product = await Product.create({
      sellerId: req.user._id,
      title,
      description,
      category,
      price,
      stock: stock !== undefined ? stock : 1,
      images: images || [],
      deliveryOptions: deliveryOptions || ['delivery'],
      status: (stock || 1) > 0 ? 'active' : 'out_of_stock',
    });

    return sendSuccess(res, serializeProductPublic(product), 'Product created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const getProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '10', 10);
    const skip = (page - 1) * limit;

    const filter = { status: 'active', moderationStatus: 'approved' };
    if (req.query.category) filter.category = req.query.category;

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .populate('sellerId')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const serialized = products.map(serializeProductPublic);

    return sendSuccess(res, serialized, 'Products retrieved successfully', 200, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).populate('sellerId');
    if (!product) throw new AppError('Product not found', 404);

    return sendSuccess(res, serializeProductPublic(product), 'Product details');
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) throw new AppError('Product not found', 404);

    if (product.sellerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      throw new AppError('Unauthorized', 403);
    }

    Object.assign(product, req.body);
    if (product.stock <= 0) {
      product.status = 'out_of_stock';
    } else if (product.status === 'out_of_stock') {
      product.status = 'active';
    }

    await product.save();
    return sendSuccess(res, serializeProductPublic(product), 'Product updated');
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) throw new AppError('Product not found', 404);

    if (product.sellerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      throw new AppError('Unauthorized', 403);
    }

    await Product.deleteOne({ _id: id });
    return sendSuccess(res, null, 'Product deleted successfully');
  } catch (error) {
    next(error);
  }
};

export const getMyProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ sellerId: req.user._id }).sort({ createdAt: -1 });
    const serialized = products.map(serializeProductPublic);
    return sendSuccess(res, serialized, 'Seller products retrieved');
  } catch (error) {
    next(error);
  }
};

