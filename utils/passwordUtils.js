const bcrypt = require("bcrypt");

module.exports = class PasswordUtils {
    /**
     *
     * @param {String} password [unhashed password]
     * @param {Number} saltRounds [salt rounds]
     * @returns {String} [hashed password]
     */
    passwordHash = async (password, saltRounds) => {
        try {
            const salt = await bcrypt.genSalt(saltRounds);
            return await bcrypt.hash(password, salt);
        } catch (error) {
            throw error;
        }
    };

    /**
     * 
     * @param {String} password [cleint password]
     * @param {String} hash [hashed password from database]
     * @returns {Boolean} [True or False]
     */
    comparePassword = async (password, hash) => {
        try {
            const matchFound = await bcrypt.compare(password, hash);
            return matchFound;
        } catch (error) {
            throw error;
        }
    };
};
