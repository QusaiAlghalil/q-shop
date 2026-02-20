import { Request, Response } from 'express';
import Product from '../models/Product';
import { AppError } from '../middleware/errorHandler';

/**
 * @route   GET /api/products
 * @desc    Get all products with filtering, sorting, and pagination
 * @access  Public
 */
export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    // Pagination
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const skip = (page - 1) * limit;

    // Build query
    const queryObj: any = { isActive: true };

    // Filter by category
    if (req.query.category) {
      queryObj.category = req.query.category;
    }

    // Filter by price range
    if (req.query.minPrice || req.query.maxPrice) {
      queryObj.price = {};
      if (req.query.minPrice) queryObj.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) queryObj.price.$lte = Number(req.query.maxPrice);
    }

    // Search by text
    if (req.query.search) {
      queryObj.$text = { $search: req.query.search as string };
    }

    // Sort
    let sortOptions: any = {};
    if (req.query.sort) {
      const sortField = req.query.sort as string;
      if (sortField === 'price-asc') sortOptions = { price: 1 };
      else if (sortField === 'price-desc') sortOptions = { price: -1 };
      else if (sortField === 'rating') sortOptions = { rating: -1 };
      else if (sortField === 'newest') sortOptions = { createdAt: -1 };
    } else {
      sortOptions = { createdAt: -1 }; // Default sort by newest
    }

    // Execute query
    const products = await Product.find(queryObj)
      .sort(sortOptions)
      .limit(limit)
      .skip(skip)
      .select('-reviews'); // Exclude reviews for list view

    // Get total count for pagination
    const total = await Product.countDocuments(queryObj);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: products
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

/**
 * @route   GET /api/products/:id
 * @desc    Get single product by ID
 * @access  Public
 */
export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id).populate(
      'reviews.user',
      'name avatar'
    );

    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Product not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

/**
 * @route   POST /api/products
 * @desc    Create a new product (Admin only)
 * @access  Private/Admin
 */
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create product'
    });
  }
};

/**
 * @route   PUT /api/products/:id
 * @desc    Update a product (Admin only)
 * @access  Private/Admin
 */
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Product not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update product'
    });
  }
};

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete a product (Admin only)
 * @access  Private/Admin
 */
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Product not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete product'
    });
  }
};

/**
 * @route   GET /api/products/featured
 * @desc    Get featured products
 * @access  Public
 */
export const getFeaturedProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await Product.find({ isFeatured: true, isActive: true })
      .sort({ rating: -1 })
      .limit(8)
      .select('-reviews');

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};
