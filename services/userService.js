const createError = require('http-errors');
const UserModel = require('../models/user');
const AddressModel = require('../models/address');



const UserModelInstance = new UserModel();
const AddressModelInstance = new AddressModel();

module.exports = class UserService {
    /**
     * 
     * @param {Object} data [user id]
     * @returns {Object} [user record]
     */
    async get(data) {
        try {
            const { id } = data;

            //check if user exist
            const user = await UserModelInstance.findOneById(id);

            //if not user found, reject
            if (!user) {
                throw createError(404, 'User record not found');
            }

            return user;
        } catch (error) {
            throw error;
        }
    }

    /**
     * 
     * @param {Object} data [object]
     * @returns {Object} [updated record]
     */
    async update(data) {
        try {
            const user = await UserModelInstance.update(data);

            return user;
        } catch (error) {
            throw error;
        }
    }

    /**
     * 
     * @param {Object} data [Object]
     * @returns {Object} [address record]
     */
    async setAddress(data) {
        try {
            const {user_id} = data;
            const address = await AddressModelInstance.findOneByUserId(user_id);

            if (!address){
                const createdAddress = await AddressModelInstance.create(data);

                return createdAddress;
            }
            
            data.id = address.id;
            const updatedAddress = await AddressModelInstance.update(data);

            return updatedAddress;

        } catch (error) {
            throw error;
        }
     }
}