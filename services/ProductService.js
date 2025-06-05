const createError = require("http-errors");
const ProductModel = require("../models/product");

const ProductModelInstance = new ProductModel();

module.exports = class ProductService {
  async getOneById(product_id) {
    try {
      const product = await ProductModelInstance.findOneById(product_id);

      if (!product) {
        throw createError(404, "No product found with that id");
      }

      return { product };
    } catch (error) {
      throw createError(500, error);
    }
  }

  /**
   *
   * @returns {Array[Object]} [products records]
   */
  async getPopular() {
    try {
      const products = await ProductModelInstance.getPopular();

      if (!products) {
        throw createError(404, "No products found");
      }

      return { products };
    } catch (error) {
      throw createError(500, error);
    }
  }

  async getAll() {
    try {
      const products = await ProductModelInstance.getAll();

      if (!products) {
        throw createError(404, "No products found");
      }

      return { products };
    } catch (error) {
      throw createError(500, error);
    }
  }

  /**
   *
   * @param {String} category_id
   * @returns {Array[Object]}
   */
  async getAllByCategoryId(category_id) {
    try {
      const products = await ProductModelInstance.getAllByCategoryId(
        category_id
      );

      if (!products) {
        throw createError(404, "No products found");
      }

      return { products };
    } catch (error) {
      throw createError(500, error);
    }
  }

  /**
   *
   * @param {Object} data
   * @returns {Object} [product record]
   */
  async create(data) {
    try {
      const product = await ProductModelInstance.create(data);

      if (!product) {
        throw createError(500, "An Error Occured");
      }

      return { product };
    } catch (error) {
      throw createError(500, error);
    }
  }

  async update(data) {
    try {
      const { id } = data;
      const product = await ProductModelInstance.findOneById(id);

      if (!product) {
        throw createError(404, "No such Product Found");
      }

      const updatedProduct = await ProductModelInstance.update(data);

      if (!updatedProduct) {
        throw createError(500, "An Error Occured");
      }

      return { product: updatedProduct };
    } catch (error) {
      throw createError(500, error);
    }
  }

  async addImage(data) {
    try {
      const image = await ProductModelInstance.addImage(data);

      if (!image) {
        throw createError(500, "An Error occured");
      }

      return { image };
    } catch (error) {
      throw createError(500, error);
    }
  }

  async updateImage(data) {
    try {
      const image = await ProductModelInstance.updateImage(data);

      if (!image) {
        throw createError(500, "An Error occured");
      }

      return { image };
    } catch (error) {
      throw createError(500, error);
    }
  }

  async deleteImage(data) {
    try {
      const deletedImage = await ProductModelInstance.deleteImage(data);

      if (!deletedImage) {
        throw createError(500, "An Error occured");
      }

      return { deletedImage };
    } catch (error) {
      throw createError(500, error);
    }
  }

  async getAllReviewByProductId(product_id) {
    try {
      const reviews = await ProductModelInstance.findReviewsByProductId(
        product_id
      );

      if (!reviews) {
        throw createError(404, "No reviews for this product");
      }

      return { reviews };
    } catch (error) {
      throw createError(500, error);
    }
  }

  async createReview(data) {
    try {
      const timestamp = new Date(Date.now()).toISOString().split("T")[0];
      data = { timestamp, ...data };
      const checkReview = await ProductModelInstance.findOneReview(data);

      if (checkReview) {
        return await this.updateReview(data);
      }

      const review = await ProductModelInstance.createReview(data);

      if (!review) {
        throw createError(500, "An Error occured");
      }

      return { review };
    } catch (error) {
      throw createError(500, error);
    }
  }

  async updateReview(data) {
    try {
      const review = await ProductModelInstance.findOneReview(data);

      if (!review) {
        throw createError(404, "No Such review found");
      }

      const updatedReview = await ProductModelInstance.updateReview(data);

      if (!updatedReview) {
        throw createError(500, "An Error Occured");
      }

      return { review: updatedReview };
    } catch (error) {
      throw createError(500, error);
    }
  }

  //cru on products
  //create, update and delete product images
};
