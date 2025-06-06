const createError = require("http-errors");
const UserModel = require("../models/user");
const PasswordUtils = require("../utils/passwordUtils");
const PasswordUtilsInstance = new PasswordUtils();
const UserModelInstance = new UserModel();

module.exports = class AuthService {
  /**
   *
   * @param {Object} data [User data]
   * @returns {Object} [User record]
   */
  async register(data) {
    try {
      const { email, password } = data;
      //Check if user already exist
      const user = await UserModelInstance.findOneByEmail(email);

      //if user exist reject bcs we cant have two users with thesame email
      if (user) {
        throw createError(409, "Email already in use.");
      }

      // hashing pure password
      const hashedPassword = await PasswordUtilsInstance.passwordHash(
        password,
        10
      );
      //modifying data to contain the hashed password

      data.password = hashedPassword;
      //user doesn't exist, create new user record
      return await UserModelInstance.create(data);
    } catch (error) {
      throw createError(500, error);
    }
  }

  /**
   *
   * @param {Object} data [User Credentials]
   * @returns {Object} [User record]
   */
  async login(data) {
    try {
      const { email, password: userpass } = data;

      //check if user exists
      const user = await UserModelInstance.findOneByEmail(email);

      // reject if no user
      if (!user) {
        throw createError(401, "Invalid username or password");
      }

      // compare password
      const isMatch = await PasswordUtilsInstance.comparePassword(
        userpass,
        user.password
      );

      //reject is password do no match
      if (!isMatch) {
        throw createError(401, "Invalid username or password");
      }

      const { password, ...userWithoutPassword } = user;

      return userWithoutPassword;
    } catch (error) {
      throw createError(500, error);
    }
  }

  async googleLogin(profile) {
    const { id, displayName } = profile;

    try {
      // Check if user exists
      const user = await UserModelInstance.findOneByGoogleId(id);

      // If no user found, create new user
      if (!user) {
        return await UserModelInstance.create({
          role_id: 3,
          first_name: displayName,
          google: { id, displayName },
        });
      }

      // User already exists, return profile
      return user;
    } catch (err) {
      throw createError(500, err);
    }
  }
};
