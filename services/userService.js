const createError = require("http-errors");
const UserModel = require("../models/user");
const AddressModel = require("../models/address");

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
        throw createError(404, "User record not found");
      }

      //fetch user address and add to  the user object
      let address = await AddressModelInstance.findOneByUserId(user.id);

      if (!address) {
        address = await AddressModelInstance.create({ user_id: id });
      }

      user["address"] = address;

      return { user };
    } catch (error) {
      throw createError(500, error);
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

      return { user };
    } catch (error) {
      throw createError(500, error);
    }
  }

  /**
   *
   * @param {Object} data [Object]
   * @returns {Object} [address record]
   */
  async setAddress(data) {
    try {
      const { user_id } = data;
      const address = await AddressModelInstance.findOneByUserId(user_id);

      if (!address) {
        const createdAddress = await AddressModelInstance.create(data);

        return { address: createdAddress };
      }

      data.id = address.id;
      const updatedAddress = await AddressModelInstance.update(data);

      return { address: updatedAddress };
    } catch (error) {
      throw createError(500, error);
    }
  }
};
