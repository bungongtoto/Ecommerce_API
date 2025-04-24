const createError = require('http-errors');
const CategoryModel = require('../models/category');

const CategoryModelInstance = new CategoryModel();

module.exports = class CategoryService {
    //cru on  categories
    /**
     * 
     * @returns {Array[Object]} [all categories records]
     */
    async getALl() {
        try {
            const categories = await CategoryModelInstance.getAll();

            if (!categories){
                throw createError(404, "No categories found");
            }

            return categories;
        } catch (error) {
            throw createError(500, error);
        }
    }

    // /**
    //  * 
    //  * @param {String} id 
    //  * @returns {Object}
    //  */
    // async getById(id) {
    //     try {
    //         const category = await CategoryModelInstance.findOneById(id);

    //         if (!category){
    //             throw createError(404, "category not found");
    //         }

    //         return category;
    //     } catch (error) {
    //         throw createError(500, error);
    //     }
    // }

    /**
     * 
     * @param {Object} data 
     * @returns {Object} [category records]
     */
    async create(data) {
        try {
            const category = await CategoryModelInstance.create(data);

            if (!category) {
                throw createError(500, "An error occured")
            }

            return category;
        } catch (error) {
            throw createError(500, error);
        }
    }

    /**
     * 
     * @param {Object} data 
     * @returns {Object} [updated category records]
     */
    async update(data) {
        try {

            const {id} = data;

            const category = await CategoryModelInstance.findOneById(id);

            if (!category){
                throw createError(404, "category not found");
            }

            const updatedCategory = await CategoryModelInstance.update(data);

            return updatedCategory;
        } catch (error) {
            throw createError(500, error);
        }
    }
}